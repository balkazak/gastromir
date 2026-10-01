<template>
  <div class="articles-page">
    <!-- Hero / Header Section -->
    <section class="articles-hero">
      <div class="container">
        <div class="breadcrumbs">
          <router-link to="/">Главная</router-link>
          <span class="sep">/</span>
          <span class="current">Полезные статьи</span>
        </div>
        <span class="hero-sub">База знаний HoReCa Астана</span>
        <h1>Полезные статьи и руководства по закупкам</h1>
        <p class="hero-desc">
          Практические советы для шеф-поваров, управляющих и закупщиков ресторанов, кафе и баров Астаны.
          Оптимизация фудкоста, стандарты качества продуктов и выбор надежных поставщиков.
        </p>

        <!-- Search Bar -->
        <div class="search-box">
          <Search class="search-icon" :size="20" />
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Поиск по статьям (например: сыры, мясо, фудкост, фритюр)..." 
          />
          <button v-if="searchQuery" class="btn-clear" @click="searchQuery = ''" title="Очистить">
            <X :size="18" />
          </button>
        </div>
      </div>
    </section>

    <!-- Categories Filter & Content -->
    <section class="articles-content section-padding">
      <div class="container">
        <!-- Category Pills -->
        <div class="filter-pills-bar">
          <button 
            v-for="cat in categories" 
            :key="cat"
            class="filter-pill"
            :class="{ active: selectedCategory === cat }"
            @click="selectedCategory = cat"
          >
            {{ cat }}
          </button>
        </div>

        <!-- Share Ribbon -->
        <div class="share-ribbon">
          <span class="share-text">Поделиться подборкой с коллегами:</span>
          <a :href="shareWaUrl" target="_blank" rel="noopener noreferrer" class="btn-share wa" title="WhatsApp">
            <MessageCircle :size="16" /> WhatsApp
          </a>
          <a :href="shareTgUrl" target="_blank" rel="noopener noreferrer" class="btn-share tg" title="Telegram">
            <Send :size="16" /> Telegram
          </a>
        </div>

        <!-- Articles Grid -->
        <div v-if="filteredArticles.length > 0" class="articles-grid">
          <article 
            v-for="article in filteredArticles" 
            :key="article.id"
            class="article-card"
            @click="openArticle(article)"
          >
            <div class="card-meta">
              <span class="card-tag">{{ article.tag }}</span>
              <span class="card-read-time"><Clock :size="14" /> {{ article.readTime }}</span>
            </div>

            <h2 class="card-title">{{ article.title }}</h2>
            <p class="card-summary">{{ article.summary }}</p>

            <div class="card-footer">
              <span class="card-date">{{ article.date }}</span>
              <span class="card-read-btn">
                Читать статью <ArrowRight :size="16" />
              </span>
            </div>
          </article>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <FileText :size="48" class="empty-icon" />
          <h3>Статьи не найдены</h3>
          <p>Попробуйте изменить поисковый запрос или выбрать другую категорию</p>
          <button class="btn btn-outline-dark" @click="resetFilters">Сбросить фильтры</button>
        </div>

        <!-- B2B Consult CTA Banner -->
        <div class="consult-banner">
          <div class="banner-text">
            <span class="badge-mini">Консультация эксперта</span>
            <h3>Хотите оптимизировать закупки продуктов в вашем заведении?</h3>
            <p>Наш ведущий менеджер HoReCa бесплатно проанализирует вашу накладную и предложит лучшие условия со склада в Астане.</p>
          </div>
          <div class="banner-actions">
            <a 
              href="https://wa.me/77015141404?text=Здравствуйте!%20Хочу%20проконсультироваться%20по%20закупкам%20продуктов%20для%20заведения." 
              target="_blank" 
              rel="noopener noreferrer" 
              class="btn btn-whatsapp btn-lg"
            >
              <MessageCircle :size="20" /> Написать в WhatsApp
            </a>
            <router-link to="/catalog" class="btn btn-secondary btn-lg">
              <ShoppingBag :size="18" /> Перейти в каталог
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Reading Modal -->
    <div v-if="activeArticle" class="modal-backdrop" @click="closeArticle">
      <div class="modal-container article-modal" @click.stop>
        <button class="modal-close" @click="closeArticle" aria-label="Закрыть">
          <X :size="24" />
        </button>

        <div class="modal-header">
          <div class="modal-badges">
            <span class="card-tag">{{ activeArticle.tag }}</span>
            <span class="card-read-time"><Clock :size="14" /> {{ activeArticle.readTime }} чтения</span>
            <span class="modal-date">{{ activeArticle.date }}</span>
          </div>
          <h1>{{ activeArticle.title }}</h1>
          <div class="author-badge">Автор: {{ activeArticle.author }}</div>
        </div>

        <div class="modal-body article-reader-content" v-html="activeArticle.content"></div>

        <div class="modal-footer-cta">
          <div class="cta-box">
            <div class="cta-text">
              <h4>Нужны продукты из этой статьи?</h4>
              <p>Заказывайте сертифицированные позиции для HoReCa в каталоге GASTROMIR с доставкой день в день.</p>
            </div>
            <div class="cta-btns">
              <button 
                v-if="activeArticle.relatedCategory"
                @click="goToCategory(activeArticle.relatedCategory)"
                class="btn btn-primary"
              >
                Смотреть «{{ activeArticle.relatedCategory }}»
              </button>
              <router-link to="/catalog" class="btn btn-secondary">
                Весь каталог
              </router-link>
            </div>
          </div>

          <div class="modal-share-bar">
            <span>Поделиться статьей:</span>
            <a :href="getArticleShareWa(activeArticle)" target="_blank" rel="noopener noreferrer" class="btn-share wa">
              <MessageCircle :size="16" /> WhatsApp
            </a>
            <a :href="getArticleShareTg(activeArticle)" target="_blank" rel="noopener noreferrer" class="btn-share tg">
              <Send :size="16" /> Telegram
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  Search, 
  X, 
  Clock, 
  ArrowRight, 
  FileText, 
  MessageCircle, 
  Send, 
  ShoppingBag 
} from 'lucide-vue-next'
import { HORECA_ARTICLES } from '@/data/articles'

