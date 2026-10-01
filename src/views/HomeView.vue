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

    <!-- Core 4 Advantages (Competitor-style Trust Grid) -->
    <section class="core-advantages-bar">
      <div class="container">
        <div class="core-advantages-grid">
          <div class="core-adv-card" v-motion-slide-visible-bottom>
            <div class="core-adv-icon"><Truck :size="24" /></div>
            <div class="core-adv-text">
              <h4>Без срывов поставок</h4>
              <p>Доставка строго с 07:00 до 18:00 к открытию кухни. Собственный автопарк с рефрижераторами.</p>
            </div>
          </div>

          <div class="core-adv-card" v-motion-slide-visible-bottom>
            <div class="core-adv-icon"><PackageCheck :size="24" /></div>
            <div class="core-adv-text">
              <h4>Всё в одном месте</h4>
              <p>Более 1 000 позиций: бакалея, сыры, мясо, заморозка, соусы, хозтовары и упаковка.</p>
            </div>
          </div>

          <div class="core-adv-card" v-motion-slide-visible-bottom>
            <div class="core-adv-icon"><Zap :size="24" /></div>
            <div class="core-adv-text">
              <h4>Без звонков и ожидания</h4>
              <p>Заказ на сайте за 1 минуту или отправка накладной в WhatsApp. Повтор закупки в один клик.</p>
            </div>
          </div>

          <div class="core-adv-card" v-motion-slide-visible-bottom>
            <div class="core-adv-icon"><FileCheck :size="24" /></div>
            <div class="core-adv-text">
              <h4>Документы сразу</h4>
              <p>Официальные накладные Форма 3-2, ЭСФ день в день, ветеринарные справки и сертификаты.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Bestsellers / Popular Products Section (Competitor Signature) -->
    <section class="bestsellers-section section-padding">
      <div class="container">
        <div class="section-header-flex">
          <div>
            <span class="sub-badge">Хиты HoReCa в Астане</span>
            <h2>Лидеры продаж и востребованные товары</h2>
            <p>Самые заказываемые позиции шеф-поваров и баров. Добавляйте в корзину в 1 клик прямо с главной.</p>
          </div>
          <router-link to="/catalog" class="btn btn-outline-dark desktop-only-btn">
            Смотреть весь каталог (1 000+) →
          </router-link>
        </div>

        <!-- Filter tabs for bestsellers -->
        <div class="bestseller-tabs">
          <button 
            v-for="tab in bestsellerTabs" 
            :key="tab.id"
            class="bestseller-tab-btn"
            :class="{ active: activeBestsellerTab === tab.id }"
            @click="activeBestsellerTab = tab.id"
          >
            {{ tab.name }}
          </button>
        </div>

        <!-- Bestsellers Grid -->
        <div class="bestsellers-grid">
          <div 
            v-for="product in filteredBestsellers" 
            :key="product.id"
            class="bestseller-card"
            v-motion-slide-visible-bottom
          >
            <div class="bestseller-img-wrap">
              <img :src="product.image" :alt="product.name" loading="lazy" />
              <span class="bestseller-badge">{{ product.badge }}</span>
            </div>

            <div class="bestseller-info">
              <span class="bestseller-category">{{ product.category }}</span>
              <h3 class="bestseller-title">{{ product.name }}</h3>
              <p class="bestseller-desc">{{ product.desc }}</p>

              <div class="bestseller-footer">
                <div class="bestseller-price-box">
                  <span class="price-val">{{ formatPrice(product.price) }} ₸</span>
                  <span class="price-unit">/ {{ product.unit }}</span>
                </div>

                <div class="bestseller-actions">
                  <div class="bestseller-qty-ctrl">
                    <button type="button" @click="decrementBestsellerQty(product.id)">-</button>
                    <span>{{ getBestsellerQty(product.id) }}</span>
                    <button type="button" @click="incrementBestsellerQty(product.id)">+</button>
                  </div>
                  <button 
                    type="button"
                    class="btn-add-bestseller"
                    :class="{ 'in-cart': isItemInCart(product.id) }"
                    @click="addBestsellerToCart(product)"
                    title="Добавить в корзину"
                  >
                    <Check v-if="isItemInCart(product.id)" :size="16" />
                    <ShoppingCart v-else :size="16" />
                    <span>{{ isItemInCart(product.id) ? 'В корзине' : 'В корзину' }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="center-cta-box">
          <router-link to="/catalog" class="btn btn-primary btn-lg">
            <ShoppingBag :size="20" /> Открыть полный каталог (1 000+ товаров)
          </router-link>
        </div>
      </div>
    </section>
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
            @click="goToCategory(cat.target || cat.name)"
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

    <!-- Block: ПОЛЕЗНЫЕ СТАТЬИ ДЛЯ РЕСТОРАТОРОВ (Competitor Articles Feature) -->
    <section class="articles-home-section section-padding bg-light">
      <div class="container">
        <div class="section-header-flex">
          <div>
            <span class="sub-badge">База знаний HoReCa Астана</span>
            <h2>Полезные статьи для рестораторов и шефов</h2>
            <p>Практические руководства по закупкам, выбору поставщиков, снижению фудкоста и стандартам качества</p>
          </div>
          <router-link to="/articles" class="btn btn-outline-dark desktop-only-btn">
            Все 30+ экспертных статей →
          </router-link>
        </div>

        <div class="home-articles-grid">
          <article 
            v-for="article in featuredArticles" 
            :key="article.id"
            class="home-article-card"
            v-motion-slide-visible-bottom
            @click="goToArticle(article.slug)"
          >
            <div class="h-art-meta">
              <span class="h-art-tag">{{ article.tag }}</span>
              <span class="h-art-time"><Clock :size="13" /> {{ article.readTime }}</span>
            </div>
            <h3 class="h-art-title">{{ article.title }}</h3>
            <p class="h-art-desc">{{ article.summary }}</p>
            <div class="h-art-footer">
              <span class="h-art-date">{{ article.date }}</span>
              <span class="h-art-link">Читать →</span>
            </div>
          </article>
        </div>

        <div class="mobile-only-btn-wrap">
          <router-link to="/articles" class="btn btn-outline-dark btn-block">
            Смотреть все статьи и гиды →
          </router-link>
        </div>
      </div>
    </section>

    <!-- Block: ОТЗЫВЫ РЕСТОРАНОВ АСТАНЫ (Trust & Reviews) -->
    <section class="reviews-section section-padding">
      <div class="container">
        <div class="section-header center">
          <span class="sub-badge">Доверие шефов и управляющих</span>
          <h2>Что говорят заведения Астаны</h2>
          <p>Более 150 ресторанов, кофеен и столовых столицы ежедневно доверяют снабжение кухни GASTROMIR</p>
        </div>

        <div class="reviews-grid">
          <div class="review-card" v-for="(rev, idx) in customerReviews" :key="idx" v-motion-slide-visible-bottom>
            <div class="review-rating">
              <Star v-for="s in 5" :key="s" :size="16" class="star-icon" fill="#F59E0B" color="#F59E0B" />
            </div>
            <p class="review-quote">«{{ rev.quote }}»</p>
            <div class="review-author">
              <div class="author-avatar">{{ rev.initials }}</div>
              <div>
                <div class="author-name">{{ rev.author }}</div>
                <div class="author-role">{{ rev.role }}, <b>{{ rev.venue }}</b></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Block: БЫСТРЫЙ ЗВОНОК / КОНСУЛЬТАЦИЯ МЕНЕДЖЕРА -->
    <section class="callback-section">
      <div class="container">
        <div class="callback-banner">
          <div class="cb-content">
            <span class="badge">Обратная связь за 15 минут</span>
            <h2>Нужен индивидуальный расчет под меню?</h2>
            <p>Оставьте номер телефона — персональный менеджер HoReCa свяжется с вами, ответит на любые вопросы и отправит оптовый прайс-лист со скидкой.</p>
          </div>
          <form class="cb-form" @submit.prevent="submitCallbackRequest">
            <div class="cb-inputs">
              <input 
                type="tel" 
                v-model="callbackPhone" 
                placeholder="+7 (___) ___-__-__" 
                required 
              />
              <button type="submit" class="btn btn-secondary btn-cb" :disabled="isSubmittingCallback">
                <PhoneCall :size="18" /> {{ isSubmittingCallback ? 'Отправка...' : 'Заказать звонок' }}
              </button>
            </div>
            <span class="cb-privacy">Бесплатная консультация специалиста по снабжению</span>
          </form>
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
  FileText,
  Truck,
  PackageCheck,
  FileCheck,
  Star,
  PhoneCall,
  Clock,
  ArrowRight
} from 'lucide-vue-next'
import { useToastStore } from '@/stores/toast'
import { useCartStore } from '@/stores/cart'
import { HORECA_ARTICLES } from '@/data/articles'
import { trackWhatsAppClick, trackUploadPurchaseList, trackEvent } from '@/utils/analytics'
import { submitForm } from '@/services/formService'

