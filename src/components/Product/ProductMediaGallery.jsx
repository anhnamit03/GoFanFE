import { useState } from 'react'
import { Image as ImageIcon, Play, Video } from 'lucide-react'
import './ProductMediaGallery.css'

function getMediaUrl(media) {
  if (typeof media === 'string') return media
  return media?.url || media?.imageUrl || media?.src || ''
}

function ProductMediaGallery({ product, discountLabel }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [failedImages, setFailedImages] = useState({})
  const productImages = Array.isArray(product.images)
    ? product.images
    : Array.isArray(product.imageUrls)
      ? product.imageUrls
      : []
  const fallbackImage = product.imageUrl || (
    product.image?.includes('placehold.co') ? '' : product.image || ''
  )
  const videoUrl = product.videoUrl || (
    typeof product.video === 'string' ? product.video : product.video?.url
  ) || ''
  const imageItems = Array.from({ length: 5 }, (_, index) => ({
    type: 'image',
    label: `Ảnh ${index + 1}`,
    src: getMediaUrl(productImages[index]) || (index === 0 ? fallbackImage : ''),
  }))
  const mediaItems = [...imageItems, { type: 'video', label: 'Video', src: videoUrl }]
  const activeMedia = mediaItems[activeIndex]
  const hasActiveImage = activeMedia.type === 'image'
    && activeMedia.src
    && !failedImages[activeIndex]

  const markImageAsFailed = (index) => {
    setFailedImages((current) => ({ ...current, [index]: true }))
  }

  return (
    <div className="product-media-gallery">
      <div className={`media-stage${activeMedia.type === 'video' ? ' media-stage-video' : ''}`}>
        {discountLabel && <span className="detail-discount">{discountLabel}</span>}
        <span className="media-index">{String(activeIndex + 1).padStart(2, '0')} / 06</span>

        {activeMedia.type === 'video' && activeMedia.src ? (
          <video
            key={activeMedia.src}
            className="media-stage-video-player"
            src={activeMedia.src}
            poster={imageItems.find((item) => item.src)?.src}
            controls
            playsInline
            preload="metadata"
          />
        ) : hasActiveImage ? (
          <img
            className="media-stage-image"
            src={activeMedia.src}
            alt={`${product.name} - ${activeMedia.label}`}
            onError={() => markImageAsFailed(activeIndex)}
          />
        ) : (
          <div className="media-empty-state">
            {activeMedia.type === 'video' ? <Video size={40} /> : <ImageIcon size={40} />}
            <strong>{activeMedia.type === 'video' ? 'Video sản phẩm' : activeMedia.label}</strong>
            <span>{activeMedia.type === 'video' ? 'Video sẽ được cập nhật' : 'Ảnh sẽ được cập nhật'}</span>
          </div>
        )}
      </div>

      <div className="media-thumbnails" aria-label="Thư viện ảnh và video sản phẩm">
        {mediaItems.map((media, index) => {
          const hasThumbnail = media.src && !failedImages[index]
          const isActive = activeIndex === index

          return (
            <button
              key={media.label}
              type="button"
              className={`media-thumbnail${isActive ? ' media-thumbnail-active' : ''}${media.type === 'video' ? ' media-thumbnail-video' : ''}`}
              aria-label={`Xem ${media.label.toLocaleLowerCase('vi')}`}
              aria-pressed={isActive}
              onClick={() => setActiveIndex(index)}
            >
              {hasThumbnail ? (
                <img
                  src={media.src}
                  alt=""
                  onError={() => markImageAsFailed(index)}
                />
              ) : (
                <span className="media-thumbnail-placeholder">
                  {media.type === 'video' ? <Video size={19} /> : <ImageIcon size={19} />}
                </span>
              )}
              {media.type === 'video' && <span className="media-play-indicator"><Play size={13} fill="currentColor" /></span>}
              <span className="media-thumbnail-label">{media.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ProductMediaGallery