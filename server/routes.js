import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken, authorizeAdmin, JWT_SECRET } from './middleware/auth.js';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// JSON File Helpers
const getDataPath = (filename) => path.join(__dirname, 'data', filename);

const readData = (filename) => {
  const filePath = getDataPath(filename);
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(filename === 'product.json' ? {} : []));
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data || (filename === 'product.json' ? '{}' : '[]'));
  } catch (error) {
    console.error(`Error reading data file ${filename}:`, error);
    return filename === 'product.json' ? {} : [];
  }
};

const writeData = (filename, data) => {
  const filePath = getDataPath(filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing data file ${filename}:`, error);
    return false;
  }
};

// Seed default admin on startup if no users exist
const seedAdmin = () => {
  const users = readData('users.json');
  if (users.length === 0) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync('admin123', salt);
    users.push({
      id: 'admin-seed',
      username: 'admin',
      email: 'admin@elarion.id.vn',
      password: hashedPassword,
      role: 'admin'
    });
    writeData('users.json', users);
    console.log('Seed: Created default admin user (username: admin, password: admin123)');
  }
};
seedAdmin();

// ═══════════════════════════════════════════════════════════════
// AUTH ROUTES
// ═══════════════════════════════════════════════════════════════

router.post('/auth/register', (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ tên đăng nhập, mật khẩu và email.' });
  }

  const users = readData('users.json');
  const existingUser = users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (existingUser) {
    return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại.' });
  }

  const existingEmail = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingEmail) {
    return res.status(400).json({ message: 'Email đã được sử dụng.' });
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  // Set first user or user named 'admin' as admin role
  const role = username.toLowerCase() === 'admin' ? 'admin' : 'user';

  const newUser = {
    id: uuidv4(),
    username,
    email,
    password: hashedPassword,
    role
  };

  users.push(newUser);
  writeData('users.json', users);

  const token = jwt.sign({ id: newUser.id, username: newUser.username, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

  res.status(201).json({
    token,
    user: { id: newUser.id, username: newUser.username, role: newUser.role, email: newUser.email }
  });
});

router.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Vui lòng cung cấp tên đăng nhập và mật khẩu.' });
  }

  const users = readData('users.json');
  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (!user) {
    return res.status(400).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
  }

  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    token,
    user: { id: user.id, username: user.username, role: user.role, email: user.email }
  });
});

router.get('/auth/me', authenticateToken, (req, res) => {
  const users = readData('users.json');
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'Không tìm thấy thông tin người dùng.' });
  }
  res.json({
    user: { id: user.id, username: user.username, role: user.role, email: user.email }
  });
});

// ═══════════════════════════════════════════════════════════════
// PRODUCT ROUTES
// ═══════════════════════════════════════════════════════════════

router.get('/product', (req, res) => {
  const product = readData('product.json');
  res.json(product);
});

router.put('/product', authenticateToken, authorizeAdmin, (req, res) => {
  const { price, originalPrice, stock, lowStockThreshold } = req.body;
  const product = readData('product.json');

  if (price !== undefined) product.price = Number(price);
  if (originalPrice !== undefined) product.originalPrice = Number(originalPrice);
  if (stock !== undefined) product.stock = Number(stock);
  if (lowStockThreshold !== undefined) product.lowStockThreshold = Number(lowStockThreshold);

  writeData('product.json', product);
  res.json(product);
});

// ═══════════════════════════════════════════════════════════════
// ORDER ROUTES
// ═══════════════════════════════════════════════════════════════

router.post('/orders', authenticateToken, (req, res) => {
  const { fullname, phone, address, paymentMethod, items, total } = req.body;
  
  if (!fullname || !phone || !address || !items || items.length === 0) {
    return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin giao hàng và sản phẩm.' });
  }

  // Deduct stock for the product (single product site)
  const product = readData('product.json');
  
  // Find game item in checkout list and check stock
  const gameItem = items.find(item => item.id === product.id);
  if (gameItem) {
    if (product.stock < gameItem.quantity) {
      return res.status(400).json({ message: `Sản phẩm đã hết hàng hoặc không đủ tồn kho. Tồn kho còn lại: ${product.stock}` });
    }
    product.stock -= gameItem.quantity;
    writeData('product.json', product);
  }

  const orders = readData('orders.json');
  const newOrder = {
    id: Math.floor(100000 + Math.random() * 900000).toString(), // 6 digit ID
    userId: req.user.id,
    username: req.user.username,
    fullname,
    phone,
    address,
    paymentMethod,
    paymentStatus: paymentMethod === 'cod' ? 'unpaid' : 'unpaid', // unpaid initially
    status: 'pending',
    items,
    total,
    date: new Date().toISOString()
  };

  orders.unshift(newOrder); // Add to beginning of array
  writeData('orders.json', orders);

  res.status(201).json({ order: newOrder });
});

router.get('/orders', authenticateToken, (req, res) => {
  const orders = readData('orders.json');
  const userOrders = orders.filter(o => o.userId === req.user.id);
  res.json(userOrders);
});

router.get('/orders/all', authenticateToken, authorizeAdmin, (req, res) => {
  const orders = readData('orders.json');
  res.json(orders);
});

router.put('/orders/:id/status', authenticateToken, authorizeAdmin, (req, res) => {
  const { id } = req.params;
  const { status, paymentStatus } = req.body;

  const orders = readData('orders.json');
  const orderIndex = orders.findIndex(o => o.id === id);
  if (orderIndex === -1) {
    return res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });
  }

  const oldStatus = orders[orderIndex].status;
  orders[orderIndex].status = status || orders[orderIndex].status;
  orders[orderIndex].paymentStatus = paymentStatus || orders[orderIndex].paymentStatus;

  // Stock restoration if order is cancelled
  if (status === 'cancelled' && oldStatus !== 'cancelled') {
    const product = readData('product.json');
    const gameItem = orders[orderIndex].items.find(item => item.id === product.id);
    if (gameItem) {
      product.stock += gameItem.quantity;
      writeData('product.json', product);
    }
  }
  // Stock re-deduction if moving away from cancelled
  else if (oldStatus === 'cancelled' && status !== 'cancelled' && status) {
    const product = readData('product.json');
    const gameItem = orders[orderIndex].items.find(item => item.id === product.id);
    if (gameItem) {
      if (product.stock < gameItem.quantity) {
        return res.status(400).json({ message: 'Không đủ hàng tồn kho để khôi phục trạng thái đơn hàng này.' });
      }
      product.stock -= gameItem.quantity;
      writeData('product.json', product);
    }
  }

  writeData('orders.json', orders);
  res.json(orders[orderIndex]);
});

// ═══════════════════════════════════════════════════════════════
// REVIEW ROUTES
// ═══════════════════════════════════════════════════════════════

router.get('/reviews', (req, res) => {
  const reviews = readData('reviews.json');
  res.json(reviews);
});

router.post('/reviews', authenticateToken, (req, res) => {
  const { rating, comment } = req.body;
  if (!rating || !comment) {
    return res.status(400).json({ message: 'Vui lòng cung cấp điểm đánh giá và bình luận.' });
  }

  // Verify that the user has actually ordered the game
  const orders = readData('orders.json');
  const userHasBought = orders.some(o => o.userId === req.user.id);
  if (!userHasBought) {
    return res.status(403).json({ message: 'Chỉ những khách hàng đã mua sản phẩm mới được quyền đánh giá.' });
  }

  const reviews = readData('reviews.json');
  const newReview = {
    id: uuidv4(),
    userId: req.user.id,
    username: req.user.username,
    rating: Number(rating),
    comment,
    date: new Date().toISOString()
  };

  reviews.unshift(newReview);
  writeData('reviews.json', reviews);

  res.status(201).json(newReview);
});

router.delete('/reviews/:id', authenticateToken, authorizeAdmin, (req, res) => {
  const { id } = req.params;
  let reviews = readData('reviews.json');
  
  const initialLength = reviews.length;
  reviews = reviews.filter(r => r.id !== id);
  
  if (reviews.length === initialLength) {
    return res.status(404).json({ message: 'Không tìm thấy đánh giá.' });
  }

  writeData('reviews.json', reviews);
  res.json({ message: 'Đã xóa đánh giá thành công.' });
});

// ═══════════════════════════════════════════════════════════════
// DASHBOARD STATS ROUTE
// ═══════════════════════════════════════════════════════════════

router.get('/dashboard', authenticateToken, authorizeAdmin, (req, res) => {
  const orders = readData('orders.json');
  const product = readData('product.json');

  // Revenue is the sum of all orders that are completed or paid
  const revenue = orders
    .filter(o => o.status === 'completed' || o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const stock = product.stock || 0;
  const lowStock = stock <= (product.lowStockThreshold || 5);

  res.json({
    revenue,
    pendingCount,
    stock,
    lowStock
  });
});

export default router;
