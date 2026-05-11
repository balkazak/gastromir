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
            <div class="total-row">
              <span>Итого к оплате:</span>
              <strong>{{ formatPrice(cartStore.totalPrice) }} ₸</strong>
            </div>
            <button 
              class="btn btn-secondary btn-block" 
              @click="generateInvoice" 
              :disabled="!orderData.customerName || !orderData.address || !orderData.phone"
            >
              Отправить заказ
            </button>
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
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, WidthType, BorderStyle } from 'docx'
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

const generateInvoice = async () => {
  const date = new Date().toLocaleDateString('ru-RU')
  const orderNum = `УД-${new Date().getTime().toString().slice(-6)}-01`

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [
            new TextRun({ text: "НАКЛАДНАЯ ДЛЯ ПЕЧАТИ", bold: true, size: 28 }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),
        new Paragraph({
          children: [new TextRun({ text: `№ ${orderNum}`, bold: true, size: 24 })],
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: `Клиент: ${orderData.customerName}`, bold: true, size: 22 })],
        }),
        new Paragraph({
          children: [new TextRun({ text: `Телефон: ${orderData.phone}` })],
        }),
        new Paragraph({
          children: [new TextRun({ text: `Адрес: ${orderData.address}` })],
        }),
        new Paragraph({
          children: [new TextRun({ text: `Дата: ${date}` })],
        }),
        new Paragraph({
          children: [new TextRun({ text: "Поставщик: Gastro Mir" })],
          spacing: { after: 400 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "⸻".repeat(20) })],
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "ТОВАРНАЯ ЧАСТЬ", bold: true })],
          spacing: { after: 200 },
        }),
        ...cartStore.items.map((item, index) => 
          new Paragraph({
            children: [
              new TextRun({ text: `${index + 1}. ${item.name} — ${item.quantity} × ${formatPrice(item.price)} = ${formatPrice(item.quantity * item.price)}` })
            ],
            spacing: { after: 100 }
          })
        ),
        new Paragraph({
          children: [new TextRun({ text: "⸻".repeat(20) })],
          spacing: { before: 200, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `ИТОГО К ОПЛАТЕ: ${formatPrice(cartStore.totalPrice)} тг`, bold: true, size: 24 })
          ],
          spacing: { after: 400 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "⸻".repeat(20) })],
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "ПРИМЕЧАНИЕ:", bold: true })],
        }),
        new Paragraph({
          children: [new TextRun({ text: "Спасибо за заказ." })],
        }),
        new Paragraph({
          children: [new TextRun({ text: "Castro Mir" })],
        }),
      ],
    }],
  })

  const blob = await Packer.toBlob(doc)
  saveAs(blob, `Накладная_${orderNum}.docx`)
  
  // Reset and Close
  alert('Заказ оформлен! Накладная скачана. Отправьте её на почту gastromir.kz@gmail.com')
  cartStore.clearCart()
  cartStore.closeModal()
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

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