const route = useRoute()
const router = useRouter()

const articles = ref(HORECA_ARTICLES)
const searchQuery = ref('')
const selectedCategory = ref('Все статьи')
const activeArticle = ref(null)

const categories = [
  'Все статьи',
  'Закупки и поставщики',
  'Сыры и молочка',
  'Мясо и птица',
  'Бакалея и масла',
  'Заморозка',
  'Хозтовары и упаковка',
  'Экономика кухни',
  'Кофе, чай и напитки'
]

const filteredArticles = computed(() => {
  return articles.value.filter(art => {
    const matchesCategory = selectedCategory.value === 'Все статьи' || art.category === selectedCategory.value
    const query = searchQuery.value.toLowerCase().trim()
    const matchesQuery = !query || 
      art.title.toLowerCase().includes(query) || 
      art.summary.toLowerCase().includes(query) || 
      art.tag.toLowerCase().includes(query) ||
      (art.seoKeywords && art.seoKeywords.toLowerCase().includes(query))
    return matchesCategory && matchesQuery
  })
})

const shareWaUrl = computed(() => {
  const text = encodeURIComponent('Полезные статьи о закупках продуктов для ресторанов в Астане: https://gastromir.kz/articles')
  return `https://wa.me/?text=${text}`
})

const shareTgUrl = computed(() => {
  const text = encodeURIComponent('Полезные статьи о закупках продуктов для ресторанов в Астане')
  const url = encodeURIComponent('https://gastromir.kz/articles')
  return `https://t.me/share/url?url=${url}&text=${text}`
})

const getArticleShareWa = (art) => {
  const text = encodeURIComponent(`Рекомендую прочитать: «${art.title}» на GASTROMIR: https://gastromir.kz/articles?article=${art.slug}`)
  return `https://wa.me/?text=${text}`
}

const getArticleShareTg = (art) => {
  const text = encodeURIComponent(`«${art.title}» — статья для ресторанов на GASTROMIR`)
  const url = encodeURIComponent(`https://gastromir.kz/articles?article=${art.slug}`)
  return `https://t.me/share/url?url=${url}&text=${text}`
}

const openArticle = (article) => {
  activeArticle.value = article
  router.replace({ query: { ...route.query, article: article.slug } })
  document.body.style.overflow = 'hidden'
}

const closeArticle = () => {
  activeArticle.value = null
  const query = { ...route.query }
  delete query.article
  router.replace({ query })
  document.body.style.overflow = ''
}

