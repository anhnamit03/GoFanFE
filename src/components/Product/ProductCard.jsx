import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import './ProductCard.css'

function ProductCard({ product }) {
  const { addToCart, isFavorite, toggleFavorite } = useCart()
  const favorite = isFavorite(product.id)

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

      <button
        type="button"
        className={`product-favorite-button${favorite ? ' product-favorite-active' : ''}`}
        aria-label={favorite ? `Bỏ yêu thích ${product.name}` : `Thêm ${product.name} vào yêu thích`}
        aria-pressed={favorite}
        onClick={() => toggleFavorite(product)}
      >
        <Heart size={18} fill={favorite ? 'currentColor' : 'none'} />
      </button>

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