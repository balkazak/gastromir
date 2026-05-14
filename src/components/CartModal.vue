<template>
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
          </div>

          <div class="modal-footer">
            <p v-if="cartStore.hasWeightItems" class="weight-disclaimer">
              ⚖️ Для весовых товаров итоговая стоимость зависит от фактического веса и рассчитывается после сборки заказа.
            </p>
            <div class="total-row">
              <span>Итого к оплате:</span>
              <strong>{{ formatPrice(cartStore.totalPrice) }} ₸</strong>
            </div>
            
            <div class="footer-actions">
              <button 
                class="btn btn-whatsapp btn-block" 
                @click="sendToWhatsApp" 
                :disabled="!orderData.customerName || !orderData.phone"
              >
                Отправить в WhatsApp
              </button>
              
              <button 
                class="btn btn-secondary btn-block" 
                @click="generateInvoice" 
                :disabled="!orderData.customerName || !orderData.address || !orderData.phone"
              >
                Скачать накладную (Word)
              </button>
              
              <button 
                class="btn btn-outline-dark btn-block" 
                @click="sendToEmail" 
                :disabled="!orderData.customerName"
              >
                Отправить на Email
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
</template>

<script setup>
import { reactive } from 'vue'
import { X, Trash2, ShoppingCart } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cart'
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, WidthType, BorderStyle, ImageRun } from 'docx'
import { saveAs } from 'file-saver'

const cartStore = useCartStore()

