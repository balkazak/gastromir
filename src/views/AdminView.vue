<template>
  <div class="admin-page">
    <section class="admin-header section-padding">
      <div class="container header-container">
        <div class="admin-profile" v-motion-slide-visible-once-bottom>
          <div class="shield-glow">
            <ShieldCheck :size="48" />
          </div>
          <div>
            <h1>Панель управления</h1>
            <p>Добро пожаловать в админ-панель GASTROMIR. Управляйте ценами, лимитами и накладными.</p>
          </div>
        </div>

        <div class="admin-tabs" v-motion-slide-visible-once-bottom>
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
            class="tab-btn"
          >
            <component :is="tab.icon" :size="18" /> {{ tab.name }}
          </button>
        </div>
      </div>
    </section>

    <section class="admin-content section-padding">
      <div class="container">
        <!-- Tab 1: Restaurants Management -->
        <div v-if="activeTab === 'restaurants'" class="tab-pane animate-fade">
          <div class="card-header">
            <h2>Зарегистрированные рестораны</h2>
            <p>Управляйте лимитами заказов и доступами для каждого ресторана</p>
          </div>

          <div v-if="loadingUsers" class="loading-state">
            <span class="loader"></span>
            <p>Загрузка списка ресторанов...</p>
          </div>

          <div v-else-if="restaurants.length === 0" class="empty-state">
            <Users :size="48" />
            <p>Нет зарегистрированных ресторанов</p>
          </div>

          <div v-else class="table-responsive">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Имя / Название</th>
                  <th>Электронная почта</th>
                  <th>Дата регистрации</th>
                  <th style="width: 250px;">Лимит на заказ (₸)</th>
                  <th style="text-align: right;">Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="res in restaurants" :key="res.id">
                  <td class="font-bold">{{ res.name }}</td>
                  <td>{{ res.email }}</td>
                  <td>{{ formatDate(res.created_at) }}</td>
                  <td>
                    <div class="limit-edit-wrapper">
                      <input 
                        type="number" 
                        v-model.number="res.order_limit" 
                        class="limit-input"
                        placeholder="Лимит"
                      />
                      <button @click="updateLimit(res.id, res.order_limit)" class="btn-save-limit" title="Сохранить">
                        <Check :size="16" />
                      </button>
                    </div>
                  </td>
                  <td style="text-align: right;">
                    <button @click="deleteRestaurant(res.id, res.name)" class="btn-delete" title="Удалить ресторан">
                      <Trash2 :size="18" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tab 2: Products Price Catalog -->
        <div v-if="activeTab === 'products'" class="tab-pane animate-fade">
          <div class="price-header-row">
            <div class="card-header">
              <h2>Цены на продукцию</h2>
              <p>Изменяйте цены на товары каталога. Изменения применятся мгновенно.</p>
            </div>
            <div class="admin-search-bar">
              <Search class="search-icon" :size="18" />
              <input 
                type="text" 
                v-model="productSearch" 
                placeholder="Поиск товара для изменения цены..." 
              />
            </div>
          </div>

          <div v-if="loadingProducts" class="loading-state">
            <span class="loader"></span>
            <p>Загрузка каталога товаров...</p>
          </div>

          <div v-else class="table-responsive">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Наименование</th>
                  <th>Категория</th>
                  <th>Производитель</th>
                  <th>Ед. изм.</th>
                  <th style="width: 220px;">Текущая цена (₸)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="prod in filteredProducts.slice(0, 100)" :key="prod.id">
                  <td>{{ prod.name }}</td>
                  <td><span class="category-pill">{{ prod.category }}</span></td>
                  <td>{{ prod.manufacturer }}</td>
                  <td>{{ prod.unit }}</td>
                  <td>
                    <div class="limit-edit-wrapper">
                      <input 
                        type="number" 
                        step="0.01" 
                        v-model.number="prod.price" 
                        class="limit-input"
                      />
                      <button @click="updateProductPrice(prod.id, prod.price)" class="btn-save-limit" title="Сохранить цену">
                        <Check :size="16" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-if="filteredProducts.length > 100" class="more-warning">
              Показаны первые 100 товаров. Используйте поиск сверху, чтобы найти конкретный товар.
            </div>
          </div>
        </div>

        <!-- Tab 3: Monthly Invoices Log -->
        <div v-if="activeTab === 'invoices'" class="tab-pane animate-fade">
          <div class="invoice-header-row">
            <div class="card-header">
              <h2>История накладных и заказов</h2>
              <p>Полный список накладных по всем ресторанам, отсортированный по месяцам</p>
            </div>
            
            <div class="month-filter-group">
              <label>Фильтр по месяцам:</label>
              <select v-model="selectedMonth" class="admin-select">
                <option value="all">Все месяцы</option>
                <option v-for="m in uniqueInvoiceMonths" :key="m" :value="m">{{ m }}</option>
              </select>
            </div>
          </div>

          <div v-if="loadingOrders" class="loading-state">
            <span class="loader"></span>
            <p>Загрузка списка заказов...</p>
          </div>

          <div v-else-if="filteredOrders.length === 0" class="empty-state">
            <ClipboardList :size="48" />
            <p>Накладные за этот период отсутствуют</p>
          </div>

          <div v-else class="table-responsive">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Накладная №</th>
                  <th>Ресторан</th>
                  <th>Эл. почта</th>
                  <th>Дата заказа</th>
                  <th>Кол-во товаров</th>
                  <th>Сумма (₸)</th>
                  <th style="text-align: right;">Детали</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in filteredOrders" :key="order.id">
                  <td class="font-bold">№{{ order.id }}</td>
                  <td>{{ order.restaurant_name }}</td>
                  <td>{{ order.restaurant_email }}</td>
                  <td>{{ formatDate(order.created_at) }}</td>
                  <td>{{ order.items.length }} поз.</td>
                  <td class="invoice-price-col">{{ formatPrice(order.total_price) }} ₸</td>
                  <td style="text-align: right;">
                    <button @click="showInvoiceDetails(order)" class="btn-inspect" title="Просмотреть">
                      <Eye :size="18" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <!-- Details Invoice Modal -->
    <Transition name="fade">
      <div v-if="activeInvoice" class="details-modal-overlay" @click.self="activeInvoice = null">
        <div class="details-modal" v-motion-pop>
          <div class="details-modal-header">
            <h3>Детали накладной №{{ activeInvoice.id }}</h3>
            <button @click="activeInvoice = null" class="close-btn"><X /></button>
          </div>
          <div class="details-modal-body">
            <div class="invoice-meta-info">
              <p><strong>Дата накладной:</strong> {{ formatDate(activeInvoice.created_at) }}</p>
              <p><strong>Ресторан:</strong> {{ activeInvoice.restaurant_name }}</p>
              <p><strong>Электронная почта:</strong> {{ activeInvoice.restaurant_email }}</p>
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
                  <td>{{ item.name }}</td>
                  <td style="text-align: center;">{{ item.quantity }} {{ item.unit }}</td>
                  <td style="text-align: right;">{{ formatPrice(item.price) }} ₸</td>
                  <td style="text-align: right;">{{ formatPrice(item.price * item.quantity) }} ₸</td>
                </tr>
                <tr class="modal-total-row">
                  <td colspan="3"><strong>Общая сумма:</strong></td>
                  <td style="text-align: right;"><strong>{{ formatPrice(activeInvoice.total_price) }} ₸</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { ShieldCheck, Users, DollarSign, Calendar, Eye, Trash2, Check, Search, ClipboardList, X } from 'lucide-vue-next'

