import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // States
  const [stats, setStats] = useState({ revenue: 0, pendingCount: 0, stock: 0, lowStock: false });
  const [orders, setOrders] = useState([]);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  
  // Form States for Editing Product
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stock, setStock] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState('');
  
  // UI Messages
  const [productMsg, setProductMsg] = useState({ type: '', text: '' });
  const [orderMsg, setOrderMsg] = useState({ type: '', text: '' });
  const [reviewMsg, setReviewMsg] = useState({ type: '', text: '' });

  const getHeaders = () => {
    const token = localStorage.getItem('elarion_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard', { headers: getHeaders() });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders/all', { headers: getHeaders() });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await fetch('/api/product');
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
        setPrice(data.price);
        setOriginalPrice(data.originalPrice);
        setStock(data.stock);
        setLowStockThreshold(data.lowStockThreshold || 5);
      }
    } catch (err) {
      console.error('Error fetching admin product:', err);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews');
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (err) {
      console.error('Error fetching admin reviews:', err);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchStats();
    fetchOrders();
    fetchProduct();
    fetchReviews();
  }, [user]);

  // Handle Product Save
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setProductMsg({ type: '', text: '' });
    try {
      const response = await fetch('/api/product', {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
          price: Number(price),
          originalPrice: Number(originalPrice),
          stock: Number(stock),
          lowStockThreshold: Number(lowStockThreshold)
        })
      });
      const data = await response.json();
      if (response.ok) {
        setProductMsg({ type: 'success', text: 'Cập nhật sản phẩm thành công!' });
        setProduct(data);
        fetchStats();
      } else {
        throw new Error(data.message || 'Cập nhật thất bại');
      }
    } catch (err) {
      setProductMsg({ type: 'error', text: err.message });
    }
  };

  // Handle Order Status Changes
  const handleOrderStatusUpdate = async (orderId, newStatus, newPaymentStatus) => {
    setOrderMsg({ type: '', text: '' });
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
          status: newStatus,
          paymentStatus: newPaymentStatus
        })
      });
      const data = await response.json();
      if (response.ok) {
        setOrderMsg({ type: 'success', text: `Đã cập nhật đơn hàng #${orderId}` });
        fetchOrders();
        fetchStats();
      } else {
        throw new Error(data.message || 'Cập nhật thất bại');
      }
    } catch (err) {
      setOrderMsg({ type: 'error', text: err.message });
    }
  };

  // Handle Review Deletion
  const handleReviewDelete = async (reviewId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đánh giá này không?')) return;
    setReviewMsg({ type: '', text: '' });
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (response.ok) {
        setReviewMsg({ type: 'success', text: 'Đã xóa đánh giá thành công!' });
        fetchReviews();
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Xóa thất bại');
      }
    } catch (err) {
      setReviewMsg({ type: 'error', text: err.message });
    }
  };

  const formatPrice = (p) => {
    return new Intl.NumberFormat('vi-VN').format(p);
  };

  if (!user || user.role !== 'admin') {
    return null; // or loading
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 className="page-title">Admin Dashboard</h1>

        {/* Tab Controls */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--gold-border)', marginBottom: '30px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setActiveTab('overview')} 
            className={`btn btn-sm ${activeTab === 'overview' ? 'btn-gold' : 'btn-secondary'}`}
            style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
          >
            Tổng Quan
          </button>
          <button 
            onClick={() => setActiveTab('orders')} 
            className={`btn btn-sm ${activeTab === 'orders' ? 'btn-gold' : 'btn-secondary'}`}
            style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
          >
            Quản Lý Đơn Hàng ({orders.filter(o => o.status === 'pending').length})
          </button>
          <button 
            onClick={() => setActiveTab('products')} 
            className={`btn btn-sm ${activeTab === 'products' ? 'btn-gold' : 'btn-secondary'}`}
            style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
          >
            Kho Hàng & Giá
          </button>
          <button 
            onClick={() => setActiveTab('reviews')} 
            className={`btn btn-sm ${activeTab === 'reviews' ? 'btn-gold' : 'btn-secondary'}`}
            style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
          >
            Quản Lý Đánh Giá ({reviews.length})
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              <div className="item-card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>TỔNG DOANH THU</div>
                <div style={{ fontSize: '1.8rem', color: 'var(--gold)', fontFamily: 'var(--font-heading)', marginTop: '8px' }}>
                  {formatPrice(stats.revenue)}₫
                </div>
              </div>
              
              <div className="item-card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ĐƠN CHỜ XỬ LÝ</div>
                <div style={{ fontSize: '1.8rem', color: 'var(--faction-raikage)', fontFamily: 'var(--font-heading)', marginTop: '8px' }}>
                  {stats.pendingCount}
                </div>
              </div>

              <div className="item-card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>TỔNG TỒN KHO</div>
                <div style={{ fontSize: '1.8rem', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', marginTop: '8px' }}>
                  {stats.stock} hộp
                </div>
              </div>

              <div className="item-card" style={{ padding: '20px', borderColor: stats.lowStock ? 'var(--text-red)' : 'var(--gold-border)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>CẢNH BÁO KHO</div>
                <div style={{ fontSize: '1.4rem', color: stats.lowStock ? 'var(--text-red)' : 'var(--faction-arboris)', fontFamily: 'var(--font-heading)', marginTop: '12px' }}>
                  {stats.lowStock ? '⚠️ SẮP HẾT HÀNG' : '✓ An Toàn'}
                </div>
              </div>
            </div>

            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', marginBottom: '16px' }}>Đơn hàng gần đây</h3>
            <div className="checkout-form-section" style={{ padding: '20px' }}>
              {orders.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Chưa có đơn hàng nào.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--gold-border)', color: 'var(--gold)' }}>
                        <th style={{ padding: '12px 8px' }}>Mã Đơn</th>
                        <th style={{ padding: '12px 8px' }}>Khách Hàng</th>
                        <th style={{ padding: '12px 8px' }}>Phương thức</th>
                        <th style={{ padding: '12px 8px' }}>Tổng Tiền</th>
                        <th style={{ padding: '12px 8px' }}>Trạng Thái</th>
                        <th style={{ padding: '12px 8px' }}>Thanh Toán</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((o) => (
                        <tr key={o.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '12px 8px' }}>#{o.id}</td>
                          <td style={{ padding: '12px 8px' }}>
                            <div>{o.fullname}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{o.phone}</div>
                          </td>
                          <td style={{ padding: '12px 8px' }}>{o.paymentMethod === 'cod' ? 'COD' : 'Chuyển khoản'}</td>
                          <td style={{ padding: '12px 8px', color: 'var(--gold)', fontFamily: 'var(--font-heading)' }}>{formatPrice(o.total)}₫</td>
                          <td style={{ padding: '12px 8px' }}>{o.status}</td>
                          <td style={{ padding: '12px 8px' }}>{o.paymentStatus === 'paid' ? 'Đã trả' : 'Chưa trả'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', marginBottom: '16px' }}>Quản lý đơn hàng</h3>
            {orderMsg.text && (
              <div style={{ 
                padding: '12px', 
                borderRadius: '4px', 
                marginBottom: '16px', 
                background: orderMsg.type === 'success' ? 'rgba(39, 174, 96, 0.15)' : 'rgba(139, 0, 0, 0.15)',
                color: orderMsg.type === 'success' ? 'var(--faction-arboris)' : 'var(--text-red)'
              }}>
                {orderMsg.text}
              </div>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {orders.map((o) => (
                <div key={o.id} className="review-card" style={{ border: '1px solid var(--gold-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <h4 style={{ color: 'var(--gold)' }}>Đơn hàng #{o.id}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Ngày đặt: {new Date(o.date).toLocaleString('vi-VN')}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <select 
                          value={o.status}
                          onChange={(e) => handleOrderStatusUpdate(o.id, e.target.value, o.paymentStatus)}
                          style={{ padding: '6px 12px', background: 'var(--bg-surface)' }}
                        >
                          <option value="pending">Chờ xử lý</option>
                          <option value="shipping">Đang giao</option>
                          <option value="completed">Đã hoàn thành</option>
                          <option value="cancelled">Đã hủy</option>
                        </select>
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <select 
                          value={o.paymentStatus}
                          onChange={(e) => handleOrderStatusUpdate(o.id, o.status, e.target.value)}
                          style={{ padding: '6px 12px', background: 'var(--bg-surface)' }}
                        >
                          <option value="unpaid">Chưa thanh toán</option>
                          <option value="paid">Đã thanh toán</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <div style={{ fontWeight: '600', marginBottom: '6px' }}>Thông tin giao hàng:</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        <div><strong>Họ tên:</strong> {o.fullname}</div>
                        <div><strong>Điện thoại:</strong> {o.phone}</div>
                        <div><strong>Địa chỉ:</strong> {o.address}</div>
                        <div><strong>Thanh toán:</strong> {o.paymentMethod === 'cod' ? 'COD' : 'Chuyển khoản'}</div>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', marginBottom: '6px' }}>Sản phẩm đặt:</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        {o.items.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>{item.name} x{item.quantity}</span>
                            <span>{formatPrice(item.price * item.quantity)}₫</span>
                          </div>
                        ))}
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: '600' }}>
                          <span>Tổng cộng:</span>
                          <span style={{ color: 'var(--gold)' }}>{formatPrice(o.total)}₫</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {orders.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Chưa có đơn hàng nào.</p>}
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', marginBottom: '24px' }}>Cập nhật sản phẩm ELARION</h3>
            
            {productMsg.text && (
              <div style={{ 
                padding: '12px', 
                borderRadius: '4px', 
                marginBottom: '16px', 
                background: productMsg.type === 'success' ? 'rgba(39, 174, 96, 0.15)' : 'rgba(139, 0, 0, 0.15)',
                color: productMsg.type === 'success' ? 'var(--faction-arboris)' : 'var(--text-red)'
              }}>
                {productMsg.text}
              </div>
            )}

            {product ? (
              <form onSubmit={handleProductSubmit} className="checkout-form-section">
                <div className="form-group">
                  <label htmlFor="prod-name">Tên sản phẩm</label>
                  <input type="text" id="prod-name" value={product.name} disabled style={{ opacity: 0.6 }} />
                </div>

                <div className="form-group">
                  <label htmlFor="prod-price">Giá bán hiện tại (VNĐ)</label>
                  <input 
                    type="number" 
                    id="prod-price" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="prod-orig">Giá gốc chưa giảm (VNĐ)</label>
                  <input 
                    type="number" 
                    id="prod-orig" 
                    value={originalPrice} 
                    onChange={(e) => setOriginalPrice(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="prod-stock">Số lượng tồn kho (Hộp)</label>
                  <input 
                    type="number" 
                    id="prod-stock" 
                    value={stock} 
                    onChange={(e) => setStock(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="prod-thresh">Ngưỡng báo động sắp hết hàng</label>
                  <input 
                    type="number" 
                    id="prod-thresh" 
                    value={lowStockThreshold} 
                    onChange={(e) => setLowStockThreshold(e.target.value)} 
                    required 
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '16px' }}>
                  Lưu Thay Đổi
                </button>
              </form>
            ) : (
              <p>Đang tải thông tin sản phẩm...</p>
            )}
          </div>
        )}

        {/* TAB 4: REVIEWS MODERATION */}
        {activeTab === 'reviews' && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', marginBottom: '16px' }}>Duyệt & quản lý đánh giá</h3>
            {reviewMsg.text && (
              <div style={{ 
                padding: '12px', 
                borderRadius: '4px', 
                marginBottom: '16px', 
                background: reviewMsg.type === 'success' ? 'rgba(39, 174, 96, 0.15)' : 'rgba(139, 0, 0, 0.15)',
                color: reviewMsg.type === 'success' ? 'var(--faction-arboris)' : 'var(--text-red)'
              }}>
                {reviewMsg.text}
              </div>
            )}

            <div className="reviews-list">
              {reviews.map((rev) => (
                <div key={rev.id} className="review-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1, marginRight: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '600' }}>{rev.username} ({new Date(rev.date).toLocaleDateString('vi-VN')})</span>
                      <span style={{ color: 'var(--gold)' }}>{Array.from({ length: rev.rating }).map(() => '★').join('')}</span>
                    </div>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{rev.comment}</p>
                  </div>
                  <button 
                    onClick={() => handleReviewDelete(rev.id)} 
                    className="btn btn-secondary btn-sm"
                    style={{ borderColor: 'var(--text-red)', color: 'var(--text-red)' }}
                  >
                    Xóa
                  </button>
                </div>
              ))}
              {reviews.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Chưa có đánh giá nào.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
