import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  ArrowLeft,
  Banknote,
  CheckCircle2,
  PackageCheck,
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  ClipboardList
} from 'lucide-react'
import { useCart } from '../context/useCart'
import { useAuth } from '../context/useAuth'
import './Checkout.css'

function formatPrice(price) {
  return `${Number(price ?? 0).toLocaleString('vi-VN')} ₫`
}

function generateOrderCode() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const suffix = String(Date.now() % 10000).padStart(4, '0')
  return `GF-${dateStr}-${suffix}`
}

function Checkout() {
  const location = useLocation()
  const { cartItems, clearCart } = useCart()
  const { user } = useAuth()

  const directCheckoutItems = location.state?.checkoutItems
  const checkoutItems = directCheckoutItems?.length ? directCheckoutItems : cartItems
  const voucherDiscount = location.state?.discountAmount || 0
  const voucherCode = location.state?.voucherCode || ''

  const subtotal = checkoutItems.reduce(
    (total, item) => total + Number(item.price ?? 0) * item.quantity,
    0
  )
  const isFreeShip = subtotal >= 1000000 || voucherCode === 'FREESHIP'
  const shippingFee = subtotal === 0 ? 0 : isFreeShip ? 0 : 30000
  const finalTotal = Math.max(0, subtotal - voucherDiscount + shippingFee)

  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createdOrder, setCreatedOrder] = useState(null)

  const [formData, setFormData] = useState({
    fullName: user?.fullName || 'Nguyễn Văn An',
    phone: user?.phone || '0987654321',
    email: user?.email || 'nguyenvana@gmail.com',
    province: 'Hà Nội',
    district: 'Cầu Giấy',
    address: user?.address || '123 Cầu Giấy, Phường Dịch Vọng',
    note: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const orderCode = generateOrderCode()

    const newOrder = {
      id: orderCode,
      code: orderCode,
      createdAt: new Date().toISOString(),
      status: 'processing', // 'processing' | 'shipping' | 'completed' | 'cancelled'
      items: checkoutItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || item.imageUrl,
        sku: item.sku,
      })),
      recipient: {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        address: `${formData.address}, ${formData.district}, ${formData.province}`,
        note: formData.note,
      },
      payment: {
        method: paymentMethod,
        isPaid: paymentMethod === 'transfer',
      },
      subtotal,
      discount: voucherDiscount,
      shippingFee,
      total: finalTotal,
    }

    setTimeout(() => {
      try {
        const savedOrders = JSON.parse(localStorage.getItem('gofan_orders') || '[]')
        localStorage.setItem('gofan_orders', JSON.stringify([newOrder, ...savedOrders]))
        clearCart()
      } catch (err) {
        console.error('Không thể lưu đơn hàng:', err)
      }

      setIsSubmitting(false)
      setCreatedOrder(newOrder)
    }, 600)
  }

  // Order Success Screen
  if (createdOrder) {
    return (
      <main className="gofan-checkout-page">
        <div className="checkout-success-container">
          <div className="success-icon-box">
            <CheckCircle2 size={56} className="text-emerald" />
          </div>
          <h1>Đặt hàng thành công!</h1>
          <p className="success-lead">
            Cảm ơn bạn đã lựa chọn GoFan. Đơn hàng của bạn đang được đóng gói và chuẩn bị giao.
          </p>

          <div className="order-summary-pill-box">
            <div className="summary-pill-item">
              <small>Mã đơn hàng</small>
              <strong>{createdOrder.code}</strong>
            </div>
            <div className="summary-pill-item">
              <small>Tổng thanh toán</small>
              <strong className="text-primary">{formatPrice(createdOrder.total)}</strong>
            </div>
            <div className="summary-pill-item">
              <small>Phương thức</small>
              <strong>{createdOrder.payment.method === 'cod' ? 'Thanh toán COD' : 'Chuyển khoản'}</strong>
            </div>
          </div>

          <div className="success-actions-row">
            <Link to="/orders" className="btn-view-order">
              <ClipboardList size={16} /> Xem đơn hàng của tôi
            </Link>
            <Link to="/products" className="btn-continue-shop">
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (checkoutItems.length === 0) {
    return (
      <main className="gofan-checkout-page">
        <div className="checkout-empty-card">
          <PackageCheck size={48} className="text-muted" />
          <h2>Chưa có sản phẩm để thanh toán</h2>
          <p>Hãy thêm các mẫu quạt yêu thích vào giỏ để tiếp tục tiến trình đặt hàng.</p>
          <Link to="/products" className="empty-cta-btn">
            Khám phá thiết bị GoFan
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="gofan-checkout-page">
      <div className="checkout-page-container">
        {/* Header Breadcrumb */}
        <div className="checkout-header-row">
          <div>
            <Link to="/cart" className="back-to-cart-link">
              <ArrowLeft size={16} /> Quay lại giỏ hàng
            </Link>
            <h1 className="checkout-title">Hoàn tất đặt hàng</h1>
          </div>
          <span className="checkout-security-tag">
            <ShieldCheck size={16} /> Thanh toán bảo mật 100%
          </span>
        </div>

        {/* 2-Column Checkout Layout */}
        <form className="checkout-layout-grid" onSubmit={handleSubmit}>
          {/* Left Column: Delivery Info & Payment Selection */}
          <div className="checkout-forms-column">
            {/* Step 1: Delivery Information */}
            <section className="checkout-step-card">
              <div className="step-card-header">
                <span className="step-number-badge">01</span>
                <div>
                  <h2>Thông tin giao hàng</h2>
                  <p>Điền địa chỉ nhận quạt và thông tin liên hệ của bạn.</p>
                </div>
              </div>

              <div className="checkout-fields-grid">
                <div className="form-group">
                  <label>Họ và tên người nhận *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Số điện thoại *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group field-full">
                  <label>Địa chỉ Email (Nhận thông báo đơn hàng)</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Tỉnh / Thành phố *</label>
                  <input
                    type="text"
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Quận / Huyện *</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group field-full">
                  <label>Địa chỉ cụ thể (Số nhà, tên đường, ngõ ngách) *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Ví dụ: 123 Cầu Giấy, Dịch Vọng"
                    required
                  />
                </div>

                <div className="form-group field-full">
                  <label>Ghi chú đơn hàng (Không bắt buộc)</label>
                  <textarea
                    rows="2"
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Ví dụ: Giao hàng vào giờ hành chính, gọi trước 15 phút..."
                  />
                </div>
              </div>
            </section>

            {/* Step 2: Payment Method */}
            <section className="checkout-step-card">
              <div className="step-card-header">
                <span className="step-number-badge">02</span>
                <div>
                  <h2>Phương thức thanh toán</h2>
                  <p>Chọn hình thức thanh toán thuận tiện nhất với bạn.</p>
                </div>
              </div>

              <div className="payment-options-list">
                <label className={`payment-radio-box ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <div className="payment-icon-box">
                    <Banknote size={22} className="text-emerald" />
                  </div>
                  <div className="payment-label-info">
                    <strong>Thanh toán khi nhận hàng (COD)</strong>
                    <small>Kiểm tra quạt nguyên vẹn, hài lòng mới thanh toán cho nhân viên giao vận.</small>
                  </div>
                </label>

                <label className={`payment-radio-box ${paymentMethod === 'transfer' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="transfer"
                    checked={paymentMethod === 'transfer'}
                    onChange={() => setPaymentMethod('transfer')}
                  />
                  <div className="payment-icon-box">
                    <QrCode size={22} className="text-primary" />
                  </div>
                  <div className="payment-label-info">
                    <strong>Chuyển khoản VietQR / Ngân hàng</strong>
                    <small>Quét mã QR qua ứng dụng ngân hàng hoặc ví điện tử (Miễn phí giao dịch).</small>
                  </div>
                </label>

                <label className={`payment-radio-box ${paymentMethod === 'card' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                  />
                  <div className="payment-icon-box">
                    <CreditCard size={22} className="text-orange" />
                  </div>
                  <div className="payment-label-info">
                    <strong>Thẻ ATM nội địa / Visa / Mastercard</strong>
                    <small>Cổng thanh toán thẻ an toàn đạt chứng nhận bảo mật PCI DSS.</small>
                  </div>
                </label>
              </div>
            </section>
          </div>

          {/* Right Column: Order Items Summary & Submit */}
          <aside className="checkout-summary-column">
            <div className="checkout-summary-card">
              <div className="summary-top">
                <h2>Đơn hàng của bạn</h2>
                <span className="items-count-tag">
                  {checkoutItems.reduce((acc, i) => acc + i.quantity, 0)} sản phẩm
                </span>
              </div>

              {/* Items List */}
              <div className="checkout-items-list">
                {checkoutItems.map((item) => (
                  <div key={item.id} className="checkout-mini-item">
                    <div className="item-thumb-wrapper">
                      <img
                        src={item.image || item.imageUrl}
                        alt={item.name}
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1618941716939-553df3c6c278?auto=format&fit=crop&w=200&q=80'
                        }}
                      />
                      <span className="qty-tag">{item.quantity}</span>
                    </div>
                    <div className="item-details-meta">
                      <strong>{item.name}</strong>
                      <small>{formatPrice(item.price)}</small>
                    </div>
                    <span className="item-line-total">
                      {formatPrice(Number(item.price ?? 0) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="checkout-divider" />

              {/* Cost Rows */}
              <div className="checkout-cost-rows">
                <div className="cost-row">
                  <span>Tạm tính:</span>
                  <strong>{formatPrice(subtotal)}</strong>
                </div>

                {voucherDiscount > 0 && (
                  <div className="cost-row text-emerald">
                    <span>Khuyến mãi ({voucherCode}):</span>
                    <strong>-{formatPrice(voucherDiscount)}</strong>
                  </div>
                )}

                <div className="cost-row">
                  <span>Phí vận chuyển:</span>
                  {isFreeShip ? (
                    <span className="freeship-tag">MIỄN PHÍ</span>
                  ) : (
                    <strong>{formatPrice(shippingFee)}</strong>
                  )}
                </div>

                <div className="checkout-divider" />

                <div className="cost-total-row">
                  <div>
                    <span>Tổng cộng:</span>
                    <small>(Đã bao gồm VAT)</small>
                  </div>
                  <strong className="final-sum">{formatPrice(finalTotal)}</strong>
                </div>
              </div>

              <button
                type="submit"
                className="checkout-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span>Đang xử lý đơn hàng...</span>
                ) : (
                  <span>Xác nhận đặt hàng</span>
                )}
              </button>

              <div className="checkout-guarantees">
                <div className="guarantee-line">
                  <Truck size={15} />
                  <span>Cam kết giao hàng đúng hẹn</span>
                </div>
                <div className="guarantee-line">
                  <ShieldCheck size={15} />
                  <span>Bảo hành chính hãng 24 tháng</span>
                </div>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </main>
  )
}

export default Checkout