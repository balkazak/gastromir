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
                  <td data-label="Ресторан" class="font-bold">{{ res.name }}</td>
                  <td data-label="Email">{{ res.email }}</td>
                  <td data-label="Регистрация">{{ formatDate(res.created_at) }}</td>
                  <td data-label="Лимит на заказ">
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
                  <td data-label="Действия" style="text-align: right;">
                    <button @click="deleteRestaurant(res.id, res.name)" class="btn-delete" title="Удалить ресторан">
                      <Trash2 :size="18" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tab 2: Products Full Catalog Editor with Advanced Filters & Infinite Scroll -->
        <div v-if="activeTab === 'products'" class="tab-pane animate-fade">
          <div class="price-header-row">
            <div class="card-header">
              <h2>Редактор каталога товаров</h2>
              <p>Вы можете изменять любые характеристики товаров. Изменения сохраняются в базе данных.</p>
            </div>
            
            <div class="search-filters-box">
              <!-- Search Name -->
              <div class="admin-search-bar">
                <Search class="search-icon" :size="18" />
                <input 
                  type="text" 
                  v-model="productSearch" 
                  @input="resetLimit"
                  placeholder="Поиск по названию..." 
                />
              </div>

              <!-- Filter Category -->
              <select v-model="filterCategory" @change="resetLimit" class="admin-select-filter">
                <option value="all">Все категории</option>
                <option v-for="cat in uniqueCategories" :key="cat" :value="cat">{{ cat }}</option>
              </select>

              <!-- Filter Manufacturer -->
              <select v-model="filterManufacturer" @change="resetLimit" class="admin-select-filter">
                <option value="all">Все производители</option>
                <option v-for="man in uniqueManufacturers" :key="man" :value="man">{{ man }}</option>
              </select>
            </div>
          </div>

          <div v-if="loadingProducts" class="loading-state">
            <span class="loader"></span>
            <p>Загрузка каталога товаров...</p>
          </div>

          <div v-else>
            <div class="table-responsive">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th @click="toggleSort('name')" class="sortable-header">
                      <div class="header-content">
                        Наименование <ArrowUpDown :size="14" />
                      </div>
                    </th>
                    <th @click="toggleSort('category')" class="sortable-header">
                      <div class="header-content">
                        Категория <ArrowUpDown :size="14" />
                      </div>
                    </th>
                    <th @click="toggleSort('manufacturer')" class="sortable-header">
                      <div class="header-content">
                        Производитель <ArrowUpDown :size="14" />
                      </div>
                    </th>
                    <th style="width: 100px;">Ед. изм.</th>
                    <th @click="toggleSort('price')" class="sortable-header" style="width: 160px;">
                      <div class="header-content">
                        Цена (₸) <ArrowUpDown :size="14" />
                      </div>
                    </th>
                    <th style="text-align: right; width: 140px;">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="prod in displayedProducts" :key="prod.id">
                    <!-- Inline Editing State -->
                    <template v-if="editingProductId === prod.id">
                      <td data-label="Наименование">
                        <input type="text" v-model="editProductForm.name" class="inline-edit-input" />
                      </td>
                      <td data-label="Категория">
                        <select v-model="editProductForm.category" class="inline-edit-select">
                          <option v-for="cat in uniqueCategories" :key="cat" :value="cat">{{ cat }}</option>
                        </select>
                      </td>
                      <td data-label="Производитель">
                        <input type="text" v-model="editProductForm.manufacturer" class="inline-edit-input" />
                      </td>
                      <td data-label="Ед. изм.">
                        <input type="text" v-model="editProductForm.unit" class="inline-edit-input" style="width: 70px;" />
                      </td>
                      <td data-label="Цена (₸)">
                        <input type="number" step="0.01" v-model.number="editProductForm.price" class="inline-edit-input" />
                      </td>
                      <td data-label="Действия" style="text-align: right;">
                        <div class="edit-actions-row">
                          <button @click="saveProductEdit(prod.id)" class="btn-action-save" title="Сохранить изменения">
                            <Check :size="16" />
                          </button>
                          <button @click="cancelProductEdit" class="btn-action-cancel" title="Отмена">
                            <X :size="16" />
                          </button>
                        </div>
                      </td>
                    </template>

                    <!-- Normal State -->
                    <template v-else>
                      <td data-label="Наименование">{{ prod.name }}</td>
                      <td data-label="Категория"><span class="category-pill">{{ prod.category }}</span></td>
                      <td data-label="Производитель">{{ prod.manufacturer }}</td>
                      <td data-label="Ед. изм.">{{ prod.unit }}</td>
                      <td data-label="Цена (₸)" class="font-bold">{{ formatPrice(prod.price) }} ₸</td>
                      <td data-label="Действия" style="text-align: right;">
                        <button @click="startProductEdit(prod)" class="btn-edit-row">
                          <Edit3 :size="18" /> Изменить
                        </button>
                      </td>
                    </template>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Scroll Sentinel (Infinite Scroll Loader) -->
            <div ref="scrollSentinel" class="scroll-sentinel">
              <div v-if="displayedLimit < filteredProducts.length" class="sentinel-loader">
                <span class="loader-dots"></span>
                <p>Загрузка товаров...</p>
              </div>
              <div v-else class="sentinel-end">
                🏁 Показаны все товары (всего: {{ filteredProducts.length }})
              </div>
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
                  <td data-label="Накладная" class="font-bold">№{{ order.id }}</td>
                  <td data-label="Ресторан">{{ order.restaurant_name }}</td>
                  <td data-label="Email">{{ order.restaurant_email }}</td>
                  <td data-label="Дата заказа">{{ formatDate(order.created_at) }}</td>
                  <td data-label="Товаров">{{ order.items.length }} поз.</td>
                  <td data-label="Сумма" class="invoice-price-col">{{ formatPrice(order.total_price) }} ₸</td>
                  <td data-label="Детали" style="text-align: right;">
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
                  <td data-label="Товар">{{ item.name }}</td>
                  <td data-label="Кол-во" style="text-align: center;">{{ item.quantity }} {{ item.unit }}</td>
                  <td data-label="Цена" style="text-align: right;">{{ formatPrice(item.price) }} ₸</td>
                  <td data-label="Сумма" style="text-align: right;">{{ formatPrice(item.price * item.quantity) }} ₸</td>
                </tr>
                <tr class="modal-total-row">
                  <td colspan="3" class="total-label-cell"><strong>Общая сумма:</strong></td>
                  <td style="text-align: right;" class="total-amount-cell"><strong>{{ formatPrice(activeInvoice.total_price) }} ₸</strong></td>
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
import { ref, computed, reactive, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { ShieldCheck, Users, DollarSign, Calendar, Eye, Trash2, Check, Search, ClipboardList, X, Edit3, ArrowUpDown } from 'lucide-vue-next'

const authStore = useAuthStore()

const tabs = [
  { id: 'restaurants', name: 'Рестораны', icon: Users },
  { id: 'products', name: 'Каталог цен', icon: DollarSign },
  { id: 'invoices', name: 'Накладные', icon: ClipboardList }
]

const activeTab = ref('restaurants')
const productSearch = ref('')
const filterCategory = ref('all')
const filterManufacturer = ref('all')
const selectedMonth = ref('all')
const activeInvoice = ref(null)

// Sorting State
const sortField = ref('name')
const sortOrder = ref('asc') // 'asc' or 'desc'

// Infinite Scroll State
const scrollSentinel = ref(null)
const displayedLimit = ref(40)
let sentinelObserver = null

// Inline Editing Product State
const editingProductId = ref(null)
const editProductForm = reactive({
  name: '',
  price: 0,
  category: '',
  unit: '',
  manufacturer: ''
})

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
    nextTick(() => {
      setupSentinelObserver()
    })
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

// Infinite Scroll intersection trigger
const setupSentinelObserver = () => {
  if (sentinelObserver) sentinelObserver.disconnect()

  sentinelObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      if (displayedLimit.value < filteredProducts.value.length) {
        displayedLimit.value += 40
      }
    }
  }, {
    rootMargin: '150px' // Preload next products slightly early
  })

  if (scrollSentinel.value) {
    sentinelObserver.observe(scrollSentinel.value)
  }
}

