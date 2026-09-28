import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-column footer-brand">
          <h2>GoFan</h2>
          <p>
            Mua sắm dễ dàng, sản phẩm chất lượng.
          </p>
        </div>

        <div className="footer-column">
          <h3>GoFan</h3>

          <Link to="/">Trang chủ</Link>
          <Link to="/products">Sản phẩm</Link>
          <Link to="/cart">Giỏ hàng</Link>
        </div>

        <div className="footer-column">
          <h3>Hỗ trợ</h3>

          <a href="#">Liên hệ</a>
          <a href="#">Chính sách mua hàng</a>
          <a href="#">Chính sách bảo mật</a>
        </div>

        <div className="footer-column">
          <h3>Liên hệ</h3>

          <p>Email: support@gofan.vn</p>
          <p>Hotline: 0123 456 789</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 GoFan. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer