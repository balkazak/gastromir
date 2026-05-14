<template>
  <div class="contact-page">
    <section class="page-header section-padding">
      <div class="container">
        <h1>Связаться с <span>нами</span></h1>
        <p>Выберите удобный способ связи или оставьте заявку</p>
      </div>
    </section>

    <section class="contact-content section-padding">
      <div class="container">
        <div class="contact-grid">
          <div class="contact-info">
            <div class="info-group">
              <h3>Контакты</h3>
              <div class="info-item">
                <MapPin class="icon" />
                <div>
                  <p class="label">Адрес</p>
                  <p>г. Астана, Шоссе Алаш 4/2</p>
                </div>
              </div>
              <div class="info-item">
                <Mail class="icon" />
                <div>
                  <p class="label">Email</p>
                  <p>gastromir.kz@gmail.com</p>
                </div>
              </div>
              <div class="info-item">
                <Clock class="icon" />
                <div>
                  <p class="label">Режим работы</p>
                  <p>Ежедневно с 07:00 до 18:00</p>
                </div>
              </div>
            </div>

            <div class="info-group">
              <h3>Команда</h3>
              <div class="team-card">
                <div class="team-info">
                  <p class="name">Ибраев Руслан Тулегенович</p>
                  <p class="role">Руководитель</p>
                  <a href="tel:87021231414" class="phone">8 702 123 1414</a>
                </div>
              </div>
              <div class="team-card">
                <div class="team-info">
                  <p class="name">Гульжан</p>
                  <p class="role">Менеджер по снабжению</p>
                  <a href="tel:87015141404" class="phone">8 701 514 1404</a>
                </div>
              </div>
            </div>

            <div class="info-group requisites">
              <h3>Реквизиты</h3>
              <div class="req-grid">
                <div v-for="(val, key) in requisites" :key="key" class="req-item">
                  <span class="req-key">{{ key }}:</span>
                  <span class="req-val">{{ val }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="contact-form-container">
            <div class="form-card">
              <h2>Оставить заявку</h2>
              <p>Мы свяжемся с вами в течение 5–15 минут</p>
              
              <form @submit.prevent="handleSubmit" v-if="!submitted">
                <div class="form-group">
                  <label>Название ресторана</label>
                  <input type="text" v-model="formData.restaurant" placeholder="Укажите название" required />
                </div>
                <div class="form-group">
                  <label>Ваше имя</label>
                  <input type="text" v-model="formData.name" placeholder="Как к вам обращаться?" required />
                </div>
                <div class="form-group">
                  <label>Телефон</label>
                  <input type="tel" v-model="formData.phone" placeholder="+7 (___) ___ __ __" required />
                </div>
                <button type="submit" class="btn btn-primary btn-block" :disabled="isSubmitting">
                  {{ isSubmitting ? 'Отправка...' : 'Отправить заявку' }}
                </button>
              </form>

              <div v-else class="success-msg" v-motion-pop>
                <div class="check-icon">✓</div>
                <h3>Заявка принята!</h3>
                <p>Наш менеджер уже изучает ваш запрос и скоро позвонит.</p>
              </div>

              <div class="form-divider">ИЛИ</div>

              <div class="direct-actions">
                <a href="https://wa.me/77015141404" class="btn btn-whatsapp" target="_blank">
                  Написать в WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { MapPin, Mail, Clock, Phone } from 'lucide-vue-next'

const submitted = ref(false)
const isSubmitting = ref(false)
const formData = reactive({
  restaurant: '',
  name: '',
  phone: ''
})

const requisites = {
  'Компания': 'GASTROMIR',
  'ИП': 'ИП Сатубалдина З.А.',
  'БИН (ИИН)': '540725400961',
  'Банк': 'АО “Kaspi Bank”',
  'БИК': 'CASPKZKA',
  'КБе': '19',
  'Номер счёта': 'KZ44722S000001273436'
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    const response = await fetch('https://formspree.io/f/xkoyakek', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Ресторан: formData.restaurant,
        Имя: formData.name,
        Телефон: formData.phone
      })
    })

    if (response.ok) {
      submitted.value = true
    } else {
      alert('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.')
    }
  } catch (error) {
    console.error('Ошибка отправки формы:', error)
    alert('Произошла ошибка при отправке заявки. Пожалуйста, проверьте подключение и попробуйте позже.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.page-header {
  background: var(--primary);
  color: var(--white);
  padding-top: 12rem;
  text-align: center;
}

.page-header h1 span { color: var(--secondary); }

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 6rem;
}