const goToCategory = (categoryName) => {
  closeArticle()
  router.push({ path: '/catalog', query: { category: categoryName } })
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'Все статьи'
}

onMounted(() => {
  if (route.query.article) {
    const found = articles.value.find(a => a.slug === route.query.article)
    if (found) {
      openArticle(found)
    }
  }
})
</script>

<style scoped>
.articles-page {
  min-height: 100vh;
  background-color: #F8FAFC;
}

.articles-hero {
  background: linear-gradient(135deg, #0B1221 0%, #151F33 100%);
  color: #FFFFFF;
  padding: 8rem 0 3.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #94A3B8;
  margin-bottom: 1.5rem;
}

.breadcrumbs a {
  color: #94A3B8;
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumbs a:hover {
  color: #F59E0B;
}

.breadcrumbs .current {
  color: #F59E0B;
}

.hero-sub {
  display: inline-block;
  color: #F59E0B;
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.75rem;
}

h1 {
  font-size: 2.75rem;
  line-height: 1.2;
  margin-bottom: 1rem;
  color: #FFFFFF;
  font-weight: 800;
}

.hero-desc {
  font-size: 1.15rem;
  color: #94A3B8;
  max-width: 760px;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.search-box {
  position: relative;
  max-width: 650px;
}

.search-icon {
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94A3B8;
}

.search-box input {
  width: 100%;
  padding: 1rem 3rem 1rem 3.25rem;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(12px);
  color: #FFFFFF;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.search-box input:focus {
  outline: none;
  border-color: #F59E0B;
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.2);
}

.search-box input::placeholder {
  color: #64748B;
}

.btn-clear {
  position: absolute;
  right: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #94A3B8;
  cursor: pointer;
  display: flex;
  align-items: center;
}

/* Category Filter Bar */
.filter-pills-bar {
  display: flex;
  gap: 0.6rem;
  overflow-x: auto;
  padding: 0.5rem 0 1.25rem;
  margin-bottom: 1.5rem;
  scrollbar-width: thin;
}

.filter-pills-bar::-webkit-scrollbar {
  height: 4px;
}

.filter-pills-bar::-webkit-scrollbar-thumb {
  background: #CBD5E1;
  border-radius: 4px;
}

.filter-pill {
  padding: 0.6rem 1.25rem;
  border-radius: 9999px;
  border: 1px solid #E2E8F0;
  background: #FFFFFF;
  color: #475569;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-pill:hover {
  border-color: #F59E0B;
  color: #F59E0B;
}

.filter-pill.active {
  background: #0B1221;
  color: #FFFFFF;
  border-color: #0B1221;
  box-shadow: 0 4px 12px rgba(11, 18, 33, 0.15);
}

/* Share Ribbon */
.share-ribbon {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid #E2E8F0;
}

.share-text {
  font-size: 0.9rem;
  color: #64748B;
  font-weight: 500;
}

.btn-share {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.85rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  transition: filter 0.2s ease;
}

.btn-share.wa {
  background: #25D366;
  color: #FFFFFF;
}

.btn-share.tg {
  background: #229ED9;
  color: #FFFFFF;
}

.btn-share:hover {
  filter: brightness(1.1);
}

/* Articles Grid */
.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.article-card {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 1.25rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04);
}

.article-card:hover {
  transform: translateY(-4px);
  border-color: #F59E0B;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08);
}

.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.card-tag {
  background: rgba(245, 158, 11, 0.12);
  color: #D97706;
  font-weight: 700;
  font-size: 0.8rem;
  padding: 0.3rem 0.75rem;
  border-radius: 6px;
}

.card-read-time {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  color: #94A3B8;
  font-weight: 500;
}

.card-title {
  font-size: 1.3rem;
  line-height: 1.35;
  color: #0F172A;
  font-weight: 700;
  margin-bottom: 0.85rem;
  transition: color 0.2s;
}

.article-card:hover .card-title {
  color: #D97706;
}

.card-summary {
  font-size: 0.95rem;
  color: #64748B;
  line-height: 1.55;
  flex: 1;
  margin-bottom: 1.5rem;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1.25rem;
  border-top: 1px solid #F1F5F9;
}

.card-date {
  font-size: 0.82rem;
  color: #94A3B8;
}

.card-read-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  font-weight: 700;
  color: #0F172A;
  transition: transform 0.2s;
}

