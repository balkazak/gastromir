<template>
  <div class="home-page">
    <!-- Hero Section (TZ Sections 1-3) -->
    <section class="hero">
      <div class="container hero-grid">
        <div 
          class="hero-content"
          v-motion
          :initial="{ opacity: 0, x: -40 }"
          :enter="{ opacity: 1, x: 0, transition: { duration: 700 } }"
        >
          <div class="badge">Единый поставщик HoReCa в Астане</div>
          <h1>Продукты и товары для ресторанов — <span>в одном заказе</span></h1>
          <p class="hero-desc">
            GASTROMIR — поставщик продуктов и хозяйственных товаров для ресторанов, кафе, баров и других предприятий HoReCa в Астане. Более 1 000 товаров для ежедневной работы кухни.
          </p>

          <!-- Main CTAs (TZ Page 2) -->
          <div class="hero-actions">
            <router-link to="/catalog" class="btn btn-secondary btn-hero">
              <ShoppingCart :size="18" /> Собрать заказ
            </router-link>
            <a href="#quick-order-section" class="btn btn-primary btn-hero">
              <FileSpreadsheet :size="18" /> Отправить список закупки
            </a>
            <router-link to="/catalog" class="btn btn-outline btn-hero">
              Смотреть каталог
            </router-link>
            <a 
              :href="whatsappHeroUrl" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="btn btn-whatsapp btn-hero"
              @click="trackWhatsApp('hero_cta')"
            >
              <MessageCircle :size="18" /> Заказать в WhatsApp
            </a>
          </div>

          <div class="hero-stats">
            <div class="stat">
              <span class="stat-num">1 поставщик</span>
              <span class="stat-label">продукты + хозтовары</span>
            </div>
            <div class="stat">
              <span class="stat-num">1 000+</span>
              <span class="stat-label">товаров в наличии</span>
            </div>
            <div class="stat">
              <span class="stat-num">Форма 3-2</span>
              <span class="stat-label">накладные в личном кабинете</span>
            </div>
          </div>
        </div>

        <div 
          class="hero-image"
          v-motion
          :initial="{ opacity: 0, scale: 0.9 }"
          :enter="{ opacity: 1, scale: 1, transition: { duration: 900 } }"
        >
          <div class="image-wrapper">
             <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Поставщик продуктов HoReCa Астана" />
             <div class="floating-card">
                <Zap class="icon" />
                <div>
                  <h4>Быстрый заказ</h4>
                  <p>Повтор прошлой закупки в 1 клик</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Block 2: Почему GASTROMIR & 3 Главных сценария закупки (TZ Sections 4-5) -->
    <section class="scenarios-section section-padding">
      <div class="container">
        <div class="section-header center">
          <span class="sub-badge">Простой и быстрый процесс</span>
          <h2>3 удобных способа сделать закупку</h2>
          <p>Выберите сценарий, который экономит больше всего времени шеф-повару и закупщику</p>
        </div>

        <div class="scenarios-grid">
          <div class="scenario-card" v-motion-slide-visible-bottom>
            <div class="scenario-step-badge">Вариант 1</div>
            <div class="sc-icon"><ShoppingBag :size="28" /></div>
            <h3>Через онлайн-каталог</h3>
            <p>Каталог → выбор категории → количество → корзина → подтверждение заказа за 1 минуту.</p>
            <router-link to="/catalog" class="card-link">Открыть каталог →</router-link>
          </div>

          <div class="scenario-card highlight" v-motion-slide-visible-bottom>
            <div class="scenario-step-badge accent">Вариант 2</div>
            <div class="sc-icon"><FileSpreadsheet :size="28" /></div>
            <h3>Через список закупки</h3>
            <p>Отправьте Excel, PDF, фото накладной или рукописный список из WhatsApp менеджеру.</p>
            <a href="#quick-order-section" class="card-link">Отправить список →</a>
          </div>

          <div class="scenario-card" v-motion-slide-visible-bottom>
            <div class="scenario-step-badge">Вариант 3</div>
            <div class="sc-icon"><RotateCcw :size="28" /></div>
            <h3>Через повторный заказ</h3>
            <p>Откройте историю накладных в личном кабинете и нажмите «Повторить заказ» в один клик.</p>
            <router-link to="/profile" class="card-link">В личный кабинет →</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Block 6: Категории товаров (TZ Section 6) -->
    <section class="categories-preview section-padding bg-light">
      <div class="container">
        <div class="section-header center">
          <span class="sub-badge">Ассортимент</span>
          <h2>Основные категории для кухни и зала</h2>
          <p>Все товарные группы сертифицированы и доступны для оперативного снабжения заведений в Астане</p>
        </div>

        <div class="categories-grid">
          <div 
            v-for="(cat, idx) in categoriesList" 
            :key="idx" 
            class="category-tile"
            @click="goToCategory(cat.name)"
          >
            <span class="cat-emoji">{{ cat.icon }}</span>
            <h4>{{ cat.name }}</h4>
            <span class="cat-link-text">Смотреть товары</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Block 7: ПОЧЕМУ УДОБНО ЗАКУПАТЬ У ОДНОГО ПОСТАВЩИКА (TZ Section 7) -->
    <section class="why-one-supplier section-padding">
      <div class="container">
        <div class="section-header center">
          <span class="sub-badge">Ключевое коммерческое преимущество</span>
          <h2>Одна закупка вместо десятка поставщиков</h2>
          <p>Ресторан может закрыть базовые потребности кухни и бара у одного партнера</p>
        </div>

        <div class="advantages-matrix">
          <div class="adv-item" v-for="(adv, i) in supplierAdvantages" :key="i" v-motion-slide-visible-bottom>
            <div class="adv-icon-wrap">
              <CheckCircle :size="24" />
            </div>
            <div>
              <h4>{{ adv.title }}</h4>
              <p>{{ adv.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Block 8: БЫСТРЫЙ ЗАКАЗ — СПИСОК ЗАКУПКИ (TZ Section 8) -->
    <section id="quick-order-section" class="quick-order-block section-padding">
      <div class="container">
        <div class="quick-order-banner">
          <div class="quick-order-header">
            <span class="badge">B2B Экспресс-заказ</span>
            <h2>Есть список закупки? Отправьте его нам</h2>
            <p>
              Принимаем любые форматы: <b>Excel, PDF, фотография списка, текст из заметок или сообщение из WhatsApp</b>. Менеджер оперативно сопоставит товары с каталогом и вышлет расчет.
            </p>
          </div>

          <div class="order-form-container">
            <form @submit.prevent="submitPurchaseList" class="quick-list-form">
              <div class="form-inputs-row">
                <input 
                  type="text" 
                  v-model="quickForm.restaurant" 
                  placeholder="Название заведения (например: Кафе Мечта)" 
                  required 
                />
                <input 
                  type="tel" 
                  v-model="quickForm.phone" 
                  placeholder="Телефон контактного лица" 
                  required 
                />
              </div>

              <!-- Поле для прикрепления файла с Dropzone и Preview -->
              <div 
                class="file-upload-zone"
                :class="{ 'is-dragging': isDragging, 'has-file': !!attachedFile }"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleDrop"
                @click="triggerFileInput"
              >
                <input 
                  type="file" 
                  ref="fileInputRef" 
                  class="hidden-file-input" 
                  accept=".xlsx,.xls,.csv,.pdf,.doc,.docx,.png,.jpg,.jpeg,.webp" 
                  @change="handleFileChange"
                />

                <div v-if="!attachedFile" class="upload-placeholder">
                  <div class="upload-icon-circle">
                    <Paperclip :size="24" />
                  </div>
                  <div class="upload-text">
                    <span class="upload-title">Нажмите или перетащите файл со списком</span>
                    <span class="upload-subtitle">Excel, PDF, Word, фото списка (до 15 МБ)</span>
                  </div>
                </div>

                <div v-else class="file-preview-card" @click.stop>
                  <div class="preview-media">
                    <img v-if="filePreviewUrl" :src="filePreviewUrl" alt="Превью списка" class="preview-img" />
                    <div v-else class="preview-doc-icon">
                      <FileSpreadsheet v-if="isExcelFile" :size="28" />
                      <FileText v-else :size="28" />
                    </div>
                  </div>
                  <div class="preview-info">
                    <div class="preview-name" :title="attachedFile.name">{{ attachedFile.name }}</div>
                    <div class="preview-size">{{ formatFileSize(attachedFile.size) }}</div>
                  </div>
                  <button type="button" class="btn-remove-file" @click.stop="removeFile" title="Удалить файл">
                    <Trash2 :size="18" />
                  </button>
                </div>
              </div>

              <textarea 
                v-model="quickForm.listText" 
                rows="4" 
                :placeholder="textareaPlaceholder"
                :required="!attachedFile"
              ></textarea>

              <div class="form-submit-actions">
                <button type="submit" class="btn btn-secondary btn-lg" :disabled="isSubmittingList">
                  <Send :size="18" /> {{ isSubmittingList ? 'Отправка...' : 'Отправить список закупки' }}
                </button>

                <div class="divider-text">или отправьте файл напрямую:</div>

                <a 
                  :href="whatsappQuickListUrl" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="btn btn-whatsapp btn-lg"
                  @click="trackWhatsApp('quick_order_wa_button')"
                >
                  <MessageCircle :size="18" /> Отправить файл в WhatsApp
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Comparison Section (Обычный поставщик vs GASTROMIR) -->
    <section class="comparison section-padding bg-light">
      <div class="container">
        <div class="section-header center">
          <h2>Почему рестораны Астаны переходят на GASTROMIR</h2>
          <p>Сравните сами: классический подход со звонками против прозрачной платформы</p>
        </div>
        
        <div class="comparison-grid">
          <div class="comp-card standard" v-motion-slide-visible-left>
            <h3>Обычный поставщик</h3>
            <ul>
              <li><X class="icon-bad" /> Дозвон по телефону / переписка до ночи</li>
              <li><X class="icon-bad" /> Неизвестно, есть ли товар на складе</li>
              <li><X class="icon-bad" /> Ручные накладные с частыми ошибками</li>
              <li><X class="icon-bad" /> Разрозненные курьеры по каждой позиции</li>
            </ul>
          </div>
          
          <div class="vs-badge">VS</div>
          
          <div class="comp-card gastromir" v-motion-slide-visible-right>
            <div class="card-logo">GASTROMIR</div>
            <ul>
              <li><Check class="icon-good" /> Заказ в приложении за 30–60 секунд</li>
              <li><Check class="icon-good" /> Актуальное складское наличие онлайн</li>
              <li><Check class="icon-good" /> Авто-генерация накладных (Форма 3-2)</li>
              <li><Check class="icon-good" /> Единая доставка продуктов и хозтоваров</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Partners Section -->
    <section class="partners">
      <div class="container">
        <p class="section-tag">Нам доверяют рестораны и заведения столицы</p>
        <div class="partners-list">
          <div class="partner">Угли</div>
          <div class="partner">BAO</div>
          <div class="partner">The Kitchen</div>
          <div class="partner">Gastronomy</div>
          <div class="partner">Urban Cafe</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ShoppingCart, 
  FileSpreadsheet, 
  MessageCircle, 
  Zap, 
  ShoppingBag, 
  RotateCcw, 
  CheckCircle, 
  Send, 
  Check, 
  X,
  Paperclip,
  Trash2,
  FileText
} from 'lucide-vue-next'
import { useToastStore } from '@/stores/toast'
import { trackWhatsAppClick, trackUploadPurchaseList, trackEvent } from '@/utils/analytics'

const router = useRouter()
const toastStore = useToastStore()

const categoriesList = [
  { name: 'Бакалея', icon: '🌾' },
  { name: 'Молочная продукция', icon: '🥛' },
  { name: 'Сыры', icon: '🧀' },
  { name: 'Мясо', icon: '🥩' },
  { name: 'Рыба и морепродукты', icon: '🐟' },
  { name: 'Овощи и фрукты', icon: '🥦' },
  { name: 'Замороженные продукты', icon: '❄️' },
  { name: 'Соусы и специи', icon: '🌶️' },
  { name: 'Масла', icon: '🫒' },
  { name: 'Консервация', icon: '🥫' },
  { name: 'Кофе и чай', icon: '☕' },
  { name: 'Напитки', icon: '🧃' },
  { name: 'Хозяйственные товары', icon: '🧼' },
  { name: 'Упаковка и расходники', icon: '📦' }
]

const supplierAdvantages = [
  {
    title: 'Меньше времени на поиск и звонки',
    desc: 'Шеф-повару не нужно обзванивать пять разных компаний. Вся корзина собирается на одном сайте.'
  },
  {
    title: 'Один заказ и единая доставка',
    desc: 'Единая приемка товара на кухне. Меньше очередей у рампы и прозрачный контроль экспедитора.'
  },
  {
    title: 'Единая коммуникация и поддержка',
    desc: 'За вами закреплен персональный менеджер HoReCa, готовый оперативно решить любой вопрос.'
  },
  {
    title: 'Автоматическая история и повтор',
    desc: 'Любая прошлая накладная сохраняется в профиле. Повторяйте регулярный закуп за секунды.'
  },
  {
    title: 'Официальные документы Формы 3-2',
    desc: 'Полный пакет бухгалтерских документов, безналичный расчет и прозрачные акты сверки.'
  },
  {
    title: 'Продукты + Хозтовары вместе',
    desc: 'Закрывайте нужды кухни, бара и клининга заведения в одном финансовом потоке.'
  }
]

const quickForm = ref({
  restaurant: '',
  phone: '',
  listText: ''
})
const fileInputRef = ref(null)
const attachedFile = ref(null)
const filePreviewUrl = ref(null)
const isDragging = ref(false)
const isSubmittingList = ref(false)

const isExcelFile = computed(() => {
  if (!attachedFile.value) return false
  const name = attachedFile.value.name.toLowerCase()
  return name.endsWith('.xlsx') || name.endsWith('.xls') || name.endsWith('.csv')
})

const textareaPlaceholder = computed(() => {
  if (attachedFile.value) {
    return 'Комментарий к файлу или дополнительный список товаров (необязательно)...'
  }
  return 'Или вставьте список товаров текстом:\nСыр моцарелла 45% - 10 кг\nМука Макфа в/с - 3 мешка\nМасло оливковое Extra Virgin - 6 бут'
})

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

const triggerFileInput = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}

