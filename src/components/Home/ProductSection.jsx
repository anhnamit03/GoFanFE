import ProductCard from '../Product/ProductCard'
import './ProductSection.css'

const products = [
  {
    id: 1,
    name: 'Áo thun Basic',
    price: 250000,
    image: 'https://placehold.co/600x600',
  },
  {
    id: 2,
    name: 'Áo sơ mi nam',
    price: 450000,
    image: 'https://placehold.co/600x600',
  },
  {
    id: 3,
    name: 'Quần jean',
    price: 550000,
    image: 'https://placehold.co/600x600',
  },
  {
    id: 4,
    name: 'Giày sneaker',
    price: 850000,
    image: 'https://placehold.co/600x600',
  },
]

function ProductSection() {
  return (
    <section className="product-section">
      <div className="product-container">

        <div className="section-heading">
          <p>Sản phẩm</p>
          <h2>Sản phẩm nổi bật</h2>
        </div>

        <div className="product-list">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>

      </div>
    </section>
  )
}

export default ProductSection