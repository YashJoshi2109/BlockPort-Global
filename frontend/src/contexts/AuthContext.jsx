import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add interceptor to add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        const response = await api.post('/auth/refresh', { refresh_token: refreshToken })
        const { access_token, refresh_token } = response.data

        localStorage.setItem('access_token', access_token)
        localStorage.setItem('refresh_token', refresh_token)

        originalRequest.headers.Authorization = `Bearer ${access_token}`
        return api(originalRequest)
      } catch (refreshError) {
        // If refresh fails, logout user
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email: email,
        password: password
      })

      const { access_token, refresh_token } = response.data
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)

      // Get user profile
      const userResponse = await api.get('/users/me')
      const userData = userResponse.data
      
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      setError('')
      return true
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message)
      setError(err.response?.data?.detail || 'Failed to login')
      return false
    }
  }

  const register = async (userData) => {
    try {
      if (userData.password !== userData.confirmPassword) {
        setError('Passwords do not match')
        return false
      }

      // Format the data according to backend expectations
      const registrationData = {
        email: userData.email,
        password: userData.password,
        confirm_password: userData.confirmPassword,
        full_name: userData.fullName,
        role: userData.role.toLowerCase() // Convert role to lowercase to match backend enum
      }

      console.log('Sending registration data:', registrationData)
      const response = await api.post('/auth/register', registrationData)
      console.log('Registration response:', response.data)
      
      // Auto login after registration
      const loginSuccess = await login(userData.email, userData.password)
      if (!loginSuccess) {
        setError('Registration successful but failed to log in automatically')
        return false
      }
      return true
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message)
      setError(err.response?.data?.detail || 'Failed to register')
      return false
    }
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
      setUser(null)
      setError('')
    }
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError: () => setError(''),
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 