const handleFile = (file) => {
  if (!file) return
  const maxBytes = 15 * 1024 * 1024 // 15MB max
  if (file.size > maxBytes) {
    toastStore.error('Размер файла не должен превышать 15 МБ')
    return
  }

  attachedFile.value = file

  // Если это изображение, строим preview
  if (file.type && file.type.startsWith('image/')) {
    if (filePreviewUrl.value) {
      URL.revokeObjectURL(filePreviewUrl.value)
    }
    filePreviewUrl.value = URL.createObjectURL(file)
  } else {
    filePreviewUrl.value = null
  }
}

const handleFileChange = (e) => {
  const file = e.target.files?.[0]
  if (file) {
    handleFile(file)
  }
}

const handleDrop = (e) => {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) {
    handleFile(file)
  }
}

const removeFile = () => {
  attachedFile.value = null
  if (filePreviewUrl.value) {
    URL.revokeObjectURL(filePreviewUrl.value)
    filePreviewUrl.value = null
  }
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const whatsappHeroUrl = computed(() => {
  const msg = encodeURIComponent('Здравствуйте! Хочу заказать товары для заведения в GASTROMIR. Помогите сформировать закупку.')
  return `https://wa.me/77015141404?text=${msg}`
})

const whatsappQuickListUrl = computed(() => {
  let lines = ['Здравствуйте! Отправляю список закупки в GASTROMIR.']
  if (quickForm.value.restaurant) {
    lines.push(`Заведение: ${quickForm.value.restaurant}`)
  }
  if (quickForm.value.phone) {
    lines.push(`Телефон: ${quickForm.value.phone}`)
  }
  if (attachedFile.value) {
    lines.push(`Прикрепляю файл со списком: "${attachedFile.value.name}"`)
  }
  if (quickForm.value.listText) {
    lines.push(`\nСписок / комментарий:\n${quickForm.value.listText}`)
  } else if (attachedFile.value) {
    lines.push(`\n(Файл прикрепляю в этом чате)`)
  }
  const msg = encodeURIComponent(lines.join('\n'))
  return `https://wa.me/77015141404?text=${msg}`
})

const submitPurchaseList = async () => {
  if (!quickForm.value.listText && !attachedFile.value) {
    toastStore.error('Пожалуйста, прикрепите файл или введите список товаров текстом')
    return
  }

  isSubmittingList.value = true
  try {
    const payload = new FormData()
    payload.append("access_key", "a4c51ae1-a7d6-4ac4-9d54-3183cb69f4f5")
    payload.append("subject", `Новый список закупки: ${quickForm.value.restaurant || 'Без названия'}`)
    payload.append("Заведение", quickForm.value.restaurant)
    payload.append("Телефон", quickForm.value.phone)
    if (quickForm.value.listText) {
      payload.append("Список закупки / Комментарий", quickForm.value.listText)
    }
    if (attachedFile.value) {
      payload.append("attachment", attachedFile.value)
    }

    const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: payload })
    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.success === false) {
      throw new Error(data.message || 'Ошибка отправки формы')
    }

    trackUploadPurchaseList(attachedFile.value ? 'file' : 'text')
    trackEvent('submit_form', { form: 'quick_purchase_list', has_file: !!attachedFile.value })
    toastStore.success('Список закупки успешно отправлен на почту! Менеджер свяжется с вами с готовым расчетом.')
    quickForm.value = { restaurant: '', phone: '', listText: '' }
    removeFile()
  } catch (e) {
    console.error('Ошибка отправки формы:', e)
    toastStore.error('Произошла ошибка при отправке. Пожалуйста, отправьте файл через кнопку WhatsApp.')
  } finally {
    isSubmittingList.value = false
  }
}

