<template>
  <div class="app-wrapper">
    <Navbar v-if="route.name !== 'register' && route.name !== 'login'" />
    
    <main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <Footer v-if="route.name !== 'register' && route.name !== 'login'" />
    <CartModal />
    <ToastContainer />
    
    <!-- Floating WhatsApp Button -->
    <a 
      v-if="route.name !== 'register' && route.name !== 'login'"
      href="https://wa.me/77015141404?text=Здравствуйте!%20Хочу%20подключить%20ресторан%20к%20GASTROMIR." 
      class="whatsapp-float"
      target="_blank"
      v-motion-pop
    >
      <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" />
    </a>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import CartModal from './components/CartModal.vue'
import ToastContainer from './components/ToastContainer.vue'
import { ShoppingCart } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cart'
import { useRoute } from 'vue-router'

const cartStore = useCartStore()
const route = useRoute()
</script>

<style>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

.whatsapp-float {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  background-color: #25D366;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  z-index: 1000;
  transition: transform 0.3s ease;
}

.whatsapp-float:hover {
  transform: scale(1.1);
}

.whatsapp-float img {
  width: 35px;
  height: 35px;
}

.cart-float {
  position: fixed;
  bottom: 2rem;
  right: 8rem; /* Moved to right, next to WhatsApp */
  width: 60px;
  height: 60px;
  background-color: var(--secondary);
  color: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  z-index: 1000;
  transition: transform 0.3s ease;
  border: none;
  cursor: pointer;
}

.cart-float:hover {
  transform: scale(1.1);
}

.cart-float .badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: var(--accent);
  color: var(--white);
  font-size: 0.8rem;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}
</style>
