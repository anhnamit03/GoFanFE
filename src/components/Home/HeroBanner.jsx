import './HeroBanner.css'

function HeroBanner() {
  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-subtitle">
          Chào mừng đến với GoFan
        </p>

        <h1 className="hero-title">
          Mua sắm dễ dàng,
          <br />
          sản phẩm chất lượng
        </h1>

        <p className="hero-description">
          Khám phá các sản phẩm và ưu đãi mới nhất tại GoFan.
        </p>

        <button className="hero-button">
          Khám phá sản phẩm
        </button>
      </div>
    </section>
  )
}

export default HeroBanner