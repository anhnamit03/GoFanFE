import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft, Banknote, PackageCheck, ShieldCheck, Truck } from 'lucide-react'
import { useCart } from '../context/CartContext'
import './Checkout.css'

function formatPrice(price) {
  return `${Number(price ?? 0).toLocaleString('vi-VN')} ₫`
}

function Checkout() {
  const location = useLocation()
  const { cartItems } = useCart()
  const directCheckoutItems = location.state?.checkoutItems
  const checkoutItems = directCheckoutItems?.length ? directCheckoutItems : cartItems
  const subtotal = checkoutItems.reduce(
    (total, item) => total + Number(item.price ?? 0) * item.quantity,
    0
  )
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [statusMessage, setStatusMessage] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    setStatusMessage('API đặt hàng chưa được kết nối. Đơn hàng chưa được gửi và chưa phát sinh thanh toán.')
  }

  if (checkoutItems.length === 0) {
    return (
      <main className="checkout-page">
        <div className="checkout-empty">
          <PackageCheck size={35} />
          <h1>Chưa có sản phẩm để thanh toán</h1>
          <p>Thêm sản phẩm vào giỏ hoặc chọn mua ngay để tiếp tục.</p>
          <Link to="/products">Khám phá sản phẩm</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-heading">
          <div>
            <Link to="/cart"><ArrowLeft size={16} /> Quay lại giỏ hàng</Link>
            <p>GOFAN / THANH TOÁN</p>
            <h1>Hoàn tất đơn hàng</h1>
          </div>
          <span className="checkout-secure-label">
            <Banknote size={17} />
            {paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản ngân hàng'}
          </span>
        </div>

        <form className="checkout-layout" onSubmit={handleSubmit}>
          <div className="checkout-form-column">
            <section className="checkout-section">
              <div className="checkout-section-heading">
                <span className="checkout-step-number">01</span>
                <div>
                  <h2>Thông tin nhận hàng</h2>
                  <p>Điền thông tin người nhận và địa chỉ giao hàng.</p>
                </div>
              </div>

              <div className="checkout-fields">
                <label className="checkout-field">
                  <span>Họ và tên <b>*</b></span>
                  <input name="fullName" autoComplete="name" placeholder="Tên người nhận" required />
                </label>
                <label className="checkout-field">
                  <span>Số điện thoại <b>*</b></span>
                  <input name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="09xx xxx xxx" pattern="[0-9+() -]{9,16}" required />
                </label>
                <label className="checkout-field checkout-field-wide">
                  <span>Email</span>
                  <input name="email" type="email" autoComplete="email" placeholder="ban@email.com" />
                </label>
                <label className="checkout-field checkout-field-wide">
                  <span>Địa chỉ nhận hàng <b>*</b></span>
                  <input name="address" autoComplete="street-address" placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành" required />
                </label>
                <label className="checkout-field checkout-field-wide">
                  <span>Ghi chú cho đơn hàng</span>
                  <textarea name="note" rows="3" placeholder="Lưu ý giao hàng (không bắt buộc)" />
                </label>
              </div>
            </section>

            <section className="checkout-section">
              <div className="checkout-section-heading">
                <span className="checkout-step-number">02</span>
                <div>
                  <h2>Phương thức thanh toán</h2>
                  <p>Chọn cách thanh toán phù hợp với bạn.</p>
                </div>
              </div>

              <div className="checkout-payment-options">
                <label className={`checkout-payment-option${paymentMethod === 'cod' ? ' checkout-payment-selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <Banknote size={21} />
                  <span><strong>Thanh toán khi nhận hàng</strong><small>Trả tiền trực tiếp cho đơn vị giao hàng.</small></span>
                </label>
                <label className={`checkout-payment-option${paymentMethod === 'transfer' ? ' checkout-payment-selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="transfer"
                    checked={paymentMethod === 'transfer'}
                    onChange={() => setPaymentMethod('transfer')}
                  />
                  <ShieldCheck size={21} />
                  <span><strong>Chuyển khoản ngân hàng</strong><small>Hướng dẫn chuyển khoản sẽ hiển thị sau khi kết nối thanh toán.</small></span>
                </label>
              </div>
            </section>
          </div>

          <aside className="checkout-summary">
            <div className="checkout-summary-heading">
              <h2>Đơn hàng của bạn</h2>
              <span>{checkoutItems.reduce((count, item) => count + item.quantity, 0)} sản phẩm</span>
            </div>

            <div className="checkout-items">
              {checkoutItems.map((item) => (
                <div className="checkout-item" key={item.id}>
                  <div className="checkout-item-image-wrap">
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(event) => { event.currentTarget.style.visibility = 'hidden' }}
                    />
                    <span>{item.quantity}</span>
                  </div>
                  <div className="checkout-item-info">
                    <strong>{item.name}</strong>
                    <span>{formatPrice(item.price)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="checkout-cost-row"><span>Tạm tính</span><strong>{formatPrice(subtotal)}</strong></div>
            <div className="checkout-cost-row"><span><Truck size={15} /> Vận chuyển</span><span className="checkout-pending">Xác nhận sau</span></div>
            <div className="checkout-total-row"><span>Tổng tạm tính</span><strong>{formatPrice(subtotal)}</strong></div>
            <p className="checkout-shipping-note">Phí vận chuyển sẽ được xác nhận trước khi đơn hàng được xử lý.</p>

            {statusMessage && <p className="checkout-status" role="status">{statusMessage}</p>}

            <button className="checkout-submit" type="submit">Xác nhận đặt hàng</button>
            <p className="checkout-terms">Bằng việc đặt hàng, bạn đồng ý với điều khoản mua hàng của GoFan.</p>
          </aside>
        </form>
      </div>
    </main>
  )
}

export default Checkout