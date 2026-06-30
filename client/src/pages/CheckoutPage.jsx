import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { SHOP_INFO } from '../data/gameData';

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod'); // cod or transfer
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullname.trim() || !phone.trim() || !address.trim()) {
      setError('Vui lòng điền đầy đủ thông tin giao hàng.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('elarion_token');
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fullname,
          phone,
          address,
          paymentMethod,
          items: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          })),
          total: cartTotal
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Đặt hàng thất bại');
      }

      clearCart();
      navigate('/order-confirmation', { state: { order: data.order } });
    } catch (err) {
      setError(err.message || 'Không thể tạo đơn hàng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
          <span style={{ fontSize: '4rem', display: 'block', marginBottom: '20px' }}>🔑</span>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', marginBottom: '16px' }}>Yêu Cầu Đăng Nhập</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Bạn cần đăng nhập để tiến hành đặt hàng.</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/login" className="btn btn-primary">Đăng Nhập</Link>
            <Link to="/register" className="btn btn-secondary">Đăng Ký</Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
          <span style={{ fontSize: '4rem', display: 'block', marginBottom: '20px' }}>🛒</span>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', marginBottom: '16px' }}>Giỏ Hàng Rống</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Không có sản phẩm nào trong giỏ hàng để thanh toán.</p>
          <Link to="/" className="btn btn-primary">Quay Lại Trang Chủ</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 className="page-title">Thanh Toán</h1>
        
        {error && <div className="form-error" style={{ marginBottom: '20px', textAlign: 'center' }}>{error}</div>}
        
        <div className="checkout-grid">
          {/* Order Details Form */}
          <form onSubmit={handlePlaceOrder} className="checkout-form-section">
            <h3>Thông tin giao hàng</h3>
            
            <div className="form-group">
              <label htmlFor="fullname">Họ và tên người nhận</label>
              <input
                type="text"
                id="fullname"
                placeholder="Nhập họ và tên"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Số điện thoại liên hệ</label>
              <input
                type="tel"
                id="phone"
                placeholder="Nhập số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="address">Địa chỉ giao hàng</label>
              <input
                type="text"
                id="address"
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <h3>Phương thức thanh toán</h3>
            <div className="payment-options">
              <div 
                className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('cod')}
              >
                <input
                  type="radio"
                  id="pay-cod"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
                <div>
                  <div className="payment-option-label">Thanh toán khi nhận hàng (COD)</div>
                  <div className="payment-option-desc">Thanh toán bằng tiền mặt khi shipper giao hàng tới nơi.</div>
                </div>
              </div>
              
              <div 
                className={`payment-option ${paymentMethod === 'transfer' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('transfer')}
              >
                <input
                  type="radio"
                  id="pay-transfer"
                  name="paymentMethod"
                  value="transfer"
                  checked={paymentMethod === 'transfer'}
                  onChange={() => setPaymentMethod('transfer')}
                />
                <div>
                  <div className="payment-option-label">Chuyển khoản ngân hàng</div>
                  <div className="payment-option-desc">Chuyển khoản qua ngân hàng trước. Shop sẽ giao hàng khi nhận được tiền.</div>
                </div>
              </div>
            </div>

            {paymentMethod === 'transfer' && (
              <div className="bank-info">
                <p className="bank-highlight">Thông tin tài khoản ngân hàng:</p>
                <p>Ngân hàng: <span className="bank-highlight">MB BANK (Ngân hàng Quân đội)</span></p>
                <p>Số tài khoản: <span className="bank-highlight">123456789999</span></p>
                <p>Chủ tài khoản: <span className="bank-highlight">{SHOP_INFO.bankInfo.accountHolder}</span></p>
                <p>Nội dung chuyển khoản: <span className="bank-highlight">ELARION {user.username} {phone}</span></p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                  * Sau khi chuyển khoản xong, vui lòng giữ biên lai giao dịch.
                </p>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '24px' }}
              disabled={loading}
            >
              {loading ? 'Đang Xử Lý Đơn Hàng...' : `Đặt Hàng — ${formatPrice(cartTotal)}₫`}
            </button>
          </form>
          
          {/* Order Summary Panel */}
          <div className="checkout-form-section" style={{ height: 'fit-content' }}>
            <h3>Đơn hàng của bạn</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cartItems.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '600' }}>{item.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Số lượng: {item.quantity} x {formatPrice(item.price)}₫
                    </div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)' }}>
                    {formatPrice(item.price * item.quantity)}₫
                  </div>
                </div>
              ))}
              
              <div style={{ borderTop: '1px solid var(--gold-border)', paddingTop: '16px', marginTop: '8px' }}>
                <div className="cart-summary-row" style={{ padding: '4px 0' }}>
                  <span>Tạm tính:</span>
                  <span>{formatPrice(cartTotal)}₫</span>
                </div>
                <div className="cart-summary-row" style={{ padding: '4px 0' }}>
                  <span>Phí vận chuyển:</span>
                  <span style={{ color: 'var(--faction-arboris)' }}>Miễn phí</span>
                </div>
                <div className="cart-summary-total" style={{ paddingTop: '16px', marginTop: '8px' }}>
                  <span>Tổng tiền:</span>
                  <span>{formatPrice(cartTotal)}₫</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
