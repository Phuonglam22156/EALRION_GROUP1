import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { FACTIONS } from '../data/gameData';

export default function StorySection() {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.1 });

  const scrollToFaction = (factionId) => {
    const el = document.getElementById(`faction-${factionId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      const elSection = document.getElementById('factions');
      if (elSection) elSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="story" className="story-section">
      <div className="container">
        <div className="section-title">
          <h2>Cốt Truyện Sử Thi</h2>
          <div className="divider"></div>
          <p>Truyền thuyết về lục địa Elarion và sự hỗn loạn của Lục Nguyên Tố</p>
        </div>

        <div ref={ref} className={`story-content reveal ${isVisible ? 'visible' : ''}`}>
          <div className="story-ornament">⚜️</div>
          <div className="story-text">
            <p style={{ marginBottom: '20px' }}>
              Từ thuở sơ khai, lục địa <span className="highlight">Elarion</span> được duy trì trong sự cân bằng hoàn mỹ nhờ <span className="highlight">Nguồn Mana Nguyên Bản</span>. Sáu tộc hệ lớn cai quản sáu góc của lục địa, mỗi tộc hệ thừa hưởng một thuộc tính tối cao giúp duy trì sự sống.
            </p>
            <p style={{ marginBottom: '20px' }}>
              Nhưng tai họa đã giáng xuống. Một sự kiện kinh hoàng mang tên <span className="highlight-red">"Đại Nứt Gãy"</span> xé toạc bầu trời. Mana vỡ vụn và phân tán khắp nơi. Những vùng đất trù phú bỗng chốc hóa thành đống đổ nát do thiên tai tàn phá dữ dội.
            </p>
            <p>
              Giờ đây, sinh mệnh của mỗi tộc hệ chỉ còn được tính bằng từng giọt mana còn sót lại. Hết mana đồng nghĩa với việc tộc hệ đó sẽ bị xóa sổ hoàn toàn khỏi bản đồ. Để tồn tại, các chiến binh kiêu hùng nhất phải bước vào cuộc chiến sinh tử khốc liệt nhất lịch sử.
            </p>
          </div>

          <div className="story-factions-preview">
            {FACTIONS.map((f) => (
              <button
                key={f.id}
                className="story-faction-badge"
                onClick={() => scrollToFaction(f.id)}
                style={{ borderLeft: `3px solid ${f.color}` }}
              >
                <span className="badge-icon" style={{ color: f.color }}>{f.icon}</span>
                <span>{f.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