const router = useRouter()
const toastStore = useToastStore()
const cartStore = useCartStore()

const categoriesList = [
  { name: 'Бакалея', target: 'Бакалея', icon: '🌾' },
  { name: 'Молочная продукция', target: 'Молочные продукты', icon: '🥛' },
  { name: 'Сыры', target: 'Сыры и сырные продукты', icon: '🧀' },
  { name: 'Мясо', target: 'Мясо птицы', icon: '🥩' },
  { name: 'Рыба и морепродукты', target: 'Морепродукты', icon: '🐟' },
  { name: 'Овощи и фрукты', target: 'Овощи', icon: '🥦' },
  { name: 'Замороженные продукты', target: 'Ягоды и овощи с/м', icon: '❄️' },
  { name: 'Соусы и специи', target: 'Соусы и уксусы', icon: '🌶️' },
  { name: 'Масла', target: 'Масла и жиры', icon: '🫒' },
  { name: 'Консервация', target: 'Консервация', icon: '🥫' },
  { name: 'Кофе и чай', target: 'Чай-кофе', icon: '☕' },
  { name: 'Напитки', target: 'Напитки', icon: '🧃' },
  { name: 'Хозяйственные товары', target: 'Хоз.товары', icon: '🧼' },
  { name: 'Упаковка и расходники', target: 'Упаковка и доставка', icon: '📦' }
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
    await submitForm({
      formType: 'quick_purchase_list',
      subject: `Новый список закупки: ${quickForm.value.restaurant || 'Без названия'}`,
      restaurant: quickForm.value.restaurant,
      phone: quickForm.value.phone,
      message: quickForm.value.listText,
      file: attachedFile.value
    })

    trackUploadPurchaseList(attachedFile.value ? 'file' : 'text')
    trackEvent('submit_form', { form: 'quick_purchase_list', has_file: !!attachedFile.value })
    toastStore.success('Список закупки успешно отправлен! Менеджер свяжется с вами с готовым расчетом.')
    quickForm.value = { restaurant: '', phone: '', listText: '' }
    removeFile()
  } catch (e) {
    console.error('Ошибка отправки формы:', e)
    toastStore.error(e.message || 'Произошла ошибка при отправке. Пожалуйста, отправьте файл через кнопку WhatsApp.')
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

// Bestsellers Logic (Competitor-style Popular Products)
const activeBestsellerTab = ref('all')
const bestsellerTabs = [
  { id: 'all', name: 'Все лидеры' },
  { id: 'cheese', name: 'Сыры & Молочка' },
  { id: 'grocery', name: 'Бакалея & Масла' },
  { id: 'meat', name: 'Мясо & Птица' },
  { id: 'hygiene', name: 'Хозтовары & Расходники' }
]

const bestsellerProducts = [
  {
    id: 9001,
    name: 'Сыр Моцарелла Pizza Cheese 45% (брусок 2 кг)',
    category: 'Сыры',
    group: 'cheese',
    price: 3850,
    unit: 'кг',
    badge: 'Хит продаж',
    image: 'https://images.unsplash.com/photo-1589881133595-a3c085cb731d?w=500&auto=format&fit=crop&q=80',
    desc: 'Идеальное плавление для неаполитанской и римской пиццы, золотистая корочка без подгорания'
  },
  {
    id: 9002,
    name: 'Масло оливковое Extra Virgin 5 л',
    category: 'Масла',
    group: 'grocery',
    price: 18900,
    unit: 'бут',
    badge: 'Топ выбор',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80',
    desc: 'Первый холодный отжим, кислотность <0.8%, для салатов, пиццы и ресторанных соусов'
  },
  {
    id: 9003,
    name: 'Филе куриное охлажденное ГОСТ (калибр)',
    category: 'Мясо',
    group: 'meat',
    price: 1950,
    unit: 'кг',
    badge: 'Хит кухни',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=80',
    desc: 'Без накачки и влаги, одинаковый калиброванный выход готовой порции на гриль'
  },
  {
    id: 9004,
    name: 'Сливки кулинарные Mlekovita 33% 1 л',
    category: 'Молочные продукты',
    group: 'cheese',
    price: 2450,
    unit: 'шт',
    badge: 'Профи выбор',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80',
    desc: 'Стабильное взбивание, идеальная густота для сливочных соусов, пасты и десертов'
  },
  {
    id: 9005,
    name: 'Масло для фритюра профессиональное 10 л',
    category: 'Масла',
    group: 'grocery',
    price: 11200,
    unit: 'шт',
    badge: 'Выгода',
    image: 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=500&auto=format&fit=crop&q=80',
    desc: 'Точка дымления 220°C, работает до 4 смен без запаха гари и потемнения'
  },
  {
    id: 9006,
    name: 'Картофель фри 9×9 мм McCain 2.5 кг',
    category: 'Заморозка',
    group: 'grocery',
    price: 3200,
    unit: 'пач',
    badge: 'Хит продаж',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80',
    desc: 'Шоковая заморозка IQF, хрустящая золотистая корочка и нежная сердцевина'
  },
  {
    id: 9007,
    name: 'Сыр Чеддер слайсы 1083 г (84 ломтика)',
    category: 'Сыры',
    group: 'cheese',
    price: 4950,
    unit: 'упак',
    badge: 'Бургер Топ',
    image: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=500&auto=format&fit=crop&q=80',
    desc: 'Быстрое таяние на горячей котлете, насыщенный сливочно-сырный вкус'
  },
  {
    id: 9008,
    name: 'Перчатки нитриловые черные L (100 шт)',
    category: 'Хозтовары',
    group: 'hygiene',
    price: 2150,
    unit: 'упак',
    badge: 'Расходник',
    image: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=500&auto=format&fit=crop&q=80',
    desc: 'Повышенная прочность, гипоаллергенные, текстурированные пальцы для кухни'
  }
]

const filteredBestsellers = computed(() => {
  if (activeBestsellerTab.value === 'all') {
    return bestsellerProducts
  }
  return bestsellerProducts.filter(p => p.group === activeBestsellerTab.value)
})

const bestsellerQuantities = ref({})

const getBestsellerQty = (id) => {
  return bestsellerQuantities.value[id] || 1
}

const incrementBestsellerQty = (id) => {
  bestsellerQuantities.value[id] = (bestsellerQuantities.value[id] || 1) + 1
}

const decrementBestsellerQty = (id) => {
  const current = bestsellerQuantities.value[id] || 1
  if (current > 1) {
    bestsellerQuantities.value[id] = current - 1
  }
}

const addBestsellerToCart = (product) => {
  const qty = getBestsellerQty(product.id)
  for (let i = 0; i < qty; i++) {
    cartStore.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      category: product.category,
      image_url: product.image
    })
  }
  toastStore.success(`«${product.name}» (${qty} ${product.unit}) добавлен в корзину!`)
  trackEvent('add_to_cart_bestseller', { product: product.name, qty })
}

