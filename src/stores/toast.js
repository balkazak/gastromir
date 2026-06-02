import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([])

  const add = (message, type = 'info', timeout = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9)
    toasts.value.push({ id, message, type })

    setTimeout(() => {
      remove(id)
    }, timeout)
  }

  const success = (message, timeout) => add(message, 'success', timeout)
  const error = (message, timeout) => add(message, 'error', timeout)
  const warning = (message, timeout) => add(message, 'warning', timeout)
  const info = (message, timeout) => add(message, 'info', timeout)

  const remove = (id) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return {
    toasts,
    add,
    success,
    error,
    warning,
    info,
    remove
  }
})
