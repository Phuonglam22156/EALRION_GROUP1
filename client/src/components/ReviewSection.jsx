import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ReviewSection() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userOrders, setUserOrders] = useState([]);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews');
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const fetchUserOrders = async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem('elarion_token');
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUserOrders(data);
      }
    } catch (err) {
      console.error('Error fetching user orders:', err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    fetchUserOrders();
  }, [user]);

  // Check if current user is allowed to review (logged in and has at least one order)
  const canReview = user && userOrders.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!comment.trim()) {
      setError('Vui lòng nhập nội dung đánh giá.');
      return;
    }

    try {
      const token = localStorage.getItem('elarion_token');
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Không thể gửi đánh giá');
      }

      setSuccess('Cảm ơn bạn đã gửi đánh giá!');
      setComment('');
      setRating(5);
      fetchReviews();
    } catch (err) {
      setError(err.message);
    }
  };

  const renderStars = (count) => {
    return Array.from({ length: 5 }).map((_, idx) => (
      <span key={idx} style={{ color: idx < count ? 'var(--gold)' : 'var(--text-muted)' }}>
        ★
      </span>
    ));
  };

  // Stats calculation
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : '0.0';

  return (
    <section id="reviews" className="reviews-section">
      <div className="container">
        <div className="section-title">
          <h2>Đánh Giá Từ Chiến Binh</h2>
          <div className="divider"></div>
          <p>Lắng nghe cảm nhận từ những người đã trải nghiệm lục địa Elarion.</p>
        </div>

        {/* Stats Summary */}
        <div className="reviews-stats">
          <div className="reviews-avg">
            <div className="avg-number">{avgRating}</div>
            <div className="avg-stars">{renderStars(Math.round(parseFloat(avgRating)))}</div>
            <div className="avg-count">{totalReviews} đánh giá</div>
          </div>
        </div>

        {/* Review Form */}
        <div style={{ maxWidth: '800px', margin: '0 auto 40px' }}>
          {user ? (
            canReview ? (
              <form onSubmit={handleSubmit} className="review-card" style={{ border: '1px solid var(--gold-border-strong)' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', marginBottom: '16px' }}>
                  Viết Đánh Giá Của Bạn
                </h3>
                
                {error && <p className="form-error" style={{ marginBottom: '16px' }}>{error}</p>}
                {success && <p style={{ color: 'var(--faction-arboris)', marginBottom: '16px' }}>{success}</p>}

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label>Số sao đánh giá</label>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '1.8rem', cursor: 'pointer' }}>
                    {Array.from({ length: 5 }).map((_, idx) => {
                      const starValue = idx + 1;
                      return (
                        <span
                          key={idx}
                          onClick={() => setRating(starValue)}
                          onMouseEnter={() => setHoverRating(starValue)}
                          onMouseLeave={() => setHoverRating(0)}
                          style={{
                            color: starValue <= (hoverRating || rating) ? 'var(--gold)' : 'var(--text-muted)',
                            transition: 'color var(--transition-fast)'
                          }}
                        >
                          ★
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="review-comment">Bình luận</label>
                  <textarea
                    id="review-comment"
                    rows="3"
                    placeholder="Nhập cảm nhận của bạn về trò chơi (hình ảnh, gameplay, hướng dẫn...)"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-gold btn-sm" style={{ marginTop: '12px' }}>
                  Gửi Đánh Giá
                </button>
              </form>
            ) : (
              <div className="review-card" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                🔒 Chỉ những tài khoản đã mua sản phẩm mới có thể viết đánh giá.
              </div>
            )
          ) : (
            <div className="review-card" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
              🔑 Vui lòng đăng nhập để gửi đánh giá của bạn.
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="reviews-list">
          {reviews.length > 0 ? (
            reviews.map((rev) => (
              <div key={rev.id} className="review-card">
                <div className="review-header">
                  <div className="review-user">
                    <div className="review-avatar">
                      {rev.username.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="review-name">{rev.username}</h4>
                      <span className="review-date">
                        {new Date(rev.date).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                  <div className="review-stars">
                    {renderStars(rev.rating)}
                  </div>
                </div>
                <p className="review-text">{rev.comment}</p>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!</p>
          )}
        </div>
      </div>
    </section>
  );
}