// Reset displayed count whenever filtering or sorting changes
const resetLimit = () => {
  displayedLimit.value = 40
  // Re-observe after viewport updates
  nextTick(() => {
    if (scrollSentinel.value && sentinelObserver) {
      sentinelObserver.unobserve(scrollSentinel.value)
      sentinelObserver.observe(scrollSentinel.value)
    }
  })
}

// Observe tab change to trigger sentinel setup
watch(activeTab, (newTab) => {
  if (newTab === 'products') {
    nextTick(() => {
      setupSentinelObserver()
    })
  }
})

// Reset on searches and filters
watch([productSearch, filterCategory, filterManufacturer, sortField, sortOrder], () => {
  resetLimit()
})

onMounted(() => {
  fetchRestaurants()
  fetchProducts()
  fetchOrders()
})

onUnmounted(() => {
  if (sentinelObserver) sentinelObserver.disconnect()
})

// Unique Lists for Dropdown Filters
const uniqueCategories = computed(() => {
  return [...new Set(products.value.map(p => p.category))].sort()
})

const uniqueManufacturers = computed(() => {
  return [...new Set(products.value.map(p => p.manufacturer))].sort()
})

// Multi-variable sorting & filtering
const filteredProducts = computed(() => {
  let list = products.value

  // Search by name
  if (productSearch.value) {
    const q = productSearch.value.toLowerCase()
    list = list.filter(p => p.name.toLowerCase().includes(q))
  }

  // Filter by category
  if (filterCategory.value !== 'all') {
    list = list.filter(p => p.category === filterCategory.value)
  }

  // Filter by manufacturer
  if (filterManufacturer.value !== 'all') {
    list = list.filter(p => p.manufacturer === filterManufacturer.value)
  }

  // Sort list
  list = [...list].sort((a, b) => {
    let fieldA = a[sortField.value]
    let fieldB = b[sortField.value]

    if (typeof fieldA === 'string') {
      fieldA = fieldA.toLowerCase()
      fieldB = fieldB.toLowerCase()
    }

    if (fieldA < fieldB) return sortOrder.value === 'asc' ? -1 : 1
    if (fieldA > fieldB) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })

  return list
})

