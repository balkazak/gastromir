import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('gastromir_token') || null)
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  // Helper for requests
  const getHeaders = () => {
    const headers = { 'Content-Type': 'application/json' }
    if (token.value) {
      headers['Authorization'] = `Bearer ${token.value}`
    }
    return headers
  }

  // Register
  const register = async (name, email, password, phone, address) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name, email, password, phone, address })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Ошибка регистрации')
      }

      token.value = data.token
      user.value = data.user
      localStorage.setItem('gastromir_token', data.token)
      return true
    } catch (err) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  // Login
  const login = async (email, password) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Ошибка входа')
      }

      token.value = data.token
      user.value = data.user
      localStorage.setItem('gastromir_token', data.token)
      return true
    } catch (err) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  // Fetch Current User Profile
  const fetchUser = async () => {
    if (!token.value) return false
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${apiUrl}/api/auth/me`, {
        method: 'GET',
        headers: getHeaders()
      })

      const data = await response.json()
      if (!response.ok) {
        // Token might be invalid/expired
        logout()
        return false
      }

      user.value = data.user
      return true
    } catch (err) {
      error.value = err.message
      logout()
      return false
    } finally {
      loading.value = false
    }
  }

  // Logout
  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('gastromir_token')
  }

  // Update Profile (Phone, Address, Password)
  const updateProfile = async (phone, address, password) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${apiUrl}/api/auth/profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ phone, address, password })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Ошибка обновления профиля')
      }

      user.value = data.user
      return true
    } catch (err) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    register,
    login,
    fetchUser,
    logout,
    updateProfile
  }
})
