import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Bed, Check, ChefHat, Laptop, Sparkles, Tv } from 'lucide-react'
import './RoomCoolingMatcher.css'

const rooms = [
  {
    id: 'bedroom',
    label: 'Phòng Ngủ',
    size: '&lt; 18m²',
    icon: Bed,
    title: 'Giải Pháp Ngủ Ngon Tuyệt Đối',
    description: 'Ưu tiên hàng đầu là độ ồn siêu tĩnh lặng, luồng gió thoảng dịu êm không phả thẳng vào mặt và tính năng hẹn giờ thông minh.',
    recommendedProduct: {
      id: 3,
      name: 'Quạt đứng GoFan Silent Wind Pro',
      sku: 'GF-QD01',
      price: 1062500,
      originalPrice: 1250000,
      image: 'https://images.unsplash.com/photo-1618941716939-553df3c6c278?auto=format&fit=crop&w=800&q=80',
      tag: 'Khuyên Dùng Cho Phòng Ngủ',
      specs: [
        'Độ ồn cực thấp chỉ 26.5 dB',
        '12 cấp độ gió điều chỉnh linh hoạt',
        'Động cơ DC Inverter tiết kiệm 70% điện',
        'Chế độ gió ngủ tự động giảm tốc ban đêm'
      ]
    }
  },
  {
    id: 'living',
    label: 'Phòng Khách',
    size: '20 - 45m²',
    icon: Tv,
    title: 'Đẳng Cấp & Lan Tỏa Mát Rộng',
    description: 'Không gian sinh hoạt chung cần lưu lượng gió lớn, góc thổi bao quát toàn bộ diện tích cùng tính thẩm mỹ hài hòa với nội thất.',
    recommendedProduct: {
      id: 4,
      name: 'Quạt trần 5 cánh đèn LED GoFan Luxury Air',
      sku: 'GF-QT01',
      price: 3105000,
      originalPrice: 3450000,
      image: 'https://images.unsplash.com/photo-1594913785162-e678a0c23dd9?auto=format&fit=crop&w=800&q=80',
      tag: 'Lựa Chọn Số 1 Cho Phòng Khách',
      specs: [
        'Sải cánh 142cm phủ gió 45m²',
        'Tích hợp đèn LED 3 chế độ ánh sáng',
        'Động cơ lõi đồng 65W vận hành bền bỉ',
        'Điều khiển từ xa 6 cấp độ gió thông minh'
      ]
    }
  },
  {
    id: 'office',
    label: 'Góc Làm Việc',
    size: 'Cá Nhân',
    icon: Laptop,
    title: 'Linh Hoạt, Tập Trung & Mát Lành',
    description: 'Thiết kế để bàn gọn gàng, sạc pin tích điện tiện lợi mang theo làm việc mọi nơi mà không vướng víu dây cáp.',
    recommendedProduct: {
      id: 6,
      name: 'Quạt sạc mini để bàn xoay 120° DeskBreeze',
      sku: 'GF-QB01',
      price: 320000,
      originalPrice: 380000,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      tag: 'Bán Chạy Cho Dân Văn Phòng',
      specs: [
        'Pin 4000mAh dùng 8-10 tiếng liên tục',
        'Cổng sạc Type-C nhanh chóng',
        'Góc xoay tự động 120 độ',
        'Trọng lượng siêu nhẹ chỉ 450g'
      ]
    }
  },
  {
    id: 'kitchen',
    label: 'Bếp & Phòng Tắm',
    size: 'Thông Khí',
    icon: ChefHat,
    title: 'Khử Mùi Nhanh, Không Gian Khô Thoáng',
    description: 'Loại bỏ ngay khói mùi thức ăn, hơi ẩm nồm và ngăn chặn ẩm mốc phát triển với van một chiều chống côn trùng.',
    recommendedProduct: {
      id: 7,
      name: 'Quạt hút thông gió gắn trần AirVent 200',
      sku: 'GF-QH01',
      price: 580000,
      originalPrice: 650000,
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      tag: 'Chuẩn Kháng Ẩm & Khử Mùi',
      specs: [
        'Lưu lượng hút cực mạnh 240 m³/giờ',
        'Van ngăn mùi chảy ngược và côn trùng',
        'Vận hành êm ái dưới 38dB',
        'Kích thước khoét trần 250x250mm tiêu chuẩn'
      ]
    }
  }
]

function RoomCoolingMatcher() {
  const [activeTabId, setActiveTabId] = useState('bedroom')
  const currentRoom = rooms.find((r) => r.id === activeTabId) || rooms[0]
  const prod = currentRoom.recommendedProduct

  const formatPrice = (p) => `${Number(p).toLocaleString('vi-VN')} ₫`

  return (
    <section className="room-matcher-section">
      <div className="landing-container">
        <div className="matcher-header">
          <span className="section-eyebrow">TƯ VẤN CHUYÊN SÂU</span>
          <h2 className="section-title">Chọn Giải Pháp Cho Từng Không Gian</h2>
          <p className="matcher-subtitle">
            Mỗi căn phòng có diện tích và nhu cầu luồng gió khác biệt. Hãy chọn không gian của bạn để GoFan gợi ý chiếc quạt hoàn hảo nhất.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="matcher-tabs-nav" role="tablist">
          {rooms.map((room) => {
            const Icon = room.icon
            const isActive = room.id === activeTabId
            return (
              <button
                key={room.id}
                role="tab"
                aria-selected={isActive}
                className={`matcher-tab-btn ${isActive ? 'matcher-tab-active' : ''}`}
                onClick={() => setActiveTabId(room.id)}
              >
                <span className="matcher-tab-icon"><Icon size={20} /></span>
                <span className="matcher-tab-text">
                  <strong>{room.label}</strong>
                  <small>{room.size}</small>
                </span>
              </button>
            )
          })}
        </div>

        {/* Matcher Content Display */}
        <div className="matcher-display-card">
          <div className="matcher-details-col">
            <span className="matcher-rec-tag">
              <Sparkles size={14} />
              {prod.tag}
            </span>
            <h3 className="matcher-room-title">{currentRoom.title}</h3>
            <p className="matcher-room-desc">{currentRoom.description}</p>

            <div className="matcher-product-info-box">
              <span className="matcher-product-sku">Mã: {prod.sku}</span>
              <h4 className="matcher-product-name">{prod.name}</h4>
              <div className="matcher-price-wrap">
                <span className="matcher-price-main">{formatPrice(prod.price)}</span>
                {prod.originalPrice > prod.price && (
                  <span className="matcher-price-old">{formatPrice(prod.originalPrice)}</span>
                )}
              </div>
            </div>

            <ul className="matcher-specs-list">
              {prod.specs.map((spec, i) => (
                <li key={i}>
                  <Check size={16} className="spec-check-icon" />
                  <span>{spec}</span>
                </li>
              ))}
            </ul>

            <div className="matcher-actions-row">
              <Link to={`/products/${prod.id}`} className="matcher-view-detail-btn">
                <span>Xem chi tiết & Đặt mua</span>
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>

          <div className="matcher-image-col">
            <div className="matcher-img-frame">
              <img
                src={prod.image}
                alt={prod.name}
                className="matcher-img"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RoomCoolingMatcher
