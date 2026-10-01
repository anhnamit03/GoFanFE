import { useEffect, useState } from 'react'
import { getProfile, loginCustomer, registerCustomer } from '../services/authService'
import AuthContext from './authContextValue'

const AUTH_STORAGE_KEY = 'gofan-auth'
function getSavedAuth() {
  try {
    const savedAuth = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || 'null')
    return savedAuth?.token ? savedAuth : { token: '', user: null }
  } catch {
    return { token: '', user: null }
  }
}

export function AuthProvider({ children }) {
  const savedAuth = getSavedAuth()
  const [token, setToken] = useState(savedAuth.token)
  const [user, setUser] = useState(savedAuth.user)
  const [isLoading, setIsLoading] = useState(Boolean(savedAuth.token))

  useEffect(() => {
    if (!token) {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      return
    }

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token, user }))
  }, [token, user])

  useEffect(() => {
    if (!token) return undefined

    let isMounted = true
    getProfile(token)
      .then((profile) => {
        if (isMounted) setUser(profile)
      })
      .catch(() => {
        if (isMounted) {
          setToken('')
          setUser(null)
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [token])

  const login = async (credentials) => {
    const result = await loginCustomer(credentials)
    if (!result.token) throw new Error('Đăng nhập thành công nhưng máy chủ chưa trả về token.')
    setToken(result.token)
    setUser(result.user)
    return result
  }

  const register = async (credentials) => {
    const result = await registerCustomer(credentials)
    if (result.token) {
      setToken(result.token)
      setUser(result.user)
    }
    return result
  }

  const updateUser = (updatedProfile) => {
    setUser((prev) => ({ ...prev, ...updatedProfile }))
  }

  const logout = () => {
    setToken('')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, isLoading, isAuthenticated: Boolean(token), login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}
