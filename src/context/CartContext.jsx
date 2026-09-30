import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext()
const FAVORITES_STORAGE_KEY = 'gofan-favorites'

function getSavedFavorites() {
  try {
    const savedFavorites = JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) || '[]')
    return Array.isArray(savedFavorites) ? savedFavorites : []
  } catch (error) {
    console.error('Không thể đọc danh sách yêu thích đã lưu.', error)
    return []
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [favoriteItems, setFavoriteItems] = useState(getSavedFavorites)

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteItems))
    } catch (error) {
      console.error('Không thể lưu danh sách yêu thích.', error)
    }
  }, [favoriteItems])

  const addToCart = (product) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.id === product.id
      )

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      }

      return [
        ...currentItems,
        {
          ...product,
          quantity: 1,
        },
      ]
    })
  }

  const increaseQuantity = (productId) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    )
  }

  const decreaseQuantity = (productId) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const removeFromCart = (productId) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId)
    )
  }

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
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
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

export function useCart() {
  return useContext(CartContext)
}