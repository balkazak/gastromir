<template>
  <Transition name="fade">
    <div v-if="showToast" class="toast-success">
      <span>✅ Накладная отправлена на Email!</span>
    </div>
  </Transition>

  <Transition name="fade">
    <div v-if="cartStore.isModalOpen" class="modal-overlay" @click.self="cartStore.closeModal">
      <div class="modal-content" v-motion-pop>
        <div class="modal-header">
          <h2>Корзина</h2>
          <button @click="cartStore.closeModal" class="close-btn"><X /></button>
        </div>

        <div v-if="cartStore.items.length > 0" class="modal-body">
          <div class="cart-items">
            <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
              <div class="item-details">
                <h4>{{ item.name }}</h4>
                <p>{{ formatPrice(item.price) }} ₸ <span class="unit">/ {{ item.unit }}</span></p>
                <span v-if="item.unit === 'кг'" class="weight-badge">⚖️ весовой</span>
              </div>
              <div class="item-actions">
                <div class="qty-control">
                  <button @click="cartStore.updateQuantity(item.id, -1)">-</button>
                  <span>{{ item.quantity }}</span>
                  <button @click="cartStore.updateQuantity(item.id, 1)">+</button>
                </div>
                <button @click="cartStore.removeItem(item.id)" class="remove-btn"><Trash2 :size="18" /></button>
              </div>
            </div>
          </div>

          <div class="order-form">
            <h3>Детали заказа</h3>
            <div class="form-group">
              <label>Название ресторана / Клиент</label>
              <input type="text" v-model="orderData.customerName" placeholder="Например: Угли Дипломат" required />
            </div>
            <div class="form-group">
              <label>Телефон для связи</label>
              <input type="tel" v-model="orderData.phone" placeholder="+7 (___) ___ __ __" required />
            </div>
            <div class="form-group">
              <label>Адрес доставки</label>
              <input type="text" v-model="orderData.address" placeholder="Например: Кунаева 29/1, 3 этаж" required />
            </div>
            <div class="form-group">
              <label>Дата доставки (ДД.ММ.ГГГГ)</label>
              <input 
                type="text" 
                :value="orderData.deliveryDate" 
                @input="onDateInput" 
                placeholder="Например: 19.05.2026" 
                maxLength="10"
                required 
                :class="{ 'input-error': orderData.deliveryDate && !isDateValid }"
              />
              <span v-if="orderData.deliveryDate && !isDateValid" class="error-message">
                Введите корректную дату (не в прошлом) в формате ДД.ММ.ГГГГ
              </span>
            </div>
            <div class="form-group">
              <label>Выберите время доставки:</label>
              <select v-model="orderData.deliveryTime" class="form-select">
                <option value="До 14:00">До 14:00</option>
                <option value="До 18:00">До 18:00</option>
              </select>
            </div>
            <div class="form-group">
              <label>Способ оплаты</label>
              <select v-model="orderData.paymentMethod" class="form-select">
                <option v-for="method in paymentMethods" :key="method.id" :value="method.name">
                  {{ method.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="modal-footer">
            <p v-if="cartStore.hasWeightItems" class="weight-disclaimer">
              ⚖️ Для весовых товаров итоговая стоимость зависит от фактического веса и рассчитывается после сборки заказа.
            </p>
            <p v-if="cartStore.hasFreshItems" class="fresh-disclaimer">
              🥬 Цены на свежую продукцию (овощи, фрукты, зелень, салаты) являются плавающими и зависят от сезонности, качества и ежедневных поставок.
            </p>
            <div class="total-row">
              <span>Итого к оплате:</span>
              <strong>{{ formatPrice(cartStore.totalPrice) }} ₸</strong>
            </div>
            
            <div v-if="!authStore.isAuthenticated" class="auth-warning-box">
              🔑 Пожалуйста, <router-link to="/login" @click="cartStore.closeModal"><b>войдите в систему</b></router-link> или <router-link to="/register" @click="cartStore.closeModal"><b>зарегистрируйтесь</b></router-link>, чтобы отправлять заказы и просматривать накладные.
            </div>
            
            <div v-else-if="isOverLimit" class="limit-warning-box">
              ⚠️ Сумма заказа ({{ formatPrice(cartStore.totalPrice) }} ₸) превышает ваш лимит ({{ formatPrice(authStore.user?.order_limit) }} ₸). Уберите товары или обратитесь к администратору.
            </div>
            
            <div class="footer-actions">
              <button 
                class="btn btn-primary btn-block" 
                @click="sendToEmail" 
                :disabled="!authStore.isAuthenticated || isOverLimit || !orderData.customerName || !orderData.phone || isSendingEmail || !isDateValid"
              >
                {{ isSendingEmail ? 'Отправка...' : 'Отправить заказ' }}
              </button>

              <button 
                class="btn btn-whatsapp btn-block" 
                @click="sendToWhatsApp" 
                :disabled="!authStore.isAuthenticated || isOverLimit || !orderData.customerName || !orderData.phone || !isDateValid"
              >
                Отправить в WhatsApp
              </button>
              
              <button 
                class="btn btn-secondary btn-block" 
                @click="generatePDFInvoice" 
                :disabled="!orderData.customerName || !orderData.address || !orderData.phone || isGeneratingPDF || !isDateValid"
              >
                {{ isGeneratingPDF ? 'Генерация PDF...' : 'Скачать накладную (PDF)' }}
              </button>
            </div>
          </div>
        </div>

        <div v-else class="empty-cart">
          <ShoppingCart :size="64" />
          <p>Ваша корзина пуста</p>
          <button @click="cartStore.closeModal" class="btn btn-primary">Вернуться к покупкам</button>
        </div>
      </div>
    </div>
  </Transition>

  <div class="pdf-offscreen-container">
    <div ref="pdfTemplateRef" class="pdf-invoice">
      <div class="invoice-logo-container">
        <img src="@/assets/logo.png" alt="GASTROMIR Logo" class="invoice-logo" />
        <h2 class="invoice-title">НАКЛАДНАЯ</h2>
      </div>
      <div class="invoice-header">
        <p><strong>Дата заказа:</strong> {{ invoiceDate }} г.</p>
        <p><strong>Дата доставки:</strong> {{ orderData.deliveryDate }} г.</p>
        <p><strong>Время доставки:</strong> {{ orderData.deliveryTime }}</p>
        <p><strong>Поставщик:</strong> GASTROMIR ИП ИБРАЕВ (БИН/ИИН: 820727351424)</p>
        <p><strong>Покупатель:</strong> {{ orderData.customerName }}</p>
        <p><strong>Адрес:</strong> {{ orderData.address }}</p>
        <p><strong>Способ оплаты:</strong> {{ orderData.paymentMethod }}</p>
      </div>

      <div v-if="mainItems.length > 0" class="invoice-section">
        <table class="invoice-table">
          <thead>
            <tr>
              <th style="width: 5%">№</th>
              <th style="width: 60%">Наименование</th>
              <th style="width: 10%">Кол-во</th>
              <th style="width: 10%">цена</th>
              <th style="width: 15%">Сумма</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in mainItems" :key="item.id">
              <td style="text-align: center;">{{ index + 1 }}</td>
              <td>{{ item.name }}</td>
              <td style="text-align: center;">{{ item.quantity }} {{ item.unit }}</td>
              <td style="text-align: right;">{{ formatPrice(item.price) }}</td>
              <td style="text-align: right;">{{ formatPrice(item.price * item.quantity) }}</td>
            </tr>
            <tr class="table-total-row">
              <td colspan="2"><strong>Итого:</strong></td>
              <td></td>
              <td></td>
              <td style="text-align: right;"><strong>{{ formatPrice(mainItemsTotal) }}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="barItems.length > 0" class="invoice-section" style="margin-top: 1.5rem;">
        <h3 class="section-title">Бар:</h3>
        <table class="invoice-table">
          <thead>
            <tr>
              <th style="width: 5%">№</th>
              <th style="width: 60%">Наименование</th>
              <th style="width: 10%">Кол-во</th>
              <th style="width: 10%">цена</th>
              <th style="width: 15%">Сумма</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in barItems" :key="item.id">
              <td style="text-align: center;">{{ index + 1 }}</td>
              <td>{{ item.name }}</td>
              <td style="text-align: center;">{{ item.quantity }} {{ item.unit }}</td>
              <td style="text-align: right;">{{ formatPrice(item.price) }}</td>
              <td style="text-align: right;">{{ formatPrice(item.price * item.quantity) }}</td>
            </tr>
            <tr class="table-total-row">
              <td colspan="2"><strong>Итого:</strong></td>
              <td></td>
              <td></td>
              <td style="text-align: right;"><strong>{{ formatPrice(barItemsTotal) }}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="invoice-grand-total">
        <table class="grand-total-table">
          <tbody>
            <tr>
              <td style="width: 65%;"><strong>Общая сумма к оплате:</strong></td>
              <td style="width: 10%;"></td>
              <td style="width: 10%;"></td>
              <td style="width: 15%; text-align: right;"><strong>{{ formatPrice(cartStore.totalPrice) }}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'
import { X, Trash2, ShoppingCart, Check } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { parse, isValid, isBefore, startOfDay, format } from 'date-fns'

const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()

const pdfTemplateRef = ref(null)
const isGeneratingPDF = ref(false)

const paymentMethods = [
  { id: 'cash', name: 'Наличный расчет' },
  { id: 'transfer', name: 'Перевод Kaspi' },
  { id: 'qr', name: 'Kaspi QR' },
  { id: 'invoice', name: 'Счет на оплату' },
  { id: 'deferred', name: 'Отсрочка платежа' }
]

const todayStr = format(new Date(), 'dd.MM.yyyy')

const orderData = reactive({
  customerName: authStore.user?.name || '',
  address: '',
  phone: '',
  paymentMethod: 'Наличный расчет',
  deliveryDate: todayStr,
  deliveryTime: 'До 14:00'
})

// Keep prefilled customerName up-to-date
watch(() => authStore.user, (newUser) => {
  if (newUser && !orderData.customerName) {
    orderData.customerName = newUser.name
  }
}, { immediate: true })

const isOverLimit = computed(() => {
  if (!authStore.isAuthenticated) return false
  if (authStore.user?.role === 'admin') return false
  const limit = authStore.user?.order_limit || 500000.00
  return cartStore.totalPrice > limit
})

const onDateInput = (event) => {
  let value = event.target.value.replace(/\D/g, '')
  if (value.length > 8) value = value.slice(0, 8)
  
  let formatted = ''
  if (value.length > 0) {
    formatted += value.slice(0, 2)
  }
  if (value.length > 2) {
    formatted += '.' + value.slice(2, 4)
  }
  if (value.length > 4) {
    formatted += '.' + value.slice(4, 8)
  }
  orderData.deliveryDate = formatted
}

const isDateValid = computed(() => {
  const dateStr = orderData.deliveryDate
  if (!dateStr || dateStr.length !== 10) return false
  const parsed = parse(dateStr, 'dd.MM.yyyy', new Date())
  if (!isValid(parsed)) return false
  const today = startOfDay(new Date())
  return !isBefore(parsed, today)
})

const invoiceDate = computed(() => {
  const d = new Date()
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}.${month}.${year}`
})

const barItems = computed(() => {
  const barCategories = ['Чай-кофе', 'Сиропы', 'Орехи']
  return cartStore.items.filter(item => barCategories.includes(item.category))
})

const mainItems = computed(() => {
  const barCategories = ['Чай-кофе', 'Сиропы', 'Орехи']
  return cartStore.items.filter(item => !barCategories.includes(item.category))
})

const mainItemsTotal = computed(() => {
  return mainItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const barItemsTotal = computed(() => {
  return barItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU').format(price)
}

const placeOrderInDatabase = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({
        items: cartStore.items,
        totalPrice: cartStore.totalPrice
      })
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || 'Ошибка сохранения заказа в бэкенд')
    }
    return true
  } catch (err) {
    console.error(err)
    alert(err.message || 'Ошибка подключения к серверу')
    return false
  }
}

const sendToWhatsApp = async () => {
  if (!authStore.isAuthenticated) {
    cartStore.closeModal()
    router.push('/login')
    return
  }
  const saved = await placeOrderInDatabase()
  if (!saved) return

  const itemsText = cartStore.items.map(item => `- ${item.name}: ${item.quantity} ${item.unit} x ${formatPrice(item.price)} тг`).join('\n')
  const totalText = `Итого: ${formatPrice(cartStore.totalPrice)} тг`
  const message = `👋 *Новый заказ в GASTROMIR!*\n\n*Ресторан:* ${orderData.customerName}\n*Телефон:* ${orderData.phone}\n*Адрес:* ${orderData.address}\n*Способ оплаты:* ${orderData.paymentMethod}\n*Дата доставки:* ${orderData.deliveryDate}\n*Время доставки:* ${orderData.deliveryTime}\n\n*Заказ:*\n${itemsText}\n\n*${totalText}*`
  
  const encodedMessage = encodeURIComponent(message)
  window.open(`https://wa.me/77015141404?text=${encodedMessage}`, '_blank')

  cartStore.clearCart()
  cartStore.closeModal()
}

const isSendingEmail = ref(false)
const showToast = ref(false)

const showSuccessToast = () => {
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 4000)
}

const sendToEmail = async () => {
  if (!authStore.isAuthenticated) {
    cartStore.closeModal()
    router.push('/login')
    return
  }

  isSendingEmail.value = true
  const saved = await placeOrderInDatabase()
  if (!saved) {
    isSendingEmail.value = false
    return
  }

  const date = new Date().toLocaleDateString('ru-RU')
  const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })

  const itemsList = cartStore.items.map((item, i) =>
    `${i + 1}. ${item.name} — ${item.quantity} ${item.unit} × ${formatPrice(item.price)} = ${formatPrice(item.quantity * item.price)} тг`
  ).join('\n')

  const weightNote = cartStore.hasWeightItems
    ? '\n\nПРИМЕЧАНИЕ: Для весовых товаров итоговая стоимость зависит от фактического веса и рассчитывается после сборки заказа.'
    : ''

  const freshNote = cartStore.hasFreshItems
    ? '\n\nПРИМЕЧАНИЕ: Цены на свежую продукцию (овощи, фрукты, зелень, салаты) являются плавающими и зависят от сезонности, качества и ежедневных поставок.'
    : ''

  const message = `===============================\nНАКЛАДНАЯ\n===============================\n\nПоставщик: GASTROMIR ИП ИБРАЕВ\nБИН/ИИН: 820727351424\nТелефон: +7 701 514 14 04\n\nПолучатель: ${orderData.customerName}\nТелефон: ${orderData.phone}\nАдрес: ${orderData.address}\nСпособ оплаты: ${orderData.paymentMethod}\nДата доставки: ${orderData.deliveryDate}\nВремя доставки: ${orderData.deliveryTime}\n\nДата заказа: ${date}\nВремя заказа: ${time}\n\n--------------------------------\nТОВАР\n--------------------------------\n${itemsList}\n\n--------------------------------\nИТОГО: ${formatPrice(cartStore.totalPrice)} тг\nК ОПЛАТЕ: ${formatPrice(cartStore.totalPrice)} тг\n\n================================\nСпасибо за заказ!\nGASTRO MIR\n================================${weightNote}${freshNote}`

  try {
    const formDataPayload = new FormData()
    formDataPayload.append("access_key", "a4c51ae1-a7d6-4ac4-9d54-3183cb69f4f5")
    formDataPayload.append("subject", `Новый заказ от ${orderData.customerName}`)
    formDataPayload.append("from_name", "GASTROMIR")
    formDataPayload.append("Ресторан", orderData.customerName)
    formDataPayload.append("Телефон", orderData.phone)
    formDataPayload.append("Адрес", orderData.address)
    formDataPayload.append("Способ оплаты", orderData.paymentMethod)
    formDataPayload.append("Дата доставки", orderData.deliveryDate)
    formDataPayload.append("Время доставки", orderData.deliveryTime)
    formDataPayload.append("Накладная", message)

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formDataPayload
    })

    if (response.ok) {
      cartStore.clearCart()
      cartStore.closeModal()
      orderData.customerName = authStore.user?.name || ''
      orderData.phone = ''
      orderData.address = ''
      orderData.paymentMethod = 'Наличный расчет'
      orderData.deliveryDate = todayStr
      orderData.deliveryTime = 'До 14:00'
      showSuccessToast()
    } else {
      alert('Ошибка при отправке. Попробуйте ещё раз.')
    }
  } catch (error) {
    console.error('Ошибка отправки:', error)
    alert('Ошибка при отправке. Проверьте подключение к интернету.')
  } finally {
    isSendingEmail.value = false
  }
}

