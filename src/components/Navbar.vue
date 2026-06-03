<template>
  <nav :class="{ 'scrolled': isScrolled }">
    <div class="nav-container nav-content">
      <router-link to="/" class="logo">
        <img src="@/assets/logo.png" alt="GASTROMIR Logo" class="logo-img" />
      </router-link>

      <div class="nav-links" :class="{ 'active': isMobileMenuOpen }">
        <router-link to="/restaurant-order" class="blink-link" @click="isMobileMenuOpen = false">
          <Zap class="zap-icon" :size="16" />Заказ в <span class="blink-text">1 клик</span>
        </router-link>
        <router-link to="/catalog" @click="isMobileMenuOpen = false">Каталог</router-link>
        <router-link to="/process" @click="isMobileMenuOpen = false">Как это работает</router-link>
        <router-link to="/about" @click="isMobileMenuOpen = false">О нас</router-link>
        <router-link to="/social-mission" @click="isMobileMenuOpen = false">Соц инициатива «Мейірім Тарелкесі»</router-link>
        <router-link to="/contacts" @click="isMobileMenuOpen = false">Контакты</router-link>
        
        <template v-if="authStore.isAuthenticated">
          <div class="user-profile-menu">
            <router-link v-if="authStore.user.role === 'admin'" to="/admin" class="admin-link" @click="isMobileMenuOpen = false">
              Админ панель
            </router-link>
            <router-link v-else to="/profile" class="user-name" @click="isMobileMenuOpen = false">
              <User class="user-icon" />
              Личный кабинет
            </router-link>
            <button @click="handleLogout" class="btn-logout" title="Выйти">
              <LogOut class="logout-icon" />
            </button>
          </div>
        </template>
        <template v-else>
          <router-link to="/login" class="btn btn-secondary nav-cta login-btn" @click="isMobileMenuOpen = false">
            Войти
          </router-link>
          <router-link to="/register" class="btn btn-primary nav-cta" @click="isMobileMenuOpen = false">
            Подключиться
          </router-link>
        </template>
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
import { Menu, X, ShoppingCart, User, LogOut, Zap } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
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
  padding: 1.2rem 0;
  transition: var(--transition);
  background: rgba(11, 13, 25, 0.05); /* Semi-transparent matching logo color */
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

nav.scrolled {
  padding: 0.9rem 0;
  background: #0B0D19; /* Solid logo background color */
  backdrop-filter: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
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
  text-align: center;
  white-space: nowrap;
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

  .nav-links a:not(.btn) {
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
    margin-top: 0.5rem;
    box-sizing: border-box;
  }
  
  .login-btn {
    margin-right: 0 !important;
    margin-bottom: 0.5rem;
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

/* User profile styling in navbar */
.user-profile-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.admin-link {
  color: var(--secondary);
  font-weight: 700;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.admin-link:hover {
  filter: brightness(1.2);
}

.user-name {
  color: var(--white);
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.user-icon {
  width: 18px;
  height: 18px;
  color: var(--secondary);
}

.btn-logout {
  color: var(--gray);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
}

.btn-logout:hover {
  color: #ef4444;
  transform: scale(1.1);
}

.logout-icon {
  width: 18px;
  height: 18px;
}

.login-btn {
  margin-right: 0.5rem;
}

@media (max-width: 768px) {
  .user-profile-menu {
    width: 100%;
    margin-top: 1rem;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    gap: 0.75rem;
  }
  .user-name {
    font-size: 0.8rem;
  }
  .admin-link {
    font-size: 0.8rem;
  }
}

.blink-link {
  font-weight: 700 !important;
  color: var(--secondary) !important;
  display: inline-flex !important;
  align-items: center;
  gap: 0.35rem;
  opacity: 1 !important;
  white-space: nowrap;
}

.blink-text {
  display: inline-block;
  animation: glow-pulse 1.5s infinite ease-in-out;
  font-weight: 800;
  padding: 0 2px;
}

.zap-icon {
  animation: pulse-zap 1.5s infinite ease-in-out;
  color: var(--secondary);
}

@keyframes glow-pulse {
  0% {
    color: var(--secondary);
    text-shadow: 0 0 4px rgba(245, 158, 11, 0.4);
  }
  50% {
    color: #fbbf24;
    text-shadow: 0 0 12px rgba(245, 158, 11, 0.8), 0 0 20px rgba(245, 158, 11, 0.4);
    transform: scale(1.05);
  }
  100% {
    color: var(--secondary);
    text-shadow: 0 0 4px rgba(245, 158, 11, 0.4);
  }
}

@keyframes pulse-zap {
  0%, 100% {
    transform: scale(1);
    opacity: 0.85;
  }
  50% {
    transform: scale(1.2) rotate(15deg);
    color: #fbbf24;
    opacity: 1;
  }
}

.nav-container {
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  padding: 0 2rem;
}

@media (max-width: 1200px) {
  .nav-links {
    gap: 1rem;
  }
}
</style>
