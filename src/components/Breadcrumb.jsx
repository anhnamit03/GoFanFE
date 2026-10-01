import { useEffect, useState } from 'react'
import { ChevronRight, House } from 'lucide-react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { getCategories } from '../services/categoryService'
import { getProductById } from '../services/productService'
import './Breadcrumb.css'

const routeLabels = {
  '/products': 'Tất cả sản phẩm',
  '/cart': 'Giỏ hàng',
  '/favorites': 'Sản phẩm yêu thích',
  '/checkout': 'Thanh toán',
  '/myself': 'Tài khoản của tôi',
  '/orders': 'Đơn mua',
}

const accountChildRoutes = new Set(['/orders', '/favorites'])

function Breadcrumb() {
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const categoryId = searchParams.get('category')
  const productId = pathname.match(/^\/products\/([^/]+)$/)?.[1]
  const [categoryName, setCategoryName] = useState('')
  const [productInfo, setProductInfo] = useState(null)

  useEffect(() => {
    if (productId) {
      let isMounted = true
      Promise.all([getProductById(productId), getCategories()])
        .then(([product, categories]) => {
          const category = categories.find((item) => String(item.id) === String(product.categoryId))
          if (isMounted) {
            setProductInfo({
              name: product.name,
              categoryId: product.categoryId,
              categoryName: category?.name || product.category?.name || 'Sản phẩm',
            })
          }
        })
        .catch(() => {
          if (isMounted) setProductInfo(null)
        })

      return () => {
        isMounted = false
      }
    }

    if (pathname !== '/products' || !categoryId) {
      return undefined
    }

    let isMounted = true
    getCategories()
      .then((categories) => {
        const category = categories.find((item) => String(item.id) === String(categoryId))
        if (isMounted) setCategoryName(category?.name || '')
      })
      .catch(() => {
        if (isMounted) setCategoryName('')
      })

    return () => {
      isMounted = false
    }
  }, [categoryId, pathname, productId])

  if (pathname === '/') {
    return null
  }

  const pageLabel = routeLabels[pathname]
  const isProductPage = Boolean(productId)
  if (!pageLabel && !isProductPage) return null

  const isCategoryPage = pathname === '/products' && categoryId

  return (
    <nav className="site-breadcrumb" aria-label="Điều hướng trang">
      <div className="site-breadcrumb-inner">
        <Link to="/"><House size={16} /> Trang chủ</Link>
        <ChevronRight size={16} aria-hidden="true" />
        {isProductPage ? (
          <>
            <Link to={productInfo?.categoryId ? `/products?category=${productInfo.categoryId}` : '/products'}>
              {productInfo?.categoryName || 'Sản phẩm'}
            </Link>
            <ChevronRight size={16} aria-hidden="true" />
            <span aria-current="page">{productInfo?.name || 'Chi tiết sản phẩm'}</span>
          </>
        ) : isCategoryPage ? (
          <span aria-current="page">{categoryName || 'Danh mục'}</span>
        ) : accountChildRoutes.has(pathname) ? (
          <>
            <Link to="/myself">Tài khoản của tôi</Link>
            <ChevronRight size={16} aria-hidden="true" />
            <span aria-current="page">{pageLabel}</span>
          </>
        ) : (
          <span aria-current="page">{pageLabel}</span>
        )}
      </div>
    </nav>
  )
}

export default Breadcrumb


