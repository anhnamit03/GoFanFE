import { RotateCw, ShieldCheck, VolumeX, Zap } from 'lucide-react'
import './FeaturesBar.css'

const features = [
  {
    icon: VolumeX,
    title: 'Động Cơ DC Siêu Êm Ái',
    subtitle: 'Vận hành tĩnh lặng < 28dB, bảo vệ giấc ngủ gia đình trọn vẹn.',
    badge: 'Siêu Tĩnh Lặng',
  },
  {
    icon: Zap,
    title: 'Tiết Kiệm Điện Đến 70%',
    subtitle: 'Tối ưu hóa năng lượng tiêu chuẩn 5 sao xanh châu Âu.',
    badge: 'ECO Inverter',
  },
  {
    icon: RotateCw,
    title: 'Điều Khiển Thông Minh 360°',
    subtitle: 'Góc đảo gió đa chiều, remote khoảng cách 15m tiện dụng.',
    badge: 'Lưu Thông 3D',
  },
  {
    icon: ShieldCheck,
    title: 'Bảo Hành Chính Hãng 24T',
    subtitle: '1 đổi 1 trong 30 ngày nếu có lỗi từ nhà sản xuất.',
    badge: 'Chính Hãng 100%',
  },
]

function FeaturesBar() {
  return (
    <section className="features-bar-section">
      <div className="landing-container">
        <div className="features-bar-grid">
          {features.map((item, index) => {
            const Icon = item.icon
            return (
              <div key={index} className="feature-pillar-card">
                <div className="feature-pillar-top">
                  <div className="feature-pillar-icon-box">
                    <Icon size={24} />
                  </div>
                  <span className="feature-pillar-badge">{item.badge}</span>
                </div>
                <h3 className="feature-pillar-title">{item.title}</h3>
                <p className="feature-pillar-sub">{item.subtitle}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FeaturesBar