.article-card:hover .card-read-btn {
  transform: translateX(4px);
  color: #D97706;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 5rem 2rem;
  background: #FFFFFF;
  border-radius: 1.5rem;
  border: 1px dashed #CBD5E1;
  margin-bottom: 3rem;
}

.empty-icon {
  color: #94A3B8;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #0F172A;
}

.empty-state p {
  color: #64748B;
  margin-bottom: 1.5rem;
}

/* Consult Banner */
.consult-banner {
  background: linear-gradient(135deg, #0B1221 0%, #1E293B 100%);
  color: #FFFFFF;
  border-radius: 1.5rem;
  padding: 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  margin-top: 2rem;
  box-shadow: 0 20px 30px rgba(11, 18, 33, 0.15);
}

.badge-mini {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  background: rgba(245, 158, 11, 0.2);
  color: #F59E0B;
  font-weight: 700;
  font-size: 0.8rem;
  border-radius: 9999px;
  margin-bottom: 0.85rem;
}

.banner-text h3 {
  font-size: 1.6rem;
  color: #FFFFFF;
  margin-bottom: 0.75rem;
}

.banner-text p {
  color: #94A3B8;
  max-width: 600px;
  line-height: 1.5;
}

.banner-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex-shrink: 0;
}

/* Modal Article Reader */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(11, 18, 33, 0.8);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
  overflow-y: auto;
}

.article-modal {
  background: #FFFFFF;
  border-radius: 1.5rem;
  max-width: 840px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 3rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #F1F5F9;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #475569;
  transition: all 0.2s;
  z-index: 10;
}

.modal-close:hover {
  background: #E2E8F0;
  color: #0F172A;
  transform: rotate(90deg);
}

.modal-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #E2E8F0;
}

.modal-badges {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.modal-date {
  font-size: 0.85rem;
  color: #94A3B8;
}

.modal-header h1 {
  font-size: 2.2rem;
  color: #0F172A;
  line-height: 1.25;
  margin-bottom: 0.75rem;
}

.author-badge {
  font-size: 0.9rem;
  color: #64748B;
  font-weight: 600;
}

/* Content Reader Styles */
:deep(.article-reader-content) {
  font-size: 1.08rem;
  line-height: 1.75;
  color: #334155;
}

:deep(.article-reader-content h2) {
  font-size: 1.6rem;
  color: #0F172A;
  margin: 2rem 0 1rem;
  font-weight: 700;
}

:deep(.article-reader-content h3) {
  font-size: 1.3rem;
  color: #0F172A;
  margin: 1.75rem 0 0.75rem;
  font-weight: 700;
}

:deep(.article-reader-content p) {
  margin-bottom: 1.25rem;
}

:deep(.article-reader-content ul) {
  margin: 1rem 0 1.5rem 1.5rem;
}

:deep(.article-reader-content li) {
  margin-bottom: 0.5rem;
}

:deep(.article-callout) {
  background: #FFFBEB;
  border-left: 4px solid #F59E0B;
  padding: 1.5rem;
  border-radius: 0 1rem 1rem 0;
  margin: 2rem 0;
}

:deep(.article-callout h4) {
  color: #B45309;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

:deep(.article-callout p) {
  color: #78350F;
  margin-bottom: 0;
  font-size: 0.98rem;
}

/* Modal Footer CTA */
.modal-footer-cta {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #E2E8F0;
}

.cta-box {
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 1.25rem;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.cta-text h4 {
  font-size: 1.2rem;
  color: #0F172A;
  margin-bottom: 0.4rem;
}

.cta-text p {
  color: #64748B;
  font-size: 0.95rem;
  margin: 0;
}

.cta-btns {
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;
}

.modal-share-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: #64748B;
}

@media (max-width: 992px) {
  .consult-banner {
    flex-direction: column;
    text-align: center;
    padding: 2.5rem 1.5rem;
  }
  .banner-actions {
    width: 100%;
  }
  .cta-box {
    flex-direction: column;
    text-align: center;
  }
  .cta-btns {
    width: 100%;
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .articles-hero {
    padding: 6.5rem 0 2.5rem;
  }
  h1 {
    font-size: 2rem;
  }
  .articles-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
  .article-modal {
    padding: 2rem 1.25rem;
  }
  .modal-header h1 {
    font-size: 1.6rem;
  }
}
</style>
