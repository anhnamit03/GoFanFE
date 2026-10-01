import { CheckCircle2, Quote, Star } from 'lucide-react'
import './TestimonialsSection.css'

const reviews = [
  {
    name: 'Anh Hoàng Nam',
    location: 'Cầu Giấy, Hà Nội',
    avatar: 'HN',
    product: 'Quạt đứng GoFan Silent Wind Pro',
    rating: 5,
    comment: 'Quạt êm bất ngờ! Để số 3 ban đêm mà phòng ngủ hoàn toàn yên tĩnh, không một tiếng ro ro khó chịu như quạt cơ cũ. Bé nhà mình ngủ say giấc suốt đêm. Rất xứng đáng từng đồng bỏ ra.',
    date: '15/09/2026'
  },
  {
    name: 'Chị Minh Trang',
    location: 'Thảo Điền, TP. Hồ Chí Minh',
    avatar: 'MT',
    product: 'Quạt trần 5 cánh đèn LED Luxury Air',
    rating: 5,
    comment: 'Thiết kế phong cách Bắc Âu chuẩn gu nội thất căn hộ của mình. Đèn LED 3 chế độ sáng thay thế luôn đèn trang trí phòng khách. Kỹ thuật viên GoFan hỗ trợ lắp đặt rất cẩn thận, nhiệt tình.',
    date: '22/09/2026'
  },
  {
    name: 'Anh Quốc Bảo',
    location: 'Hải Châu, Đà Nẵng',
    avatar: 'QB',
    product: 'Quạt sạc mini để bàn DeskBreeze',
    rating: 5,
    comment: 'Pin trâu thật sự, mình dùng cả ngày ở văn phòng từ sáng tới chiều vẫn chưa hết pin. Góc quay 120 độ mát thoang thoảng dễ chịu, không bị khô rát mắt hay nghẹt mũi như ngồi điều hòa.',
    date: '28/09/2026'
  }
]

function TestimonialsSection() {
  return (
    <section className="testimonials-section">
      <div className="landing-container">
        <div className="testimonials-header">
          <span className="section-eyebrow">KHÁCH HÀNG NÓI VỀ CHÚNG TÔI</span>
          <h2 className="section-title">Hơn 12.000+ Gia Đình Tin Dùng</h2>
          
          <div className="rating-pill">
            <div className="rating-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill="#f59e0b" color="#f59e0b" />
              ))}
            </div>
            <strong>4.9 / 5.0</strong>
            <span>từ 2.850+ đánh giá xác thực</span>
          </div>
        </div>

        <div className="testimonials-grid">
          {reviews.map((rev, index) => (
            <div key={index} className="testimonial-card">
              <div className="testi-top-row">
                <div className="testi-stars">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <Quote size={24} className="testi-quote-icon" />
              </div>

              <p className="testi-comment">"{rev.comment}"</p>

              <div className="testi-product-tag">
                <span>Đã mua: </span>
                <strong>{rev.product}</strong>
              </div>

              <div className="testi-author-box">
                <div className="testi-avatar">{rev.avatar}</div>
                <div>
                  <div className="testi-author-name">
                    <strong>{rev.name}</strong>
                    <CheckCircle2 size={15} className="verified-badge" />
                  </div>
                  <span className="testi-author-loc">{rev.location} · {rev.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