const authStore = useAuthStore()

const tabs = [
  { id: 'restaurants', name: 'Рестораны', icon: Users },
  { id: 'products', name: 'Каталог цен', icon: DollarSign },
  { id: 'invoices', name: 'Накладные', icon: ClipboardList }
]

const activeTab = ref('restaurants')
const productSearch = ref('')
const selectedMonth = ref('all')
const activeInvoice = ref(null)

// Loaders & State Refs
const restaurants = ref([])
const loadingUsers = ref(true)

const products = ref([])
const loadingProducts = ref(true)

const orders = ref([])
const loadingOrders = ref(true)

const fetchRestaurants = async () => {
  try {
    loadingUsers.value = true
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/users`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    if (response.ok) {
      restaurants.value = await response.json()
    }
  } catch (err) {
    console.error('Failed to load restaurants:', err)
  } finally {
    loadingUsers.value = false
  }
}

const fetchProducts = async () => {
  try {
    loadingProducts.value = true
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`)
    if (response.ok) {
      products.value = await response.json()
    }
  } catch (err) {
    console.error('Failed to load products:', err)
  } finally {
    loadingProducts.value = false
  }
}

const fetchOrders = async () => {
  try {
    loadingOrders.value = true
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    if (response.ok) {
      orders.value = await response.json()
    }
  } catch (err) {
    console.error('Failed to load orders:', err)
  } finally {
    loadingOrders.value = false
  }
}