@media (max-width: 768px) {
  .page-header { padding-top: 7rem; }
  .contact-grid { gap: 2rem; }
}

@media (max-width: 480px) {
  .page-header { padding-top: 5.5rem; }
  .contact-grid { gap: 1.5rem; }
}

.info-group { margin-bottom: 4rem; }
.info-group h3 { margin-bottom: 2rem; color: var(--primary); font-size: 1.5rem; }

@media (max-width: 768px) {
  .info-group { margin-bottom: 2rem; }
  .info-group h3 { margin-bottom: 1rem; font-size: 1.15rem; }
}

.info-item {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.info-item .icon { color: var(--primary-light); width: 24px; }
.info-item .label { font-size: 0.85rem; color: var(--gray); text-transform: uppercase; letter-spacing: 1px; }
.info-item p { font-weight: 600; }

.team-card {
  background: var(--white);
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  margin-bottom: 1.5rem;
}

.team-info .name { font-weight: 700; color: var(--primary); }
.team-info .role { font-size: 0.9rem; color: var(--gray); margin-bottom: 0.5rem; }
.team-info .phone { font-weight: 600; color: var(--primary-light); }

.req-grid { display: grid; gap: 0.75rem; }
.req-item { display: flex; justify-content: space-between; font-size: 0.9rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem; }
.req-key { color: var(--gray); }
.req-val { font-weight: 600; text-align: right; }

.form-card {
  background: var(--white);
  padding: 4rem;
  border-radius: 3rem;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  position: sticky;
  top: 100px;
}

@media (max-width: 768px) {
  .form-card { padding: 1.75rem; border-radius: 1.5rem; position: static; }
}

@media (max-width: 480px) {
  .form-card { padding: 1.25rem; border-radius: 1.25rem; }
}

.form-card h2 { margin-bottom: 0.5rem; color: var(--primary); }
.form-card p { color: var(--gray); margin-bottom: 2.5rem; }

@media (max-width: 768px) {
  .form-card h2 { font-size: 1.25rem; }
  .form-card p { font-size: 0.85rem; margin-bottom: 1.5rem; }
}

.form-group { margin-bottom: 1.5rem; }
.form-group label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem; }
.form-group input {
  width: 100%;
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid #ddd;
  background: #f8fafc;
  outline: none;
}

@media (max-width: 768px) {
  .form-group { margin-bottom: 1rem; }
  .form-group label { font-size: 0.75rem; margin-bottom: 0.35rem; }
  .form-group input { padding: 0.75rem; border-radius: 0.75rem; font-size: 0.85rem; }
}

.form-group input:focus { border-color: var(--primary-light); }

.btn-block { width: 100%; margin-top: 1rem; }

.form-divider {
  margin: 2rem 0;
  text-align: center;
  position: relative;
  color: var(--gray);
  font-size: 0.8rem;
  font-weight: 700;
}

.form-divider::before, .form-divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background: #eee;
}

.form-divider::before { left: 0; }
.form-divider::after { right: 0; }

.btn-whatsapp {
  background: #25D366;
  color: var(--white);
  width: 100%;
  padding: 1rem;
  border-radius: 1rem;
  text-align: center;
}

.success-msg { text-align: center; padding: 2rem 0; }
.check-icon {
  width: 60px;
  height: 60px;
  background: var(--primary-light);
  color: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 1.5rem;
}

@media (max-width: 992px) {
  .contact-grid { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .info-item { gap: 1rem; margin-bottom: 1rem; }
  .info-item .label { font-size: 0.75rem; }
  .info-item p { font-size: 0.85rem; }
  .team-card { padding: 1rem; margin-bottom: 0.75rem; }
  .team-info .name { font-size: 0.9rem; }
  .team-info .role { font-size: 0.8rem; }
  .team-info .phone { font-size: 0.85rem; }
  .req-item { font-size: 0.8rem; }
  .btn-whatsapp { padding: 0.75rem; font-size: 0.85rem; }
  .form-divider { margin: 1.25rem 0; font-size: 0.7rem; }
  .success-msg { padding: 1.5rem 0; }
  .check-icon { width: 48px; height: 48px; font-size: 1.5rem; }
}
</style>
