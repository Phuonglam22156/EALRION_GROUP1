import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { GAME_SYSTEMS, GAMEPLAY_PHASES } from '../data/gameData';

export default function HowToPlay() {
  const [ref1, isVisible1] = useScrollReveal({ threshold: 0.05 });
  const [ref2, isVisible2] = useScrollReveal({ threshold: 0.05 });

  return (
    <section id="gameplay" className="howtoplay-section">
      <div className="container">
        <div className="section-title">
          <h2>Quy Luật & Hệ Thống</h2>
          <div className="divider"></div>
          <p>
            Cách chơi dễ tiếp cận cho người mới bắt đầu nhưng đầy chiều sâu chiến thuật cho những game thủ lão luyện.
          </p>
        </div>

        {/* Systems Grid */}
        <div
          ref={ref1}
          className={`systems-grid reveal ${isVisible1 ? 'visible' : ''}`}
        >
          {GAME_SYSTEMS.map((sys) => (
            <div key={sys.id} className="system-card">
              <span className="system-icon">{sys.icon}</span>
              <h3 className="system-title">{sys.title}</h3>
              <p className="system-desc">{sys.description}</p>
              {sys.details && (
                <div className="system-details">
                  {sys.details.map((d, i) => (
                    <div key={i} className="system-detail-item">
                      <div className="detail-label">{d.label}</div>
                      <div className="detail-text">{d.text}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Gameplay Phases */}
        <div
          ref={ref2}
          className={`phases-container reveal ${isVisible2 ? 'visible' : ''}`}
        >
          <div className="phases-title">
            <h3>Các Pha Trong Một Lượt</h3>
          </div>

          {GAMEPLAY_PHASES.map((phase, idx) => (
            <div key={phase.id} className="phase-item">
              <div className="phase-number">{idx + 1}</div>
              <div className="phase-content">
                <h4>{phase.title} {phase.icon}</h4>
                <p>{phase.description}</p>
                {phase.options && (
                  <div className="phase-options">
                    {phase.options.map((opt, oIdx) => (
                      <div key={oIdx} className="phase-option">
                        <div className="option-name">{opt.name}</div>
                        <div className="option-detail">{opt.detail}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
