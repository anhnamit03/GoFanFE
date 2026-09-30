import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check, Heart, PackageCheck, Plus, ShoppingCart, Truck, Zap } from 'lucide-react'
import { useCart } from '../context/CartContext'
import ProductMediaGallery from '../components/Product/ProductMediaGallery'
import { getProductById, getProducts } from '../services/productService'
import './ProductDetail.css'

function formatPrice(price) {
  return `${Number(price ?? 0).toLocaleString('vi-VN')} ₫`
}

function getRelatedProducts(products, product) {
  const availableProducts = products.filter(
    (item) => item.id !== product.id && item.active !== false
  )
  const sameCategoryProducts = product.categoryId == null
    ? []
    : availableProducts.filter((item) => item.categoryId === product.categoryId)

  return (sameCategoryProducts.length > 0 ? sameCategoryProducts : availableProducts).slice(0, 3)
}

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, isFavorite, toggleFavorite } = useCart()
  const [result, setResult] = useState({
    id: null,
    product: null,
    relatedProducts: [],
    relatedLoading: true,
    error: '',
  })

  useEffect(() => {
    let isMounted = true

    getProductById(id)
      .then((data) => {
        if (!isMounted) return

        setResult({
          id,
          product: data,
          relatedProducts: [],
          relatedLoading: true,
          error: '',
        })

        getProducts()
          .then((products) => {
            if (isMounted) {
              setResult((current) => current.id === id
                ? { ...current, relatedProducts: getRelatedProducts(products, data), relatedLoading: false }
                : current)
            }
          })
          .catch(() => {
            if (isMounted) {
              setResult((current) => current.id === id
                ? { ...current, relatedLoading: false }
                : current)
            }
          })
      })
      .catch((fetchError) => {
        if (isMounted) {
          setResult({
            id,
            product: null,
            relatedProducts: [],
            relatedLoading: false,
            error: fetchError.message,
          })
        }
      })

    return () => {
      isMounted = false
    }
  }, [id])

  if (result.id !== id) {
    return <main className="product-detail-page"><p className="detail-message">Đang tải sản phẩm...</p></main>
  }
  if (result.error) {
    return <main className="product-detail-page"><p className="detail-message" role="alert">{result.error}</p></main>
  }

  const product = result.product
  if (!product) {
    return <main className="product-detail-page"><p className="detail-message">Không tìm thấy sản phẩm.</p></main>
  }

  const hasDiscount = product.salePrice != null && product.basePrice != null && product.salePrice < product.basePrice
  const handleBuyNow = () => {
    addToCart(product)
    navigate('/checkout', {
      state: {
        checkoutItems: [{ ...product, quantity: 1 }],
      },
    })
  }

  return (
    <main className="product-detail-page">
      <div className="detail-breadcrumb">
        <Link to="/products"><ArrowLeft size={16} /> Quay lại sản phẩm</Link>
        <span>Trang chủ / Sản phẩm / {product.name}</span>
      </div>

      <div className="product-detail-layout">
        <section className="product-detail-main" aria-label="Thông tin sản phẩm">
          <ProductMediaGallery
            key={product.id}
            product={product}
            discountLabel={hasDiscount
              ? `-${product.discountPercent ?? Math.round((1 - product.salePrice / product.basePrice) * 100)}%`
              : ''}
          />

          <div className="detail-info">
            <div className="detail-meta">
              <span className="detail-sku">Mã sản phẩm: {product.sku || product.id}</span>
              <span className={`detail-status${product.active === false ? ' detail-status-inactive' : ''}`}>
                <Check size={14} /> {product.active === false ? 'Ngừng kinh doanh' : 'Đang kinh doanh'}
              </span>
            </div>

            <div className="detail-title-row">
              <h1>{product.name}</h1>
              <button
                className={`detail-favorite-button${isFavorite(product.id) ? ' detail-favorite-active' : ''}`}
                type="button"
                aria-label={isFavorite(product.id) ? 'Bỏ sản phẩm khỏi yêu thích' : 'Thêm sản phẩm vào yêu thích'}
                aria-pressed={isFavorite(product.id)}
                onClick={() => toggleFavorite(product)}
              >
                <Heart size={19} fill={isFavorite(product.id) ? 'currentColor' : 'none'} />
                <span>{isFavorite(product.id) ? 'Đã yêu thích' : 'Yêu thích'}</span>
              </button>
            </div>

            <div className="detail-price-row">
              <strong>{formatPrice(product.price)}</strong>
              {hasDiscount && <del>{formatPrice(product.basePrice)}</del>}
            </div>

            {product.description && <p className="detail-description">{product.description}</p>}

            {product.technicalInfo && (
              <div className="detail-specification">
                <span>Thông số kỹ thuật</span>
                <p>{product.technicalInfo}</p>
              </div>
            )}

            <div className="detail-action-row">
              <button
                className="detail-add-button detail-cart-button"
                type="button"
                disabled={product.active === false}
                onClick={() => addToCart(product)}
              >
                <ShoppingCart size={18} /> Thêm vào giỏ
              </button>
              <button
                className="detail-add-button detail-buy-button"
                type="button"
                disabled={product.active === false}
                onClick={handleBuyNow}
              >
                <Zap size={18} /> Mua ngay
              </button>
            </div>

            <div className="detail-delivery-note">
              <Truck size={19} />
              <span>Giao hàng toàn quốc</span>
              <span className="delivery-separator"></span>
              <PackageCheck size={19} />
              <span>Sản phẩm chính hãng</span>
            </div>
          </div>
        </section>

        <aside className="related-products" aria-label="Sản phẩm đi kèm">
          <div className="related-heading">
            <div>
              <p>GỢI Ý CHO BẠN</p>
              <h2>Sản phẩm đi kèm</h2>
            </div>
            <span className="related-count">{result.relatedProducts.length}</span>
          </div>

          {result.relatedLoading ? (
            <p className="related-message">Đang tải gợi ý...</p>
          ) : result.relatedProducts.length === 0 ? (
            <p className="related-message">Chưa có sản phẩm gợi ý.</p>
          ) : (
            <div className="related-list">
              {result.relatedProducts.map((relatedProduct) => (
                <article className="related-item" key={relatedProduct.id}>
                  <Link to={`/products/${relatedProduct.id}`} className="related-image-link">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      onError={(event) => { event.currentTarget.style.visibility = 'hidden' }}
                    />
                  </Link>
                  <div className="related-item-info">
                    <Link to={`/products/${relatedProduct.id}`} className="related-name">
                      {relatedProduct.name}
                    </Link>
                    <p>{formatPrice(relatedProduct.price)}</p>
                  </div>
                  <button
                    type="button"
                    className="related-add-button"
                    aria-label={`Thêm ${relatedProduct.name} vào giỏ hàng`}
                    onClick={() => addToCart(relatedProduct)}
                  >
                    <Plus size={17} />
                  </button>
                </article>
              ))}
            </div>
          )}
        </aside>
      </div>
    </main>
  )
}

export default ProductDetail