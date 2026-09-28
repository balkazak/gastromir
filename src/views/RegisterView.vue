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

        <div class="form-group">
          <label for="phone">Номер телефона</label>
          <div class="input-wrapper">
            <Phone class="input-icon" />
            <input 
              type="tel" 
              id="phone" 
              :value="phone" 
              @input="onPhoneInput" 
              placeholder="+7 (700) 000 00 00" 
              maxlength="18"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label for="address">Адрес доставки</label>
          <div class="input-wrapper">
            <MapPin class="input-icon" />
            <input 
              type="text" 
              id="address" 
              v-model="address" 
              placeholder="ул. Абая 52, офис 4" 
              required
            />
          </div>
        </div>

        <!-- Optional Legal Requisites Toggle -->
        <div class="requisites-toggle-box">
          <button 
            type="button" 
            class="toggle-req-btn" 
            @click="showRequisites = !showRequisites"
          >
            <span>Реквизиты для накладных (необязательно при регистрации)</span>
            <span class="toggle-indicator">{{ showRequisites ? '▲ Свернуть' : '▼ Заполнить сейчас' }}</span>
          </button>
          <p class="req-hint">Банковские реквизиты и БИН можно будет внести позже в личном кабинете.</p>
        </div>

        <div v-show="showRequisites" class="optional-requisites-section" v-motion-fade>
          <div class="form-group">
            <label for="bin_iin">БИН (ИИН) ресторана</label>
            <div class="input-wrapper">
              <FileText class="input-icon" />
              <input 
                type="text" 
                id="bin_iin" 
                v-model="bin_iin" 
                placeholder="123456789012" 
              />
            </div>
          </div>

          <div class="form-group">
            <label for="bank">Наименование банка</label>
            <div class="input-wrapper">
              <Landmark class="input-icon" />
              <input 
                type="text" 
                id="bank" 
                v-model="bank" 
                placeholder="АО &quot;Kaspi Bank&quot;" 
              />
            </div>
          </div>

          <div class="form-group">
            <label for="kbe">КБе</label>
            <div class="input-wrapper">
              <Hash class="input-icon" />
              <input 
                type="text" 
                id="kbe" 
                v-model="kbe" 
                placeholder="17" 
              />
            </div>
          </div>

          <div class="form-group">
            <label for="bic">БИК</label>
            <div class="input-wrapper">
              <Globe class="input-icon" />
              <input 
                type="text" 
                id="bic" 
                v-model="bic" 
                placeholder="CASPKZKA" 
              />
            </div>
          </div>

          <div class="form-group">
            <label for="account_number">Номер счета</label>
            <div class="input-wrapper">
              <CreditCard class="input-icon" />
              <input 
                type="text" 
                id="account_number" 
                v-model="account_number" 
                placeholder="KZ000000000000000000" 
              />
            </div>
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
import { User, Mail, Lock, Phone, MapPin, FileText, Landmark, Hash, Globe, CreditCard } from 'lucide-vue-next'
import { formatPhone } from '@/utils/format'
import { trackEvent } from '@/utils/analytics'

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const phone = ref('')
const address = ref('')
const bin_iin = ref('')
const bank = ref('')
const kbe = ref('')
const bic = ref('')
const account_number = ref('')
const errorMsg = ref('')
const showRequisites = ref(false)

const authStore = useAuthStore()
const router = useRouter()

const onPhoneInput = (event) => {
  phone.value = formatPhone(event.target.value)
}

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

  if (!phone.value || phone.value.length < 18) {
    errorMsg.value = 'Введите корректный номер телефона'
    return
  }

  if (!address.value.trim()) {
    errorMsg.value = 'Укажите адрес доставки'
    return
  }

  const success = await authStore.register(
    name.value, 
    email.value, 
    password.value, 
    phone.value, 
    address.value,
    bin_iin.value || '',
    bank.value || '',
    kbe.value || '',
    bic.value || '',
    account_number.value || ''
  )
  if (success) {
    trackEvent('registration', { method: 'quick_b2b_form' })
    router.push('/profile')
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

.requisites-toggle-box {
  margin: 1.25rem 0 1rem;
  padding: 0.85rem 1rem;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.2);
}

.toggle-req-btn {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  font-weight: 600;
  color: #FFFFFF;
  text-align: left;
}

.toggle-indicator {
  color: var(--secondary);
  font-size: 0.8rem;
  font-weight: 700;
}

.req-hint {
  font-size: 0.75rem;
  color: #94A3B8;
  margin-top: 0.35rem;
}

.optional-requisites-section {
  padding-left: 0.5rem;
  border-left: 2px solid rgba(245, 158, 11, 0.4);
  margin-bottom: 1.25rem;
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
