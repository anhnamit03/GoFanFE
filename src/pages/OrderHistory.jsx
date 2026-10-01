import { useState } from 'react'
import {
  ArrowRight,
  Clock3,
  PackageCheck,
  RotateCcw,
  Search,
  ShoppingBag,
  Truck,
  XCircle,
  Calendar
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/useCart'
import './OrderHistory.css'

const ORDER_TABS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'processing', label: 'Đang xử lý' },
  { id: 'shipping', label: 'Đang giao' },
  { id: 'completed', label: 'Đã giao' },
  { id: 'cancelled', label: 'Đã hủy' },
]

const SAMPLE_ORDERS = [
  {
    id: 'GF-20261001-8821',
    code: 'GF-20261001-8821',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    status: 'completed',
    items: [
      {
        id: 1,
        name: 'Quạt đứng thông minh GoFan AeroBlade Pro DC Inverter',
        price: 1890000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1618941716939-553df3c6c278?auto=format&fit=crop&w=300&q=80',
        sku: 'GF-AB-PRO',
      },
      {
        id: 2,
        name: 'Điều khiển từ xa đa năng GoFan Remote RF',
        price: 150000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80',
        sku: 'GF-REMOTE-01',
      },
    ],
    recipient: {
      fullName: 'Nguyễn Văn An',
      phone: '0987654321',
      address: '123 Cầu Giấy, Phường Dịch Vọng, Quận Cầu Giấy, Hà Nội',
    },
    payment: {
      method: 'cod',
      isPaid: true,
    },
    subtotal: 2040000,
    shippingFee: 0,
    discount: 100000,
    total: 1940000,
  },
  {
    id: 'GF-20260928-4412',
    code: 'GF-20260928-4412',
    createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    status: 'shipping',
    items: [
      {
        id: 3,
        name: 'Quạt trần đối lưu không khí GoFan Nordic Silence 5 Cánh',
        price: 3450000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=300&q=80',
        sku: 'GF-NS-5C',
      },
    ],
    recipient: {
      fullName: 'Nguyễn Văn An',
      phone: '0987654321',
      address: '123 Cầu Giấy, Phường Dịch Vọng, Quận Cầu Giấy, Hà Nội',
    },
    payment: {
      method: 'transfer',
      isPaid: true,
    },
    subtotal: 3450000,
    shippingFee: 0,
    discount: 0,
    total: 3450000,
  },
]

function formatPrice(p) {
  return `${Number(p ?? 0).toLocaleString('vi-VN')} ₫`
}

function formatDate(isoStr) {
  try {
    const d = new Date(isoStr)
    return `${d.toLocaleDateString('vi-VN')} - ${d.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    })}`
  } catch {
    return isoStr
  }
}

function getInitialOrders() {
  try {
    const saved = JSON.parse(localStorage.getItem('gofan_orders') || '[]')
    if (saved && saved.length > 0) {
      const existingIds = new Set(saved.map((o) => o.id))
      const remainingSamples = SAMPLE_ORDERS.filter((s) => !existingIds.has(s.id))
      return [...saved, ...remainingSamples]
    }
  } catch (e) {
    console.error(e)
  }
  return SAMPLE_ORDERS
}

