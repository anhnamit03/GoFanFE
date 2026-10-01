import { useEffect, useState } from 'react'
import {
  ArrowRight,
  Camera,
  CheckCircle,
  ChevronRight,
  Heart,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Package,
  Pencil,
  Phone,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  User,
  X
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { useCart } from '../context/useCart'
import {
  createAddress,
  deleteAddress,
  getAddresses,
  setDefaultAddress as setDefaultAddressApi,
  updateAddress,
  updateProfile,
  uploadAvatar
} from '../services/authService'
import './Myself.css'

const initialProfile = {
  fullName: 'Khách hàng GoFan',
  email: 'customer@gofan.vn',
  phone: '0901 234 567',
  address: 'Chưa cập nhật địa chỉ nhận hàng',
}

function Myself() {
  const { cartItems, favoriteItems } = useCart()
  const { token, user, isAuthenticated, isLoading, logout, updateUser } = useAuth()
  const [avatarFile, setAvatarFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [profileOverrides, setProfileOverrides] = useState({})
  const [avatarPreview, setAvatarPreview] = useState('')
  const [addresses, setAddresses] = useState([])
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState(null)
  const [addressSubmitting, setAddressSubmitting] = useState(false)
  const [addressFormData, setAddressFormData] = useState({
    recipientName: '',
    phoneNumber: '',
    streetAddress: '',
    ward: '',
    district: '',
    province: '',
    isDefault: false,
  })

  useEffect(() => {
    if (!token) return

    getAddresses(token)
      .then(data => setAddresses(Array.isArray(data) ? data : []))
      .catch(err => console.error('Failed to fetch addresses:', err))
  }, [token])

  const effectiveProfile = {
    ...initialProfile,
    ...(user ? {
      fullName: user.fullName || initialProfile.fullName,
      email: user.email || initialProfile.email,
      phone: user.phoneNumber || initialProfile.phone,
      address: user.address || initialProfile.address,
    } : {}),
    ...profileOverrides,
  }

  const [formData, setFormData] = useState(effectiveProfile)
  const [statusMessage, setStatusMessage] = useState('')
  const [statusType, setStatusType] = useState('success')

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData(effectiveProfile)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, profileOverrides])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setAvatarFile(file)
    const previewUrl = URL.createObjectURL(file)
    setAvatarPreview(previewUrl)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatusMessage('')

    try {
      let currentAvatarUrl = user?.avatarUrl

      if (avatarFile && token) {
        const uploadRes = await uploadAvatar(token, avatarFile)
        currentAvatarUrl = uploadRes?.avatarUrl || currentAvatarUrl
      }

      if (token) {
        await updateProfile(token, {
          fullName: formData.fullName,
          phoneNumber: formData.phone,
          address: formData.address,
          avatarUrl: currentAvatarUrl,
        })
      }

      setProfileOverrides({
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        ...(currentAvatarUrl ? { avatarUrl: currentAvatarUrl } : {}),
      })

      if (updateUser) {
        updateUser({
          fullName: formData.fullName,
          phoneNumber: formData.phone,
          address: formData.address,
          avatarUrl: currentAvatarUrl,
        })
      }

      setStatusType('success')
      setStatusMessage('Thông tin tài khoản đã được lưu thành công!')
    } catch (err) {
      console.error(err)
      setStatusType('error')
      setStatusMessage(err.message || 'Cập nhật thất bại. Vui lòng kiểm tra lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenAddressModal = (address = null) => {
    if (address) {
      setEditingAddressId(address.id)
      setAddressFormData({
        recipientName: address.recipientName || '',
        phoneNumber: address.phoneNumber || '',
        streetAddress: address.streetAddress || '',
        ward: address.ward || '',
        district: address.district || '',
        province: address.province || '',
        isDefault: !!address.isDefault,
      })
    } else {
      setEditingAddressId(null)
      setAddressFormData({
        recipientName: formData.fullName || '',
        phoneNumber: formData.phone || '',
        streetAddress: '',
        ward: '',
        district: '',
        province: '',
        isDefault: addresses.length === 0,
      })
    }
    setIsAddressFormOpen(true)
  }

  const handleAddressSubmit = async (e) => {
    e.preventDefault()
    if (!token) return
    setAddressSubmitting(true)

    try {
      if (editingAddressId) {
        const updated = await updateAddress(token, editingAddressId, addressFormData)
        setAddresses(prev => prev.map(a => a.id === editingAddressId ? updated : a))
      } else {
        const created = await createAddress(token, addressFormData)
        setAddresses(prev => [...prev, created])
      }
      setIsAddressFormOpen(false)
      const freshAddresses = await getAddresses(token)
      setAddresses(freshAddresses)
    } catch (err) {
      alert(err.message || 'Lỗi khi lưu địa chỉ')
    } finally {
      setAddressSubmitting(false)
    }
  }

  const handleDeleteAddress = async (id) => {
    if (!token || !window.confirm('Bạn có chắc muốn xóa địa chỉ nhận hàng này?')) return
    try {
      await deleteAddress(token, id)
      setAddresses(prev => prev.filter(a => a.id !== id))
    } catch (err) {
      alert(err.message || 'Lỗi khi xóa địa chỉ')
    }
  }

  const handleSetDefaultAddress = async (id) => {
    if (!token) return
    try {
      await setDefaultAddressApi(token, id)
      const freshAddresses = await getAddresses(token)
      setAddresses(freshAddresses)
    } catch (err) {
      alert(err.message || 'Lỗi khi đặt địa chỉ mặc định')
    }
  }

  const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  const displayAvatar = avatarPreview || user?.avatarUrl || profileOverrides.avatarUrl || defaultAvatar

  return (
    <main className="myself-page">
      <div className="myself-container">
        {/* Page Top Header */}
        <header className="myself-heading">
          <div className="myself-heading-text">
            <span className="myself-eyebrow">Tài khoản cá nhân</span>
            <h1>Thông tin tài khoản</h1>
            <p>Quản lý hồ sơ bảo mật, sổ địa chỉ giao hàng và theo dõi đơn hàng của bạn.</p>
          </div>

          <div className="myself-header-actions">
            {isAuthenticated ? (
              <button type="button" className="myself-logout-button" onClick={logout}>
                <LogOut size={16} /> Đăng xuất
              </button>
            ) : (
              <Link to="/login" className="myself-login-button">
                Đăng nhập tài khoản
              </Link>
            )}
          </div>
        </header>

        {/* Quick Stats Grid */}
        <section className="myself-stats-grid">
          <Link to="/cart" className="myself-stat-card myself-stat-cart">
            <div className="myself-stat-icon-wrap">
              <ShoppingBag size={20} />
            </div>
            <div className="myself-stat-content">
              <strong>{cartItems.length}</strong>
              <small>Sản phẩm trong giỏ</small>
            </div>
            <ArrowRight size={16} className="myself-stat-arrow" />
          </Link>

          <Link to="/favorites" className="myself-stat-card myself-stat-fav">
            <div className="myself-stat-icon-wrap">
              <Heart size={20} />
            </div>
            <div className="myself-stat-content">
              <strong>{favoriteItems.length}</strong>
              <small>Sản phẩm yêu thích</small>
            </div>
            <ArrowRight size={16} className="myself-stat-arrow" />
          </Link>

          <Link to="/orders" className="myself-stat-card myself-stat-orders">
            <div className="myself-stat-icon-wrap">
              <Package size={20} />
            </div>
            <div className="myself-stat-content">
              <strong>Tra cứu</strong>
              <small>Lịch sử đơn hàng</small>
            </div>
            <ArrowRight size={16} className="myself-stat-arrow" />
          </Link>

          <div className="myself-stat-card myself-stat-warranty">
            <div className="myself-stat-icon-wrap">
              <ShieldCheck size={20} />
            </div>
            <div className="myself-stat-content">
              <strong>Chính hãng</strong>
              <small>Bảo hành 24 Tháng</small>
            </div>
            <span className="myself-badge-pill">VIP</span>
          </div>
        </section>

        {/* Main Content Layout Grid */}
        <div className="myself-content-grid">
          {/* Main Column */}
          <div className="myself-main-column">
            {/* Profile Information Card */}
            <section className="myself-card myself-profile-card">
              <div className="myself-avatar-row">
                <div className="myself-avatar-wrap">
                  <img
                    src={displayAvatar}
                    alt={formData.fullName}
                    className="myself-avatar-image"
                  />
                  <label className="myself-avatar-badge" title="Tải lên ảnh đại diện mới">
                    <Camera size={14} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>

                <div className="myself-avatar-info">
                  <div className="myself-user-title-row">
                    <h2>{formData.fullName}</h2>
                    <span className="myself-verified-tag">
                      <CheckCircle size={13} /> Đã xác thực
                    </span>
                  </div>
                  <p className="myself-user-email">{formData.email}</p>
                </div>
              </div>

              {statusMessage && (
                <div className={`myself-status-banner myself-status-${statusType}`}>
                  <CheckCircle size={16} />
                  <span>{statusMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="myself-form">
                <div className="myself-form-row">
                  <label className="myself-field">
                    <span className="myself-field-label">
                      <User size={14} /> Họ và tên
                    </span>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Nhập họ và tên"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </label>

                  <label className="myself-field">
                    <span className="myself-field-label">
                      <Phone size={14} /> Số điện thoại
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Nhập số điện thoại"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                </div>

                <div className="myself-form-row">
                  <label className="myself-field myself-field-disabled">
                    <span className="myself-field-label">
                      <Mail size={14} /> Email đăng nhập
                      <span className="myself-badge-lock"><Lock size={11} /> Cố định</span>
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                    />
                  </label>

                  <label className="myself-field">
                    <span className="myself-field-label">
                      <MapPin size={14} /> Địa chỉ mặc định
                    </span>
                    <input
                      type="text"
                      name="address"
                      placeholder="Số nhà, đường, quận/huyện, tỉnh/thành"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                </div>

                <div className="myself-form-submit-row">
                  <button
                    type="submit"
                    className="myself-save-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="myself-spinner" /> Đang cập nhật...
                      </>
                    ) : (
                      'Lưu thông tin hồ sơ'
                    )}
                  </button>
                </div>
              </form>
            </section>

            {/* Address Book Section */}
            <section className="myself-card myself-address-book">
              <div className="myself-address-heading">
                <div>
                  <h3>Sổ địa chỉ nhận hàng</h3>
                  <p>Lưu nhiều địa chỉ để đặt hàng và giao quạt tận nơi tiện lợi hơn</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenAddressModal()}
                  className="myself-add-address-btn"
                >
                  <Plus size={16} /> Thêm địa chỉ mới
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="myself-address-empty">
                  <div className="myself-address-empty-icon">
                    <MapPin size={32} />
                  </div>
                  <h4>Chưa có địa chỉ nào</h4>
                  <p>Thêm địa chỉ giao hàng để tiến hành thanh toán giỏ hàng nhanh chóng.</p>
                  <button
                    type="button"
                    onClick={() => handleOpenAddressModal()}
                    className="myself-empty-add-btn"
                  >
                    <Plus size={14} /> Thêm địa chỉ ngay
                  </button>
                </div>
              ) : (
                <div className="myself-address-list">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`myself-address-card ${addr.isDefault ? 'myself-address-card-default' : ''}`}
                    >
                      <div className="myself-address-info">
                        <div className="myself-address-meta">
                          <strong className="myself-address-name">{addr.recipientName}</strong>
                          <span className="myself-address-phone">{addr.phoneNumber}</span>
                          {addr.isDefault && (
                            <span className="myself-default-badge">
                              Mặc định
                            </span>
                          )}
                        </div>
                        <p className="myself-address-detail">
                          <MapPin size={14} className="myself-address-pin" />
                          <span>{[addr.streetAddress, addr.ward, addr.district, addr.province].filter(Boolean).join(', ')}</span>
                        </p>
                      </div>

                      <div className="myself-address-actions">
                        {!addr.isDefault && (
                          <button
                            type="button"
                            onClick={() => handleSetDefaultAddress(addr.id)}
                            className="myself-set-default-btn"
                          >
                            Đặt làm mặc định
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleOpenAddressModal(addr)}
                          className="myself-icon-btn myself-edit-btn"
                          title="Chỉnh sửa địa chỉ"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="myself-icon-btn myself-delete-btn"
                          title="Xóa địa chỉ"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Side / Secondary Column */}
          <aside className="myself-side-column">
            {/* Account Status / Security Banner */}
            <section className="myself-card myself-side-card">
              <div className="myself-side-icon-box">
                <ShieldCheck size={24} />
              </div>
              <div className="myself-side-info">
                <h3>Bảo mật thông tin</h3>
                <p>
                  {isLoading
                    ? 'Đang đồng bộ dữ liệu tài khoản...'
                    : isAuthenticated
                    ? 'Tài khoản của bạn được bảo vệ 2 lớp với công nghệ mã hóa an toàn của GoFan.'
                    : 'Đăng nhập để tự động lưu giỏ hàng, nhận khuyến mãi và xem điểm thưởng.'}
                </p>
              </div>
            </section>

            {/* Quick Navigation Card */}
            <section className="myself-card myself-side-nav-card">
              <div className="myself-side-nav-header">
                <Sparkles size={16} />
                <span>Tiện ích mua sắm</span>
              </div>
              <nav className="myself-side-links">
                <Link to="/orders" className="myself-side-nav-link">
                  <div className="myself-link-icon-wrap">
                    <Package size={16} />
                  </div>
                  <span>Lịch sử đơn hàng</span>
                  <ChevronRight size={15} />
                </Link>

                <Link to="/cart" className="myself-side-nav-link">
                  <div className="myself-link-icon-wrap">
                    <ShoppingBag size={16} />
                  </div>
                  <span>Giỏ hàng của bạn</span>
                  <span className="myself-nav-count">{cartItems.length}</span>
                  <ChevronRight size={15} />
                </Link>

                <Link to="/favorites" className="myself-side-nav-link">
                  <div className="myself-link-icon-wrap">
                    <Heart size={16} />
                  </div>
                  <span>Danh sách yêu thích</span>
                  <span className="myself-nav-count">{favoriteItems.length}</span>
                  <ChevronRight size={15} />
                </Link>

                <Link to="/products" className="myself-side-nav-link myself-link-highlight">
                  <div className="myself-link-icon-wrap">
                    <Sparkles size={16} />
                  </div>
                  <span>Xem tất cả quạt điện</span>
                  <ChevronRight size={15} />
                </Link>
              </nav>
            </section>
          </aside>
        </div>

        {/* Address Modal Dialog */}
        {isAddressFormOpen && (
          <div className="myself-address-modal-overlay">
            <div className="myself-address-modal" role="dialog" aria-modal="true">
              <div className="myself-modal-header">
                <div>
                  <h3>{editingAddressId ? 'Cập nhật địa chỉ nhận hàng' : 'Thêm địa chỉ nhận hàng mới'}</h3>
                  <p>Vui lòng điền thông tin người nhận chính xác để shipper giao hàng tận nơi</p>
                </div>
                <button
                  type="button"
                  className="myself-modal-close"
                  onClick={() => setIsAddressFormOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddressSubmit} className="myself-modal-form">
                <div className="myself-modal-row">
                  <div className="myself-modal-field">
                    <label>Tên người nhận</label>
                    <input
                      type="text"
                      placeholder="Nguyễn Văn A"
                      required
                      value={addressFormData.recipientName}
                      onChange={e => setAddressFormData(prev => ({ ...prev, recipientName: e.target.value }))}
                    />
                  </div>

                  <div className="myself-modal-field">
                    <label>Số điện thoại</label>
                    <input
                      type="tel"
                      placeholder="09xx xxx xxx"
                      required
                      value={addressFormData.phoneNumber}
                      onChange={e => setAddressFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="myself-modal-row myself-modal-row-3">
                  <div className="myself-modal-field">
                    <label>Tỉnh / Thành phố</label>
                    <input
                      type="text"
                      placeholder="Hà Nội, TP.HCM..."
                      required
                      value={addressFormData.province}
                      onChange={e => setAddressFormData(prev => ({ ...prev, province: e.target.value }))}
                    />
                  </div>

                  <div className="myself-modal-field">
                    <label>Quận / Huyện</label>
                    <input
                      type="text"
                      placeholder="Quận Cầu Giấy..."
                      required
                      value={addressFormData.district}
                      onChange={e => setAddressFormData(prev => ({ ...prev, district: e.target.value }))}
                    />
                  </div>

                  <div className="myself-modal-field">
                    <label>Phường / Xã</label>
                    <input
                      type="text"
                      placeholder="Phường Dịch Vọng..."
                      required
                      value={addressFormData.ward}
                      onChange={e => setAddressFormData(prev => ({ ...prev, ward: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="myself-modal-field">
                  <label>Địa chỉ chi tiết (Số nhà, ngõ, tên đường)</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Số 25, ngõ 12 phố Trần Quý Kiên"
                    required
                    value={addressFormData.streetAddress}
                    onChange={e => setAddressFormData(prev => ({ ...prev, streetAddress: e.target.value }))}
                  />
                </div>

                <label className="myself-modal-checkbox">
                  <input
                    type="checkbox"
                    checked={addressFormData.isDefault}
                    onChange={e => setAddressFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                  />
                  <span>Đặt làm địa chỉ nhận hàng mặc định</span>
                </label>

                <div className="myself-modal-actions">
                  <button
                    type="button"
                    onClick={() => setIsAddressFormOpen(false)}
                    className="myself-modal-cancel-btn"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="myself-modal-submit-btn"
                    disabled={addressSubmitting}
                  >
                    {addressSubmitting ? 'Đang lưu...' : 'Lưu địa chỉ'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default Myself