onMounted(() => {
  fetchRestaurants()
  fetchProducts()
  fetchOrders()
})

const filteredProducts = computed(() => {
  if (!productSearch.value) return products.value
  const query = productSearch.value.toLowerCase()
  return products.value.filter(p => 
    p.name.toLowerCase().includes(query) || 
    p.category.toLowerCase().includes(query)
  )
})

const uniqueInvoiceMonths = computed(() => {
  const months = new Set()
  orders.value.forEach(order => {
    const date = new Date(order.created_at)
    const monthYear = date.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })
    const capitalized = monthYear.charAt(0).toUpperCase() + monthYear.slice(1)
    months.add(capitalized)
  })
  return Array.from(months)
})

const filteredOrders = computed(() => {
  if (selectedMonth.value === 'all') return orders.value
  return orders.value.filter(order => {
    const date = new Date(order.created_at)
    const monthYear = date.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })
    const capitalized = monthYear.charAt(0).toUpperCase() + monthYear.slice(1)
    return capitalized === selectedMonth.value
  })
})

const updateLimit = async (userId, limit) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/users/${userId}/limit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({ limit })
    })
    const data = await response.json()
    if (response.ok) {
      alert(data.message)
    } else {
      alert(data.message || 'Ошибка обновления')
    }
  } catch (err) {
    console.error(err)
    alert('Не удалось обновить лимит')
  }
}

const deleteRestaurant = async (userId, name) => {
  if (!confirm(`Вы действительно хотите безвозвратно удалить ресторан "${name}"?`)) return
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    const data = await response.json()
    if (response.ok) {
      alert(data.message)
      restaurants.value = restaurants.value.filter(r => r.id !== userId)
    } else {
      alert(data.message || 'Ошибка удаления')
    }
  } catch (err) {
    console.error(err)
    alert('Не удалось удалить ресторан')
  }
}