function OrderHistory() {
  const [activeTab, setActiveTab] = useState('all')
  const [orders, setOrders] = useState(getInitialOrders)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const handleCancelOrder = (orderId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) return

    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, status: 'cancelled' } : o
    )
    setOrders(updated)
    try {
      localStorage.setItem('gofan_orders', JSON.stringify(updated))
    } catch (e) {
      console.error(e)
    }
  }

  const handleReorder = async (order) => {
    for (const item of order.items) {
      await addToCart(item, item.quantity)
    }
    navigate('/cart')
  }

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    // Status tab
    if (activeTab !== 'all' && order.status !== activeTab) return false

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase()
      const matchCode = order.code?.toLowerCase().includes(q)
      const matchProduct = order.items?.some((i) => i.name.toLowerCase().includes(q))
      return matchCode || matchProduct
    }
    return true
  })

  // Count by status
  const counts = {
    all: orders.length,
    processing: orders.filter((o) => o.status === 'processing').length,
    shipping: orders.filter((o) => o.status === 'shipping').length,
    completed: orders.filter((o) => o.status === 'completed').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  }

  return (
    <main className="gofan-orders-page">
      <div className="orders-page-container">
        {/* Header Breadcrumb */}
        <div className="orders-header-row">
          <div>
            <span className="orders-kicker">GOFAN MEMBER ORDERS</span>
            <h1 className="orders-title">Đơn mua của tôi</h1>
            <p className="orders-subtitle">
              Theo dõi lộ trình giao hàng, hóa đơn điện tử và chính sách bảo hành của từng đơn hàng.
            </p>
          </div>
          <Link to="/myself" className="back-profile-pill">
            Về hồ sơ tài khoản <ArrowRight size={15} />
          </Link>
        </div>

        {/* Status Tab Navigation */}
        <nav className="orders-tabs-nav" aria-label="Lọc theo trạng thái đơn hàng">
          {ORDER_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`orders-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.label}</span>
              {counts[tab.id] > 0 && (
                <span className="tab-count-badge">{counts[tab.id]}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Search Bar */}
        <div className="orders-search-wrapper">
          <Search size={18} className="search-icon-fixed" />
          <input
            type="search"
            placeholder="Tìm theo mã đơn hàng (GF-...) hoặc tên thiết bị làm mát"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchTerm('')}
            >
              Xóa tìm kiếm
            </button>
          )}
        </div>

        {/* Orders List / Empty State */}
        {filteredOrders.length === 0 ? (
          <div className="orders-empty-card">
            <div className="empty-order-icon">
              <ShoppingBag size={48} />
            </div>
            <h2>Không tìm thấy đơn hàng nào</h2>
            <p>
              {searchTerm
                ? `Không có đơn hàng nào khớp với từ khóa "${searchTerm}".`
                : 'Bạn hiện chưa có đơn hàng nào trong mục này.'}
            </p>
            <Link to="/products" className="orders-shop-now-btn">
              Khám phá sản phẩm GoFan ngay <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="orders-stack">
            {filteredOrders.map((order) => {
              const statusMap = {
                processing: { label: 'Đang xử lý', class: 'status-processing', icon: Clock3 },
                shipping: { label: 'Đang giao hàng', class: 'status-shipping', icon: Truck },
                completed: { label: 'Giao thành công', class: 'status-completed', icon: PackageCheck },
                cancelled: { label: 'Đã hủy', class: 'status-cancelled', icon: XCircle },
              }
              const currentStatus = statusMap[order.status] || statusMap.processing
              const StatusIcon = currentStatus.icon

              return (
                <article key={order.id} className="order-item-card">
                  {/* Card Header */}
                  <div className="order-card-header">
                    <div className="order-code-meta">
                      <strong>Mã đơn: {order.code}</strong>
                      <span className="order-date-row">
                        <Calendar size={13} /> {formatDate(order.createdAt)}
                      </span>
                    </div>

                    <div className={`order-status-badge ${currentStatus.class}`}>
                      <StatusIcon size={14} />
                      <span>{currentStatus.label}</span>
                    </div>
                  </div>

                  {/* Card Items */}
                  <div className="order-card-items-list">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="order-product-row">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="order-product-thumb"
                          onError={(e) => {
                            e.currentTarget.src =
                              'https://images.unsplash.com/photo-1618941716939-553df3c6c278?auto=format&fit=crop&w=200&q=80'
                          }}
                        />
                        <div className="order-product-info">
                          <Link to={`/products/${item.id}`} className="order-product-title">
                            {item.name}
                          </Link>
                          {item.sku && <small>SKU: {item.sku}</small>}
                          <span className="order-qty-price">
                            Số lượng: <strong>{item.quantity}</strong> × {formatPrice(item.price)}
                          </span>
                        </div>
                        <div className="order-product-subtotal">
                          <strong>{formatPrice(Number(item.price ?? 0) * item.quantity)}</strong>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Card Footer: Summary & Actions */}
                  <div className="order-card-footer">
                    <div className="order-shipping-dest">
                      <small>Giao đến:</small>
                      <span>
                        {order.recipient.fullName} - {order.recipient.phone} ({order.recipient.address})
                      </span>
                    </div>

                    <div className="order-total-action-group">
                      <div className="order-final-price-box">
                        <span>Tổng tiền thanh toán:</span>
                        <strong className="order-total-amount">{formatPrice(order.total)}</strong>
                      </div>

                      <div className="order-buttons-row">
                        {order.status === 'processing' && (
                          <button
                            type="button"
                            className="btn-cancel-order"
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            Hủy đơn hàng
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn-reorder"
                          onClick={() => handleReorder(order)}
                        >
                          <RotateCcw size={14} /> Mua lại
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

export default OrderHistory
