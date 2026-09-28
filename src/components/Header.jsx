import { Link } from 'react-router-dom'
import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header-container">

        <Link to="/" className="logo">
          GoFan
        </Link>

        <nav className="nav">
          <Link to="/">Trang chủ</Link>
          <Link to="/products">Sản phẩm</Link>
          <Link to="/cart">Giỏ hàng</Link>
          <Link to="/login">Đăng nhập</Link>
        </nav>

      </div>
    </header>
  )
}

export default Header