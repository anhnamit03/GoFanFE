import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Heart, ShoppingBag } from 'lucide-react'
import { useCart } from '../../context/useCart'
import './ProductCard.css'

function ProductCard({ product }) {
  const { addToCart, isFavorite, toggleFavorite } = useCart()
  const [isAdded, setIsAdded] = useState(false)
  const favorite = isFavorite(product.id)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    await addToCart(product)
    setIsAdded(true)
    setTimeout(() => {
      setIsAdded(false)
    }, 1800)
  }

  const formatPrice = (p) => `${Number(p ?? 0).toLocaleString('vi-VN')} ₫`
  const discount = product.discountPercent || (product.promotion?.discountPercent)
  const currentPrice = product.price ?? product.discountPrice ?? product.basePrice ?? 0
  const originalPrice = product.basePrice && product.basePrice > currentPrice ? product.basePrice : null

  return (
    <article className="gofan-product-card">
      {discount && (
        <span className="card-discount-tag">-{discount}%</span>
      )}

      <button
        type="button"
        className={`card-fav-btn ${favorite ? 'card-fav-active' : ''}`}
        aria-label={favorite ? `Bỏ yêu thích ${product.name}` : `Thêm ${product.name} vào yêu thích`}
        aria-pressed={favorite}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          toggleFavorite(product)
        }}
      >
        <Heart size={16} fill={favorite ? '#ea580c' : 'none'} />
      </button>

      <Link to={`/products/${product.id}`} className="card-img-wrap">
        <img
          src={product.image || product.imageUrl}
          alt={product.name}
          className="card-img"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1618941716939-553df3c6c278?auto=format&fit=crop&w=600&q=80'
          }}
        />
      </Link>

      <div className="card-details">
        {product.sku && <span className="card-sku">MÃ: {product.sku}</span>}
        <Link to={`/products/${product.id}`} className="card-title-link">
          <h3 className="card-title">{product.name}</h3>
        </Link>

        <div className="card-price-box">
          <span className="card-price-now">{formatPrice(currentPrice)}</span>
          {originalPrice && (
            <span className="card-price-was">{formatPrice(originalPrice)}</span>
          )}
        </div>

        <button
          type="button"
          className={`card-cart-btn ${isAdded ? 'card-cart-added' : ''}`}
          onClick={handleAddToCart}
        >
          {isAdded ? (
            <>
              <Check size={16} />
              <span>Đã thêm giỏ</span>
            </>
          ) : (
            <>
              <ShoppingBag size={16} />
              <span>Thêm vào giỏ</span>
            </>
          )}
        </button>
      </div>
    </article>
  )
}

export default ProductCard