import { useEffect, useState, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  ChevronDown,
  ChevronRight,
  Grid2X2,
  Heart,
  LogOut,
  Menu,
  PackageOpen,
  PhoneCall,
  Search,
  ShoppingCart,
  UserRound,
  Wind,
  X,
  Sparkles,
  ClipboardList
} from 'lucide-react'
import { useCart } from '../context/useCart'
import { useAuth } from '../context/useAuth'
import { getCategories } from '../services/categoryService'
import './Header.css'

function Header() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isCatalogOpen, setIsCatalogOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [headerHeight, setHeaderHeight] = useState(96)
  const headerRef = useRef(null)
  const catalogDropdownRef = useRef(null)

  const navigate = useNavigate()
  const { cartItems, favoriteItems } = useCart()
  const { user, isAuthenticated, logout } = useAuth()
  
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  // Accurately measure header height so backdrop starts strictly below header
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight)
      }
    }
    updateHeaderHeight()
    window.addEventListener('resize', updateHeaderHeight)
    return () => window.removeEventListener('resize', updateHeaderHeight)
  }, [isCatalogOpen])

  // Outside click listener for catalog dropdown
  useEffect(() => {
    if (!isCatalogOpen) return

    const handleOutsideClick = (event) => {
      if (catalogDropdownRef.current && !catalogDropdownRef.current.contains(event.target)) {
        setIsCatalogOpen(false)
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsCatalogOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isCatalogOpen])

  const handleSearch = (event) => {
    event.preventDefault()
    const query = searchTerm.trim()
    navigate(query ? `/products?search=${encodeURIComponent(query)}` : '/products')
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="gofan-header" ref={headerRef}>
      {/* Top utility notification bar */}
      <div className="header-topbar">
        <div className="header-topbar-inner">
          <div className="topbar-left">
            <span className="topbar-badge">
              <Sparkles size={13} /> Khuyến mãi tháng
            </span>
            <span className="topbar-text">
              Miễn phí giao hàng toàn quốc cho đơn từ 1.000.000đ • Hotline: <strong>1900 6868</strong>
            </span>
          </div>
          <div className="topbar-right">
            <a href="tel:19006868" className="topbar-link">
              <PhoneCall size={13} /> Tư vấn trực tiếp
            </a>
            <span className="topbar-divider">|</span>
            <Link to="/orders" className="topbar-link">
              <ClipboardList size={13} /> Tra cứu đơn hàng
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="header-main">
        <div className="header-container">
          {/* Mobile hamburger button */}
          <button
            type="button"
            className="mobile-menu-toggle"
            aria-label={isMobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Brand Logo */}
          <Link to="/" className="header-logo" aria-label="GoFan - Trang chủ">
            <span className="logo-icon-box" aria-hidden="true">
              <Wind size={22} className="logo-wind-icon" />
            </span>
            <span className="logo-text">
              GoFan<span className="logo-dot">.</span>
            </span>
          </Link>

          {/* Desktop Categories Dropdown */}
          <div className="header-catalog-dropdown" ref={catalogDropdownRef}>
            <button
              className={`catalog-trigger-btn ${isCatalogOpen ? 'active' : ''}`}
              type="button"
              aria-expanded={isCatalogOpen}
              onClick={() => setIsCatalogOpen(!isCatalogOpen)}
            >
              <Grid2X2 size={18} />
              <span>Danh mục</span>
              <ChevronDown size={16} className={`chevron-icon ${isCatalogOpen ? 'rotated' : ''}`} />
            </button>

            {isCatalogOpen && (
              <div className="catalog-dropdown-menu">
                <div className="catalog-dropdown-header">
                  <Grid2X2 size={16} />
                  <span>Danh mục thiết bị làm mát</span>
                </div>
                  <div className="catalog-items-grid">
                    <Link
                      to="/products"
                      className="catalog-item-link all-products"
                      onClick={() => setIsCatalogOpen(false)}
                    >
                      <div className="catalog-item-icon">
                        <PackageOpen size={18} />
                      </div>
                      <div className="catalog-item-text">
                        <strong>Tất cả sản phẩm</strong>
                        <small>Xem trọn bộ sưu tập</small>
                      </div>
                      <ChevronRight size={16} className="arrow" />
                    </Link>
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/products?category=${cat.id}`}
                        className="catalog-item-link"
                        onClick={() => setIsCatalogOpen(false)}
                      >
                        <div className="catalog-item-icon">
                          <Wind size={18} />
                        </div>
                        <div className="catalog-item-text">
                          <strong>{cat.name}</strong>
                          <small>{cat.description || 'Công nghệ DC Inverter'}</small>
                        </div>
                        <ChevronRight size={16} className="arrow" />
                      </Link>
                    ))}
                  </div>
                </div>
            )}
          </div>

          {/* Quick link: All products */}
          <NavLink
            to="/products"
            className={({ isActive }) => `header-nav-link ${isActive ? 'active' : ''}`}
          >
            <PackageOpen size={18} />
            <span>Sản phẩm</span>
          </NavLink>

          {/* Search bar */}
          <form className="header-search-form" onSubmit={handleSearch} role="search">
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm quạt đứng, quạt trần, quạt sạc..."
              aria-label="Tìm kiếm sản phẩm"
            />
            {searchTerm && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchTerm('')}
                aria-label="Xóa từ khóa"
              >
                <X size={14} />
              </button>
            )}
            <button type="submit" className="search-submit-btn" aria-label="Tìm kiếm">
              <Search size={18} />
            </button>
          </form>

          {/* Header Actions (Wishlist, Cart, User) */}
          <div className="header-action-group">
            {/* Wishlist */}
            <NavLink
              to="/favorites"
              className={({ isActive }) => `header-icon-action ${isActive ? 'active' : ''}`}
              aria-label={`Yêu thích (${favoriteItems.length})`}
            >
              <div className="action-icon-wrapper">
                <Heart size={21} />
                {favoriteItems.length > 0 && (
                  <span className="action-counter-badge">{favoriteItems.length}</span>
                )}
              </div>
              <span className="action-text">Yêu thích</span>
            </NavLink>

            {/* Cart */}
            <NavLink
              to="/cart"
              className={({ isActive }) => `header-icon-action cart-action ${isActive ? 'active' : ''}`}
              aria-label={`Giỏ hàng (${cartCount})`}
            >
              <div className="action-icon-wrapper">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="action-counter-badge cart-badge">{cartCount}</span>
                )}
              </div>
              <span className="action-text">Giỏ hàng</span>
            </NavLink>

            {/* User Account / Auth */}
            {isAuthenticated ? (
              <div className="user-profile-menu">
                <NavLink
                  to="/myself"
                  className={({ isActive }) => `header-icon-action user-btn ${isActive ? 'active' : ''}`}
                >
                  <div className="action-icon-wrapper user-avatar-pill">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt="" className="header-avatar-img" />
                    ) : (
                      <UserRound size={20} />
                    )}
                  </div>
                  <span className="action-text user-name-truncate">
                    {user?.fullName?.split(' ').slice(-1)[0] || 'Tài khoản'}
                  </span>
                </NavLink>

                <button
                  type="button"
                  className="header-logout-btn"
                  onClick={logout}
                  title="Đăng xuất"
                  aria-label="Đăng xuất"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <NavLink to="/login" className="header-login-pill">
                <UserRound size={17} />
                <span>Đăng nhập</span>
              </NavLink>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Category Dropdown Backdrop (Dims ONLY the page below header) */}
      {isCatalogOpen && (
        <div
          className="catalog-dropdown-backdrop"
          style={{ top: `${headerHeight}px` }}
          onClick={() => setIsCatalogOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <Link to="/" className="header-logo" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="logo-icon-box">
                  <Wind size={20} />
                </span>
                <span className="logo-text">GoFan.</span>
              </Link>
              <button
                type="button"
                className="mobile-drawer-close"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Đóng menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* Mobile Search */}
            <form className="mobile-search-form" onSubmit={handleSearch}>
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm quạt..."
              />
              <button type="submit" aria-label="Tìm kiếm">
                <Search size={18} />
              </button>
            </form>

            {/* Mobile User Status */}
            {isAuthenticated ? (
              <div className="mobile-user-card">
                <div className="mobile-user-avatar">
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
                <div className="mobile-user-info">
                  <strong>{user?.fullName || 'Khách hàng GoFan'}</strong>
                  <span>{user?.email || user?.phone}</span>
                </div>
              </div>
            ) : (
              <div className="mobile-auth-actions">
                <Link
                  to="/login"
                  className="mobile-login-btn primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Đăng nhập / Đăng ký
                </Link>
              </div>
            )}

            {/* Mobile Nav Links */}
            <nav className="mobile-nav-list">
              <NavLink
                to="/"
                className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Trang chủ
              </NavLink>
              <NavLink
                to="/products"
                className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Tất cả sản phẩm
              </NavLink>
              <NavLink
                to="/favorites"
                className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Sản phẩm yêu thích</span>
                {favoriteItems.length > 0 && <span className="mobile-count">{favoriteItems.length}</span>}
              </NavLink>
              <NavLink
                to="/cart"
                className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Giỏ hàng</span>
                {cartCount > 0 && <span className="mobile-count primary">{cartCount}</span>}
              </NavLink>
              {isAuthenticated && (
                <>
                  <NavLink
                    to="/myself"
                    className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Tài khoản của tôi
                  </NavLink>
                  <NavLink
                    to="/orders"
                    className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Đơn mua của tôi
                  </NavLink>
                  <button
                    type="button"
                    className="mobile-logout-btn"
                    onClick={() => {
                      logout()
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <LogOut size={16} /> Đăng xuất
                  </button>
                </>
              )}
            </nav>

            {/* Mobile Categories list */}
            {categories.length > 0 && (
              <div className="mobile-categories-section">
                <span className="mobile-section-label">Danh mục sản phẩm</span>
                <div className="mobile-categories-list">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/products?category=${cat.id}`}
                      className="mobile-cat-pill"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Wind size={14} />
                      <span>{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Support hotline */}
            <div className="mobile-drawer-footer">
              <a href="tel:19006868" className="mobile-hotline-card">
                <PhoneCall size={18} />
                <div>
                  <small>Tổng đài tư vấn miễn phí</small>
                  <strong>1900 6868</strong>
                </div>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header