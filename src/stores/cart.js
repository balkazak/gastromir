import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const isWeightProduct = (product) => {
  if (!product) return false
  if (product.unit === 'кг') return true
  
  const name = product.name.toLowerCase()
  // Check if name has weight patterns: e.g. "0,25кг", "125гр", "250гр", "(вес)", etc.
  const weightRegex = /\b\d+([.,]\d+)?\s*(кг|гр|грамм|г\b)/
  const hasWeightWord = name.includes('вес') || name.includes('гр.') || name.includes('гр ') || name.includes('кг.')
  
  return weightRegex.test(name) || hasWeightWord
}

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const isModalOpen = ref(false)

  // Load from localStorage
  const storedCart = localStorage.getItem('gastromir_cart')
  if (storedCart) {
    items.value = JSON.parse(storedCart)
  }

  // Watch for changes and save to localStorage
  watch(items, (newItems) => {
    localStorage.setItem('gastromir_cart', JSON.stringify(newItems))
  }, { deep: true })

  const totalItems = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  })

  const hasWeightItems = computed(() => {
    return items.value.some(item => isWeightProduct(item))
  })

  const hasFreshItems = computed(() => {
    const freshCategories = ['Овощи', 'Зелень', 'Салаты', 'Фрукты']
    return items.value.some(item => freshCategories.includes(item.category))
  })

  const addItem = (product) => {
    const existing = items.value.find(i => i.id === product.id)
    if (existing) {
      existing.quantity += 1
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
  }

  const updateQuantity = (id, delta) => {
    const item = items.value.find(i => i.id === id)
    if (item) {
      item.quantity += delta
      if (item.quantity <= 0) {
        items.value = items.value.filter(i => i.id !== id)
      }
    }
  }

  const setQuantity = (id, val) => {
    const item = items.value.find(i => i.id === id)
    if (item) {
      item.quantity = val
      if (item.quantity <= 0) {
        items.value = items.value.filter(i => i.id !== id)
      }
    }
  }

  const removeItem = (id) => {
    items.value = items.value.filter(i => i.id !== id)
  }

  const clearCart = () => {
    items.value = []
  }

  const isFastOrderOpen = ref(false)

  const toggleModal = () => {
    isModalOpen.value = !isModalOpen.value
  }

  const openModal = () => {
    isModalOpen.value = true
  }

  const closeModal = () => {
    isModalOpen.value = false
  }

  const toggleFastOrder = () => {
    isFastOrderOpen.value = !isFastOrderOpen.value
  }

  const openFastOrder = () => {
    isFastOrderOpen.value = true
  }

  const closeFastOrder = () => {
    isFastOrderOpen.value = false
  }

  return {
    items,
    isModalOpen,
    isFastOrderOpen,
    totalItems,
    totalPrice,
    hasWeightItems,
    hasFreshItems,
    addItem,
    updateQuantity,
    setQuantity,
    removeItem,
    clearCart,
    toggleModal,
    openModal,
    closeModal,
    toggleFastOrder,
    openFastOrder,
    closeFastOrder
  }
})
