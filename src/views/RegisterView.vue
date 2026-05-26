<template>
  <div class="auth-page">
    <div class="auth-card" v-motion-slide-visible-once-bottom>
      <div class="brand-header">
        <router-link to="/">
          <img src="@/assets/logo.png" alt="GASTROMIR Logo" class="auth-logo" />
        </router-link>
        <h2>Регистрация в GASTROMIR</h2>
        <p>Создайте аккаунт, чтобы сохранять адреса и просматривать историю заказов</p>
      </div>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div v-if="errorMsg" class="error-banner">
          {{ errorMsg }}
        </div>
        <div v-else-if="authStore.error" class="error-banner">
          {{ authStore.error }}
        </div>

        <div class="form-group">
          <label for="name">Ваше имя / Компания</label>
          <div class="input-wrapper">
            <User class="input-icon" />
            <input 
              type="text" 
              id="name" 
              v-model="name" 
              placeholder="Иван Иванов" 
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label for="email">Электронная почта</label>
          <div class="input-wrapper">
            <Mail class="input-icon" />
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              placeholder="example@mail.com" 
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label for="password">Пароль</label>
          <div class="input-wrapper">
            <Lock class="input-icon" />
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              placeholder="••••••••" 
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Подтвердите пароль</label>
          <div class="input-wrapper">
            <Lock class="input-icon" />
            <input 
              type="password" 
              id="confirmPassword" 
              v-model="confirmPassword" 
              placeholder="••••••••" 
              required
            />
          </div>
        </div>

        <button type="submit" class="btn btn-secondary auth-btn" :disabled="authStore.loading">
          <span v-if="authStore.loading" class="spinner"></span>
          <span v-else>Зарегистрироваться</span>
        </button>

        <p class="auth-switch">
          Уже есть аккаунт? 
          <router-link to="/login">Войти</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { User, Mail, Lock } from 'lucide-vue-next'

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMsg = ref('')

const authStore = useAuthStore()
const router = useRouter()

const handleRegister = async () => {
  errorMsg.value = ''
  
  if (password.value !== confirmPassword.value) {
    errorMsg.value = 'Пароли не совпадают'
    return
  }

  if (password.value.length < 6) {
    errorMsg.value = 'Пароль должен содержать минимум 6 символов'
    return
  }

  const success = await authStore.register(name.value, email.value, password.value)
  if (success) {
    router.push('/')
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at 10% 20%, var(--primary-light) 0%, var(--primary) 90%);
  padding: 2rem;
  box-sizing: border-box;
}

.auth-card {
  width: 100%;
  max-width: 480px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.brand-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.auth-logo {
  height: 80px;
  margin-bottom: 1.5rem;
}

.brand-header h2 {
  color: var(--white);
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.brand-header p {
  color: var(--gray);
  font-size: 0.95rem;
  line-height: 1.5;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.error-banner {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 0.9rem;
  text-align: center;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: var(--white);
  font-size: 0.85rem;
  font-weight: 500;
  opacity: 0.9;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1.25rem;
  color: #94a3b8;
  width: 20px;
  height: 20px;
}

.input-wrapper input {
  width: 100%;
  padding: 0.85rem 1.25rem 0.85rem 3.25rem;
  background: var(--white);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 14px;
  color: var(--primary);
  font-size: 1rem;
  transition: var(--transition);
}

.input-wrapper input::placeholder {
  color: #94a3b8;
}

.input-wrapper input:focus {
  border-color: var(--secondary);
  background: var(--white);
  outline: none;
  box-shadow: 0 0 15px rgba(245, 158, 11, 0.25);
  color: var(--primary);
}

.auth-btn {
  width: 100%;
  padding: 0.9rem;
  font-size: 1.1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 14px;
  margin-top: 1rem;
}

.auth-switch {
  text-align: center;
  color: var(--gray);
  font-size: 0.9rem;
  margin-top: 1rem;
}

.auth-switch a {
  color: var(--secondary);
  font-weight: 600;
}

.auth-switch a:hover {
  text-decoration: underline;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: var(--white);
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 480px) {
  .auth-card {
    padding: 2rem 1.5rem;
  }
  .brand-header h2 {
    font-size: 1.5rem;
  }
}
</style>
