import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'

export const useProductsStore = defineStore('products', () => {
  const authStore = useAuthStore()
  const products = ref([])
  const loading = ref(false)
  const error = ref(null)

  const apiUrl = import.meta.env.VITE_API_URL || 'https://gastroback-production.up.railway.app'

  const fetchProducts = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${apiUrl}/api/products`)
      if (!response.ok) {
        throw new Error('Failed to load products')
      }
      const data = await response.json()
      products.value = data.map(p => ({
        ...p,
        price: parseFloat(p.price),
        is_in_stock: p.is_in_stock !== false,
        image_url: p.image_url || null,
        description: p.description || null
      }))
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const addProduct = async (productData) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${apiUrl}/api/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`
        },
        body: JSON.stringify(productData)
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add product')
      }
      products.value.push({
        ...data.product,
        price: parseFloat(data.product.price),
        is_in_stock: data.product.is_in_stock !== false,
        image_url: data.product.image_url || null,
        description: data.product.description || null
      })
      return true
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProduct = async (id, productData) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${apiUrl}/api/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`
        },
        body: JSON.stringify(productData)
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update product')
      }
      const updated = {
        ...data.product,
        price: parseFloat(data.product.price),
        is_in_stock: data.product.is_in_stock !== false,
        image_url: data.product.image_url || null,
        description: data.product.description || null
      }
      const index = products.value.findIndex(p => p.id === id)
      if (index !== -1) {
        products.value[index] = updated
      }
      return updated
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteProduct = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${apiUrl}/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete product')
      }
      products.value = products.value.filter(p => p.id !== id)
      return true
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetState = () => {
    products.value = []
    loading.value = false
    error.value = null
  }

  return {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    resetState
  }
})

