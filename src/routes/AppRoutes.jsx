import { Routes, Route } from 'react-router-dom'
import CustomerLayout from '../layouts/CustomerLayout'

import Home from '../pages/Home'
import Products from '../pages/Products'
import ProductDetail from '../pages/ProductDetail'
import Cart from '../pages/Cart'
import Favorites from '../pages/Favorites'
import Login from '../pages/Login'
import Checkout from '../pages/Checkout'

function AppRoutes() {
  return (
    <CustomerLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </CustomerLayout>
  )
}

export default AppRoutes