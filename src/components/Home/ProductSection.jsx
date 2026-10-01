import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import ProductCard from '../Product/ProductCard'
import { getProducts } from '../../services/productService'
import { getCategories } from '../../services/categoryService'
import './ProductSection.css'

function ProductSection() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCatId, setActiveCatId] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    Promise.all([getProducts(), getCategories()])
      .then(([prods, cats]) => {
        if (!isMounted) return
        setProducts(prods)
        setCategories(cats)
      })
      .catch((fetchError) => {
        if (isMounted) setError(fetchError.message)
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const filteredProducts = activeCatId === 'all'
    ? products
    : products.filter((p) => String(p.categoryId) === String(activeCatId))

  return (
    <section className="product-section" id="featured-products">
      <div className="landing-container">
        <div className="product-section-header">
          <div>
            <span className="section-eyebrow">BỘ SƯU TẬP CAO CẤP</span>
            <h2 className="section-title">Sản Phẩm Được Yêu Thích Nhất</h2>
          </div>

          <div className="product-cat-filters">
            <button
              type="button"
              className={`cat-filter-btn ${activeCatId === 'all' ? 'cat-filter-active' : ''}`}
              onClick={() => setActiveCatId('all')}
            >
              Tất cả ({products.length})
            </button>
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`cat-filter-btn ${String(activeCatId) === String(cat.id) ? 'cat-filter-active' : ''}`}
                onClick={() => setActiveCatId(String(cat.id))}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="product-loading">
            <Sparkles size={24} className="animate-spin" />
            <p>Đang tải danh sách quạt...</p>
          </div>
        ) : error ? (
          <p role="alert" className="product-error">{error}</p>
        ) : (
          <>
            <div className="product-grid-layout">
              {filteredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="product-bottom-action">
              <Link to="/products" className="product-see-more-btn">
                <span>Khám phá toàn bộ {products.length} sản phẩm GoFan</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default ProductSection