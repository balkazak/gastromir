<template>
  <div class="profile-page">
    <section class="profile-header section-padding animate-fade">
      <div class="container header-container">
        <div class="user-info-card" v-motion-slide-visible-once-bottom>
          <div class="avatar-glow">
            <User :size="48" class="avatar-icon" />
          </div>
          <div class="user-meta">
            <h1>{{ authStore.user?.name }}</h1>
            <p class="email">{{ authStore.user?.email }}</p>
            <span class="badge">Ресторан</span>
          </div>
        </div>

        <div class="limit-status-card" v-motion-slide-visible-once-bottom>
          <div class="card-glow"></div>
          <div class="user-details-box">
            <div class="details-row">
              <Phone :size="20" class="details-icon" />
              <div>
                <h4>Телефон:</h4>
                <p>{{ authStore.user?.phone || 'Не указан' }}</p>
              </div>
            </div>
            <div class="details-row" style="margin-top: 1rem;">
              <MapPin :size="20" class="details-icon" />
              <div>
                <h4>Адрес доставки:</h4>
                <p>{{ authStore.user?.address || 'Не указан' }}</p>
              </div>
            </div>
            <button @click="openEditModal" class="btn btn-secondary btn-edit-profile" style="margin-top: 1.5rem; width: 100%;">
              <Edit3 :size="16" /> Редактировать профиль
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="invoices-section section-padding">
      <div class="container">
        <div class="section-title">
          <h2>История <span>накладных</span></h2>
          <p>Все ваши заказы, сгруппированные по месяцам</p>
        </div>

        <div v-if="loading" class="loading-state">
          <span class="loader"></span>
          <p>Загрузка истории накладных...</p>
        </div>

        <div v-else-if="Object.keys(groupedOrders).length === 0" class="empty-state" v-motion-pop>
          <ClipboardList :size="64" />
          <h3>Накладных пока нет</h3>
          <p>Сделайте свой первый заказ в каталоге товаров!</p>
          <router-link to="/catalog" class="btn btn-secondary">Перейти в каталог</router-link>
        </div>

        <div v-else class="invoices-timeline">
          <div 
            v-for="(orders, month) in groupedOrders" 
            :key="month" 
            class="month-group"
            v-motion-slide-visible-once-bottom
          >
            <h3 class="month-title"><Calendar :size="18" /> {{ month }}</h3>
            
            <div class="orders-grid">
              <div v-for="order in orders" :key="order.id" class="invoice-card">
                <div class="invoice-card-header">
                  <div>
                    <span class="invoice-num">Накладная №{{ order.id }}</span>
                    <span class="invoice-date">{{ formatDate(order.created_at) }}</span>
                  </div>
                  <span class="invoice-price">{{ formatPrice(order.total_price) }} ₸</span>
                </div>

                <div class="invoice-items-preview">
                  <div v-for="(item, index) in order.items.slice(0, 3)" :key="index" class="preview-item">
                    <span>{{ item.name }}</span>
                    <span>{{ item.quantity }} {{ item.unit }}</span>
                  </div>
                  <div v-if="order.items.length > 3" class="preview-more">
                    и еще {{ order.items.length - 3 }} товар(ов)...
                  </div>
                </div>

                <div class="invoice-card-actions">
                  <button @click="showInvoiceDetails(order)" class="btn-details">
                    <Eye :size="16" /> Посмотреть детали
                  </button>
                  <button @click="repeatOrder(order)" class="btn btn-secondary btn-repeat">
                    <RotateCcw :size="16" /> Повторить заказ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Detailed Invoice Modal -->
    <Transition name="fade">
      <div v-if="activeInvoice" class="details-modal-overlay" @click.self="activeInvoice = null">
        <div class="details-modal" v-motion-pop>
          <div class="details-modal-header">
            <h3>Накладная №{{ activeInvoice.id }}</h3>
            <button @click="activeInvoice = null" class="close-btn"><X /></button>
          </div>
          <div class="details-modal-body">
            <div class="invoice-meta-info">
              <p><strong>Дата заказа:</strong> {{ formatDate(activeInvoice.created_at) }}</p>
              <p><strong>Получатель:</strong> {{ authStore.user?.name }}</p>
              <p><strong>Электронная почта:</strong> {{ authStore.user?.email }}</p>
            </div>
            <table class="modal-invoice-table">
              <thead>
                <tr>
                  <th>Наименование товара</th>
                  <th style="text-align: center;">Кол-во</th>
                  <th style="text-align: right;">Цена</th>
                  <th style="text-align: right;">Сумма</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in activeInvoice.items" :key="item.id">
                  <td data-label="Товар">{{ item.name }}</td>
                  <td data-label="Кол-во" style="text-align: center;">{{ item.quantity }} {{ item.unit }}</td>
                  <td data-label="Цена" style="text-align: right;">{{ formatPrice(item.price) }} ₸</td>
                  <td data-label="Сумма" style="text-align: right;">{{ formatPrice(item.price * item.quantity) }} ₸</td>
                </tr>
                <tr class="modal-total-row">
                  <td colspan="3" class="total-label-cell"><strong>Итого к оплате:</strong></td>
                  <td style="text-align: right;" class="total-amount-cell"><strong>{{ formatPrice(activeInvoice.total_price) }} ₸</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="details-modal-footer">
            <button @click="repeatOrder(activeInvoice)" class="btn btn-secondary btn-block">
              <RotateCcw :size="18" /> Повторить этот заказ полностью
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Edit Profile Modal -->
    <Transition name="fade">
      <div v-if="isEditModalOpen" class="details-modal-overlay" @click.self="closeEditModal">
        <div class="details-modal" v-motion-pop>
          <div class="details-modal-header">
            <h3>Редактирование профиля</h3>
            <button @click="closeEditModal" class="close-btn"><X /></button>
          </div>
          <form @submit.prevent="handleUpdateProfile">
            <div class="details-modal-body">
              <div v-if="modalErrorMsg" class="error-banner" style="margin-bottom: 1.5rem;">
                {{ modalErrorMsg }}
              </div>
              <div v-else-if="authStore.error" class="error-banner" style="margin-bottom: 1.5rem;">
                {{ authStore.error }}
              </div>

              <div class="form-group" style="margin-bottom: 1.25rem;">
                <label style="display: block; font-weight: 700; color: var(--primary); margin-bottom: 0.5rem; text-transform: uppercase; font-size: 0.85rem;">Номер телефона</label>
                <input 
                  type="tel" 
                  :value="editForm.phone" 
                  @input="onPhoneInput" 
                  placeholder="+7 (701) 514 14 04" 
                  maxlength="18"
                  required 
                  style="width: 100%; padding: 1rem 1.25rem; border-radius: 1rem; border: 1px solid #ddd; outline: none; font-size: 1rem; color: var(--primary);"
                />
              </div>

              <div class="form-group" style="margin-bottom: 1.25rem;">
                <label style="display: block; font-weight: 700; color: var(--primary); margin-bottom: 0.5rem; text-transform: uppercase; font-size: 0.85rem;">Адрес доставки</label>
                <input 
                  type="text" 
                  v-model="editForm.address" 
                  placeholder="Кунаева 29/1, 3 этаж" 
                  required 
                  style="width: 100%; padding: 1rem 1.25rem; border-radius: 1rem; border: 1px solid #ddd; outline: none; font-size: 1rem; color: var(--primary);"
                />
              </div>

              <div class="form-group" style="margin-bottom: 1.25rem;">
                <label style="display: block; font-weight: 700; color: var(--primary); margin-bottom: 0.5rem; text-transform: uppercase; font-size: 0.85rem;">Новый пароль (оставьте пустым, если не хотите менять)</label>
                <input 
                  type="password" 
                  v-model="editForm.password" 
                  placeholder="••••••••" 
                  style="width: 100%; padding: 1rem 1.25rem; border-radius: 1rem; border: 1px solid #ddd; outline: none; font-size: 1rem; color: var(--primary);"
                />
              </div>

              <div class="form-group" style="margin-bottom: 1.25rem;">
                <label style="display: block; font-weight: 700; color: var(--primary); margin-bottom: 0.5rem; text-transform: uppercase; font-size: 0.85rem;">Подтвердите новый пароль</label>
                <input 
                  type="password" 
                  v-model="editForm.confirmPassword" 
                  placeholder="••••••••" 
                  style="width: 100%; padding: 1rem 1.25rem; border-radius: 1rem; border: 1px solid #ddd; outline: none; font-size: 1rem; color: var(--primary);"
                />
              </div>
            </div>
            <div class="details-modal-footer">
              <button type="submit" class="btn btn-secondary btn-block" :disabled="authStore.loading">
                {{ authStore.loading ? 'Сохранение...' : 'Сохранить изменения' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { User, Calendar, Eye, RotateCcw, ClipboardList, X, Phone, MapPin, Edit3 } from 'lucide-vue-next'
import { formatPhone } from '@/utils/format'

const authStore = useAuthStore()
const cartStore = useCartStore()
const router = useRouter()
const orders = ref([])
const loading = ref(true)
const activeInvoice = ref(null)

const isEditModalOpen = ref(false)
const modalErrorMsg = ref('')
const editForm = reactive({
  phone: '',
  address: '',
  password: '',
  confirmPassword: ''
})

const openEditModal = () => {
  editForm.phone = authStore.user?.phone || ''
  editForm.address = authStore.user?.address || ''
  editForm.password = ''
  editForm.confirmPassword = ''
  modalErrorMsg.value = ''
  isEditModalOpen.value = true
}

const closeEditModal = () => {
  isEditModalOpen.value = false
}

const onPhoneInput = (event) => {
  editForm.phone = formatPhone(event.target.value)
}

const handleUpdateProfile = async () => {
  modalErrorMsg.value = ''

  if (editForm.password) {
    if (editForm.password !== editForm.confirmPassword) {
      modalErrorMsg.value = 'Пароли не совпадают'
      return
    }
    if (editForm.password.length < 6) {
      modalErrorMsg.value = 'Пароль должен содержать минимум 6 символов'
      return
    }
  }

  if (!editForm.phone || editForm.phone.length < 18) {
    modalErrorMsg.value = 'Введите корректный номер телефона'
    return
  }

  if (!editForm.address.trim()) {
    modalErrorMsg.value = 'Укажите адрес доставки'
    return
  }

  const success = await authStore.updateProfile(editForm.phone, editForm.address, editForm.password)
  if (success) {
    isEditModalOpen.value = false
  }
}

const fetchOrders = async () => {
  try {
    loading.value = true
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    if (response.ok) {
      orders.value = await response.json()
    }
  } catch (err) {
    console.error('Failed to fetch orders:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOrders()
})

const groupedOrders = computed(() => {
  const groups = {}
  orders.value.forEach(order => {
    const date = new Date(order.created_at)
    const monthYear = date.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })
    const capitalized = monthYear.charAt(0).toUpperCase() + monthYear.slice(1)
    if (!groups[capitalized]) {
      groups[capitalized] = []
    }
    groups[capitalized].push(order)
  })
  return groups
})

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU').format(price)
}

