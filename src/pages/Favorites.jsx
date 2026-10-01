import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, Trash2, ArrowRight, Sparkles } from 'lucide-react'
import ProductCard from '../components/Product/ProductCard'
import { useCart } from '../context/useCart'
import './Favorites.css'

function Favorites() {
  const { favoriteItems, addToCart, removeFavorite } = useCart()

  const handleAddAllToCart = async () => {
    for (const item of favoriteItems) {
      await addToCart(item)
    }
    alert(`Đã thêm ${favoriteItems.length} sản phẩm vào giỏ hàng thành công!`)
  }

  const handleClearAll = () => {
    if (window.confirm('Bạn có muốn xóa toàn bộ sản phẩm khỏi danh sách yêu thích?')) {
      favoriteItems.forEach((item) => removeFavorite(item.id))
    }
  }

  return (
    <main className="gofan-favorites-page">
      <div className="favorites-page-container">
        {/* Heading Section */}
        <div className="favorites-header-row">
          <div>
            <span className="favorites-kicker">GOFAN WISHLIST</span>
            <h1 className="favorites-main-title">Sản phẩm yêu thích</h1>
            <p className="favorites-subtitle">
              Lưu giữ những thiết bị làm mát bạn quan tâm để dễ dàng so sánh và đặt mua.
            </p>
          </div>

          {favoriteItems.length > 0 && (
            <div className="favorites-header-actions">
              <span className="favorites-count-badge">
                {favoriteItems.length} sản phẩm
              </span>
              <button
                type="button"
                className="fav-action-btn add-all"
                onClick={handleAddAllToCart}
              >
                <ShoppingBag size={16} /> Thêm tất cả vào giỏ
              </button>
              <button
                type="button"
                className="fav-action-btn clear-all"
                onClick={handleClearAll}
              >
                <Trash2 size={16} /> Xóa tất cả
              </button>
            </div>
          )}
        </div>

        {/* Content Section */}
        {favoriteItems.length === 0 ? (
          <div className="favorites-empty-card">
            <div className="favorites-empty-visual">
              <Heart size={44} className="empty-heart-icon" />
            </div>
            <h2>Chưa có sản phẩm yêu thích</h2>
            <p>
              Hãy bấm vào biểu tượng trái tim trên các sản phẩm quạt đứng, quạt trần hoặc quạt sạc
              để lưu lại vào danh sách yêu thích của bạn.
            </p>
            <Link to="/products" className="favorites-empty-cta">
              <Sparkles size={16} /> Khám phá sản phẩm ngay <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="favorites-grid-wrapper">
            <div className="favorites-products-grid">
              {favoriteItems.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default Favorites