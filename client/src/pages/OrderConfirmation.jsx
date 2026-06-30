import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { SHOP_INFO } from '../data/gameData';

export default function OrderConfirmation() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return <Navigate to="/" replace />;
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '700px' }}>
        <div className="checkout-form-section" style={{ textAlign: 'center', padding: '40px' }}>
          <span style={{ fontSize: '4rem', display: 'block', marginBottom: '16px' }}>🎉</span>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', marginBottom: '12px' }}>Đặt Hàng Thành Công!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Cảm ơn bạn đã mua hàng. Mã đơn hàng của bạn là <strong style={{ color: 'var(--text-primary)' }}>#{order.id}</strong>
          </p>

          <div style={{ textAlign: 'left', background: 'var(--bg-surface)', padding: '20px', borderRadius: '8px', border: '1px solid var(--gold-border)', marginBottom: '24px' }}>
            <h4 style={{ color: 'var(--gold)', marginBottom: '12px' }}>Thông tin đơn hàng:</h4>
            <p style={{ marginBottom: '6px' }}><strong>Người nhận:</strong> {order.fullname}</p>
            <p style={{ marginBottom: '6px' }}><strong>Số điện thoại:</strong> {order.phone}</p>
            <p style={{ marginBottom: '6px' }}><strong>Địa chỉ:</strong> {order.address}</p>
            <p style={{ marginBottom: '6px' }}>
              <strong>Phương thức thanh toán:</strong> {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng'}
            </p>
            <p style={{ marginBottom: '6px' }}><strong>Trạng thái thanh toán:</strong> {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>
            <p style={{ marginBottom: '6px' }}><strong>Trạng thái vận chuyển:</strong> Chờ xử lý</p>
            <p style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '1.1rem' }}>
              <strong>Tổng tiền: </strong>
              <span style={{ color: 'var(--gold)', fontFamily: 'var(--font-heading)' }}>{formatPrice(order.total)}₫</span>
            </p>
          </div>

          {order.paymentMethod === 'transfer' && (
            <div style={{ textAlign: 'left', background: 'var(--bg-surface)', padding: '20px', borderRadius: '8px', border: '1px solid var(--red-blood)', marginBottom: '24px' }}>
              <h4 style={{ color: 'var(--text-red)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ⚠️ Hướng dẫn chuyển khoản:
              </h4>
              <p style={{ fontSize: '0.9rem', marginBottom: '8px' }}>
                Vui lòng thực hiện chuyển khoản đến số tài khoản sau để đơn hàng được xác nhận nhanh chóng:
              </p>
              <div style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.95rem' }}>
                <div>Ngân hàng: MB BANK</div>
                <div>Số tài khoản: 123456789999</div>
                <div>Chủ tài khoản: {SHOP_INFO.bankInfo.accountHolder}</div>
                <div>Số tiền: {formatPrice(order.total)}đ</div>
                <div>Nội dung CK: ELARION {order.username || 'user'} {order.phone}</div>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                * Sau khi nhận được tiền, shop sẽ cập nhật trạng thái đơn hàng sang "Đã thanh toán" và tiến hành giao hàng.
              </p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '30px' }}>
            <Link to="/" className="btn btn-secondary">Quay Lại Trang Chủ</Link>
            <Link to="/orders" className="btn btn-primary">Xem Lịch Sử Đơn</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
