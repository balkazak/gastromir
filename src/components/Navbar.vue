<template>
  <nav :class="{ 'scrolled': isScrolled }">
    <div class="container nav-content">
      <router-link to="/" class="logo">
        <img src="@/assets/logo.png" alt="GASTROMIR Logo" class="logo-img" />
      </router-link>

      <div class="nav-links" :class="{ 'active': isMobileMenuOpen }">
        <router-link to="/" @click="isMobileMenuOpen = false">Главная</router-link>
        <router-link to="/catalog" @click="isMobileMenuOpen = false">Каталог</router-link>
        <router-link to="/process" @click="isMobileMenuOpen = false">Как это работает</router-link>
        <router-link to="/about" @click="isMobileMenuOpen = false">О нас</router-link>
        <router-link to="/contacts" @click="isMobileMenuOpen = false">Контакты</router-link>
        
        <button class="cart-trigger" @click="() => { cartStore.openModal(); isMobileMenuOpen = false; }">
          <ShoppingCart />
          <span v-if="cartStore.totalItems > 0" class="badge">{{ cartStore.totalItems }}</span>
        </button>

        <router-link to="/contacts" class="btn btn-primary nav-cta" @click="isMobileMenuOpen = false">
          Подключиться
        </router-link>
      </div>

      <button class="mobile-toggle" @click="isMobileMenuOpen = !isMobileMenuOpen">
        <Menu v-if="!isMobileMenuOpen" />
        <X v-else />
      </button>
    </div>
  </nav>
  <div v-if="isMobileMenuOpen" class="mobile-menu-overlay" @click="isMobileMenuOpen = false"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Menu, X, ShoppingCart } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  padding: 1.5rem 0;
  transition: var(--transition);
}

nav.scrolled {
  padding: 1rem 0;
  background: var(--glass);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-img {
  height: 70px;
  width: auto;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-links a {
  font-weight: 500;
  color: var(--white);
  font-size: 0.95rem;
  opacity: 0.8;
}

.nav-links a:hover {
  color: var(--secondary);
  opacity: 1;
}

.nav-links a.router-link-active:not(.btn) {
  color: var(--secondary);
  font-weight: 700;
  opacity: 1;
}

.cart-trigger {
  position: relative;
  color: var(--white);
  padding: 0.5rem;
  display: flex;
  align-items: center;
  margin: 0 1rem;
}

.cart-trigger .badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: var(--secondary);
  color: var(--white);
  font-size: 0.7rem;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
}

.mobile-toggle {
  display: none;
  color: var(--white);
}

@media (max-width: 768px) {
  nav { padding: 1rem 0; background: var(--glass); }
  
  .logo-img {
    height: 55px;
  }
  
  .mobile-toggle {
    display: block;
    background: none;
    border: none;
    color: var(--white);
    cursor: pointer;
    z-index: 1001;
  }

  .nav-links {
    position: fixed;
    top: 0;
    right: -100%;
    width: 280px;
    height: 100vh;
    background: var(--primary);
    flex-direction: column;
    justify-content: flex-start;
    padding: 6rem 2rem 2rem 2rem;
    transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 999;
    gap: 1.25rem;
    box-shadow: -5px 0 25px rgba(0, 0, 0, 0.3);
  }

  .nav-links.active {
    right: 0;
  }

  .nav-links a {
    font-size: 1.1rem;
    color: var(--white);
    opacity: 0.9;
    display: block;
    width: 100%;
    text-align: left;
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .cart-trigger {
    margin: 1rem 0;
    transform: scale(1.1);
    align-self: flex-start;
  }

  .nav-cta {
    width: 100%;
    text-align: center;
    padding: 0.75rem;
    font-size: 1rem;
    margin-top: 1rem;
  }
}

.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 998;
}
</style>
