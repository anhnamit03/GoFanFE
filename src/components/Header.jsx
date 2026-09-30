import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Heart, Menu, PackageOpen, Search, ShoppingCart, Truck, UserRound, Wind, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import './Header.css'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const { cartItems, favoriteItems } = useCart()
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  const closeMenu = () => setIsMenuOpen(false)
  const handleSearch = (event) => {
    event.preventDefault()
    const query = searchTerm.trim()
    navigate(query ? `/products?search=${encodeURIComponent(query)}` : '/products')
    closeMenu()
  }

  return (
    <header className="header">
      <div className="header-main">
        <div className="header-container">
          <Link to="/" className="logo" onClick={closeMenu} aria-label="GoFan - Trang chủ">
            <span className="logo-mark" aria-hidden="true"><Wind /></span>
            <span className="logo-name">GoFan<span className="logo-period">.</span></span>
          </Link>

          <form className="header-search" role="search" onSubmit={handleSearch}>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tìm sản phẩm, thương hiệu..."
              aria-label="Tìm sản phẩm"
            />
            <button type="submit" aria-label="Tìm kiếm">
              <Search size={20} strokeWidth={2.2} />
            </button>
          </form>

          <div className="header-actions">
            <NavLink
              to="/favorites"
              className="header-action favorite-action"
              aria-label={`Sản phẩm yêu thích, ${favoriteItems.length} sản phẩm`}
            >
              <span className="action-icon-wrap">
                <Heart size={22} strokeWidth={1.8} />
                <span className="cart-count">{favoriteItems.length}</span>
              </span>
              <span className="action-label">Yêu thích</span>
            </NavLink>
            <NavLink to="/cart" className="header-action cart-action" aria-label={`Giỏ hàng, ${cartCount} sản phẩm`}>
              <span className="action-icon-wrap">
                <ShoppingCart size={23} strokeWidth={1.8} />
                <span className="cart-count">{cartCount}</span>
              </span>
              <span className="action-label">Giỏ hàng</span>
            </NavLink>
            <NavLink to="/login" className="header-action account-action" aria-label="Tài khoản">
              <span className="action-icon-wrap"><UserRound size={22} strokeWidth={1.8} /></span>
              <span className="action-label">Tài khoản</span>
            </NavLink>
          </div>

          <button
            type="button"
            className="menu-toggle"
            aria-label={isMenuOpen ? 'Đóng menu' : 'Mở menu'}
            aria-controls="primary-navigation"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          >
            {isMenuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>

      <div className={`header-nav-band${isMenuOpen ? ' nav-band-open' : ''}`}>
        <div className="header-nav-inner">
          <nav className="nav" id="primary-navigation" aria-label="Điều hướng chính">
            <NavLink to="/" end onClick={closeMenu}>
              <Wind size={16} /> Trang chủ
            </NavLink>
            <NavLink to="/products" onClick={closeMenu}>
              <PackageOpen size={16} /> Tất cả sản phẩm
            </NavLink>
          </nav>
          <div className="shipping-note">
            <Truck size={17} strokeWidth={1.8} />
            <span>Giao hàng toàn quốc</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header