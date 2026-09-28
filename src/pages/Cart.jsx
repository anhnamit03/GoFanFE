import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './Cart.css'

function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
  } = useCart()

  return (
    <section className="cart-page">
      <div className="cart-container">
        <div className="cart-heading">
          <p>Giỏ hàng</p>
          <h1>Giỏ hàng của bạn</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <p>Giỏ hàng đang trống.</p>

            <Link to="/products">
              Xem sản phẩm
            </Link>
          </div>
        ) : (
          <div className="cart-list">
            {cartItems.map((product) => (
              <div
                key={product.id}
                className="cart-item"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="cart-item-image"
                />

                <div className="cart-item-info">
                  <h2>{product.name}</h2>

                  <p>
                    {product.price.toLocaleString('vi-VN')} ₫
                  </p>

                  <div className="cart-quantity">
                    <button
                      onClick={() => decreaseQuantity(product.id)}
                    >
                      -
                    </button>

                    <span>{product.quantity}</span>

                    <button
                      onClick={() => increaseQuantity(product.id)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Cart