// Slice catalog matching dynamic scroll state
const displayedProducts = computed(() => {
  return filteredProducts.value.slice(0, displayedLimit.value)
})

// Toggle column sorting
const toggleSort = (field) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
}

// Inline editing functions
const startProductEdit = (product) => {
  editingProductId.value = product.id
  editProductForm.name = product.name
  editProductForm.price = product.price
  editProductForm.category = product.category
  editProductForm.unit = product.unit
  editProductForm.manufacturer = product.manufacturer
}

const cancelProductEdit = () => {
  editingProductId.value = null
}

const saveProductEdit = async (prodId) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/products/${prodId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(editProductForm)
    })
    const data = await response.json()
    if (response.ok) {
      // Find and update item locally
      const idx = products.value.findIndex(p => p.id === prodId)
      if (idx !== -1) {
        products.value[idx] = { ...data.product }
      }
      editingProductId.value = null
      alert('Товар успешно обновлен!')
    } else {
      alert(data.message || 'Ошибка обновления')
    }
  } catch (err) {
    console.error(err)
    alert('Не удалось сохранить изменения')
  }
}

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
  user-select: none;
}

.sortable-header {
  cursor: pointer;
  transition: color 0.3s ease;
}

.sortable-header:hover {
  color: var(--secondary-dark);
}

.header-content {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
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

/* Search Filters Box styling */
.price-header-row, .invoice-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.search-filters-box {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.admin-search-bar {
  position: relative;
  width: 250px;
}

.admin-search-bar input {
  width: 100%;
  padding: 0.6rem 1rem 0.6rem 2.5rem;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  outline: none;
  font-size: 0.9rem;
}

.admin-search-bar input:focus {
  border-color: var(--secondary);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.admin-search-bar .search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray);
}

.admin-select-filter {
  padding: 0.6rem 1.75rem 0.6rem 1rem;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  font-weight: 600;
  font-size: 0.9rem;
  background-color: white;
  appearance: none;
  cursor: pointer;
  background: white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E") no-repeat right 0.75rem center;
}

/* Inline Edit Controls */
.inline-edit-input, .inline-edit-select {
  width: 100%;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid var(--secondary);
  font-size: 0.9rem;
  outline: none;
  color: var(--primary);
  background: rgba(245, 158, 11, 0.02);
}

.inline-edit-select {
  appearance: none;
  cursor: pointer;
  background: rgba(245, 158, 11, 0.02) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E") no-repeat right 0.5rem center;
  padding-right: 1.75rem;
}

.inline-edit-input:focus, .inline-edit-select:focus {
  background: white;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.2);
}

