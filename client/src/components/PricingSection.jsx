import React, { useEffect, useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useCart } from '../context/CartContext';
import { PRODUCT } from '../data/gameData';

export default function PricingSection() {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.1 });
  const { addToCart } = useCart();
  const [productData, setProductData] = useState(PRODUCT);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch('/api/product');
        if (response.ok) {
          const data = await response.json();
          setProductData(data);
        }
      } catch (error) {
        console.error('Failed to fetch product data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, []);

  const handleAddToCart = () => {
    addToCart(productData);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  // Calculate discount percentage
  const discount = Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100);

  return (
    <section id="pricing" className="pricing-section">
      <div className="container">
        <div className="section-title">
          <h2>Bảng Giá & Sở Hữu</h2>
          <div className="divider"></div>
          <p>Đặt mua ngay hôm nay để nhận ưu đãi đặc biệt cho những bản in giới hạn đầu tiên.</p>
        </div>

        <div
          ref={ref}
          className={`pricing-card reveal ${isVisible ? 'visible' : ''}`}
        >
          <div className="pricing-card-content">
            <span className="pricing-badge">Tiết kiệm {discount}%</span>
            <h3 className="pricing-product-name">{productData.name}</h3>
            <p className="pricing-product-subtitle">{productData.tagline || 'Phiên bản tiêu chuẩn cực đẹp'}</p>

            <div className="pricing-price">
              <span className="pricing-original">{formatPrice(productData.originalPrice)}₫</span>
              <span className="pricing-current">{formatPrice(productData.price)}</span>
              <span className="pricing-currency">VNĐ</span>
            </div>

            <div className="pricing-specs">
              <div className="pricing-spec">
                <span className="spec-icon">👥</span>
                <span className="spec-label">Số người chơi</span>
                <span className="spec-value">{productData.players}</span>
              </div>
              <div className="pricing-spec">
                <span className="spec-icon">⏱️</span>
                <span className="spec-label">Thời gian</span>
                <span className="spec-value">{productData.playTime}</span>
              </div>
              <div className="pricing-spec">
                <span className="spec-icon">🔞</span>
                <span className="spec-label">Độ tuổi</span>
                <span className="spec-value">{productData.ages}</span>
              </div>
              <div className="pricing-spec">
                <span className="spec-icon">🧠</span>
                <span className="spec-label">Độ khó</span>
                <span className="spec-value">{productData.difficulty}</span>
              </div>
            </div>

            <div className="pricing-actions">
              <button
                onClick={handleAddToCart}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', maxWidth: '400px' }}
                disabled={productData.stock <= 0}
              >
                {productData.stock <= 0 ? 'Hết hàng' : added ? '✓ Đã Thêm Vào Giỏ' : 'Thêm Vào Giỏ Hàng'}
              </button>
              
              <div className="pricing-stock">
                Tình trạng kho: {productData.stock <= 0 ? (
                  <span style={{ color: 'var(--text-red)' }}>Hết hàng</span>
                ) : productData.stock <= productData.lowStockThreshold ? (
                  <span style={{ color: 'var(--faction-raikage)' }}>Chỉ còn {productData.stock} hộp cuối!</span>
                ) : (
                  <span>Còn lại <span className="stock-number">{productData.stock}</span> hộp</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