const showInvoiceDetails = (order) => {
  activeInvoice.value = order
}

const repeatOrder = (order) => {
  cartStore.clearCart()
  order.items.forEach(item => {
    // Add product to cart with its saved quantity
    const product = {
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category || 'Бакалея',
      unit: item.unit || 'шт',
      manufacturer: item.manufacturer || 'Не указан'
    }
    for (let i = 0; i < item.quantity; i++) {
      cartStore.addItem(product)
    }
  })
  activeInvoice.value = null
  router.push('/catalog')
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background-color: var(--light);
}

.profile-header {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
  padding-top: 10rem;
  padding-bottom: 5rem;
  color: var(--white);
}

.header-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.user-info-card {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.avatar-glow {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--secondary);
  box-shadow: 0 0 25px rgba(245, 158, 11, 0.25);
}

.user-meta h1 {
  font-size: 2.2rem;
  color: var(--white);
  margin-bottom: 0.25rem;
}

.user-meta .email {
  color: var(--gray);
  margin-bottom: 0.75rem;
}

.badge {
  display: inline-block;
  background: rgba(245, 158, 11, 0.15);
  color: var(--secondary);
  border: 1px solid rgba(245, 158, 11, 0.3);
  padding: 0.25rem 1rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
}

.limit-status-card {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 2.5rem;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.card-glow {
  position: absolute;
  top: -50%;
  right: -50%;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%);
  filter: blur(20px);
}

