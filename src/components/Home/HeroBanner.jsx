import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Sparkles, Truck, VolumeX, Zap } from 'lucide-react'
import './HeroBanner.css'

function HeroBanner() {
  return (
    <section className="hero-section">
      <div className="hero-ambient-glow" aria-hidden="true" />
      <div className="hero-ambient-glow-secondary" aria-hidden="true" />

      <div className="landing-container hero-inner">
        <div className="hero-copy">
          <div className="hero-badge">
            <span className="hero-badge-icon"><Zap size={14} /></span>
            <span>ĐỘNG CƠ DC INVERTER 2026 · TIẾT KIỆM 70% ĐIỆN</span>
          </div>

          <h1 className="hero-heading">
            Luồng Gió Êm Dịu,
            <span className="hero-heading-gradient"> Không Gian Đẳng Cấp.</span>
          </h1>

          <p className="hero-lead">
            Giải pháp làm mát thông minh thế hệ mới từ GoFan. Vận hành siêu tĩnh lặng dưới 28dB,
            khí động học 7 cánh quạt đối lưu không khí trong lành suốt 4 mùa.
          </p>

          <div className="hero-actions">
            <Link to="/products" className="hero-btn-primary">
              <span>Khám phá bộ sưu tập</span>
              <ArrowRight size={18} />
            </Link>
            <a href="#flash-deals" className="hero-btn-glass">
              <Sparkles size={17} />
              <span>Sản phẩm giảm giá</span>
            </a>
          </div>

          <div className="hero-highlights">
            <div className="hero-highlight-item">
              <div className="hero-highlight-icon"><VolumeX size={18} /></div>
              <div>
                <strong>Siêu êm ái</strong>
                <span>Độ ồn &lt; 28dB ngủ ngon</span>
              </div>
            </div>

            <div className="hero-highlight-item">
              <div className="hero-highlight-icon"><ShieldCheck size={18} /></div>
              <div>
                <strong>24 Tháng</strong>
                <span>Bảo hành chính hãng 1:1</span>
              </div>
            </div>

            <div className="hero-highlight-item">
              <div className="hero-highlight-icon"><Truck size={18} /></div>
              <div>
                <strong>Freeship</strong>
                <span>Đơn hàng từ 500.000đ</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-visual-card">
            <div className="hero-image-wrapper">
              <img
                src="/assets/gofan-hero-fan.jpg"
                alt="Quạt đứng thông minh GoFan Silent Wind Pro"
                className="hero-product-img"
              />
            </div>

            {/* Floating Glass Badges */}
            <div className="hero-float-badge hero-float-top animate-float">
              <span className="badge-tag">BÁN CHẠY</span>
              <div>
                <strong>GoFan Silent Wind Pro</strong>
                <span>Động cơ DC 12 cấp gió</span>
              </div>
            </div>

            <div className="hero-float-badge hero-float-bottom">
              <div className="badge-pulse-indicator" />
              <div>
                <strong>Độ ồn ban đêm</strong>
                <span className="badge-accent-text">Chỉ 26.5 dB · Tự động giảm tốc</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroBanner