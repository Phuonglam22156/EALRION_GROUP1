import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartItemCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    setMobileOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete before scrolling
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <Link to="/" className="navbar-logo" onClick={() => handleNavClick('hero')}>
            <span className="navbar-logo-text">ELARION</span>
          </Link>

          <ul className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
            <li><button onClick={() => handleNavClick('story')} className="nav-btn-link">Cốt Truyện</button></li>
            <li><button onClick={() => handleNavClick('factions')} className="nav-btn-link">Tộc Hệ</button></li>
            <li><button onClick={() => handleNavClick('components')} className="nav-btn-link">Thành Phần</button></li>
            <li><button onClick={() => handleNavClick('gameplay')} className="nav-btn-link">Cách Chơi</button></li>
            <li><button onClick={() => handleNavClick('pricing')} className="nav-btn-link">Đặt Mua</button></li>
            <li><button onClick={() => handleNavClick('reviews')} className="nav-btn-link">Đánh Giá</button></li>
            
            {user ? (
              <>
                {user.role === 'admin' && (
                  <li><Link to="/admin" onClick={() => setMobileOpen(false)}>Admin</Link></li>
                )}
                <li><Link to="/orders" onClick={() => setMobileOpen(false)}>Lịch sử</Link></li>
                <li>
                  <button onClick={() => { logout(); setMobileOpen(false); navigate('/'); }} className="nav-btn-link logout-btn">
                    Đăng Xuất ({user.username})
                  </button>
                </li>
              </>
            ) : (
              <li><Link to="/login" onClick={() => setMobileOpen(false)}>Đăng Nhập</Link></li>
            )}
          </ul>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link to="/cart" className="navbar-cart">
              <span style={{ fontSize: '1.4rem' }}>🛒</span>
              {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
            </Link>

            <button 
              className="navbar-toggle" 
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>
      <div 
        className={`navbar-overlay ${mobileOpen ? 'open' : ''}`} 
        onClick={() => setMobileOpen(false)}
      ></div>
    </>
  );
}