const isItemInCart = (productId) => {
  return cartStore.items.some(item => item.id === productId)
}

const formatPrice = (val) => {
  return new Intl.NumberFormat('ru-RU').format(val)
}

// Featured Articles Preview
const featuredArticles = computed(() => {
  return HORECA_ARTICLES.slice(0, 3)
})

const goToArticle = (slug) => {
  router.push({ path: '/articles', query: { article: slug } })
}

// Customer Reviews (Real Astana venues)
const customerReviews = [
  {
    author: 'Ильяс С.',
    role: 'Шеф-пиццайоло',
    venue: 'Пиццерия Bella Napoli, Астана',
    initials: 'ИС',
    quote: 'Сыр моцарелла и мука приходят всегда точно к 08:30 утра. Ни одного срыва за 8 месяцев работы. Накладные Форма 3-2 скачиваем прямо в личном кабинете.'
  },
  {
    author: 'Дамир К.',
    role: 'Управляющий',
    venue: 'Кофейня-пекарня Urban Coffee, левый берег',
    initials: 'ДК',
    quote: 'Заказываем замороженные ягоды для авторских чаев, молоко, сиропы и стаканчики в одном месте. Закрыли 4 поставщиков одним договором с GASTROMIR.'
  },
  {
    author: 'Арман М.',
    role: 'Бренд-шеф',
    venue: 'Гриль-бар Steak & Smoke, ул. Достык',
    initials: 'АМ',
    quote: 'Калиброванное куриное филе и фритюрное масло премиум качества. Фудкост горячего цеха снизился на 14% благодаря оптовым ценам и стабильному выходу.'
  }
]

