import { useEffect, useState } from 'react'
import { ArrowRight, ArrowUpRight, BatteryCharging, Blinds, Fan, LampCeiling, Layers, Wind } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getCategories } from '../../services/categoryService'
import './CategorySection.css'

const categoryVisuals = [
  { icon: Fan, tone: 'sky', tagline: 'Động cơ DC êm ái cho phòng khách & phòng ngủ' },
  { icon: LampCeiling, tone: 'amber', tagline: 'Tích hợp đèn LED 3 chế độ màu Bắc Âu' },
  { icon: Blinds, tone: 'emerald', tagline: 'Tiết kiệm không gian, góc xoay rộng 180°' },
  { icon: BatteryCharging, tone: 'indigo', tagline: 'Pin dung lượng cao, cổng sạc Type-C' },
  { icon: Wind, tone: 'cyan', tagline: 'Hút mùi, chống ẩm và thông khí 24/7' },
  { icon: Layers, tone: 'rose', tagline: 'Remote đa năng, lưới bảo vệ an toàn' },
]

function CategorySection() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    getCategories()
      .then((data) => {
        setCategories(data)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  return (
    <section className="category-section" id="categories">
      <div className="landing-container">
        <div className="section-header-row">
          <div>
            <span className="section-eyebrow">KHÔNG GIAN LÀM MÁT</span>
            <h2 className="section-title">Danh Mục Sản Phẩm Chính Hãng</h2>
          </div>
          <Link to="/products" className="section-see-all-link">
            <span>Xem tất cả danh mục</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="category-grid">
          {categories.map((category, index) => {
            const visual = categoryVisuals[index % categoryVisuals.length]
            const Icon = visual.icon

            return (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className={`cat-card cat-tone-${visual.tone}`}
              >
                <div className="cat-card-header">
                  <span className="cat-card-icon-box">
                    <Icon size={24} />
                  </span>
                  <span className="cat-card-idx">0{index + 1}</span>
                </div>

                <div className="cat-card-body">
                  <h3 className="cat-card-name">{category.name}</h3>
                  <p className="cat-card-tagline">{category.description || visual.tagline}</p>
                </div>

                <div className="cat-card-footer">
                  <span className="cat-explore-text">Khám phá mẫu</span>
                  <span className="cat-card-arrow-circle">
                    <ArrowUpRight size={16} />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default CategorySection