.limit-info {
  display: flex;
  align-items: center;
  gap: 1.75rem;
}

.limit-icon {
  color: var(--secondary);
  background: rgba(245, 158, 11, 0.1);
  padding: 1rem;
  border-radius: 18px;
  width: 64px;
  height: 64px;
}

.limit-info h3 {
  font-size: 1rem;
  color: var(--gray);
  margin-bottom: 0.25rem;
}

.limit-info h2 {
  font-size: 2.4rem;
  color: var(--white);
  font-weight: 800;
  margin-bottom: 0.25rem;
}

.limit-info p {
  font-size: 0.85rem;
  color: var(--gray);
  opacity: 0.8;
}

.section-title {
  margin-bottom: 4rem;
  text-align: center;
}

.section-title h2 span {
  background: var(--gradient-orange);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.month-group {
  margin-bottom: 4rem;
}

.month-title {
  font-size: 1.5rem;
  color: var(--primary);
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0.75rem;
}

.orders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 2rem;
}

.invoice-card {
  background: var(--white);
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 1.75rem;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: var(--transition);
}

.invoice-card:hover {
  transform: translateY(-3px);
  border-color: var(--secondary);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.05);
}

.invoice-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 1.25rem;
  margin-bottom: 1.25rem;
}

.invoice-num {
  display: block;
  font-weight: 700;
  color: var(--primary);
  font-size: 1.1rem;
}