// Quick Callback Form
const callbackPhone = ref('')
const isSubmittingCallback = ref(false)

const submitCallbackRequest = async () => {
  if (!callbackPhone.value) return
  isSubmittingCallback.value = true
  try {
    await submitForm({
      formType: 'callback_request',
      subject: `Заказ обратного звонка: ${callbackPhone.value}`,
      phone: callbackPhone.value,
      message: 'Запрос на экспресс-консультацию по оптовым поставкам продуктов в Астане'
    })
    toastStore.success('Спасибо! Менеджер свяжется с вами в течение 15 минут.')
    callbackPhone.value = ''
    trackEvent('submit_callback', { phone: callbackPhone.value })
  } catch (err) {
    console.error('Ошибка отправки заявки на звонок:', err)
    toastStore.error('Произошла ошибка. Пожалуйста, напишите нам в WhatsApp.')
  } finally {
    isSubmittingCallback.value = false
  }
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

/* Core Advantages Bar */
.core-advantages-bar {
  background: #0B1221;
  padding: 2rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.core-advantages-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.core-adv-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.04);
  padding: 1.25rem;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.2s ease;
}

.core-adv-card:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(245, 158, 11, 0.3);
  transform: translateY(-2px);
}

.core-adv-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(245, 158, 11, 0.15);
  color: #F59E0B;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.core-adv-text h4 {
  font-size: 0.98rem;
  color: #FFFFFF;
  margin-bottom: 0.3rem;
  font-weight: 700;
}

