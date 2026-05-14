import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

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
    return items.value.some(item => item.unit === 'кг')
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

  const removeItem = (id) => {
    items.value = items.value.filter(i => i.id !== id)
  }

  const clearCart = () => {
    items.value = []
  }

  const toggleModal = () => {
    isModalOpen.value = !isModalOpen.value
  }

  const openModal = () => {
    isModalOpen.value = true
  }

  const closeModal = () => {
    isModalOpen.value = false
  }

  return {
    items,
    isModalOpen,
    totalItems,
    totalPrice,
    hasWeightItems,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    toggleModal,
    openModal,
    closeModal
  }
})
