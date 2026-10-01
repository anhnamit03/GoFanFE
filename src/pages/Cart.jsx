import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
  ShieldCheck,
  Tag,
  CheckCircle2,
  AlertCircle,
  PackageOpen
} from 'lucide-react'
import { useCart } from '../context/useCart'
import './Cart.css'

const FREESHIP_THRESHOLD = 1000000

function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart()

  const [voucherCode, setVoucherCode] = useState('')
  const [appliedVoucher, setAppliedVoucher] = useState(null)
  const [voucherError, setVoucherError] = useState('')

  const itemCount = cartItems.reduce((total, product) => total + product.quantity, 0)
  const subtotal = cartItems.reduce(
    (total, product) => total + Number(product.price ?? 0) * product.quantity,
    0
  )

  // Voucher calculation
  let discountAmount = 0
  if (appliedVoucher) {
    if (appliedVoucher.type === 'fixed') {
      discountAmount = appliedVoucher.value
    } else if (appliedVoucher.type === 'percent') {
      discountAmount = Math.round((subtotal * appliedVoucher.value) / 100)
    }
  }

  const isFreeShip = subtotal >= FREESHIP_THRESHOLD || appliedVoucher?.code === 'FREESHIP'
  const shippingFee = subtotal === 0 ? 0 : (isFreeShip ? 0 : 30000)
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee)
  const freeshipProgress = Math.min(100, Math.round((subtotal / FREESHIP_THRESHOLD) * 100))
  const remainingForFreeship = Math.max(0, FREESHIP_THRESHOLD - subtotal)

  const handleApplyVoucher = (e) => {
    e.preventDefault()
    setVoucherError('')
    const code = voucherCode.trim().toUpperCase()
    if (!code) return

    if (code === 'GOFAN100') {
      if (subtotal < 500000) {
        setVoucherError('Mã GOFAN100 chỉ áp dụng cho đơn từ 500.000đ')
        return
      }
      setAppliedVoucher({ code: 'GOFAN100', name: 'Giảm 100.000đ', value: 100000, type: 'fixed' })
      setVoucherCode('')
    } else if (code === 'FREESHIP') {
      setAppliedVoucher({ code: 'FREESHIP', name: 'Miễn phí vận chuyển', value: 0, type: 'freeship' })
      setVoucherCode('')
    } else if (code === 'VIP5') {
      setAppliedVoucher({ code: 'VIP5', name: 'Chiết khấu VIP 5%', value: 5, type: 'percent' })
      setVoucherCode('')
    } else {
      setVoucherError('Mã giảm giá không hợp lệ hoặc đã hết hạn')
    }
  }

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null)
    setVoucherError('')
  }

  const handleClearCart = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ sản phẩm trong giỏ hàng?')) {
      clearCart()
    }
  }

  const confirmRemoveProduct = (product) => {
    const shouldRemove = window.confirm(
      `Bạn có muốn bỏ "${product.name}" khỏi giỏ hàng không?`
    )
    if (shouldRemove) removeFromCart(product.id)
  }

  const handleDecreaseQuantity = (product) => {
    if (product.quantity <= 1) {
      confirmRemoveProduct(product)
      return
    }
    decreaseQuantity(product.id)
  }

  return (
    <main className="gofan-cart-page">
      <div className="cart-page-container">
        {/* Header Breadcrumb Banner */}
        <div className="cart-header-row">
          <div>
            <span className="cart-kicker">GOFAN SHOPPING CART</span>
            <h1 className="cart-main-title">Giỏ hàng của bạn</h1>
          </div>
          {cartItems.length > 0 && (
            <div className="cart-header-actions">
              <span className="cart-count-badge">{itemCount} sản phẩm</span>
              <button
                type="button"
                className="cart-clear-all-btn"
                onClick={handleClearCart}
              >
                <Trash2 size={15} /> Xóa giỏ hàng
              </button>
            </div>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty-showcase">
            <div className="cart-empty-visual">
              <ShoppingBag size={48} className="empty-icon-bag" />
            </div>
            <h2>Giỏ hàng của bạn đang trống</h2>
            <p>
              Hãy khám phá các mẫu quạt đứng DC Inverter, quạt trần Bắc Âu và quạt sạc thông minh
              để tận hưởng không gian mát lành.
            </p>
            <Link to="/products" className="cart-empty-cta">
              <PackageOpen size={18} /> Khám phá sản phẩm GoFan <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="cart-main-layout">
            {/* Left Column: Items List & Freeship meter */}
            <div className="cart-content-column">
              {/* Freeship Progress Meter */}
              <div className="freeship-meter-card">
                <div className="freeship-info-row">
                  <div className="freeship-title">
                    <Truck size={20} className={isFreeShip ? 'truck-green' : 'truck-blue'} />
                    {isFreeShip ? (
                      <span className="freeship-text-success">
                        <strong>Tuyệt vời!</strong> Bạn đã được <strong>Miễn phí vận chuyển toàn quốc</strong>.
                      </span>
                    ) : (
                      <span>
                        Mua thêm <strong>{remainingForFreeship.toLocaleString('vi-VN')} ₫</strong> để được <strong>FREESHIP toàn quốc</strong>!
                      </span>
                    )}
                  </div>
                  <span className="freeship-percent">{freeshipProgress}%</span>
                </div>
                <div className="freeship-bar-bg">
                  <div
                    className={`freeship-bar-fill ${isFreeShip ? 'fill-complete' : ''}`}
                    style={{ width: `${freeshipProgress}%` }}
                  />
                </div>
              </div>

              {/* Items Card List */}
              <div className="cart-items-wrapper">
                <div className="cart-items-header-bar">
                  <span className="col-prod">Sản phẩm ({itemCount})</span>
                  <span className="col-price">Đơn giá</span>
                  <span className="col-qty">Số lượng</span>
                  <span className="col-total">Thành tiền</span>
                  <span className="col-action"></span>
                </div>

                <div className="cart-items-list">
                  {cartItems.map((product) => {
                    const itemPrice = Number(product.price ?? 0)
                    const itemTotal = itemPrice * product.quantity

                    return (
                      <article key={product.id} className="cart-item-card">
                        <Link to={`/products/${product.id}`} className="cart-item-thumb">
                          <img
                            src={product.image || product.imageUrl}
                            alt={product.name}
                            onError={(e) => {
                              e.currentTarget.src =
                                'https://images.unsplash.com/photo-1618941716939-553df3c6c278?auto=format&fit=crop&w=300&q=80'
                            }}
                          />
                        </Link>

                        <div className="cart-item-details">
                          <Link to={`/products/${product.id}`} className="cart-item-title">
                            {product.name}
                          </Link>
                          {product.sku && <span className="cart-item-sku">SKU: {product.sku}</span>}
                          
                          {/* Mobile price row */}
                          <div className="cart-item-mobile-prices">
                            <span className="mobile-price-now">
                              {itemPrice.toLocaleString('vi-VN')} ₫
                            </span>
                            <span className="mobile-total-calc">
                              × {product.quantity} = {itemTotal.toLocaleString('vi-VN')} ₫
                            </span>
                          </div>
                        </div>

                        <div className="cart-item-unit-col">
                          <strong>{itemPrice.toLocaleString('vi-VN')} ₫</strong>
                        </div>

                        <div className="cart-item-qty-col">
                          <div className="qty-control-box">
                            <button
                              type="button"
                              onClick={() => handleDecreaseQuantity(product)}
                              aria-label="Giảm số lượng"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="qty-number">{product.quantity}</span>
                            <button
                              type="button"
                              onClick={() => increaseQuantity(product.id)}
                              aria-label="Tăng số lượng"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="cart-item-total-col">
                          <strong className="item-subtotal-price">
                            {itemTotal.toLocaleString('vi-VN')} ₫
                          </strong>
                        </div>

                        <div className="cart-item-action-col">
                          <button
                            type="button"
                            className="cart-item-del-btn"
                            onClick={() => confirmRemoveProduct(product)}
                            title="Xóa sản phẩm"
                            aria-label={`Xóa ${product.name}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </article>
                    )
                  })}
                </div>

                <div className="cart-bottom-links">
                  <Link to="/products" className="continue-shopping-btn">
                    <ArrowRight size={16} className="rotate-180" /> Tiếp tục lựa chọn sản phẩm
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Voucher */}
            <aside className="cart-summary-sidebar">
              <div className="cart-summary-card">
                <h2 className="summary-title">Tóm tắt đơn hàng</h2>

                {/* Voucher Code Form */}
                <div className="voucher-section">
                  <span className="voucher-label">
                    <Tag size={14} /> Mã khuyến mãi / Voucher
                  </span>
                  {appliedVoucher ? (
                    <div className="applied-voucher-chip">
                      <div className="voucher-chip-info">
                        <CheckCircle2 size={16} className="chip-check" />
                        <div>
                          <strong>{appliedVoucher.code}</strong>
                          <small>{appliedVoucher.name}</small>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="voucher-remove-btn"
                        onClick={handleRemoveVoucher}
                      >
                        Bỏ áp dụng
                      </button>
                    </div>
                  ) : (
                    <form className="voucher-input-group" onSubmit={handleApplyVoucher}>
                      <input
                        type="text"
                        placeholder="Nhập mã (VD: GOFAN100)"
                        value={voucherCode}
                        onChange={(e) => {
                          setVoucherCode(e.target.value)
                          setVoucherError('')
                        }}
                      />
                      <button type="submit" disabled={!voucherCode.trim()}>
                        Áp dụng
                      </button>
                    </form>
                  )}
                  {voucherError && (
                    <p className="voucher-error-msg">
                      <AlertCircle size={13} /> {voucherError}
                    </p>
                  )}
                  <div className="voucher-suggestions">
                    <span className="hint-label">Gợi ý mã:</span>
                    <button
                      type="button"
                      className="suggested-pill"
                      onClick={() => {
                        setVoucherCode('GOFAN100')
                        setVoucherError('')
                      }}
                    >
                      GOFAN100
                    </button>
                    <button
                      type="button"
                      className="suggested-pill"
                      onClick={() => {
                        setVoucherCode('FREESHIP')
                        setVoucherError('')
                      }}
                    >
                      FREESHIP
                    </button>
                  </div>
                </div>

                <div className="summary-divider" />

                {/* Costs breakdown */}
                <div className="summary-breakdown">
                  <div className="summary-row">
                    <span>Tạm tính ({itemCount} sản phẩm):</span>
                    <strong>{subtotal.toLocaleString('vi-VN')} ₫</strong>
                  </div>

                  {discountAmount > 0 && (
                    <div className="summary-row discount-row">
                      <span>Giảm giá ({appliedVoucher?.code}):</span>
                      <strong>-{discountAmount.toLocaleString('vi-VN')} ₫</strong>
                    </div>
                  )}

                  <div className="summary-row">
                    <span>Phí vận chuyển:</span>
                    {isFreeShip ? (
                      <span className="freeship-badge-text">MIỄN PHÍ</span>
                    ) : (
                      <strong>{shippingFee.toLocaleString('vi-VN')} ₫</strong>
                    )}
                  </div>

                  <div className="summary-divider" />

                  <div className="summary-total-row">
                    <div>
                      <span className="total-label">Tổng thanh toán:</span>
                      <small>(Đã bao gồm VAT nếu có)</small>
                    </div>
                    <strong className="final-total-amount">
                      {finalTotal.toLocaleString('vi-VN')} ₫
                    </strong>
                  </div>
                </div>

                {/* Checkout CTA */}
                <Link
                  to="/checkout"
                  state={{
                    discountAmount,
                    voucherCode: appliedVoucher?.code,
                    shippingFee,
                  }}
                  className="cart-checkout-button"
                >
                  Tiến hành thanh toán <ArrowRight size={18} />
                </Link>

                {/* Trust and warranty guarantees */}
                <div className="cart-trust-badges">
                  <div className="trust-item">
                    <ShieldCheck size={16} />
                    <span>Bảo hành chính hãng 24 tháng tận nhà</span>
                  </div>
                  <div className="trust-item">
                    <Truck size={16} />
                    <span>Giao hàng hỏa tốc trong 2-4 giờ tại HN & HCM</span>
                  </div>
                  <div className="trust-item">
                    <CheckCircle2 size={16} />
                    <span>Kiểm tra hàng trước khi thanh toán (COD)</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>

      {/* Mobile Sticky Bottom Bar */}
      {cartItems.length > 0 && (
        <div className="mobile-cart-bottom-bar">
          <div className="mobile-bottom-total">
            <span>Tổng thanh toán:</span>
            <strong>{finalTotal.toLocaleString('vi-VN')} ₫</strong>
          </div>
          <Link
            to="/checkout"
            state={{
              discountAmount,
              voucherCode: appliedVoucher?.code,
              shippingFee,
            }}
            className="mobile-bottom-checkout-btn"
          >
            Thanh toán ({itemCount})
          </Link>
        </div>
      )}
    </main>
  )
}

export default Cart