.core-adv-text p {
  font-size: 0.82rem;
  color: #94A3B8;
  line-height: 1.45;
  margin: 0;
}

/* Bestsellers Section */
.bestsellers-section {
  background: #FFFFFF;
}

.section-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
  gap: 1.5rem;
}

.section-header-flex h2 {
  font-size: 2.2rem;
  color: #0F172A;
  margin: 0.4rem 0 0.5rem;
}

.section-header-flex p {
  color: #64748B;
  font-size: 1.05rem;
  margin: 0;
}

.bestseller-tabs {
  display: flex;
  gap: 0.6rem;
  overflow-x: auto;
  padding: 0.5rem 0 1.5rem;
  margin-bottom: 1.5rem;
  scrollbar-width: thin;
}

.bestseller-tab-btn {
  padding: 0.6rem 1.25rem;
  border-radius: 9999px;
  border: 1px solid #E2E8F0;
  background: #F8FAFC;
  color: #475569;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
}

.bestseller-tab-btn:hover {
  border-color: #F59E0B;
  color: #F59E0B;
}

.bestseller-tab-btn.active {
  background: #0B1221;
  color: #FFFFFF;
  border-color: #0B1221;
  box-shadow: 0 4px 10px rgba(11, 18, 33, 0.15);
}

.bestsellers-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.75rem;
  margin-bottom: 3rem;
}

