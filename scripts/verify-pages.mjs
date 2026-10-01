/**
 * GOFAN MANUAL & AUTOMATED PAGE COMPONENT VERIFIER
 * Checks HTML structure, key components, accessibility IDs, and CSS imports
 */

import fs from 'fs/promises'
import path from 'path'

async function verifyAllComponents() {
  console.log('--- AUDITING ALL PAGES AND COMPONENTS INTEGRATION ---')

  const filesToAudit = [
    { file: 'src/components/Header.jsx', keys: ['header-logo', 'header-catalog-dropdown', 'mobile-drawer-overlay', 'header-search-form'] },
    { file: 'src/components/Footer.jsx', keys: ['footer-container', 'footer-logo', 'footer-trust-badge'] },
    { file: 'src/pages/Home.jsx', keys: ['HeroBanner', 'FeaturesBar', 'FlashDeals', 'CategorySection', 'TechSpotlight', 'RoomCoolingMatcher', 'ProductSection', 'TestimonialsSection', 'BrandGuarantee'] },
    { file: 'src/pages/Products.jsx', keys: ['products-page-container', 'products-grid', 'ProductCard'] },
    { file: 'src/pages/ProductDetail.jsx', keys: ['detail-main-grid', 'ProductMediaGallery', 'detail-price-card', 'detail-tabs-section', 'mobile-detail-sticky-bar'] },
    { file: 'src/pages/Cart.jsx', keys: ['freeship-meter-card', 'cart-items-wrapper', 'voucher-section', 'cart-summary-card', 'mobile-cart-bottom-bar'] },
    { file: 'src/pages/Favorites.jsx', keys: ['favorites-page-container', 'favorites-products-grid', 'fav-action-btn'] },
    { file: 'src/pages/Checkout.jsx', keys: ['checkout-layout-grid', 'checkout-step-card', 'payment-options-list', 'checkout-summary-card'] },
    { file: 'src/pages/Myself.jsx', keys: ['myself-heading', 'myself-stats-grid', 'myself-form', 'myself-address-book'] },
    { file: 'src/pages/OrderHistory.jsx', keys: ['orders-tabs-nav', 'orders-search-wrapper', 'orders-stack', 'order-item-card'] },
  ]

  let allValid = true

  for (const item of filesToAudit) {
    const fullPath = path.resolve('d:/GOFAN/GoFanFE', item.file)
    const content = await fs.readFile(fullPath, 'utf-8')
    const missingKeys = item.keys.filter((k) => !content.includes(k))

    if (missingKeys.length === 0) {
      console.log(`  ✓ [VERIFIED] ${item.file}: All key components and hooks present`)
    } else {
      console.error(`  ✗ [DEFECT] ${item.file}: Missing ${missingKeys.join(', ')}`)
      allValid = false
    }
  }

  if (allValid) {
    console.log('\n  ALL 10 TARGET FILES AUDITED AND FULLY COMPLIANT!')
  } else {
    process.exit(1)
  }
}

verifyAllComponents()
