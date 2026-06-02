<template>
  <div class="toast-container">
    <TransitionGroup name="toast-list">
      <div 
        v-for="toast in toastStore.toasts" 
        :key="toast.id" 
        class="toast-item" 
        :class="toast.type"
      >
        <div class="toast-icon">
          <CheckCircle v-if="toast.type === 'success'" :size="20" />
          <AlertCircle v-else-if="toast.type === 'error'" :size="20" />
          <AlertTriangle v-else-if="toast.type === 'warning'" :size="20" />
          <Info v-else :size="20" />
        </div>
        <div class="toast-message">{{ toast.message }}</div>
        <button class="toast-close" @click="toastStore.remove(toast.id)" title="Закрыть">
          <X :size="16" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useToastStore } from '@/stores/toast'
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-vue-next'

const toastStore = useToastStore()
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  max-width: 380px;
  pointer-events: none;
}

.toast-item {
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: 1rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s cubic-bezier(0.68, -0.6, 0.32, 1.6);
  position: relative;
  overflow: hidden;
}

/* Glassmorphism theme per type */
.toast-item.success {
  background: rgba(240, 253, 244, 0.9);
  border-color: rgba(74, 222, 128, 0.4);
  color: #166534;
}
.toast-item.success .toast-icon {
  color: #22c55e;
}

.toast-item.error {
  background: rgba(254, 242, 242, 0.9);
  border-color: rgba(248, 113, 113, 0.4);
  color: #991b1b;
}
.toast-item.error .toast-icon {
  color: #ef4444;
}

.toast-item.warning {
  background: rgba(255, 251, 235, 0.9);
  border-color: rgba(251, 191, 36, 0.4);
  color: #92400e;
}
.toast-item.warning .toast-icon {
  color: #f59e0b;
}

.toast-item.info {
  background: rgba(240, 249, 255, 0.9);
  border-color: rgba(56, 189, 248, 0.4);
  color: #075985;
}
.toast-item.info .toast-icon {
  color: #0284c7;
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.1rem;
  flex-shrink: 0;
}

.toast-message {
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.4;
  flex: 1;
}

.toast-close {
  background: transparent;
  border: none;
  color: inherit;
  opacity: 0.5;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: opacity 0.2s;
  margin-top: 0.1rem;
}

.toast-close:hover {
  opacity: 1;
}

/* Animations using TransitionGroup */
.toast-list-enter-from {
  opacity: 0;
  transform: translateX(50px) scale(0.9);
}
.toast-list-leave-to {
  opacity: 0;
  transform: translateX(50px) scale(0.9);
}
.toast-list-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast-list-leave-active {
  transition: all 0.25s ease;
  position: absolute;
}
.toast-list-move {
  transition: transform 0.3s ease;
}

@media (max-width: 600px) {
  .toast-container {
    top: 1rem;
    right: 1rem;
    left: 1rem;
    width: auto;
    max-width: none;
  }
}
</style>
