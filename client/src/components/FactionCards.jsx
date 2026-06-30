import React, { useState } from 'react';
import { FACTIONS } from '../data/gameData';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function FactionCards() {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.05 });
  const [flippedCards, setFlippedCards] = useState({});

  const toggleFlip = (id) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section id="factions" className="factions-section">
      <div className="container">
        <div className="section-title">
          <h2>Sáu Tộc Hệ Nguyên Tố</h2>
          <div className="divider"></div>
          <p>
            Chọn phe của bạn. Mỗi tộc hệ sở hữu một chiến binh huyền thoại mang năng lực tối thượng 
            có thể xoay chuyển cục diện trận đấu.
          </p>
        </div>

        <div
          ref={ref}
          className={`factions-grid reveal ${isVisible ? 'visible' : ''}`}
        >
          {FACTIONS.map((faction) => {
            const isFlipped = !!flippedCards[faction.id];
            return (
              <div
                key={faction.id}
                id={`faction-${faction.id}`}
                className={`faction-card ${isFlipped ? 'mobile-flipped' : ''}`}
                data-faction={faction.id}
                onClick={() => toggleFlip(faction.id)}
              >
                <div className="faction-card-inner" style={{ transform: isFlipped ? 'rotateY(180deg)' : '' }}>
                  {/* Front Side */}
                  <div className="faction-card-front" style={{ borderTop: `4px solid ${faction.color}` }}>
                    <div className="faction-icon" style={{ color: faction.color }}>
                      {faction.icon}
                    </div>
                    <h3 className="faction-name" style={{ color: faction.color }}>
                      {faction.name}
                    </h3>
                    <div className="faction-title">{faction.title}</div>
                    
                    <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px', width: '100%' }}>
                      <div className="character-name">{faction.character.name}</div>
                      <div className="character-epithet">{faction.character.epithet}</div>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '15px' }}>
                      (Nhấn để lật xem kỹ năng)
                    </div>
                  </div>

                  {/* Back Side */}
                  <div className="faction-card-back" style={{ borderLeft: `4px solid ${faction.color}` }}>
                    <div>
                      <div className="back-header">
                        <span className="back-icon" style={{ color: faction.color }}>
                          {faction.icon}
                        </span>
                        <h3 className="back-title" style={{ color: faction.color }}>
                          {faction.character.name}
                        </h3>
                      </div>
                      <div className="back-story">
                        {faction.character.background}
                      </div>
                    </div>

                    <div className="ability-box" style={{ borderColor: `${faction.color}33` }}>
                      <div className="ability-header">
                        <span className="ability-name">{faction.character.abilityName}</span>
                        <span className="ability-cost" style={{ background: `${faction.color}22`, color: faction.color }}>
                          {faction.character.manaCost} Mana
                        </span>
                      </div>
                      <p className="ability-desc">
                        {faction.character.abilityDesc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
