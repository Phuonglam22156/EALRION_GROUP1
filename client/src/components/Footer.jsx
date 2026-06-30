import React from 'react';
import { SHOP_INFO } from '../data/gameData';

export default function Footer() {
  const handleScroll = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Brand Info */}
          <div className="footer-brand">
            <h3 className="footer-logo">ELARION</h3>
            <p>
              Board game fantasy chiến thuật cá nhân nhỏ lẻ hướng đến người mới bắt đầu. 
              Hãy gia nhập cuộc chiến lục nguyên tố và cứu lấy thế giới của bạn.
            </p>
            <div className="footer-social">
              {SHOP_INFO.fanpage && (
                <a href={`https://${SHOP_INFO.fanpage}`} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  🌐
                </a>
              )}
              {SHOP_INFO.instagram && (
                <a href={`https://${SHOP_INFO.instagram}`} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  📸
                </a>
              )}
              {SHOP_INFO.email && (
                <a href={`mailto:${SHOP_INFO.email}`} aria-label="Email">
                  ✉️
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h4>Khám Phá</h4>
            <ul>
              <li><button onClick={() => handleScroll('story')} className="nav-btn-link" style={{ color: 'var(--text-secondary)' }}>Cốt Truyện</button></li>
              <li><button onClick={() => handleScroll('factions')} className="nav-btn-link" style={{ color: 'var(--text-secondary)' }}>Tộc Hệ</button></li>
              <li><button onClick={() => handleScroll('gameplay')} className="nav-btn-link" style={{ color: 'var(--text-secondary)' }}>Cách Chơi</button></li>
              <li><button onClick={() => handleScroll('pricing')} className="nav-btn-link" style={{ color: 'var(--text-secondary)' }}>Đặt Mua</button></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="footer-links">
            <h4>Thông Tin Shop</h4>
            <ul style={{ gap: '6px' }}>
              <li style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <strong>Tên miền:</strong> <a href={SHOP_INFO.website} target="_blank" rel="noopener noreferrer">{SHOP_INFO.domain}</a>
              </li>
              <li style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <strong>Email:</strong> {SHOP_INFO.email}
              </li>
              <li style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <strong>Chủ sở hữu:</strong> {SHOP_INFO.bankInfo.accountHolder}
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} {SHOP_INFO.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