const orderData = reactive({
  customerName: '',
  address: '',
  phone: ''
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU').format(price)
}

const sendToWhatsApp = () => {
  const itemsText = cartStore.items.map(item => `- ${item.name}: ${item.quantity} ${item.unit} x ${formatPrice(item.price)} тг`).join('\n')
  const totalText = `Итого: ${formatPrice(cartStore.totalPrice)} тг`
  const message = `👋 *Новый заказ в GASTROMIR!*\n\n*Ресторан:* ${orderData.customerName}\n*Телефон:* ${orderData.phone}\n*Адрес:* ${orderData.address}\n\n*Заказ:*\n${itemsText}\n\n*${totalText}*`
  
  const encodedMessage = encodeURIComponent(message)
  window.open(`https://wa.me/77015141404?text=${encodedMessage}`, '_blank')
}

const sendToEmail = () => {
  const itemsText = cartStore.items.map(item => `- ${item.name}: ${item.quantity} ${item.unit} x ${formatPrice(item.price)} тг`).join('%0D%0A')
  const totalText = `Итого: ${formatPrice(cartStore.totalPrice)} тг`
  const body = `Новый заказ в GASTROMIR%0D%0A%0D%0AРесторан: ${orderData.customerName}%0D%0AТелефон: ${orderData.phone}%0D%0AАдрес: ${orderData.address}%0D%0A%0D%0AЗаказ:%0D%0A${itemsText}%0D%0A%0D%0A${totalText}`
  
  window.location.href = `mailto:gastromir.kz@gmail.com?subject=Новый заказ от ${orderData.customerName}&body=${body}`
}

const generateInvoice = async () => {
  const date = new Date().toLocaleDateString('ru-RU')
  const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  const orderNum = `УД-${new Date().getTime().toString().slice(-6)}-01`

  let imageBuffer = null
  try {
    const response = await fetch('/src/assets/logo.png')
    const blob = await response.blob()
    imageBuffer = await blob.arrayBuffer()
  } catch (e) {
    console.error("Could not load logo", e)
  }

  const createText = (text, bold = false, size = 22) => new TextRun({ text, bold, size })
  const createLine = (text, bold = false, size = 22) => new Paragraph({ children: [createText(text, bold, size)] })
  const createCentered = (text, bold = false, size = 22) => new Paragraph({ children: [createText(text, bold, size)], alignment: AlignmentType.CENTER })

  const headerLogo = imageBuffer ? [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new ImageRun({
          data: imageBuffer,
          transformation: {
            width: 250,
            height: 100,
          },
        })
      ]
    })
  ] : []

  const tableHeaderRow = new TableRow({
    children: [
      new TableCell({ children: [createLine("№", true)], width: { size: 10, type: WidthType.PERCENTAGE } }),
      new TableCell({ children: [createLine("Наименование", true)], width: { size: 45, type: WidthType.PERCENTAGE } }),
      new TableCell({ children: [createLine("Кол-во", true)], width: { size: 15, type: WidthType.PERCENTAGE } }),
      new TableCell({ children: [createLine("Цена", true)], width: { size: 15, type: WidthType.PERCENTAGE } }),
      new TableCell({ children: [createLine("Сумма", true)], width: { size: 15, type: WidthType.PERCENTAGE } }),
    ]
  })

  const tableRows = cartStore.items.map((item, index) => {
    return new TableRow({
      children: [
        new TableCell({ children: [createLine(`${index + 1}.`)] }),
        new TableCell({ children: [createLine(`${item.name}`)] }),
        new TableCell({ children: [createLine(`${item.quantity} ${item.unit}`)] }),
        new TableCell({ children: [createLine(formatPrice(item.price))] }),
        new TableCell({ children: [createLine(formatPrice(item.quantity * item.price))] }),
      ]
    })
  })

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        ...headerLogo,
        createCentered("==============================="),
        createCentered("НАКЛАДНАЯ", true, 28),
        createCentered("==============================="),
        new Paragraph({ spacing: { after: 200 } }),

        createLine("Поставщик: ИП Сатубалдина З.А."),
        createLine("БИН/ИИН: 540725400961"),
        createLine("Телефон: +7 701 514 14 04"),
        new Paragraph({ spacing: { after: 200 } }),
        
        createLine(`Получатель: ${orderData.customerName}`),
        createLine(`Телефон: ${orderData.phone}`),
        new Paragraph({ spacing: { after: 200 } }),
        
        createLine(`Дата: ${date}`),
        createLine(`Время: ${time}`),
        new Paragraph({ spacing: { after: 200 } }),

        createCentered("--------------------------------"),
        createCentered("ТОВАР", true),
        createCentered("--------------------------------"),
        new Paragraph({ spacing: { after: 200 } }),
        
        new Table({
          rows: [tableHeaderRow, ...tableRows],
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
          }
        }),
        new Paragraph({ spacing: { after: 200 } }),

        createCentered("--------------------------------"),
        createLine(`ИТОГО: ${formatPrice(cartStore.totalPrice)} тг`, true),
        createLine(`Скидка: 0 тг`),
        createLine(`К ОПЛАТЕ: ${formatPrice(cartStore.totalPrice)} тг`, true, 24),
        new Paragraph({ spacing: { after: 200 } }),

        createCentered("--------------------------------"),
        createCentered("СПОСОБ ОПЛАТЫ", true),
        createCentered("--------------------------------"),
        createLine("☐ Наличный расчет"),
        createLine("☐ Перевод Kaspi"),
        createLine("☐ Kaspi QR"),
        createLine("☐ Счет на оплату"),
        createLine("☐ Отсрочка платежа"),
        new Paragraph({ spacing: { after: 200 } }),

        createLine("Kaspi: ____________________"),
        new Paragraph({ spacing: { after: 200 } }),
        
        createLine("Счет на оплату №: _________"),
        createLine("Договор №: ________________"),
        createLine("Банк: _____________________"),
        new Paragraph({ spacing: { after: 200 } }),

        createLine("Статус оплаты:"),
        createLine("☐ Оплачено"),
        createLine("☐ Частично оплачено"),
        createLine("☐ Ожидает оплаты"),
        new Paragraph({ spacing: { after: 200 } }),

        createCentered("--------------------------------"),
        createCentered("ИНФОРМАЦИЯ ДОСТАВКИ", true),
        createCentered("--------------------------------"),
        createLine(`Курьер: ___________________`),
        createLine(`Адрес: ${orderData.address}`),
        createLine(`Комментарий: ______________`),
        new Paragraph({ spacing: { after: 200 } }),

        createCentered("==============================="),
        createCentered("Спасибо за заказ!", true, 24),
        createCentered("GASTRO MIR", true, 28),
        createCentered("==============================="),
        new Paragraph({ spacing: { after: 200 } }),

        ...(cartStore.hasWeightItems ? [
          new Paragraph({
            children: [new TextRun({ text: "ПРИМЕЧАНИЕ:", bold: true })],
          }),
          new Paragraph({
            children: [new TextRun({ text: "Для весовых товаров итоговая стоимость зависит от фактического веса и рассчитывается после сборки заказа.", italics: true })],
          }),
        ] : []),
      ],
    }],
  })

  const blob = await Packer.toBlob(doc)
  saveAs(blob, `Накладная_${orderNum}.docx`)
  
  // Also offer to send via WhatsApp
  const confirmWA = confirm('Накладная скачана. Отправить заказ в WhatsApp?')
  if (confirmWA) sendToWhatsApp()
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
    max-height: 100vh; 
    border-radius: 0; 
    height: 100%;
  }
  .modal-body { padding: 1.25rem; }
  .cart-item { gap: 1rem; }
  .order-form { padding: 1.5rem; border-radius: 1.5rem; }
  .modal-footer { padding: 1.25rem; }
  .total-row { font-size: 1.1rem; }
}
</style>
