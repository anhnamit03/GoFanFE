import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import './ProductCard.css'

function ProductCard({ product }) {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart(product)
  }

  return (
    <article className="product-card">
      <Link
        to={`/products/${product.id}`}
        className="product-card-image-link"
      >
        <img
          src={product.image}
          alt={product.name}
          className="product-card-image"
        />
      </Link>

      <div className="product-card-content">
        <Link
          to={`/products/${product.id}`}
          className="product-card-name"
        >
          {product.name}
        </Link>

        <p className="product-card-price">
          {product.price.toLocaleString('vi-VN')} ₫
        </p>

        <button
          className="product-card-button"
          onClick={handleAddToCart}
        >
          Thêm vào giỏ
        </button>
      </div>
    </article>
  )
}

export default ProductCard