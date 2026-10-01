import { useEffect, useRef, useState } from 'react'
import { useAuth } from './useAuth'
import CartContext from './cartContextValue'
import {
  addToCartApi,
  clearCartApi,
  getCartApi,
  removeCartItemApi,
  syncCartApi,
  updateCartItemQuantityApi,
} from '../services/cartService'

const CART_STORAGE_KEY = 'gofan-cart'
const FAVORITES_STORAGE_KEY = 'gofan-favorites'

function getSavedCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]')
    return Array.isArray(saved) ? saved : []
  } catch (error) {
    console.error('Không thể đọc giỏ hàng từ localStorage:', error)
    return []
  }
}

function getSavedFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) || '[]')
    return Array.isArray(saved) ? saved : []
  } catch (error) {
    console.error('Không thể đọc danh sách yêu thích:', error)
    return []
  }
}

export function CartProvider({ children }) {
  const { token } = useAuth()
  const [cartItems, setCartItems] = useState(getSavedCart)
  const [favoriteItems, setFavoriteItems] = useState(getSavedFavorites)
  const [isCartLoading, setIsCartLoading] = useState(false)
  const previousTokenRef = useRef(token)

  // Lưu favorites vào localStorage khi thay đổi
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteItems))
    } catch (error) {
      console.error('Không thể lưu danh sách yêu thích:', error)
    }
  }, [favoriteItems])

  // Lưu cartItems vào localStorage khi thay đổi (cho guest hoặc làm offline cache)
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
    } catch (error) {
      console.error('Không thể lưu giỏ hàng:', error)
    }
  }, [cartItems])

  // Đồng bộ giỏ hàng với server khi đăng nhập hoặc khởi động có token
  useEffect(() => {
    const prevToken = previousTokenRef.current
    previousTokenRef.current = token

    // Trường hợp Đăng xuất: clear giỏ hàng
    if (prevToken && !token) {
      setCartItems([])
      localStorage.removeItem(CART_STORAGE_KEY)
      return
    }

    // Trường hợp Có Token (vừa đăng nhập hoặc reload có token sẵn)
    if (token) {
      let isMounted = true
      const localItems = getSavedCart()

      // Nếu có sản phẩm local trước đó (ví dụ khách chọn hàng trước khi đăng nhập)
      if (localItems.length > 0) {
        syncCartApi(token, localItems)
          .then((serverCart) => {
            if (isMounted) {
              setCartItems(serverCart.items)
            }
          })
          .catch((err) => {
            console.warn('Lỗi khi đồng bộ giỏ hàng lên server:', err)
            getCartApi(token)
              .then((serverCart) => {
                if (isMounted) setCartItems(serverCart.items)
              })
              .catch((e) => console.error('Không thể tải giỏ hàng từ server:', e))
          })
          .finally(() => {
            if (isMounted) setIsCartLoading(false)
          })
      } else {
        // Chưa có giỏ local, tải giỏ hàng đã lưu trên Database của user
        getCartApi(token)
          .then((serverCart) => {
            if (isMounted) {
              setCartItems(serverCart.items)
            }
          })
          .catch((err) => {
            console.error('Không thể tải giỏ hàng từ server:', err)
          })
          .finally(() => {
            if (isMounted) setIsCartLoading(false)
          })
      }

      return () => {
        isMounted = false
      }
    }
  }, [token])

  // Thêm vào giỏ hàng
  const addToCart = async (product, quantity = 1) => {
    const addOnProductIds = Array.isArray(product.relatedProducts)
      ? product.relatedProducts.map((r) => r.addOnProductId || r.id).filter(Boolean)
      : []

    if (token) {
      try {
        const updatedCart = await addToCartApi(token, {
          productId: product.id,
          quantity,
          addOnProductIds,
        })
        setCartItems(updatedCart.items)
        return
      } catch (error) {
        console.error('Không thể thêm sản phẩm lên server:', error)
      }
    }

    // Fallback hoặc Guest (chưa đăng nhập)
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id)

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                relatedProducts: product.relatedProducts ?? item.relatedProducts,
                quantity: item.quantity + quantity,
              }
            : item
        )
      }

      return [
        ...currentItems,
        {
          ...product,
          quantity,
        },
      ]
    })
  }

  // Tăng số lượng
  const increaseQuantity = async (productId) => {
    const item = cartItems.find((i) => i.id === productId)

    if (token && item?.cartItemId) {
      try {
        const updatedCart = await updateCartItemQuantityApi(
          token,
          item.cartItemId,
          item.quantity + 1
        )
        setCartItems(updatedCart.items)
        return
      } catch (error) {
        console.error('Lỗi khi tăng số lượng trên server:', error)
      }
    }

    // Fallback hoặc Guest
    setCartItems((currentItems) =>
      currentItems.map((curr) =>
        curr.id === productId
          ? {
              ...curr,
              quantity: curr.quantity + 1,
            }
          : curr
      )
    )
  }

  // Giảm số lượng
  const decreaseQuantity = async (productId) => {
    const item = cartItems.find((i) => i.id === productId)
    if (!item) return

    if (token && item.cartItemId) {
      try {
        if (item.quantity <= 1) {
          const updatedCart = await removeCartItemApi(token, item.cartItemId)
          setCartItems(updatedCart.items)
        } else {
          const updatedCart = await updateCartItemQuantityApi(
            token,
            item.cartItemId,
            item.quantity - 1
          )
          setCartItems(updatedCart.items)
        }
        return
      } catch (error) {
        console.error('Lỗi khi giảm số lượng trên server:', error)
      }
    }

    // Fallback hoặc Guest
    setCartItems((currentItems) =>
      currentItems
        .map((curr) =>
          curr.id === productId
            ? {
                ...curr,
                quantity: curr.quantity - 1,
              }
            : curr
        )
        .filter((curr) => curr.quantity > 0)
    )
  }

  // Xóa khỏi giỏ hàng
  const removeFromCart = async (productId) => {
    const item = cartItems.find((i) => i.id === productId)

    if (token && item?.cartItemId) {
      try {
        const updatedCart = await removeCartItemApi(token, item.cartItemId)
        setCartItems(updatedCart.items)
        return
      } catch (error) {
        console.error('Lỗi khi xóa sản phẩm trên server:', error)
      }
    }

    // Fallback hoặc Guest
    setCartItems((currentItems) =>
      currentItems.filter((curr) => curr.id !== productId)
    )
  }

  // Xóa toàn bộ giỏ hàng
  const clearCart = async () => {
    if (token) {
      try {
        await clearCartApi(token)
      } catch (error) {
        console.error('Lỗi khi xóa sạch giỏ hàng trên server:', error)
      }
    }
    setCartItems([])
    localStorage.removeItem(CART_STORAGE_KEY)
  }

  // Favorites
  const toggleFavorite = (product) => {
    setFavoriteItems((currentItems) => {
      if (currentItems.some((item) => item.id === product.id)) {
        return currentItems.filter((item) => item.id !== product.id)
      }

      return [...currentItems, product]
    })
  }

  const removeFavorite = (productId) => {
    setFavoriteItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId)
    )
  }

  const isFavorite = (productId) =>
    favoriteItems.some((item) => item.id === productId)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartLoading,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        favoriteItems,
        toggleFavorite,
        removeFavorite,
        isFavorite,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}