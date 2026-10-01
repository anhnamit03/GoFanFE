import HeroBanner from '../components/Home/HeroBanner'
import FeaturesBar from '../components/Home/FeaturesBar'
import FlashDeals from '../components/Home/FlashDeals'
import CategorySection from '../components/Home/CategorySection'
import TechSpotlight from '../components/Home/TechSpotlight'
import ProductSection from '../components/Home/ProductSection'
import RoomCoolingMatcher from '../components/Home/RoomCoolingMatcher'
import TestimonialsSection from '../components/Home/TestimonialsSection'
import BrandGuarantee from '../components/Home/BrandGuarantee'

function Home() {
  return (
    <div className="home-page">
      <HeroBanner />
      <FeaturesBar />
      <FlashDeals />
      <CategorySection />
      <TechSpotlight />
      <ProductSection />
      <RoomCoolingMatcher />
      <TestimonialsSection />
      <BrandGuarantee />
    </div>
  )
}

export default Home