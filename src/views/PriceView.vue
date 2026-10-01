<template>
  <div class="price-page">
    <section class="page-header section-padding">
      <div class="container text-center">
        <div class="header-badge">Оптовый прайс HoReCa</div>
        <h1>Оптовый прайс-лист на продукты для ресторанов</h1>
        <p>Актуальные оптовые цены для предприятий общепита г. Астана. Скачайте PDF или запросите индивидуальные условия.</p>
      </div>
    </section>

    <section class="price-content section-padding">
      <div class="container">
        <div class="price-action-cards">
          <!-- Download Card -->
          <div class="action-card highlight">
            <div class="card-icon">
              <Download :size="32" />
            </div>
            <h3>Скачать полный каталог (PDF)</h3>
            <p>Свежий прайс-лист со всеми товарными позициями, фасовками и производителями.</p>
            <router-link to="/catalog" class="btn btn-secondary">
              Перейти к скачиванию PDF
            </router-link>
          </div>

          <!-- Request Special Terms Card -->
          <div class="action-card">
            <div class="card-icon">
              <FileCheck :size="32" />
            </div>
            <h3>Запросить коммерческое предложение</h3>
            <p>Для сетевых ресторанов, крупных заведений и отелей действуют объемные скидки и отсрочка платежа.</p>
            <a :href="whatsappUrl" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp" @click="handleWhatsApp('price_page')">
              Запросить прайс в WhatsApp
            </a>
          </div>
        </div>

        <!-- Explanation of Dynamic / Volume Pricing (TZ Page 21) -->
        <div class="pricing-explanation-box">
          <h2>Как формируются оптовые цены в GASTROMIR</h2>
          <div class="factors-grid">
            <div class="factor-item">
              <h4>📦 Объем регулярной закупки</h4>
              <p>Чем выше еженедельный объем закупа вашего ресторана, тем более гибкие цены мы можем зафиксировать в договоре поставки.</p>
            </div>
            <div class="factor-item">
              <h4>🥬 Сезонность свежих овощей и зелени</h4>
              <p>Цены на свежую продукцию обновляются ежедневно на основании прямых поставок от агрокомплексов и импортеров.</p>
            </div>
            <div class="factor-item">
              <h4>🤝 Индивидуальные условия оплаты</h4>
              <p>Для постоянных клиентов доступна работа с отсрочкой платежа и фиксацией лимита по накладным.</p>
            </div>
          </div>
        </div>

        <!-- Lead Form -->
        <div class="price-form-wrap">
          <div class="form-container-card">
            <h3>Запросить коммерческие условия для вашего заведения</h3>
            <p>Оставьте заявку, и мы вышлем индивидуальный расчет снабжения с максимальной выгодой.</p>

            <form @submit.prevent="submitPriceLead" class="price-lead-form">
              <div class="form-row">
                <input type="text" v-model="form.restaurant" placeholder="Название ресторана / кафе" required />
                <input type="text" v-model="form.name" placeholder="Ваше имя" required />
              </div>
              <div class="form-row">
                <input type="tel" v-model="form.phone" placeholder="Телефон" required />
                <input type="text" v-model="form.volume" placeholder="Примерный объем закупки в месяц" />
              </div>
              <textarea v-model="form.comment" rows="3" placeholder="Какие категории товаров интересуют в первую очередь?"></textarea>
              <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                {{ isSubmitting ? 'Отправка...' : 'Получить персональный прайс' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Download, FileCheck } from 'lucide-vue-next'
import { useToastStore } from '@/stores/toast'
import { trackWhatsAppClick, trackEvent } from '@/utils/analytics'
import { submitForm } from '@/services/formService'

const toastStore = useToastStore()

const whatsappUrl = computed(() => {
  const msg = encodeURIComponent('Здравствуйте! Прошу предоставить актуальный оптовый прайс-лист для нашего ресторана в Астане.')
  return `https://wa.me/77015141404?text=${msg}`
})

const form = ref({
  restaurant: '',
  name: '',
  phone: '',
  volume: '',
  comment: ''
})
const isSubmitting = ref(false)

const submitPriceLead = async () => {
  isSubmitting.value = true
  try {
    await submitForm({
      formType: 'price_request',
      subject: `Запрос оптового прайса от ${form.value.restaurant}`,
      restaurant: form.value.restaurant,
      name: form.value.name,
      phone: form.value.phone,
      message: form.value.comment,
      details: {
        volume: form.value.volume || 'Не указан'
      }
    })

    trackEvent('submit_form', { form: 'price_request' })
    toastStore.success('Запрос успешно принят! Менеджер подготовит прайс и свяжется с вами.')
    form.value = { restaurant: '', name: '', phone: '', volume: '', comment: '' }
  } catch (e) {
    console.error('Ошибка отправки формы:', e)
    toastStore.error(e.message || 'Произошла ошибка, пожалуйста свяжитесь с нами в WhatsApp.')
  } finally {
    isSubmitting.value = false
  }
}

const handleWhatsApp = (src) => {
  trackWhatsAppClick(src)
}
</script>

<style scoped>
.page-header {
  background: linear-gradient(135deg, #0B1221 0%, #172136 100%);
  color: #FFFFFF;
  padding: 11rem 0 4rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.header-badge {
  display: inline-block;
  padding: 0.35rem 1rem;
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid #F59E0B;
  color: #F59E0B;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
}

h1 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.page-header p {
  color: #94A3B8;
  font-size: 1.2rem;
  max-width: 750px;
  margin: 0 auto;
}

.price-action-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.action-card {
  background: #FFFFFF;
  padding: 3rem 2.5rem;
  border-radius: 1.5rem;
  border: 1px solid #E2E8F0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.action-card.highlight {
  border-color: #F59E0B;
  box-shadow: 0 10px 30px rgba(245, 158, 11, 0.12);
}

.card-icon {
  color: #F59E0B;
  margin-bottom: 1.5rem;
}

.action-card h3 {
  font-size: 1.4rem;
  color: #0B1221;
  margin-bottom: 0.75rem;
}

.action-card p {
  color: #64748B;
  font-size: 0.95rem;
  margin-bottom: 2rem;
}

.btn-whatsapp {
  background: #25D366;
  color: #FFFFFF;
  text-align: center;
}

.pricing-explanation-box {
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 1.5rem;
  padding: 3rem;
  margin-bottom: 4rem;
}

.pricing-explanation-box h2 {
  font-size: 1.8rem;
  color: #0B1221;
  margin-bottom: 2rem;
  text-align: center;
}

.factors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
}

.factor-item h4 {
  font-size: 1.15rem;
  color: #0B1221;
  margin-bottom: 0.5rem;
}

.factor-item p {
  color: #64748B;
  font-size: 0.9rem;
}

.price-form-wrap {
  max-width: 800px;
  margin: 0 auto;
}

.form-container-card {
  background: #0B1221;
  color: #FFFFFF;
  border-radius: 2rem;
  padding: 3.5rem 3rem;
}

.form-container-card h3 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.form-container-card p {
  color: #94A3B8;
  margin-bottom: 2rem;
}

.price-lead-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.price-lead-form input, .price-lead-form textarea {
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid #334155;
  background: #1E293B;
  color: #FFFFFF;
  outline: none;
  font-family: inherit;
}

.price-lead-form input:focus, .price-lead-form textarea:focus {
  border-color: #F59E0B;
}

@media (max-width: 768px) {
  .page-header {
    padding: 7rem 0 3rem;
  }
  h1 {
    font-size: 2rem;
  }
  .form-row {
    grid-template-columns: 1fr;
  }
  .form-container-card {
    padding: 2rem 1.5rem;
  }
}
</style>