const updateProductPrice = async (prodId, price) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/products/${prodId}/price`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({ price })
    })
    const data = await response.json()
    if (response.ok) {
      // Find and update local list price
      const idx = products.value.findIndex(p => p.id === prodId)
      if (idx !== -1) {
        products.value[idx].price = price
      }
      alert('Цена товара успешно обновлена!')
    } else {
      alert(data.message || 'Ошибка')
    }
  } catch (err) {
    console.error(err)
    alert('Не удалось обновить цену товара')
  }
}

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
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background-color: var(--light);
}

.admin-header {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
  padding-top: 10rem;
  padding-bottom: 4rem;
  color: var(--white);
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
}

.admin-profile {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  max-width: 600px;
}

.shield-glow {
  width: 70px;
  height: 70px;
  border-radius: 20px;
  background: rgba(37, 99, 235, 0.15);
  border: 1px solid rgba(37, 99, 235, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-light);
  box-shadow: 0 0 20px rgba(37, 99, 235, 0.3);
  flex-shrink: 0;
}

.admin-profile h1 {
  font-size: 2rem;
  margin-bottom: 0.25rem;
}

.admin-profile p {
  color: var(--gray);
  font-size: 0.95rem;
  line-height: 1.4;
}

.admin-tabs {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.35rem;
  border-radius: 16px;
  gap: 0.25rem;
}

.tab-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--white);
  opacity: 0.8;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tab-btn:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.05);
}

.tab-btn.active {
  background: var(--secondary);
  color: var(--white);
  opacity: 1;
}

.admin-content {
  padding-top: 3rem;
  padding-bottom: 6rem;
}

.card-header {
  margin-bottom: 2rem;
}

.card-header h2 {
  font-size: 1.6rem;
  color: var(--primary);
  margin-bottom: 0.25rem;
}

.card-header p {
  color: var(--gray);
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
  background: var(--white);
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  box-shadow: var(--shadow);
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.admin-table th {
  background: #f8fafc;
  padding: 1.25rem 1.5rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--gray);
  text-transform: uppercase;
  border-bottom: 1px solid #e2e8f0;
}

.admin-table td {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.95rem;
  color: var(--primary-light);
}

.font-bold {
  font-weight: 700;
  color: var(--primary);
}

.category-pill {
  background: #f1f5f9;
  color: var(--primary);
  font-weight: 600;
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  text-transform: uppercase;
}

.limit-edit-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  max-width: 180px;
}

.limit-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-weight: 700;
  color: var(--primary);
  outline: none;
}

.limit-input:focus {
  border-color: var(--secondary);
}

.btn-save-limit {
  background: var(--primary);
  color: var(--white);
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-save-limit:hover {
  background: var(--secondary);
}

.btn-delete {
  color: var(--gray);
  padding: 0.5rem;
}

.btn-delete:hover {
  color: #ef4444;
  transform: scale(1.1);
}

.btn-inspect {
  color: var(--primary);
  padding: 0.5rem;
}

.btn-inspect:hover {
  color: var(--secondary);
  transform: scale(1.1);
}

/* Price Catalog styling */
.price-header-row, .invoice-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.admin-search-bar {
  position: relative;
  width: 320px;
}

.admin-search-bar input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  outline: none;
  font-size: 0.95rem;
}

.admin-search-bar input:focus {
  border-color: var(--secondary);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.admin-search-bar .search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray);
}

.more-warning {
  padding: 1.25rem 1.5rem;
  background: #f8fafc;
  font-size: 0.85rem;
  color: var(--gray);
  text-align: center;
  font-style: italic;
  border-top: 1px solid #e2e8f0;
}

.month-filter-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.month-filter-group label {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--primary);
}

.admin-select {
  padding: 0.6rem 1.5rem 0.6rem 1rem;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  font-weight: 600;
  appearance: none;
  background: white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E") no-repeat right 0.75rem center;
}

.invoice-price-col {
  font-weight: 800;
  color: var(--secondary-dark);
}

/* Loaders / States */
.loading-state, .empty-state {
  text-align: center;
  padding: 5rem 2rem;
  background: var(--white);
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  color: var(--gray);
  box-shadow: var(--shadow);
}

.loader {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(11, 18, 33, 0.1);
  border-radius: 50%;
  border-top-color: var(--secondary);
  display: inline-block;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
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

.close-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #f1f5f9;
}

@media (max-width: 992px) {
  .header-container {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 768px) {
  .admin-tabs { width: 100%; flex-direction: column; }
  .tab-btn { justify-content: center; }
  .price-header-row, .invoice-header-row { flex-direction: column; align-items: flex-start; }
  .admin-search-bar { width: 100%; }
}
</style>
