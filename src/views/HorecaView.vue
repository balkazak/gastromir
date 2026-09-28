<template>
  <div class="horeca-page">
    <!-- Hero Section -->
    <section class="horeca-hero section-padding">
      <div class="container hero-content-wrapper">
        <div class="hero-badge">Поставщик HoReCa №1 в Астане</div>
        <h1>Поставщик продуктов для ресторанов и кафе в Астане</h1>
        <p class="hero-subtitle">
          Комплексное снабжение заведений общественного питания: от свежих овощей, мяса и сыров до профессиональной бакалеи, кофе и хозтоваров. Более 1000 позиций в одном заказе.
        </p>

        <div class="hero-cta-buttons">
          <router-link to="/catalog" class="btn btn-secondary">Собрать заказ</router-link>
          <a href="#quick-order" class="btn btn-primary">Отправить список закупки</a>
          <a :href="whatsappUrl" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp" @click="handleWhatsApp('horeca_hero')">
            Заказать в WhatsApp
          </a>
        </div>

        <div class="hero-features-strip">
          <div class="strip-item">
            <span class="strip-val">1 заказ</span>
            <span class="strip-label">вместо десятка поставщиков</span>
          </div>
          <div class="strip-item">
            <span class="strip-val">07:00 – 18:00</span>
            <span class="strip-label">ежедневная доставка по Астане</span>
          </div>
          <div class="strip-item">
            <span class="strip-val">Форма 3-2</span>
            <span class="strip-label">полный пакет закрывающих документов</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Target Segments Section -->
    <section class="segments-section section-padding">
      <div class="container">
        <div class="section-title-wrap text-center">
          <span class="sub-badge">Кому подходит GASTROMIR</span>
          <h2>Снабжение всех форматов HoReCa</h2>
          <p>Индивидуальный подход к специфике и графику вашего заведения</p>
        </div>

        <div class="segments-grid">
          <div class="segment-card" v-for="(seg, idx) in segments" :key="idx" v-motion-slide-visible-bottom>
            <div class="segment-icon">
              <component :is="seg.icon" :size="28" />
            </div>
            <h3>{{ seg.title }}</h3>
            <p>{{ seg.desc }}</p>
            <ul class="segment-tags">
              <li v-for="(tag, tIdx) in seg.tags" :key="tIdx">{{ tag }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Why One Supplier Section -->
    <section class="why-one-section section-padding bg-alt">
      <div class="container">
        <div class="why-grid">
          <div class="why-text">
            <span class="sub-badge">Выгода для шефа и закупщика</span>
            <h2>Одна закупка вместо десятка поставщиков</h2>
            <p class="lead-text">
              Больше не нужно тратить часы на созвоны с разными поставщиками овощей, бакалеи, сыров и хозтоваров.
            </p>
            <ul class="benefit-list">
              <li>
                <CheckCircle2 class="check-icon" :size="22" />
                <div>
                  <strong>Экономия до 3 часов в день</strong>
                  <p>Формируйте закупку онлайн или отправляйте список за 30 секунд.</p>
                </div>
              </li>
              <li>
                <CheckCircle2 class="check-icon" :size="22" />
                <div>
                  <strong>Единая доставка и одна машина</strong>
                  <p>Продукты, напитки и хозяйственные товары приезжают одной поставкой.</p>
                </div>
              </li>
              <li>
                <CheckCircle2 class="check-icon" :size="22" />
                <div>
                  <strong>Прозрачные документы и история</strong>
                  <p>Все накладные формы 3-2 и электронные акты доступны в личном кабинете.</p>
                </div>
              </li>
              <li>
                <CheckCircle2 class="check-icon" :size="22" />
                <div>
                  <strong>Повтор заказа в 1 клик</strong>
                  <p>Сохраняйте шаблоны закупки и повторяйте прошлые заказы мгновенно.</p>
                </div>
              </li>
            </ul>
          </div>

          <div class="why-banner-card">
            <div class="banner-inner">
              <h3>Получите персональные условия поставки</h3>
              <p>Оставьте контакты заведения, и менеджер предоставит индивидуальный прайс и условия отсрочки.</p>
              <form @submit.prevent="handleLeadSubmit" class="lead-form">
                <input type="text" v-model="leadForm.restaurant" placeholder="Название заведения" required />
                <input type="tel" v-model="leadForm.phone" placeholder="+7 (___) ___-__-__" required />
                <button type="submit" class="btn btn-secondary btn-block" :disabled="isSubmittingLead">
                  {{ isSubmittingLead ? 'Отправка...' : 'Получить условия поставки' }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Purchase List Block (Page 5 & 10 requirement) -->
    <section id="quick-order" class="quick-order-section section-padding">
      <div class="container">
        <div class="quick-order-card">
          <div class="order-card-header text-center">
            <FileSpreadsheet class="order-icon" :size="40" />
            <h2>Есть готовый список закупки? Отправьте его нам</h2>
            <p>Принимаем списки в любом формате: Excel, PDF, фотография блокнота, текстовое сообщение или WhatsApp.</p>
          </div>

          <div class="upload-options-grid">
            <div class="upload-box text-box">
              <label>Вставьте текст закупки сюда:</label>
              <textarea 
                v-model="quickText" 
                rows="5" 
                placeholder="Например:&#10;Моцарелла Bonfesto - 5 кг&#10;Мука цельнозерновая - 2 мешка&#10;Масло подсолнечное Олейна - 3 кор&#10;Фреш апельсин - 10 кг"
              ></textarea>
              <button @click="submitQuickText" class="btn btn-primary" :disabled="!quickText.trim() || isSubmittingQuick">
                {{ isSubmittingQuick ? 'Отправка...' : 'Отправить список закупки' }}
              </button>
            </div>

            <div class="upload-box direct-wa-box">
              <h4>Мгновенная отправка списка</h4>
              <p>Сфотографируйте накладную или перешлите файл из чата прямо нашему дежурному менеджеру в WhatsApp:</p>
              <a 
                :href="whatsappUrl" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="btn btn-whatsapp btn-large"
                @click="handleWhatsApp('quick_order_box')"
              >
                <MessageSquare :size="20" /> Отправить файл в WhatsApp
              </a>
              <span class="mgr-phone">Или позвоните: <a href="tel:87015141404">+7 (701) 514-14-04</a></span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section section-padding">
      <div class="container">
        <div class="section-title-wrap text-center">
          <span class="sub-badge">Часто задаваемые вопросы</span>
          <h2>Вопросы закупщиков HoReCa</h2>
        </div>

        <div class="faq-accordion">
          <div 
            v-for="(item, idx) in faqItems" 
            :key="idx" 
            class="faq-card"
            :class="{ open: openFaqIndex === idx }"
            @click="toggleFaq(idx)"
          >
            <div class="faq-question">
              <h4>{{ item.q }}</h4>
              <ChevronDown class="faq-chevron" :size="20" />
            </div>
            <div v-show="openFaqIndex === idx" class="faq-answer">
              <p>{{ item.a }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  Utensils, 
  Coffee, 
  Wine, 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  FileSpreadsheet, 
  MessageSquare, 
  ChevronDown 
} from 'lucide-vue-next'
import { useToastStore } from '@/stores/toast'
import { trackWhatsAppClick, trackUploadPurchaseList, trackEvent } from '@/utils/analytics'

const toastStore = useToastStore()

const whatsappUrl = computed(() => {
  const msg = encodeURIComponent('Здравствуйте! Интересуют условия комплексного снабжения для нашего заведения в Астане.')
  return `https://wa.me/77015141404?text=${msg}`
})

const segments = [
  {
    icon: Utensils,
    title: 'Для ресторанов',
    desc: 'Регулярная стабильная поставка продуктов, мяса, сыров и хозтоваров. Четкое соблюдение таймингов утренней поставки.',
    tags: ['Свежесть', 'Объемные скидки', 'Форма 3-2']
  },
  {
    icon: Coffee,
    title: 'Для кофеен и пекарен',
    desc: 'Профессиональное молоко, сиропы, зерновой кофе, мука, масла, упаковка и одноразовая посуда.',
    tags: ['Кофе', 'Молоко Barista', 'Упаковка']
  },
  {
    icon: Wine,
    title: 'Для баров и лаунджей',
    desc: 'Соки, напитки, фрукты, лед, салфетки, барный инвентарь и моющие средства в нужных объемах.',
    tags: ['Напитки', 'Барный закуп', 'Расходники']
  },
  {
    icon: Building2,
    title: 'Для отелей и гостиниц',
    desc: 'Комплексное снабжение ресторанной службы отеля, шведской линии и хозяйственного блока.',
    tags: ['Комплексный закуп', 'Отсрочка', 'Договор']
  },
  {
    icon: Sparkles,
    title: 'Для кейтеринга',
    desc: 'Крупные оптовые партии под банкеты и выездные мероприятия с доставкой точно к указанному времени.',
    tags: ['Срочные объемы', 'Спецзаказ', 'Доставка к таймингу']
  }
]

const leadForm = ref({ restaurant: '', phone: '' })
const isSubmittingLead = ref(false)

const handleLeadSubmit = async () => {
  isSubmittingLead.value = true
  try {
    const payload = new FormData()
    payload.append("access_key", "a4c51ae1-a7d6-4ac4-9d54-3183cb69f4f5")
    payload.append("subject", `Запрос условий поставки HoReCa: ${leadForm.value.restaurant}`)
    payload.append("Заведение", leadForm.value.restaurant)
    payload.append("Телефон", leadForm.value.phone)

    await fetch('https://api.web3forms.com/submit', { method: 'POST', body: payload })
    toastStore.success('Спасибо! Менеджер свяжется с вами в течение 15 минут.')
    trackEvent('submit_form', { form: 'horeca_lead' })
    leadForm.value = { restaurant: '', phone: '' }
  } catch (e) {
    toastStore.error('Ошибка отправки заявки, пожалуйста напишите нам в WhatsApp.')
  } finally {
    isSubmittingLead.value = false
  }
}

const quickText = ref('')
const isSubmittingQuick = ref(false)

const submitQuickText = async () => {
  isSubmittingQuick.value = true
  try {
    const payload = new FormData()
    payload.append("access_key", "a4c51ae1-a7d6-4ac4-9d54-3183cb69f4f5")
    payload.append("subject", "Быстрый список закупки HoReCa")
    payload.append("Список товаров", quickText.value)

    await fetch('https://api.web3forms.com/submit', { method: 'POST', body: payload })
    trackUploadPurchaseList('text')
    toastStore.success('Список закупки передан менеджеру! Мы свяжемся с расчетом.')
    quickText.value = ''
  } catch (e) {
    toastStore.error('Не удалось отправить список, перешлите его нам в WhatsApp.')
  } finally {
    isSubmittingQuick.value = false
  }
}

const openFaqIndex = ref(0)
const toggleFaq = (idx) => {
  openFaqIndex.value = openFaqIndex.value === idx ? -1 : idx
}

const faqItems = [
  {
    q: 'Как заказать продукты для ресторана?',
    a: 'Вы можете оформить заказ онлайн через наш каталог, вставив текстовый список в форму быстрого заказа, либо отправить фото/Excel накладную прямо менеджеру в WhatsApp.'
  },
  {
    q: 'Есть ли доставка по Астане?',
    a: 'Да, доставка осуществляется ежедневно по городу Астана и прилегающим районам с 07:00 до 18:00.'
  },
  {
    q: 'Предоставляются ли закрывающие документы (Форма 3-2)?',
    a: 'Да, ИП Ибраев Р.Т. работает официально. Все накладные установленной формы 3-2 и акты сверки формируются автоматически и доступны в личном кабинете.'
  },
  {
    q: 'Можно ли объединить продукты и хозяйственные товары в одну поставку?',
    a: 'Да! Это наше ключевое преимущество: кухня получает продукты питания, а бар и зал — моющие средства, упаковку и расходники одной доставкой.'
  },
  {
    q: 'Есть ли персональный менеджер?',
    a: 'Каждому подключенному ресторану назначается персональный менеджер по снабжению, который контролирует наличие и спецзаказы.'
  }
]

const handleWhatsApp = (source) => {
  trackWhatsAppClick(source)
}
</script>

<style scoped>
.horeca-hero {
  background: linear-gradient(135deg, #0B1221 0%, #151F33 100%);
  color: #FFFFFF;
  padding: 11rem 0 5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.hero-badge {
  display: inline-block;
  padding: 0.4rem 1rem;
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid #F59E0B;
  color: #F59E0B;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

h1 {
  font-size: 3.2rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  max-width: 900px;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #94A3B8;
  max-width: 800px;
  line-height: 1.6;
  margin-bottom: 2.5rem;
}

.hero-cta-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 3.5rem;
}

.btn-whatsapp {
  background: #25D366;
  color: #FFFFFF;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-whatsapp:hover {
  filter: brightness(1.1);
  transform: translateY(-2px);
}

.hero-features-strip {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.strip-item {
  display: flex;
  flex-direction: column;
}

.strip-val {
  font-size: 1.4rem;
  font-weight: 800;
  color: #F59E0B;
}

.strip-label {
  font-size: 0.85rem;
  color: #94A3B8;
}

.sub-badge {
  color: #F59E0B;
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: inline-block;
  margin-bottom: 0.5rem;
}

.segments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.segment-card {
  background: #FFFFFF;
  padding: 2.5rem 2rem;
  border-radius: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid #E2E8F0;
  transition: transform 0.3s ease;
}

.segment-card:hover {
  transform: translateY(-5px);
}

.segment-icon {
  width: 56px;
  height: 56px;
  background: #FEF3C7;
  color: #D97706;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.segment-card h3 {
  font-size: 1.4rem;
  color: #0B1221;
  margin-bottom: 0.75rem;
}

.segment-card p {
  color: #64748B;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.segment-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
}

.segment-tags li {
  background: #F1F5F9;
  color: #475569;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
}

.bg-alt {
  background: #F8FAFC;
}

.why-grid {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 4rem;
  align-items: center;
}

.lead-text {
  font-size: 1.15rem;
  color: #475569;
  margin-bottom: 2rem;
}

.benefit-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.benefit-list li {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.check-icon {
  color: #10B981;
  flex-shrink: 0;
  margin-top: 3px;
}

.why-banner-card {
  background: #0B1221;
  color: #FFFFFF;
  padding: 3rem 2.5rem;
  border-radius: 2rem;
  box-shadow: 0 20px 40px rgba(11, 18, 33, 0.25);
}

.banner-inner h3 {
  font-size: 1.6rem;
  margin-bottom: 1rem;
  color: #FFFFFF;
}

.banner-inner p {
  color: #94A3B8;
  font-size: 0.95rem;
  margin-bottom: 2rem;
}

.lead-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.lead-form input {
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid #334155;
  background: #1E293B;
  color: #FFFFFF;
  outline: none;
}

.lead-form input:focus {
  border-color: #F59E0B;
}

.quick-order-section {
  background: #FFFFFF;
}

.quick-order-card {
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 2rem;
  padding: 3.5rem 3rem;
}

.order-icon {
  color: #F59E0B;
  margin-bottom: 1rem;
}

.upload-options-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 3rem;
  margin-top: 2.5rem;
}

.upload-box textarea {
  width: 100%;
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid #CBD5E1;
  outline: none;
  font-family: inherit;
  margin: 0.5rem 0 1rem;
}

.direct-wa-box {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 1.5rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.direct-wa-box h4 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.direct-wa-box p {
  font-size: 0.9rem;
  color: #64748B;
  margin-bottom: 1.5rem;
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1.05rem;
}

.mgr-phone {
  margin-top: 1rem;
  font-size: 0.85rem;
  color: #64748B;
}

.mgr-phone a {
  color: #0B1221;
  font-weight: 700;
}

.faq-accordion {
  max-width: 800px;
  margin: 3rem auto 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-card {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 1rem;
  padding: 1.25rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.faq-question h4 {
  font-size: 1.05rem;
  color: #0B1221;
}

.faq-chevron {
  color: #94A3B8;
  transition: transform 0.2s ease;
}

.faq-card.open .faq-chevron {
  transform: rotate(180deg);
}

.faq-answer {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #F1F5F9;
  color: #64748B;
  font-size: 0.95rem;
  line-height: 1.6;
}

@media (max-width: 992px) {
  .why-grid, .upload-options-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .horeca-hero {
    padding: 7rem 0 3rem;
  }
  h1 {
    font-size: 2.2rem;
  }
  .quick-order-card {
    padding: 2rem 1.5rem;
  }
}
</style>
