import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 className="page-title">Giỏ Hàng</h1>
        
        {cartItems.length === 0 ? (
          <div className="cart-container" style={{ textAlign: 'center', padding: '40px 0' }}>
            <span style={{ fontSize: '4rem', display: 'block', marginBottom: '20px' }}>🛒</span>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Giỏ hàng của bạn đang trống.</p>
            <Link to="/" className="btn btn-primary">Mua Board Game</Link>
          </div>
        ) : (
          <div className="cart-container">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">📦</div>
                <div className="cart-item-info">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <div className="cart-item-price">{formatPrice(item.price)}₫</div>
                </div>
                
                <div className="cart-item-qty">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                
                <div style={{ marginLeft: '20px', fontFamily: 'var(--font-heading)', color: 'var(--gold)', minWidth: '100px', textAlign: 'right' }}>
                  {formatPrice(item.price * item.quantity)}₫
                </div>
                
                <button 
                  onClick={() => removeFromCart(item.id)} 
                  className="cart-item-remove"
                  style={{ marginLeft: '20px' }}
                  title="Xóa sản phẩm"
                >
                  🗑️
                </button>
              </div>
            ))}
            
            <div className="cart-summary">
              <div className="cart-summary-row">
                <span>Số lượng sản phẩm:</span>
                <span>{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
              </div>
              <div className="cart-summary-row">
                <span>Phí vận chuyển:</span>
                <span style={{ color: 'var(--faction-arboris)' }}>Miễn phí (Ưu đãi)</span>
              </div>
              <div className="cart-summary-total">
                <span>Tổng cộng:</span>
                <span>{formatPrice(cartTotal)}₫</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <button onClick={clearCart} className="btn btn-secondary btn-sm">
                Xóa Sạch Giỏ Hàng
              </button>
              <div style={{ display: 'flex', gap: '16px' }}>
                <Link to="/" className="btn btn-secondary">
                  Tiếp Tục Mua
                </Link>
                <button onClick={() => navigate('/checkout')} className="btn btn-primary">
                  Thanh Toán
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
