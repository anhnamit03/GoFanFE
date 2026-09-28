import { useEffect, useState } from 'react'
import { getCategories } from '../../services/categoryService'
import './CategorySection.css'

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
    <section className="category-section">
      <div className="category-container">
        <div className="section-heading">
          <p>Danh mục</p>
          <h2>Khám phá danh mục</h2>
        </div>

        <div className="category-list">
          {categories.map((category) => (
            <div
              key={category.id}
              className="category-card"
            >
              {category.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategorySection