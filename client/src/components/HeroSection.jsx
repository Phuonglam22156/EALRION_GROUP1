import React, { useEffect, useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { PRODUCT } from '../data/gameData';

export default function HeroSection() {
  const [particles, setParticles] = useState([]);
  const [ref, isVisible] = useScrollReveal({ threshold: 0.05 });

  useEffect(() => {
    // Generate random particles
    const generated = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${6 + Math.random() * 6}s`,
      size: `${1 + Math.random() * 3}px`,
    }));
    setParticles(generated);
  }, []);

  const scrollToPricing = () => {
    const el = document.getElementById('pricing');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToStory = () => {
    const el = document.getElementById('story');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header id="hero" className="hero">
      <div className="hero-bg"></div>
      
      <div className="hero-particles">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: p.left,
              animationDelay: p.delay,
              animationDuration: p.duration,
              width: p.size,
              height: p.size,
            }}
          />
        ))}
      </div>

      <div ref={ref} className={`hero-content reveal ${isVisible ? 'visible' : ''}`}>
        <h1 className="hero-title">{PRODUCT.name}</h1>
        <h2 className="hero-subtitle">{PRODUCT.tagline}</h2>
        <p className="hero-description">
          Đại Nứt Gãy đã khai mở. Lục địa Elarion đang sụp đổ. Nhập vai các hộ vệ, 
          chiến binh, pháp sư tối thượng từ 6 tộc hệ sở hữu sức mạnh nguyên thủy. 
          Quản lý nguồn mana quyết định sự sống còn của bạn!
        </p>
        <div className="hero-actions">
          <button onClick={scrollToPricing} className="btn btn-primary btn-lg">
            Đặt Mua Ngay — 300.000đ
          </button>
          <button onClick={scrollToStory} className="btn btn-secondary btn-lg">
            Khám Phá Cốt Truyện
          </button>
        </div>
      </div>

      <div className="hero-scroll-indicator" onClick={scrollToStory} style={{ cursor: 'pointer' }}>
        <span></span>
      </div>
    </header>
  );
}
