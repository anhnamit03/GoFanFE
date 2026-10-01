import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone, ShieldCheck, Wind } from 'lucide-react'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="landing-container footer-container">
        <div className="footer-column footer-brand">
          <Link to="/" className="footer-logo">
            <span className="footer-logo-mark"><Wind size={22} /></span>
            <span className="footer-logo-text">GoFan<span className="footer-logo-period">.</span></span>
          </Link>
          <p className="footer-brand-tagline">
            Thế giới quạt điện & giải pháp làm mát thông minh thế hệ mới. Tiên phong ứng dụng động cơ DC Inverter tiết kiệm điện và công nghệ khí động học vận hành siêu tĩnh lặng.
          </p>
          <div className="footer-trust-badge">
            <ShieldCheck size={18} />
            <span>Bảo hành chính hãng 24 - 36 tháng</span>
          </div>
        </div>

        <div className="footer-column">
          <h3 className="footer-col-title">Danh Mục Quạt</h3>
          <Link to="/products?category=3">Quạt đứng DC Inverter</Link>
          <Link to="/products?category=4">Quạt trần đèn LED Bắc Âu</Link>
          <Link to="/products?category=5">Quạt treo tường có remote</Link>
          <Link to="/products?category=6">Quạt sạc mini để bàn</Link>
          <Link to="/products?category=7">Quạt hút thông gió gắn trần</Link>
        </div>

        <div className="footer-column">
          <h3 className="footer-col-title">Chính Sách & Hỗ Trợ</h3>
          <Link to="/orders">Tra cứu đơn hàng</Link>
          <Link to="/myself">Tài khoản & Sổ địa chỉ</Link>
          <a href="#guarantee">Chính sách bảo hành 1:1</a>
          <a href="#shipping">Giao hàng miễn phí từ 500k</a>
          <a href="#terms">Điều khoản & Bảo mật</a>
        </div>

        <div className="footer-column footer-contact">
          <h3 className="footer-col-title">Hệ Thống Showroom</h3>
          <div className="footer-contact-item">
            <MapPin size={18} className="contact-icon" />
            <span>123 Đường Cầu Giấy, Quận Cầu Giấy, Hà Nội</span>
          </div>
          <div className="footer-contact-item">
            <Phone size={18} className="contact-icon" />
            <div>
              <strong>1900 6868</strong>
              <small> (Tổng đài CSKH miễn phí 24/7)</small>
            </div>
          </div>
          <div className="footer-contact-item">
            <Mail size={18} className="contact-icon" />
            <span>support@gofan.vn</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="landing-container footer-bottom-inner">
          <p>© 2026 GoFan Technologies JSC. All rights reserved.</p>
          <div className="footer-bottom-links">
            <span>Tiêu chuẩn năng lượng 5 sao</span>
            <span>·</span>
            <span>ISO 9001:2015</span>
            <span>·</span>
            <span>Chính hãng 100%</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer