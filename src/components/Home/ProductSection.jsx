import { useEffect, useState } from 'react'
import ProductCard from '../Product/ProductCard'
import { getProducts } from '../../services/productService'
import './ProductSection.css'

function ProductSection() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    getProducts()
      .then((data) => {
        if (isMounted) setProducts(data)
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

  return (
    <section className="product-section">
      <div className="product-container">

        <div className="section-heading">
          <p>Sản phẩm</p>
          <h2>Sản phẩm nổi bật</h2>
        </div>

        <div className="product-list">
          {isLoading && <p>Đang tải sản phẩm...</p>}
          {!isLoading && error && <p role="alert">{error}</p>}
          {!isLoading && !error && products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  )
}

export default ProductSection