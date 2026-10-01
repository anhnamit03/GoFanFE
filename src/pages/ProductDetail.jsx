import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Check,
  Heart,
  Minus,
  PackageCheck,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  Zap,
  RotateCcw,
  Sparkles
} from 'lucide-react'
import { useCart } from '../context/useCart'
import ProductMediaGallery from '../components/Product/ProductMediaGallery'
import { getProductById, getProducts } from '../services/productService'
import './ProductDetail.css'

function formatPrice(price) {
  return `${Number(price ?? 0).toLocaleString('vi-VN')} ₫`
}

function getRelatedProducts(products, product) {
  const configuredProducts =
    product.relatedProducts ??
    product.accompanyingProducts ??
    product.accessoryProducts ??
    product.productAccessories ??
    product.addOns

  if (Array.isArray(configuredProducts)) {
    return configuredProducts
      .map((item) => ({
        ...item,
        id: item.addOnProductId ?? item.id,
        name: item.name ?? item.addOnProductName,
        sku: item.sku,
        price: item.price ?? item.unitPrice ?? item.salePrice ?? item.basePrice ?? 0,
        image: item.image ?? item.imageUrl ?? 'https://images.unsplash.com/photo-1618941716939-553df3c6c278?auto=format&fit=crop&w=400&q=80',
      }))
      .filter((item) => item.id !== product.id && item.name && item.active !== false)
      .slice(0, 4)
  }

  const availableProducts = products.filter(
    (item) => item.id !== product.id && item.active !== false
  )
  const sameCategoryProducts =
    product.categoryId == null
      ? []
      : availableProducts.filter((item) => item.categoryId === product.categoryId)

  return (sameCategoryProducts.length > 0 ? sameCategoryProducts : availableProducts).slice(0, 4)
}