const goToCategory = (categoryName) => {
  router.push({ path: '/catalog', query: { category: categoryName } })
}

const trackWhatsApp = (source) => {
  trackWhatsAppClick(source)
}
</script>

<style scoped>
.hero {
  padding: 10.5rem 0 5.5rem;
  background: linear-gradient(135deg, #0B1221 0%, #151F33 100%);
  color: var(--white);
  overflow: hidden;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.25fr 0.75fr;
  align-items: center;
  gap: 3.5rem;
}

.badge {
  display: inline-block;
  padding: 0.45rem 1.2rem;
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid #F59E0B;
  color: #F59E0B;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 0.85rem;
  margin-bottom: 1.5rem;
}

h1 {
  font-size: 3.2rem;
  line-height: 1.15;
  margin-bottom: 1.25rem;
  color: var(--white);
}

h1 span {
  background: var(--gradient-orange);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-desc {
  font-size: 1.15rem;
  color: #94A3B8;
  margin-bottom: 2.25rem;
  line-height: 1.6;
  max-width: 650px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  margin-bottom: 2.75rem;
}

.btn-hero {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.95rem;
  padding: 0.85rem 1.4rem;
}

.btn-outline {
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: var(--white);
}

.btn-outline:hover {
  border-color: var(--white);
  background: rgba(255, 255, 255, 0.1);
}

.btn-whatsapp {
  background: #25D366;
  color: #FFFFFF;
}

.btn-whatsapp:hover {
  filter: brightness(1.1);
}

.hero-stats {
  display: flex;
  gap: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-num {
  display: block;
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--secondary);
}

.stat-label {
  color: #94A3B8;
  font-size: 0.85rem;
}

.image-wrapper {
  position: relative;
}

.image-wrapper img {
  width: 100%;
  border-radius: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.floating-card {
  position: absolute;
  bottom: -20px;
  left: -20px;
  background: var(--white);
  padding: 1.25rem 1.5rem;
  border-radius: 1.25rem;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--primary);
}

.floating-card .icon {
  color: #F59E0B;
  width: 32px;
  height: 32px;
}

.floating-card h4 {
  font-size: 1rem;
  margin-bottom: 0.2rem;
}

.floating-card p {
  font-size: 0.85rem;
  color: var(--gray);
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

.section-header.center {
  text-align: center;
  max-width: 750px;
  margin: 0 auto 3.5rem;
}

.scenarios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.scenario-card {
  background: var(--white);
  border: 1px solid #E2E8F0;
  border-radius: 1.5rem;
  padding: 2.5rem 2rem;
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.03);
  transition: transform 0.3s ease;
}

.scenario-card:hover {
  transform: translateY(-5px);
}

.scenario-card.highlight {
  border-color: #F59E0B;
  box-shadow: 0 10px 30px rgba(245, 158, 11, 0.12);
}

.scenario-step-badge {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  background: #F1F5F9;
  color: #475569;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
}

.scenario-step-badge.accent {
  background: #FEF3C7;
  color: #D97706;
}

.sc-icon {
  width: 52px;
  height: 52px;
  background: #F1F5F9;
  color: #0B1221;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.scenario-card h3 {
  font-size: 1.3rem;
  margin-bottom: 0.75rem;
  color: #0B1221;
}

.scenario-card p {
  color: #64748B;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  flex: 1;
}

.card-link {
  font-weight: 700;
  color: #F59E0B;
  font-size: 0.95rem;
}

.bg-light {
  background: #F8FAFC;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.25rem;
}

.category-tile {
  background: var(--white);
  border: 1px solid #E2E8F0;
  border-radius: 1.25rem;
  padding: 1.5rem 1.25rem;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.category-tile:hover {
  transform: translateY(-4px);
  border-color: #F59E0B;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
}

.cat-emoji {
  font-size: 2.2rem;
  margin-bottom: 0.75rem;
}

.category-tile h4 {
  font-size: 1.05rem;
  color: #0B1221;
  margin-bottom: 0.5rem;
}

.cat-link-text {
  font-size: 0.8rem;
  font-weight: 600;
  color: #F59E0B;
}

.advantages-matrix {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
}

.adv-item {
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
  background: var(--white);
  padding: 2rem;
  border-radius: 1.5rem;
  border: 1px solid #E2E8F0;
}

.adv-icon-wrap {
  color: #10B981;
  flex-shrink: 0;
  margin-top: 2px;
}

.adv-item h4 {
  font-size: 1.15rem;
  margin-bottom: 0.4rem;
  color: #0B1221;
}

.adv-item p {
  color: #64748B;
  font-size: 0.95rem;
  line-height: 1.5;
}

.quick-order-banner {
  background: linear-gradient(135deg, #0B1221 0%, #151F33 100%);
  color: #FFFFFF;
  border-radius: 2.5rem;
  padding: 4rem 3.5rem;
  box-shadow: 0 20px 50px rgba(11, 18, 33, 0.3);
}

.quick-order-header {
  text-align: center;
  max-width: 750px;
  margin: 0 auto 3rem;
}

.quick-order-header h2 {
  font-size: 2.4rem;
  margin-bottom: 1rem;
  color: #FFFFFF;
}

.quick-order-header p {
  color: #94A3B8;
  font-size: 1.1rem;
}

.order-form-container {
  max-width: 800px;
  margin: 0 auto;
}

.quick-list-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-inputs-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.hidden-file-input {
  display: none;
}

.file-upload-zone {
  border: 2px dashed #334155;
  border-radius: 1rem;
  background: rgba(30, 41, 59, 0.6);
  padding: 1.25rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.file-upload-zone:hover,
.file-upload-zone.is-dragging {
  border-color: #F59E0B;
  background: rgba(245, 158, 11, 0.05);
}

.file-upload-zone.has-file {
  border-style: solid;
  border-color: rgba(245, 158, 11, 0.4);
  background: #1E293B;
  cursor: default;
  padding: 0.9rem 1.2rem;
}

.upload-placeholder {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.upload-icon-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(245, 158, 11, 0.15);
  color: #F59E0B;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.upload-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-align: left;
}

.upload-title {
  color: #FFFFFF;
  font-weight: 600;
  font-size: 0.98rem;
}

.upload-subtitle {
  color: #94A3B8;
  font-size: 0.82rem;
}

.file-preview-card {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.preview-media {
  width: 52px;
  height: 52px;
  border-radius: 0.75rem;
  overflow: hidden;
  background: #0B1221;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid #334155;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-doc-icon {
  color: #F59E0B;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  text-align: left;
}

.preview-name {
  color: #FFFFFF;
  font-weight: 600;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.preview-size {
  color: #94A3B8;
  font-size: 0.8rem;
}

.btn-remove-file {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #EF4444;
  width: 36px;
  height: 36px;
  border-radius: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.btn-remove-file:hover {
  background: #EF4444;
  color: #FFFFFF;
}

.quick-list-form input,
.quick-list-form textarea {
  padding: 1rem 1.25rem;
  border-radius: 1rem;
  border: 1px solid #334155;
  background: #1E293B;
  color: #FFFFFF;
  font-family: inherit;
  outline: none;
}

.quick-list-form input:focus,
.quick-list-form textarea:focus {
  border-color: #F59E0B;
}

.form-submit-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.btn-lg {
  padding: 1rem 2rem;
  font-size: 1.05rem;
}

.divider-text {
  color: #94A3B8;
  font-size: 0.9rem;
}

.comparison-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.comp-card {
  background: var(--white);
  padding: 2.5rem;
  border-radius: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.comp-card.standard {
  border: 1px solid #CBD5E1;
}

.comp-card.gastromir {
  border: 2px solid #F59E0B;
  background: #FFFDF9;
}

.card-logo {
  font-weight: 800;
  font-size: 1.5rem;
  color: #0B1221;
  margin-bottom: 1.5rem;
}

.comp-card ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.comp-card li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
}

.icon-bad {
  color: #EF4444;
  flex-shrink: 0;
}

.icon-good {
  color: #10B981;
  flex-shrink: 0;
}

.vs-badge {
  background: #0B1221;
  color: #FFFFFF;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
}

.partners {
  padding: 4rem 0;
  text-align: center;
}

.section-tag {
  color: var(--gray);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  margin-bottom: 2rem;
}

.partners-list {
  display: flex;
  justify-content: center;
  gap: 4rem;
  flex-wrap: wrap;
}

.partner {
  font-size: 1.5rem;
  font-weight: 800;
  color: #94A3B8;
}

@media (max-width: 992px) {
  .hero-grid {
    grid-template-columns: 1fr;
  }
  .form-inputs-row {
    grid-template-columns: 1fr;
  }
  .comparison-grid {
    grid-template-columns: 1fr;
  }
  .vs-badge {
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 7rem 0 3rem;
  }
  h1 {
    font-size: 2.2rem;
  }
  .quick-order-banner {
    padding: 2.5rem 1.5rem;
  }
}
</style>
