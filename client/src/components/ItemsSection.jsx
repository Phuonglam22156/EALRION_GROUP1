import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { COMPONENTS } from '../data/gameData';

export default function ItemsSection() {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.05 });

  return (
    <section id="components" className="items-section">
      <div className="container">
        <div className="section-title">
          <h2>Thành Phần Trò Chơi</h2>
          <div className="divider"></div>
          <p>Mỗi hộp game ELARION bao gồm các thành phần chi tiết, chất lượng cao, mang lại trải nghiệm chiến thuật chân thực nhất.</p>
        </div>

        <div
          ref={ref}
          className={`items-grid reveal ${isVisible ? 'visible' : ''}`}
        >
          {COMPONENTS.map((item, index) => (
            <div key={index} className="item-card">
              <span className="item-icon">{item.icon}</span>
              <h3 className="item-name">{item.name}</h3>
              <div className="item-qty">Số lượng: {item.qty}</div>
              <div className="item-detail">{item.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