.bestseller-card {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 1.25rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.25s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.bestseller-card:hover {
  transform: translateY(-4px);
  border-color: #F59E0B;
  box-shadow: 0 16px 30px rgba(0, 0, 0, 0.08);
}

.bestseller-img-wrap {
  position: relative;
  height: 180px;
  background: #F1F5F9;
  overflow: hidden;
}

.bestseller-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.bestseller-card:hover .bestseller-img-wrap img {
  transform: scale(1.05);
}

.bestseller-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(11, 18, 33, 0.85);
  backdrop-filter: blur(4px);
  color: #F59E0B;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.65rem;
  border-radius: 6px;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.bestseller-info {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.bestseller-category {
  font-size: 0.78rem;
  color: #94A3B8;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 0.35rem;
}

.bestseller-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #0F172A;
  line-height: 1.35;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.bestseller-desc {
  font-size: 0.82rem;
  color: #64748B;
  line-height: 1.45;
  margin-bottom: 1.25rem;
  flex: 1;
}

.bestseller-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #F1F5F9;
  flex-wrap: wrap;
}

.bestseller-price-box {
  display: flex;
  flex-direction: column;
}

.price-val {
  font-size: 1.2rem;
  font-weight: 800;
  color: #0F172A;
}

.price-unit {
  font-size: 0.8rem;
  color: #94A3B8;
}

.bestseller-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.bestseller-qty-ctrl {
  display: flex;
  align-items: center;
  border: 1px solid #CBD5E1;
  border-radius: 8px;
  overflow: hidden;
  background: #F8FAFC;
}

.bestseller-qty-ctrl button {
  width: 28px;
  height: 32px;
  background: transparent;
  border: none;
  font-weight: 700;
  color: #475569;
  cursor: pointer;
  transition: background 0.15s;
}

.bestseller-qty-ctrl button:hover {
  background: #E2E8F0;
  color: #0F172A;
}

.bestseller-qty-ctrl span {
  width: 24px;
  text-align: center;
  font-size: 0.88rem;
  font-weight: 600;
  color: #0F172A;
}

.btn-add-bestseller {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0 0.85rem;
  height: 34px;
  background: #F59E0B;
  color: #0B1221;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-add-bestseller:hover {
  background: #D97706;
  color: #FFFFFF;
}

.btn-add-bestseller.in-cart {
  background: #10B981;
  color: #FFFFFF;
}

.center-cta-box {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

/* Articles Section on Home */
.articles-home-section {
  background: #F8FAFC;
}

.home-articles-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
}

.home-article-card {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 1.25rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

.home-article-card:hover {
  transform: translateY(-4px);
  border-color: #F59E0B;
  box-shadow: 0 16px 25px -5px rgba(0, 0, 0, 0.07);
}

.h-art-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.h-art-tag {
  background: rgba(245, 158, 11, 0.12);
  color: #D97706;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.25rem 0.65rem;
  border-radius: 6px;
}

.h-art-time {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  color: #94A3B8;
  font-size: 0.78rem;
}

.h-art-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #0F172A;
  line-height: 1.35;
  margin-bottom: 0.75rem;
  transition: color 0.2s;
}

.home-article-card:hover .h-art-title {
  color: #D97706;
}

.h-art-desc {
  font-size: 0.9rem;
  color: #64748B;
  line-height: 1.55;
  flex: 1;
  margin-bottom: 1.5rem;
}

.h-art-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid #F1F5F9;
}

