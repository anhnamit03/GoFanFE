import { Link } from 'react-router-dom'
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCart } from '../context/CartContext'
import './Cart.css'

function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart()
  const itemCount = cartItems.reduce((total, product) => total + product.quantity, 0)
  const cartTotal = cartItems.reduce(
    (total, product) => total + Number(product.price ?? 0) * product.quantity,
    0
  )

  return (
    <main className="cart-page">
      <div className="cart-container">
        <div className="cart-heading">
          <div>
            <p>GOFAN / GIỎ HÀNG</p>
            <h1>Giỏ hàng của bạn</h1>
          </div>
          {cartItems.length > 0 && <span>{itemCount} sản phẩm</span>}
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <span className="cart-empty-icon"><ShoppingBag size={30} /></span>
            <h2>Giỏ hàng đang trống</h2>
            <p>Hãy thêm sản phẩm bạn yêu thích, chúng sẽ nằm gọn ở đây.</p>
            <Link to="/products">Khám phá sản phẩm <ArrowRight size={16} /></Link>
          </div>
        ) : (
          <div className="cart-layout">
            <section className="cart-items-panel" aria-label="Sản phẩm trong giỏ">
              <div className="cart-panel-heading">
                <h2>Sản phẩm</h2>
                <span>Đơn giá · Số lượng · Thành tiền</span>
              </div>

              <div className="cart-list">
                {cartItems.map((product) => (
                  <article key={product.id} className="cart-item">
                    <Link to={`/products/${product.id}`} className="cart-item-image-link">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="cart-item-image"
                        onError={(event) => { event.currentTarget.style.visibility = 'hidden' }}
                      />
                    </Link>

                    <div className="cart-item-info">
                      <Link to={`/products/${product.id}`} className="cart-item-name">{product.name}</Link>
                      <span className="cart-item-sku">Mã: {product.sku || product.id}</span>
                      <span className="cart-item-mobile-price">
                        {Number(product.price ?? 0).toLocaleString('vi-VN')} ₫ / sản phẩm
                      </span>
                    </div>

                    <div className="cart-item-unit-price">
                      <span>Đơn giá</span>
                      <strong>{Number(product.price ?? 0).toLocaleString('vi-VN')} ₫</strong>
                    </div>

                    <div className="cart-item-quantity">
                      <span>Số lượng</span>
                      <div className="cart-quantity">
                        <button
                          type="button"
                          aria-label={`Giảm số lượng ${product.name}`}
                          onClick={() => decreaseQuantity(product.id)}
                        >
                          <Minus size={14} />
                        </button>
                        <output>{product.quantity}</output>
                        <button
                          type="button"
                          aria-label={`Tăng số lượng ${product.name}`}
                          onClick={() => increaseQuantity(product.id)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="cart-item-total">
                      <span>Thành tiền</span>
                      <strong>{(Number(product.price ?? 0) * product.quantity).toLocaleString('vi-VN')} ₫</strong>
                    </div>

                    <button
                      className="cart-remove-button"
                      type="button"
                      aria-label={`Xóa ${product.name} khỏi giỏ hàng`}
                      onClick={() => removeFromCart(product.id)}
                    >
                      <Trash2 size={17} />
                    </button>
                  </article>
                ))}
              </div>

              <Link to="/products" className="cart-continue-link">
                <ArrowRight size={15} /> Tiếp tục mua sắm
              </Link>
            </section>

            <aside className="cart-summary">
              <div className="cart-summary-heading">
                <h2>Tóm tắt đơn hàng</h2>
                <span>{itemCount} món</span>
              </div>
              <div className="cart-summary-row">
                <span>Tạm tính</span>
                <strong>{cartTotal.toLocaleString('vi-VN')} ₫</strong>
              </div>
              <div className="cart-summary-row">
                <span>Vận chuyển</span>
                <span className="cart-shipping-note">Tính ở bước sau</span>
              </div>
              <div className="cart-summary-total">
                <span>Tổng tạm tính</span>
                <strong>{cartTotal.toLocaleString('vi-VN')} ₫</strong>
              </div>
              <p className="cart-summary-caption">Phí giao hàng sẽ được xác nhận tại bước thanh toán.</p>
              <Link to="/checkout" className="cart-checkout-link">
                Tiến hành thanh toán <ArrowRight size={17} />
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}

export default Cart