.edit-actions-row {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.btn-action-save {
  background: #22c55e;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-action-save:hover {
  background: #16a34a;
}

.btn-action-cancel {
  background: #ef4444;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-action-cancel:hover {
  background: #dc2626;
}

.btn-edit-row {
  background: rgba(245, 158, 11, 0.1);
  color: var(--secondary-dark);
  border: 1px solid rgba(245, 158, 11, 0.2);
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.btn-edit-row:hover {
  background: var(--secondary);
  color: white;
  border-color: var(--secondary);
}

/* Infinite Scroll Sentinel Styling */
.scroll-sentinel {
  padding: 3rem 0;
  text-align: center;
  font-weight: 600;
  color: var(--gray);
}

.sentinel-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.loader-dots {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: block;
  margin: 0 auto;
  position: relative;
  color: var(--secondary);
  box-sizing: border-box;
  animation: shadowPulse 2s linear infinite;
}

@keyframes shadowPulse {
  0% {
    box-shadow: -24px 0 var(--secondary), -8px 0 rgba(245, 158, 11, 0.2), 8px 0 rgba(245, 158, 11, 0.2), 24px 0 rgba(245, 158, 11, 0.2);
  }
  16.666% {
    box-shadow: -24px 0 rgba(245, 158, 11, 0.2), -8px 0 var(--secondary), 8px 0 rgba(245, 158, 11, 0.2), 24px 0 rgba(245, 158, 11, 0.2);
  }
  33.333% {
    box-shadow: -24px 0 rgba(245, 158, 11, 0.2), -8px 0 rgba(245, 158, 11, 0.2), 8px 0 var(--secondary), 24px 0 rgba(245, 158, 11, 0.2);
  }
  50.000% {
    box-shadow: -24px 0 rgba(245, 158, 11, 0.2), -8px 0 rgba(245, 158, 11, 0.2), 8px 0 rgba(245, 158, 11, 0.2), 24px 0 var(--secondary);
  }
  66.666% {
    box-shadow: -24px 0 rgba(245, 158, 11, 0.2), -8px 0 rgba(245, 158, 11, 0.2), 8px 0 var(--secondary), 24px 0 rgba(245, 158, 11, 0.2);
  }
  83.333% {
    box-shadow: -24px 0 rgba(245, 158, 11, 0.2), -8px 0 var(--secondary), 8px 0 rgba(245, 158, 11, 0.2), 24px 0 rgba(245, 158, 11, 0.2);
  }
  100% {
    box-shadow: -24px 0 var(--secondary), -8px 0 rgba(245, 158, 11, 0.2), 8px 0 rgba(245, 158, 11, 0.2), 24px 0 rgba(245, 158, 11, 0.2);
  }
}

.sentinel-end {
  font-size: 0.95rem;
  color: var(--gray);
  padding: 1rem;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  display: inline-block;
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
  .search-filters-box { width: 100%; flex-direction: column; align-items: stretch; }
  .admin-search-bar { width: 100%; }

  /* Mobile responsive layout for all tables */
  .admin-table, 
  .admin-table thead, 
  .admin-table tbody, 
  .admin-table tr, 
  .admin-table td {
    display: block;
  }

  .admin-table thead {
    display: none; /* Hide default layout headers */
  }

  .admin-table tr {
    margin-bottom: 1.5rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
  }

  .admin-table tr:last-child {
    margin-bottom: 0;
  }

  .admin-table td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f1f5f9;
    padding: 0.75rem 0.5rem;
    text-align: right;
  }

  .admin-table td:last-child {
    border-bottom: none;
  }

  .admin-table td::before {
    content: attr(data-label);
    font-weight: 700;
    color: var(--gray);
    font-size: 0.75rem;
    text-transform: uppercase;
    text-align: left;
  }

  .limit-edit-wrapper {
    max-width: 100%;
    width: 60%;
    justify-content: flex-end;
  }

  .edit-actions-row {
    width: 100%;
    justify-content: flex-end;
  }

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

  .details-modal {
    max-height: 95vh;
    border-radius: 16px;
    width: 100%;
  }
  .details-modal-body {
    padding: 1.25rem;
  }
}
</style>
