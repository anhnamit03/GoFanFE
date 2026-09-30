import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
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
  const normalizedSearchTerm = normalizeSearchText(searchTerm)
  const filteredProducts = products.filter((product) => {
    const searchableText = normalizeSearchText(`${product.name} ${product.sku}`)
    return searchableText.includes(normalizedSearchTerm)
  })

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
    <section className="products-page">
      <div className="products-container">

        <div className="products-heading">
          <p>Sản phẩm</p>
          <h1>{searchTerm ? `Kết quả tìm kiếm: ${searchTerm}` : 'Tất cả sản phẩm'}</h1>
        </div>

        <div className="products-list">
          {isLoading && <p>Đang tải sản phẩm...</p>}
          {!isLoading && error && <p role="alert">{error}</p>}
          {!isLoading && !error && filteredProducts.length === 0 && (
            <p>{searchTerm ? 'Không tìm thấy sản phẩm phù hợp.' : 'Hiện chưa có sản phẩm.'}</p>
          )}
          {!isLoading && !error && filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  )
}

export default Products