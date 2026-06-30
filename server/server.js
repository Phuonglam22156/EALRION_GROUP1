import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes.js';

const app = express();
const PORT = process.env.PORT || 3001;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets if any
app.use('/assets', express.static(path.join(__dirname, 'data', 'assets')));

// API Routes
app.use('/api', apiRouter);

// Basic health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Elarion Server is running smoothly.' });
});

// Serve frontend build if in production (optional but good practice)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ message: 'Đã xảy ra lỗi hệ thống phía máy chủ.' });
});

app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(` ELARION Server running on: http://localhost:${PORT}`);
  console.log(`===================================================`);
});
