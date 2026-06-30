import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('elarion_token');
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        throw new Error('Không thể tải lịch sử đơn hàng');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Đang xử lý';
      case 'shipping': return 'Đang giao hàng';
      case 'completed': return 'Đã hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'var(--faction-raikage)';
      case 'shipping': return 'var(--faction-horologia)';
      case 'completed': return 'var(--faction-arboris)';
      case 'cancelled': return 'var(--text-red)';
      default: return 'var(--text-secondary)';
    }
  };

  if (!user) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
          <span style={{ fontSize: '4rem', display: 'block', marginBottom: '20px' }}>🔑</span>
          <h2>Yêu Cầu Đăng Nhập</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Vui lòng đăng nhập để xem lịch sử đơn hàng của bạn.</p>
          <Link to="/login" className="btn btn-primary">Đăng Nhập</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 className="page-title">Đơn Hàng Của Bạn</h1>
        
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Đang tải lịch sử đơn hàng...</p>
        ) : error ? (
          <p style={{ textAlign: 'center', color: 'var(--text-red)' }}>{error}</p>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <span style={{ fontSize: '4rem', display: 'block', marginBottom: '20px' }}>📦</span>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Bạn chưa đặt đơn hàng nào.</p>
            <Link to="/" className="btn btn-primary">Mua Board Game Ngay</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <span style={{ fontWeight: '600' }}>Mã đơn: #{order.id}</span>
                    <span style={{ color: 'var(--text-muted)', marginLeft: '12px' }}>
                      | {new Date(order.date).toLocaleDateString('vi-VN')} {new Date(order.date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div style={{ fontWeight: '600', color: getStatusColor(order.status) }}>
                    ● {getStatusText(order.status)}
                  </div>
                </div>
                
                <div style={{ margin: '12px 0', padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span>{item.name} <span style={{ color: 'var(--text-muted)' }}>x{item.quantity}</span></span>
                      <span>{formatPrice(item.price * item.quantity)}₫</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <div>Thanh toán: <strong style={{ color: 'var(--text-primary)' }}>{order.paymentMethod === 'cod' ? 'COD' : 'Chuyển khoản'}</strong></div>
                    <div>Trạng thái thanh toán: <strong style={{ color: order.paymentStatus === 'paid' ? 'var(--faction-arboris)' : 'var(--faction-raikage)' }}>{order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}</strong></div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Tổng tiền: </span>
                    <strong style={{ fontSize: '1.2rem', color: 'var(--gold)', fontFamily: 'var(--font-heading)' }}>
                      {formatPrice(order.total)}₫
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
