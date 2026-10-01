import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Clock, Flame, Heart, ShoppingBag, Sparkles } from 'lucide-react'
import { getProducts } from '../../services/productService'
import { useCart } from '../../context/useCart'
import './FlashDeals.css'

function FlashDeals() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [addedId, setAddedId] = useState(null)
  const { addToCart, isFavorite, toggleFavorite } = useCart()

  useEffect(() => {
    let isMounted = true
    getProducts()
      .then((data) => {
        if (!isMounted) return
        // Lấy các sản phẩm có promotion hoặc giảm giá
        const dealProducts = data.filter((p) => p.discountPercent || p.salePrice || p.discountPrice)
        setProducts(dealProducts.length > 0 ? dealProducts : data.slice(0, 4))
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const handleAddToCart = async (product, event) => {
    event.preventDefault()
    await addToCart(product)
    setAddedId(product.id)
    setTimeout(() => {
      setAddedId(null)
    }, 1800)
  }

  const formatPrice = (price) => `${Number(price ?? 0).toLocaleString('vi-VN')} ₫`

  return (
    <section className="flash-deals-section" id="flash-deals">
      <div className="landing-container">
        <div className="flash-deals-banner">
          <div className="deals-banner-left">
            <div className="deals-fire-tag">
              <Flame size={16} />
              <span>FLASH SALE MÙA HÈ 2026</span>
            </div>
            <h2 className="deals-title">Siêu Giảm Giá Đến 25%</h2>
            <p className="deals-desc">
              Cơ hội sở hữu các dòng quạt cao cấp với mức giá tốt nhất năm. Số lượng có hạn!
            </p>
          </div>

          <div className="deals-countdown-box">
            <span className="countdown-label"><Clock size={16} /> Ưu đãi kết thúc sau:</span>
            <div className="countdown-units">
              <div className="count-unit"><strong>14</strong><span>Ngày</span></div>
              <span className="count-sep">:</span>
              <div className="count-unit"><strong>08</strong><span>Giờ</span></div>
              <span className="count-sep">:</span>
              <div className="count-unit"><strong>45</strong><span>Phút</span></div>
              <span className="count-sep">:</span>
              <div className="count-unit"><strong>20</strong><span>Giây</span></div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="deals-loading-state">
            <Sparkles size={24} className="animate-spin" />
            <p>Đang tải ưu đãi nóng...</p>
          </div>
        ) : (
          <div className="deals-product-grid">
            {products.slice(0, 4).map((product) => {
              const discount = product.discountPercent || (product.promotion?.discountPercent) || 15
              const currentPrice = product.price || product.discountPrice || product.basePrice
              const originalPrice = product.basePrice || currentPrice

              return (
                <div key={product.id} className="deal-card">
                  <div className="deal-badge-row">
                    <span className="deal-discount-badge">-{discount}%</span>
                    <button
                      type="button"
                      className={`deal-favorite-btn ${isFavorite(product.id) ? 'deal-fav-active' : ''}`}
                      onClick={() => toggleFavorite(product)}
                      aria-label="Yêu thích sản phẩm"
                    >
                      <Heart size={16} fill={isFavorite(product.id) ? '#ea580c' : 'none'} />
                    </button>
                  </div>

                  <Link to={`/products/${product.id}`} className="deal-img-link">
                    <img
                      src={product.image || product.imageUrl}
                      alt={product.name}
                      className="deal-product-img"
                      onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1618941716939-553df3c6c278?auto=format&fit=crop&w=600&q=80' }}
                    />
                  </Link>

                  <div className="deal-card-content">
                    <span className="deal-sku">MÃ: {product.sku || 'GF-PRO'}</span>
                    <Link to={`/products/${product.id}`} className="deal-name-link">
                      <h3 className="deal-name">{product.name}</h3>
                    </Link>

                    <div className="deal-price-row">
                      <span className="deal-price-current">{formatPrice(currentPrice)}</span>
                      {originalPrice > currentPrice && (
                        <span className="deal-price-original">{formatPrice(originalPrice)}</span>
                      )}
                    </div>

                    <div className="deal-stock-bar">
                      <div className="deal-stock-fill" style={{ width: '78%' }} />
                      <span className="deal-stock-text">Đã bán 78% · Sắp hết hàng</span>
                    </div>

                    <div className="deal-card-actions">
                      <button
                        type="button"
                        className={`deal-add-cart-btn ${addedId === product.id ? 'deal-added' : ''}`}
                        onClick={(e) => handleAddToCart(product, e)}
                      >
                        {addedId === product.id ? (
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
                      <Link to={`/products/${product.id}`} className="deal-view-btn">
                        Chi tiết
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default FlashDeals
