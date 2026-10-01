import { Link } from 'react-router-dom'
import { ArrowRight, Moon, Wind, Zap } from 'lucide-react'
import './TechSpotlight.css'

function TechSpotlight() {
  return (
    <section className="tech-spotlight-section">
      <div className="landing-container">
        <div className="tech-spotlight-grid">
          <div className="tech-spotlight-media">
            <div className="tech-media-frame">
              <img
                src="/assets/gofan-airflow-tech.jpg"
                alt="Công nghệ luồng gió đối lưu 3D GoFan"
                className="tech-main-img"
              />
              <div className="tech-media-overlay" />
              
              <div className="tech-floating-stat animate-float">
                <span className="stat-num">&lt; 28dB</span>
                <span className="stat-desc">Độ ồn ban đêm êm hơn tiếng lá rơi</span>
              </div>
            </div>
          </div>

          <div className="tech-spotlight-content">
            <span className="section-eyebrow">CÔNG NGHỆ KHÍ ĐỘNG HỌC ĐỘC QUYỀN</span>
            <h2 className="tech-spotlight-heading">
              Gió Tự Nhiên Đa Tầng, Vỗ Về Giấc Ngủ Sâu
            </h2>
            <p className="tech-spotlight-desc">
              Không giống như quạt truyền thống tạo luồng gió cắt giật gây khô da và đau đầu,
              GoFan ứng dụng cánh quạt mô phỏng cánh máy bay kết hợp thuật toán biến thiên
              gió tự nhiên, lan tỏa mát dịu khắp mọi ngóc ngách căn phòng.
            </p>

            <div className="tech-pillars-list">
              <div className="tech-pillar-row">
                <div className="tech-pillar-icon"><Wind size={22} /></div>
                <div>
                  <h4>Cánh quạt khí động học đa tầng</h4>
                  <p>7 cánh uốn lượn phân tán luồng khí mịn màng, góc tản gió bao phủ lên đến 140 độ.</p>
                </div>
              </div>

              <div className="tech-pillar-row">
                <div className="tech-pillar-icon"><Zap size={22} /></div>
                <div>
                  <h4>Động cơ lõi đồng Silent-DC</h4>
                  <p>Vận hành không sinh nhiệt, tiết kiệm 70% điện năng với tuổi thọ động cơ lên đến 10 năm.</p>
                </div>
              </div>

              <div className="tech-pillar-row">
                <div className="tech-pillar-icon"><Moon size={22} /></div>
                <div>
                  <h4>Thuật toán giấc ngủ thông minh</h4>
                  <p>Tự động hạ nhiệt và giảm tốc độ gió lúc nửa đêm, ngăn ngừa cảm lạnh cho trẻ nhỏ và người cao tuổi.</p>
                </div>
              </div>
            </div>

            <div className="tech-spotlight-action">
              <Link to="/products?category=4" className="tech-cta-btn">
                <span>Khám phá quạt trần thông minh</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TechSpotlight
