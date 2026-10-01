import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Wind } from 'lucide-react'
import ProductCard from '../components/Product/ProductCard'
import { getProducts } from '../services/productService'
import './Products.css'

function normalizeSearchText(value = '') {
  return value
    .toLocaleLowerCase('vi')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function Products() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const searchTerm = searchParams.get('search')?.trim() ?? ''
  const selectedCategory = searchParams.get('category')?.trim() ?? 'all'

  useEffect(() => {
    let isMounted = true

    getProducts()
      .then((productsData) => {
        if (isMounted) {
          setProducts(productsData)
        }
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

  // Filter products by search term or category from URL
  const filteredProducts = useMemo(() => {
    const normalizedTerm = normalizeSearchText(searchTerm)

    return products.filter((product) => {
      if (normalizedTerm) {
        const searchableText = normalizeSearchText(`${product.name} ${product.sku} ${product.description || ''}`)
        if (!searchableText.includes(normalizedTerm)) return false
      }

      if (selectedCategory && selectedCategory !== 'all') {
        if (String(product.categoryId) !== selectedCategory) return false
      }

      return true
    })
  }, [products, searchTerm, selectedCategory])

  return (
    <div className="gofan-products-page">
      <div className="products-page-container">
        <div className="products-grid-column">
          {isLoading && (
            <div className="products-loading-state">
              <Wind size={36} className="animate-spin text-primary" />
              <p>Đang tải danh sách quạt GoFan...</p>
            </div>
          )}

          {!isLoading && error && (
            <div className="products-error-state" role="alert">
              <p>{error}</p>
              <button type="button" onClick={() => window.location.reload()}>
                Thử lại
              </button>
            </div>
          )}

          {!isLoading && !error && filteredProducts.length === 0 && (
            <div className="products-empty-state">
              <h3>Không tìm thấy sản phẩm nào</h3>
              <p>Vui lòng quay lại hoặc chọn danh mục khác từ thanh menu.</p>
            </div>
          )}

          {!isLoading && !error && filteredProducts.length > 0 && (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Products