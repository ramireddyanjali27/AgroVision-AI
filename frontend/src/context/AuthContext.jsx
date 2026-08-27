import { createContext, useContext, useState, useCallback } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('agrovision_user'))
    } catch {
      return null
    }
  })

  const [loading, setLoading] = useState(false)

  const setSession = useCallback((data) => {
    localStorage.setItem('agrovision_token', data.token)
    localStorage.setItem(
      'agrovision_user',
      JSON.stringify({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      })
    )
    setUser({ id: data.id, name: data.name, email: data.email, role: data.role })
  }, [])

  const login = useCallback(
    async (credentials) => {
      setLoading(true)
      try {
        const data = await authService.login(credentials)
        setSession(data)
        return data
      } finally {
        setLoading(false)
      }
    },
    [setSession]
  )

  const register = useCallback(
    async (payload) => {
      setLoading(true)
      try {
        const data = await authService.register(payload)
        setSession(data)
        return data
      } finally {
        setLoading(false)
      }
    },
    [setSession]
  )

  const logout = useCallback(() => {
    localStorage.removeItem('agrovision_token')
    localStorage.removeItem('agrovision_user')
    setUser(null)
  }, [])

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
