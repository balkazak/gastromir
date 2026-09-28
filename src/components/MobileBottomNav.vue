<template>
  <div class="mobile-bottom-nav">
    <router-link to="/catalog" class="nav-item" :class="{ active: route.path.startsWith('/catalog') }">
      <Package :size="20" />
      <span>Каталог</span>
    </router-link>

    <button class="nav-item" @click="handleSearchClick">
      <Search :size="20" />
      <span>Поиск</span>
    </button>

    <button class="nav-item cart-btn" @click="handleCartClick">
      <div class="icon-wrap">
        <ShoppingCart :size="20" />
        <span v-if="cartStore.totalItems > 0" class="badge-count">{{ cartStore.totalItems }}</span>
      </div>
      <span>Корзина</span>
    </button>

    <a 
      :href="whatsappUrl" 
      target="_blank" 
      rel="noopener noreferrer" 
      class="nav-item whatsapp-item"
      @click="handleWhatsAppClick"
    >
      <MessageCircle :size="20" />
      <span>WhatsApp</span>
    </a>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Package, Search, ShoppingCart, MessageCircle } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cart'
import { trackWhatsAppClick } from '@/utils/analytics'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const whatsappUrl = computed(() => {
  const msg = encodeURIComponent('Здравствуйте! Хочу сделать заказ продуктов для заведения в GASTROMIR.')
  return `https://wa.me/77015141404?text=${msg}`
})

const handleSearchClick = () => {
  if (route.path !== '/catalog') {
    router.push({ path: '/catalog', query: { focusSearch: 'true' } })
  } else {
    const input = document.querySelector('.search-bar input')
    if (input) {
      input.focus()
      input.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
}

const handleCartClick = () => {
  cartStore.openModal()
}

const handleWhatsAppClick = () => {
  trackWhatsAppClick('mobile_bottom_nav')
}
</script>

<style scoped>
.mobile-bottom-nav {
  display: none;
}

@media (max-width: 768px) {
  .mobile-bottom-nav {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: #0B1221;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(16px);
    z-index: 990;
    justify-content: space-around;
    align-items: center;
    padding: 0 0.5rem;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.35);
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    color: #94A3B8;
    font-size: 0.72rem;
    font-weight: 500;
    flex: 1;
    padding: 6px 0;
    background: none;
    border: none;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .nav-item.active,
  .nav-item:hover {
    color: #F59E0B;
  }

  .icon-wrap {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .badge-count {
    position: absolute;
    top: -6px;
    right: -10px;
    background: #F59E0B;
    color: #0B1221;
    font-size: 0.65rem;
    font-weight: 800;
    padding: 1px 5px;
    border-radius: 9999px;
    min-width: 16px;
    text-align: center;
  }

  .whatsapp-item {
    color: #25D366;
  }
}
</style>