.invoice-date {
  font-size: 0.85rem;
  color: var(--gray);
}

.invoice-price {
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--secondary-dark);
}

.invoice-items-preview {
  margin-bottom: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.preview-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--primary-light);
}

.preview-more {
  font-size: 0.85rem;
  color: var(--gray);
  font-style: italic;
  margin-top: 0.25rem;
}

.invoice-card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.btn-details {
  color: var(--primary);
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.btn-details:hover {
  color: var(--secondary);
}

.btn-repeat {
  padding: 0.5rem 1.25rem;
  font-size: 0.9rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 6rem 2rem;
  color: var(--gray);
}

.empty-state h3 {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--primary);
}

.empty-state p {
  margin-bottom: 2rem;
}

/* Modal details styling */
.details-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  z-index: 3000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.details-modal {
  background: var(--white);
  width: 100%;
  max-width: 650px;
  max-height: 85vh;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
}

.details-modal-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.details-modal-header h3 {
  font-size: 1.3rem;
  color: var(--primary);
}

.details-modal-body {
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
}

.invoice-meta-info {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 1.25rem 1.5rem;
  border-radius: 16px;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.invoice-meta-info p {
  margin-bottom: 0.5rem;
}

.invoice-meta-info p:last-child {
  margin-bottom: 0;
}

.modal-invoice-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.modal-invoice-table th {
  background: #f1f5f9;
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--gray);
  text-transform: uppercase;
}

.modal-invoice-table td {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.95rem;
}

.modal-total-row td {
  border-bottom: none;
  font-size: 1.1rem;
  padding-top: 1.5rem;
}

.details-modal-footer {
  padding: 1.5rem 2rem;
  background: #f8fafc;
  border-top: 1px solid #f1f5f9;
}

.btn-block {
  width: 100%;
  padding: 1rem;
  border-radius: 14px;
}

.loader {
  width: 48px;
  height: 48px;
  border: 5px solid rgba(11, 18, 33, 0.1);
  border-radius: 50%;
  border-top-color: var(--secondary);
  display: inline-block;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 992px) {
  .header-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .avatar-glow { width: 70px; height: 70px; }
  .user-meta h1 { font-size: 1.8rem; }
  .limit-info h2 { font-size: 2rem; }
  .orders-grid { grid-template-columns: 1fr; }
  .details-modal { max-height: 95vh; border-radius: 16px; width: 100%; }
  .details-modal-body { padding: 1.25rem; }

  /* Responsive table inside invoice details modal */
  .modal-invoice-table, 
  .modal-invoice-table thead, 
  .modal-invoice-table tbody, 
  .modal-invoice-table tr, 
  .modal-invoice-table td {
    display: block;
  }
  .modal-invoice-table thead {
    display: none;
  }
  .modal-invoice-table tr {
    margin-bottom: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 0.75rem;
    background: #f8fafc;
  }
  .modal-invoice-table td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f1f5f9;
    padding: 0.5rem 0.25rem;
    text-align: right;
  }
  .modal-invoice-table td:last-child {
    border-bottom: none;
  }
  .modal-invoice-table td::before {
    content: attr(data-label);
    font-weight: 700;
    color: var(--gray);
    font-size: 0.75rem;
    text-transform: uppercase;
  }
  .modal-total-row td.total-label-cell {
    display: flex;
    justify-content: space-between;
  }
  .modal-total-row td.total-amount-cell {
    display: flex;
    justify-content: flex-end;
    font-size: 1.2rem;
    color: var(--secondary-dark);
  }
}
.user-details-box {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
}

.details-row {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.details-icon {
  color: var(--secondary);
  margin-top: 0.2rem;
}

.details-row h4 {
  font-size: 0.9rem;
  color: var(--gray);
  margin-bottom: 0.15rem;
}

.details-row p {
  font-size: 1.1rem;
  color: var(--white);
  font-weight: 600;
  line-height: 1.4;
}

.btn-edit-profile {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  font-size: 0.95rem;
  border-radius: 12px;
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
</style>
