import { createContext, useContext, useState, useEffect } from 'react'
import { getCurrentUser } from '../services/api'

// Create a context — like a global variable accessible anywhere
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (token) {
      // If token exists, fetch who the logged-in user is
      getCurrentUser()
        .then(res => setUser(res.data))
        .catch(() => {
          // Token expired or invalid — clear it
          localStorage.removeItem('token')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    window.location.href = '/login'
  }

  const isLoggedIn = !!token
  const isAdmin    = user?.role === 'ADMIN'
  const isReviewer = user?.role === 'REVIEWER' || user?.role === 'ADMIN'

  return (
    <AuthContext.Provider value={{
      user, loading, isLoggedIn, isAdmin, isReviewer, logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook — call this in any component to get auth info
export const useAuth = () => useContext(AuthContext)