.h-art-date {
  font-size: 0.8rem;
  color: #94A3B8;
}

.h-art-link {
  font-size: 0.88rem;
  font-weight: 700;
  color: #0F172A;
  transition: color 0.2s;
}

.home-article-card:hover .h-art-link {
  color: #D97706;
}

.mobile-only-btn-wrap {
  display: none;
}

/* Reviews Section */
.reviews-section {
  background: #FFFFFF;
}

.reviews-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.review-card {
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 1.25rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
}

.review-rating {
  display: flex;
  gap: 0.3rem;
  margin-bottom: 1rem;
}

.review-quote {
  font-size: 0.98rem;
  line-height: 1.6;
  color: #334155;
  font-style: italic;
  flex: 1;
  margin-bottom: 1.5rem;
}

.review-author {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #E2E8F0;
}

.author-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #0B1221;
  color: #F59E0B;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.95rem;
  flex-shrink: 0;
}

.author-name {
  font-weight: 700;
  color: #0F172A;
  font-size: 0.95rem;
}

.author-role {
  font-size: 0.82rem;
  color: #64748B;
}

.author-role b {
  color: #1E293B;
}

/* Callback Banner */
.callback-section {
  padding: 2rem 0 4rem;
}

.callback-banner {
  background: linear-gradient(135deg, #0B1221 0%, #17233B 100%);
  border-radius: 1.75rem;
  padding: 3rem;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  align-items: center;
  gap: 3rem;
  box-shadow: 0 20px 40px rgba(11, 18, 33, 0.15);
}

.cb-content h2 {
  font-size: 2rem;
  color: #FFFFFF;
  margin: 0.75rem 0;
  line-height: 1.25;
}

.cb-content p {
  color: #94A3B8;
  font-size: 1rem;
  line-height: 1.55;
  margin: 0;
}

.cb-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.cb-inputs {
  display: flex;
  gap: 0.75rem;
}

.cb-inputs input {
  flex: 1;
  padding: 0.85rem 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.08);
  color: #FFFFFF;
  font-size: 1rem;
}

.cb-inputs input:focus {
  outline: none;
  border-color: #F59E0B;
  background: rgba(255, 255, 255, 0.14);
}

.btn-cb {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  padding: 0.85rem 1.5rem;
}

.cb-privacy {
  font-size: 0.78rem;
  color: #64748B;
}

.btn-outline-dark {
  border: 1px solid #CBD5E1;
  background: #FFFFFF;
  color: #1E293B;
  padding: 0.65rem 1.25rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-outline-dark:hover {
  border-color: #0F172A;
  background: #0F172A;
  color: #FFFFFF;
}

@media (max-width: 1200px) {
  .core-advantages-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .bestsellers-grid {
    grid-template-columns: repeat(3, 1fr);
  }
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
  .bestsellers-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .home-articles-grid {
    grid-template-columns: 1fr;
  }
  .reviews-grid {
    grid-template-columns: 1fr;
  }
  .callback-banner {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 2.5rem 1.5rem;
  }
  .cb-inputs {
    flex-direction: column;
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
  .core-advantages-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  .section-header-flex {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 1.5rem;
  }
  .desktop-only-btn {
    display: none;
  }
  .mobile-only-btn-wrap {
    display: block;
    margin-top: 1rem;
  }
  .btn-block {
    display: block;
    width: 100%;
    text-align: center;
  }
  .bestsellers-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  .bestseller-img-wrap {
    height: 140px;
  }
  .bestseller-info {
    padding: 0.85rem;
  }
  .bestseller-title {
    font-size: 0.95rem;
  }
  .bestseller-desc {
    display: none; /* Hide description on mobile for compact touch layout */
  }
  .bestseller-footer {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
  .bestseller-actions {
    justify-content: space-between;
  }
  .btn-add-bestseller {
    flex: 1;
    justify-content: center;
  }
}
</style>
