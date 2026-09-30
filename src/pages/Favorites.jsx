import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/Product/ProductCard'
import { useCart } from '../context/CartContext'
import './Favorites.css'

function Favorites() {
  const { favoriteItems } = useCart()

  return (
    <main className="favorites-page">
      <div className="favorites-container">
        <div className="favorites-heading">
          <div>
            <p>GOFAN / DANH SÁCH CỦA BẠN</p>
            <h1>Sản phẩm yêu thích</h1>
          </div>
          <span>{favoriteItems.length} sản phẩm</span>
        </div>

        {favoriteItems.length === 0 ? (
          <section className="favorites-empty">
            <span className="favorites-empty-icon"><Heart size={27} /></span>
            <h2>Chưa có sản phẩm yêu thích</h2>
            <p>Lưu lại sản phẩm bạn muốn xem sau.</p>
            <Link to="/products">Khám phá sản phẩm</Link>
          </section>
        ) : (
          <div className="favorites-grid">
            {favoriteItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default Favorites