const generatePDFInvoice = async () => {
  if (!pdfTemplateRef.value) return
  isGeneratingPDF.value = true

  try {
    const html2pdf = (await import('html2pdf.js')).default
    const orderNum = `УД-${new Date().getTime().toString().slice(-6)}-01`
    const element = pdfTemplateRef.value

    const options = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `Накладная_${orderNum}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }

    await html2pdf()
      .from(element)
      .set(options)
      .save()
  } catch (err) {
    console.error('Error generating PDF:', err)
  } finally {
    isGeneratingPDF.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.modal-content {
  background: var(--white);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  border-radius: 2rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.modal-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
}

.cart-items {
  margin-bottom: 2rem;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.item-img {
  width: 60px;
  height: 60px;
  border-radius: 0.75rem;
  object-fit: cover;
}

.item-details {
  flex: 1;
}

.item-details h4 {
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.item-details p {
  color: var(--primary);
  font-weight: 700;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.qty-control {
  display: flex;
  align-items: center;
  background: #f1f5f9;
  border-radius: 9999px;
  padding: 0.25rem;
}

.qty-control button {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.qty-control span {
  width: 30px;
  text-align: center;
  font-weight: 600;
}

.remove-btn {
  color: #ef4444;
  opacity: 0.6;
}

.remove-btn:hover {
  opacity: 1;
}

.order-form {
  background: #f8fafc;
  padding: 2rem;
  border-radius: 2rem;
  margin-bottom: 2rem;
  border: 1px solid #e2e8f0;
}

.weight-badge {
  display: inline-block;
  font-size: 0.7rem;
  color: var(--secondary-dark);
  background: #FEF3C7;
  padding: 0.15rem 0.5rem;
  border-radius: 0.35rem;
  margin-top: 0.25rem;
  font-weight: 600;
}

.weight-disclaimer {
  font-size: 0.8rem;
  color: var(--secondary-dark);
  background: #FEF3C7;
  padding: 0.6rem 0.75rem;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.fresh-disclaimer {
  font-size: 0.8rem;
  color: var(--secondary-dark);
  background: #FEF3C7;
  padding: 0.6rem 0.75rem;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.order-form h3 {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  color: var(--primary);
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-group input {
  width: 100%;
  padding: 1rem 1.25rem;
  border-radius: 1rem;
  border: 1px solid #ddd;
  background: var(--white);
  outline: none;
  font-size: 1rem;
  transition: var(--transition);
}

.form-group input:focus {
  border-color: var(--secondary);
  box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.1);
}

.modal-footer {
  padding: 1.5rem 2rem;
  background: #f8fafc;
  border-top: 1px solid #f1f5f9;
}

.total-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
}

.btn-block {
  width: 100%;
  padding: 1rem;
}

.empty-cart {
  padding: 5rem 2rem;
  text-align: center;
  color: var(--gray);
}

.empty-cart p {
  margin: 1.5rem 0;
}

.close-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.close-btn:hover {
  background: #f1f5f9;
}

.footer-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-whatsapp {
  background: #25D366;
  color: var(--white);
}

.btn-whatsapp:hover {
  background: #128C7E;
  transform: translateY(-2px);
}

.btn-outline-dark {
  border: 1px solid var(--primary);
  color: var(--primary);
}

.btn-outline-dark:hover {
  background: var(--primary);
  color: var(--white);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 600px) {
  .modal-overlay { padding: 0; }
  .modal-content { 
    max-height: 100dvh; 
    border-radius: 0; 
    height: 100dvh;
  }
  .modal-body { padding: 1.25rem; }
  .cart-item { gap: 1rem; }
  .order-form { padding: 1.5rem; border-radius: 1.5rem; }
  .modal-footer { padding: 1.25rem; padding-bottom: calc(1.25rem + env(safe-area-inset-bottom)); }
  .total-row { font-size: 1.1rem; }
}

.toast-success {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: #22c55e;
  color: #fff;
  padding: 1rem 2rem;
  border-radius: 1rem;
  font-size: 1rem;
  font-weight: 600;
  z-index: 9999;
  box-shadow: 0 8px 30px rgba(34,197,94,0.35);
  white-space: nowrap;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateX(-50%) translateY(20px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}

.payment-methods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.payment-method-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid #ddd;
  background: var(--white);
  cursor: pointer;
  transition: var(--transition);
  user-select: none;
}

.payment-method-card:hover {
  border-color: var(--secondary);
  background: rgba(245, 158, 11, 0.02);
}

.payment-method-card.active {
  border-color: var(--secondary);
  background: rgba(245, 158, 11, 0.05);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.checkbox-indicator {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: var(--white);
  transition: var(--transition);
}

.payment-method-card.active .checkbox-indicator {
  border-color: var(--secondary);
  background: var(--secondary);
  color: var(--white);
}

.method-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--primary);
}

.form-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-family: inherit;
  background-color: var(--white);
  color: var(--primary);
  cursor: pointer;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  padding-right: 2.5rem;
}

.form-select:hover {
  border-color: var(--secondary);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.form-select:focus {
  outline: none;
  border-color: var(--secondary);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.2);
}

.form-select option {
  padding: 0.5rem;
  background-color: var(--white);
  color: var(--primary);
}

.pdf-offscreen-container {
  position: absolute;
  left: -9999px;
  top: -9999px;
  width: 790px;
}

/* Warnings in checkout */
.auth-warning-box {
  background: rgba(37, 99, 235, 0.08);
  border: 1px solid rgba(37, 99, 235, 0.2);
  color: var(--accent);
  padding: 1rem;
  border-radius: 1rem;
  margin-bottom: 1.25rem;
  font-size: 0.9rem;
  line-height: 1.4;
  text-align: center;
}

.auth-warning-box a {
  color: var(--accent);
  text-decoration: underline;
}

.limit-warning-box {
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.25);
  color: #ef4444;
  padding: 1rem;
  border-radius: 1rem;
  margin-bottom: 1.25rem;
  font-size: 0.9rem;
  line-height: 1.4;
  text-align: center;
  font-weight: 500;
}

.pdf-invoice {
  font-family: 'Arial', sans-serif;
  color: #000;
  background: #fff;
  padding: 2.5rem;
}

.invoice-header {
  margin-bottom: 2rem;
  font-size: 0.9rem;
  line-height: 1.6;
}

.invoice-header p {
  margin: 0.25rem 0;
}

.section-title {
  font-size: 1.1rem;
  font-weight: bold;
  margin: 1.5rem 0 0.5rem 0;
  text-align: left;
}

.invoice-table, .grand-total-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 0.5rem;
}

.invoice-table th, .invoice-table td,
.grand-total-table td {
  border: 1px solid #000;
  padding: 0.4rem 0.6rem;
  font-size: 0.8rem;
  line-height: 1.3;
}

.invoice-table th {
  font-weight: bold;
  background-color: #fff;
  text-align: center;
}

.invoice-table td {
  text-align: left;
}

.table-total-row td {
  border-top: 1.5px solid #000;
}

.invoice-grand-total {
  margin-top: 1.5rem;
}

.grand-total-table td {
  border: 1px solid #000;
  padding: 0.6rem;
  font-size: 0.9rem;
}

@media (max-width: 600px) {
  .payment-methods-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
}

.input-error {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1) !important;
}

.error-message {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: block;
}

.invoice-logo-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #000;
  padding-bottom: 1rem;
}

.invoice-logo {
  height: 50px;
  width: auto;
}

.invoice-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #000;
  margin: 0;
}
</style>