const SAMPLE_REVIEWS = [
  {
    id: 1,
    author: 'Trần Minh Đức',
    rating: 5,
    date: '3 ngày trước',
    comment: 'Quạt chạy cực kỳ êm ái, ban đêm bật số 2 gần như không nghe thấy tiếng động cơ. Luồng gió thoang thoảng tự nhiên rất dễ chịu, rất đáng tiền!',
    verified: true,
  },
  {
    id: 2,
    author: 'Nguyễn Thị Hương',
    rating: 5,
    date: '1 tuần trước',
    comment: 'Thiết kế tối giản sang trọng, để trong phòng khách nhìn rất hiện đại. Đóng gói cẩn thận, giao hàng nhanh trong 2 giờ tại Hà Nội.',
    verified: true,
  },
  {
    id: 3,
    author: 'Lê Hoàng Nam',
    rating: 4.8,
    date: '2 tuần trước',
    comment: 'Động cơ DC Inverter tiết kiệm điện rõ rệt so với quạt cũ. Điều khiển từ xa nhạy, có chế độ hẹn giờ rất tiện lợi.',
    verified: true,
  },
]

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, isFavorite, toggleFavorite } = useCart()

  const [quantity, setQuantity] = useState(1)
  const [selectedAddOns, setSelectedAddOns] = useState([])
  const [isAddedToast, setIsAddedToast] = useState(false)
  const [activeTab, setActiveTab] = useState('specs') // 'specs' | 'reviews' | 'warranty'
  const [reviewsList, setReviewsList] = useState(SAMPLE_REVIEWS)
  const [newReview, setNewReview] = useState({ author: '', rating: 5, comment: '' })
  const [showReviewForm, setShowReviewForm] = useState(false)

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
              const relatedProducts = getRelatedProducts(products, data)
              setResult((current) =>
                current.id === id
                  ? {
                      ...current,
                      product: { ...current.product, relatedProducts },
                      relatedProducts,
                      relatedLoading: false,
                    }
                  : current
              )
            }
          })
          .catch(() => {
            if (isMounted) {
              setResult((current) =>
                current.id === id ? { ...current, relatedLoading: false } : current
              )
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
    return (
      <main className="gofan-detail-page">
        <div className="detail-loading-box">
          <p>Đang tải thông số thiết bị GoFan...</p>
        </div>
      </main>
    )
  }

  if (result.error) {
    return (
      <main className="gofan-detail-page">
        <div className="detail-error-box" role="alert">
          <p>{result.error}</p>
          <Link to="/products">Quay lại danh sách sản phẩm</Link>
        </div>
      </main>
    )
  }

  const product = result.product
  if (!product) {
    return (
      <main className="gofan-detail-page">
        <div className="detail-error-box">
          <p>Không tìm thấy sản phẩm.</p>
          <Link to="/products">Xem tất cả sản phẩm</Link>
        </div>
      </main>
    )
  }

  const hasDiscount =
    product.salePrice != null &&
    product.basePrice != null &&
    product.salePrice < product.basePrice

  const discountPercent =
    product.discountPercent ??
    (hasDiscount ? Math.round((1 - product.salePrice / product.basePrice) * 100) : 0)

  const toggleAddOn = (addOn) => {
    setSelectedAddOns((prev) =>
      prev.some((item) => item.id === addOn.id)
        ? prev.filter((item) => item.id !== addOn.id)
        : [...prev, addOn]
    )
  }

  const handleAddToCart = async () => {
    const productPayload = {
      ...product,
      relatedProducts: selectedAddOns,
    }
    await addToCart(productPayload, quantity)
    setIsAddedToast(true)
    setTimeout(() => setIsAddedToast(false), 2200)
  }

  const handleBuyNow = () => {
    const productPayload = {
      ...product,
      relatedProducts: selectedAddOns,
    }
    addToCart(productPayload, quantity)
    navigate('/checkout', {
      state: {
        checkoutItems: [{ ...productPayload, quantity }],
      },
    })
  }

  const handleReviewSubmit = (e) => {
    e.preventDefault()
    if (!newReview.author.trim() || !newReview.comment.trim()) return

    const reviewObj = {
      id: Date.now(),
      author: newReview.author.trim(),
      rating: newReview.rating,
      date: 'Vừa xong',
      comment: newReview.comment.trim(),
      verified: true,
    }

    setReviewsList([reviewObj, ...reviewsList])
    setNewReview({ author: '', rating: 5, comment: '' })
    setShowReviewForm(false)
  }

  return (
    <main className="gofan-detail-page">
      <div className="detail-page-container">
        {/* Main Product Showcase (2 Columns) */}
        <div className="detail-main-grid">
          {/* Left Column: Media Gallery */}
          <div className="detail-media-column">
            <ProductMediaGallery
              key={product.id}
              product={product}
              discountLabel={discountPercent > 0 ? `-${discountPercent}%` : ''}
            />
          </div>

          {/* Right Column: Buying Information & Actions */}
          <div className="detail-info-column">
            <div className="detail-badge-row">
              <span className="detail-category-badge">
                <Sparkles size={13} /> Thiết bị cao cấp
              </span>
              <span className={`detail-status-pill ${product.active === false ? 'inactive' : 'active'}`}>
                <Check size={13} /> {product.active === false ? 'Tạm hết hàng' : 'Còn hàng tại kho'}
              </span>
            </div>

            <h1 className="detail-product-title">{product.name}</h1>

            <div className="detail-rating-sku-row">
              <div className="detail-stars">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={15} fill="#f59e0b" color="#f59e0b" />
                ))}
                <span className="rating-score">4.9</span>
                <span className="rating-count">({reviewsList.length} đánh giá)</span>
              </div>
              <span className="sku-divider">•</span>
              <span className="detail-sku-tag">Mã: <strong>{product.sku || product.id}</strong></span>
            </div>

            {/* Price Box */}
            <div className="detail-price-card">
              <div className="price-primary-row">
                <span className="current-price-label">Giá bán:</span>
                <strong className="current-price">{formatPrice(product.price)}</strong>
                {hasDiscount && (
                  <span className="base-price-del">{formatPrice(product.basePrice)}</span>
                )}
                {discountPercent > 0 && (
                  <span className="discount-pill">Tiết kiệm {discountPercent}%</span>
                )}
              </div>
              <p className="price-vat-note">Đã bao gồm thuế VAT & Miễn phí vận chuyển toàn quốc</p>
            </div>

            {/* Highlights bullet points */}
            <div className="detail-features-highlight">
              <div className="feature-pill-item">
                <span className="check-dot">✓</span> Động cơ DC Inverter tiết kiệm điện 80%
              </div>
              <div className="feature-pill-item">
                <span className="check-dot">✓</span> Vận hành êm ái dưới 13dB không gây ồn
              </div>
              <div className="feature-pill-item">
                <span className="check-dot">✓</span> Chế độ gió tự nhiên đối lưu không khí 3D
              </div>
              <div className="feature-pill-item">
                <span className="check-dot">✓</span> Điều khiển từ xa & Hẹn giờ thông minh
              </div>
            </div>

            {product.description && (
              <p className="detail-short-desc">{product.description}</p>
            )}

            {/* Quantity Stepper & Add to Cart Controls */}
            <div className="detail-buy-controls">
              <div className="qty-picker-label">Số lượng:</div>
              <div className="detail-quantity-box">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Giảm số lượng"
                >
                  <Minus size={15} />
                </button>
                <span className="quantity-display">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Tăng số lượng"
                >
                  <Plus size={15} />
                </button>
              </div>

              <button
                type="button"
                className={`detail-fav-btn ${isFavorite(product.id) ? 'active' : ''}`}
                onClick={() => toggleFavorite(product)}
                aria-label="Yêu thích"
              >
                <Heart size={19} fill={isFavorite(product.id) ? '#ea580c' : 'none'} />
                <span>{isFavorite(product.id) ? 'Đã yêu thích' : 'Yêu thích'}</span>
              </button>
            </div>

            {/* Dual CTA Buttons */}
            <div className="detail-action-buttons">
              <button
                type="button"
                className="cta-add-cart-btn"
                disabled={product.active === false}
                onClick={handleAddToCart}
              >
                <ShoppingCart size={18} />
                <span>{isAddedToast ? '✓ Đã thêm vào giỏ!' : 'Thêm vào giỏ hàng'}</span>
              </button>

              <button
                type="button"
                className="cta-buy-now-btn"
                disabled={product.active === false}
                onClick={handleBuyNow}
              >
                <Zap size={18} />
                <span>Mua ngay</span>
              </button>
            </div>

            {/* Trust commitments */}
            <div className="detail-commitments-grid">
              <div className="commit-item">
                <Truck size={18} />
                <div>
                  <strong>Giao hàng toàn quốc</strong>
                  <span>Hỏa tốc 2-4h tại HN & HCM</span>
                </div>
              </div>
              <div className="commit-item">
                <ShieldCheck size={18} />
                <div>
                  <strong>Bảo hành 24 tháng</strong>
                  <span>Đổi mới trong 30 ngày nếu lỗi</span>
                </div>
              </div>
              <div className="commit-item">
                <PackageCheck size={18} />
                <div>
                  <strong>100% Chính hãng</strong>
                  <span>Kiểm tra hàng trước khi nhận</span>
                </div>
              </div>
              <div className="commit-item">
                <RotateCcw size={18} />
                <div>
                  <strong>Đổi trả dễ dàng</strong>
                  <span>Hỗ trợ miễn phí tận nơi</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Details Section (Specifications, Reviews, Warranty) */}
        <section className="detail-tabs-section">
          <div className="detail-tabs-nav">
            <button
              type="button"
              className={`detail-tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
              onClick={() => setActiveTab('specs')}
            >
              Thông số kỹ thuật
            </button>
            <button
              type="button"
              className={`detail-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Đánh giá khách hàng ({reviewsList.length})
            </button>
            <button
              type="button"
              className={`detail-tab-btn ${activeTab === 'warranty' ? 'active' : ''}`}
              onClick={() => setActiveTab('warranty')}
            >
              Chính sách bảo hành & Đổi trả
            </button>
          </div>

          <div className="detail-tabs-body">
            {/* Specs Tab */}
            {activeTab === 'specs' && (
              <div className="specs-table-container">
                <table className="specs-table">
                  <tbody>
                    <tr>
                      <th>Loại thiết bị</th>
                      <td>{product.name}</td>
                    </tr>
                    <tr>
                      <th>Mã sản phẩm (SKU)</th>
                      <td>{product.sku || product.id}</td>
                    </tr>
                    <tr>
                      <th>Công nghệ động cơ</th>
                      <td>Động cơ DC không chổi than (Brushless DC Motor)</td>
                    </tr>
                    <tr>
                      <th>Mức độ ồn</th>
                      <td>13dB - Siêu tĩnh lặng chuẩn phòng ngủ</td>
                    </tr>
                    <tr>
                      <th>Góc xoay & Đảo chiều</th>
                      <td>3D 360 độ đối lưu luồng khí toàn diện</td>
                    </tr>
                    <tr>
                      <th>Cấp độ gió</th>
                      <td>8 - 12 cấp độ gió thông minh + Gió tự nhiên</td>
                    </tr>
                    <tr>
                      <th>Tiện ích</th>
                      <td>Điều khiển từ xa RF, Hẹn giờ tắt 12h, Bảng LED hiển thị</td>
                    </tr>
                    <tr>
                      <th>Thông tin kỹ thuật chi tiết</th>
                      <td>{product.technicalInfo || 'Đang cập nhật'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="reviews-tab-container">
                <div className="reviews-summary-card">
                  <div className="rating-overview">
                    <span className="big-rating">4.9</span>
                    <div className="overview-stars">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={18} fill="#f59e0b" color="#f59e0b" />
                      ))}
                    </div>
                    <span>Dựa trên {reviewsList.length} đánh giá thực tế</span>
                  </div>

                  <button
                    type="button"
                    className="write-review-btn"
                    onClick={() => setShowReviewForm(!showReviewForm)}
                  >
                    Viết đánh giá của bạn
                  </button>
                </div>

                {showReviewForm && (
                  <form className="review-submit-form" onSubmit={handleReviewSubmit}>
                    <h3>Gửi đánh giá sản phẩm</h3>
                    <div className="form-group">
                      <label>Họ và tên của bạn</label>
                      <input
                        type="text"
                        placeholder="Nhập tên của bạn"
                        value={newReview.author}
                        onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Điểm đánh giá (sao)</label>
                      <select
                        value={newReview.rating}
                        onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                      >
                        <option value="5">⭐⭐⭐⭐⭐ 5 sao - Cực kỳ hài lòng</option>
                        <option value="4">⭐⭐⭐⭐ 4 sao - Hài lòng</option>
                        <option value="3">⭐⭐⭐ 3 sao - Bình thường</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Nhận xét chi tiết</label>
                      <textarea
                        rows="3"
                        placeholder="Chia sẻ trải nghiệm sử dụng quạt GoFan..."
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        required
                      />
                    </div>
                    <button type="submit" className="submit-review-btn">
                      Đăng nhận xét
                    </button>
                  </form>
                )}

                <div className="reviews-cards-list">
                  {reviewsList.map((rev) => (
                    <div key={rev.id} className="review-card">
                      <div className="review-card-top">
                        <div className="author-info">
                          <strong>{rev.author}</strong>
                          {rev.verified && (
                            <span className="verified-badge">
                              <Check size={11} /> Đã mua hàng tại GoFan
                            </span>
                          )}
                        </div>
                        <span className="review-date">{rev.date}</span>
                      </div>
                      <div className="review-stars-row">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={14}
                            fill={s <= Math.round(rev.rating) ? '#f59e0b' : 'none'}
                            color="#f59e0b"
                          />
                        ))}
                      </div>
                      <p className="review-body">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warranty Tab */}
            {activeTab === 'warranty' && (
              <div className="warranty-tab-content">
                <div className="warranty-grid">
                  <div className="warranty-item">
                    <h4>Bảo hành chính hãng 24 tháng</h4>
                    <p>
                      Mọi sản phẩm quạt mang thương hiệu GoFan đều được áp dụng chính sách bảo hành
                      động cơ và bo mạch điều khiển 24 tháng tận nhà tại các thành phố lớn.
                    </p>
                  </div>
                  <div className="warranty-item">
                    <h4>Đổi mới 1 - 1 trong 30 ngày</h4>
                    <p>
                      Nếu phát sinh bất kỳ lỗi kỹ thuật nào từ nhà sản xuất trong vòng 30 ngày đầu
                      tiên, khách hàng được quyền đổi sản phẩm mới nguyên hộp 100%.
                    </p>
                  </div>
                  <div className="warranty-item">
                    <h4>Hỗ trợ bảo dưỡng trọn đời</h4>
                    <p>
                      Cung cấp linh kiện thay thế chính hãng, hỗ trợ kiểm tra định kỳ và vệ sinh quạt
                      chuyên nghiệp qua hệ thống trạm bảo hành ủy quyền toàn quốc.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Accompanying / Add-on Products Section */}
        {result.relatedProducts.length > 0 && (
          <section className="detail-addons-section">
            <div className="addons-header">
              <div>
                <span className="addons-kicker">PHỤ KIỆN & SẢN PHẨM LIÊN QUAN</span>
                <h2>Sản phẩm cùng hệ sinh thái</h2>
              </div>
            </div>

            <div className="addons-grid">
              {result.relatedProducts.map((rel) => {
                const isSelected = selectedAddOns.some((i) => i.id === rel.id)

                return (
                  <article key={rel.id} className={`addon-card ${isSelected ? 'selected' : ''}`}>
                    <Link to={`/products/${rel.id}`} className="addon-thumb">
                      <img src={rel.image} alt={rel.name} />
                    </Link>
                    <div className="addon-content">
                      <Link to={`/products/${rel.id}`} className="addon-name">
                        {rel.name}
                      </Link>
                      <strong className="addon-price">{formatPrice(rel.price)}</strong>
                      <button
                        type="button"
                        className={`addon-select-btn ${isSelected ? 'active' : ''}`}
                        onClick={() => toggleAddOn(rel)}
                      >
                        {isSelected ? '✓ Đã chọn kèm' : '+ Chọn mua kèm'}
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        )}
      </div>

      {/* Mobile Sticky Buy Bar */}
      <div className="mobile-detail-sticky-bar">
        <div className="mobile-sticky-price">
          <span>Giá bán:</span>
          <strong>{formatPrice(product.price)}</strong>
        </div>
        <div className="mobile-sticky-actions">
          <button
            type="button"
            className="mobile-sticky-cart"
            onClick={handleAddToCart}
            aria-label="Thêm vào giỏ"
          >
            <ShoppingCart size={18} />
          </button>
          <button
            type="button"
            className="mobile-sticky-buy"
            onClick={handleBuyNow}
          >
            Mua ngay
          </button>
        </div>
      </div>
    </main>
  )
}

export default ProductDetail