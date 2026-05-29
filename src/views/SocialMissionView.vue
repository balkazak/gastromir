<template>
  <div class="social-mission-page">
    <!-- Custom Toast Notification -->
    <transition name="toast-fade">
      <div v-if="showToast" class="custom-toast">
        <div class="toast-content">
          <CheckCircle class="toast-check-icon" />
          <span>{{ toastMessage }}</span>
        </div>
      </div>
    </transition>

    <!-- 1. Hero Section -->
    <section class="mission-hero" :style="{ backgroundImage: `url(${socialBg})` }">
      <div class="hero-overlay"></div>
      <div class="container hero-content-wrapper">
        <div class="hero-left-col" v-motion-slide-visible-once-left>
          <h1 class="hero-title">
            1% от заказа — <br />
            <span class="highlight-green">на добро</span>
          </h1>
          <p class="hero-description">
            Каждый заказ через Gastro Mir помогает накормить тех, кто в этом нуждается
          </p>
          <button 
            @click="scrollToTimeline" 
            class="btn-partner-scroll"
          >
            СТАТЬ ПАРТНЕРОМ
          </button>
        </div>

        <div class="hero-right-col" v-motion-slide-visible-once-right>
          <!-- Flowchart circle diagram -->
          <div class="flowchart-circle">
            <div class="flow-step">
              <div class="flow-icon-container">
                <Store class="flow-icon" />
              </div>
              <span class="flow-text">РЕСТОРАН</span>
            </div>
            
            <div class="flow-arrow">
              <ArrowDown class="arrow-svg" />
            </div>

            <div class="flow-step">
              <div class="flow-icon-container highlight-pct">
                <span class="pct-text">1%</span>
              </div>
              <span class="flow-text">1% ОТ ЗАКАЗА</span>
            </div>

            <div class="flow-arrow">
              <ArrowDown class="arrow-svg" />
            </div>

            <div class="flow-step">
              <div class="flow-icon-container">
                <Users class="flow-icon" />
              </div>
              <span class="flow-text">ПОМОЩЬ ЛЮДЯМ</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. [MOVED UP] Step Checklist Timeline -->
    <section ref="timelineSection" class="partnership-steps section-padding white-bg">
      <div class="container">
        <h2 class="timeline-main-title" v-motion-slide-visible-once-bottom>
          ПРОГРАММА ВЗАИМОДЕЙСТВИЯ
        </h2>
        <p class="timeline-subtitle" v-motion-slide-visible-once-bottom>
          Пошаговое описание реализации нашей благотворительной миссии
        </p>

        <div class="timeline-wrapper">
          <div class="timeline-vertical-line"></div>
          
          <div class="timeline-steps-list">
            <!-- Step 1 -->
            <div class="timeline-step-row" v-motion-slide-visible-once-bottom>
              <div class="timeline-badge">
                <Settings class="timeline-badge-svg" />
              </div>
              <div class="timeline-content-card">
                <span class="timeline-number">01</span>
                <div class="timeline-text-wrap">
                  <h3 class="timeline-step-heading">КАК РАБОТАЕТ СИСТЕМА</h3>
                  <p class="timeline-step-desc">пошаговый механизм помощи</p>
                </div>
              </div>
            </div>

            <!-- Step 2 -->
            <div class="timeline-step-row" v-motion-slide-visible-once-bottom>
              <div class="timeline-badge">
                <PieChart class="timeline-badge-svg" />
              </div>
              <div class="timeline-content-card">
                <span class="timeline-number">02</span>
                <div class="timeline-text-wrap">
                  <h3 class="timeline-step-heading">ПРОЗРАЧНОСТЬ</h3>
                  <p class="timeline-step-desc">финансовая отчетность, поступления и расходы</p>
                </div>
              </div>
            </div>

            <!-- Step 3 -->
            <div class="timeline-step-row" v-motion-slide-visible-once-bottom>
              <div class="timeline-badge">
                <Soup class="timeline-badge-svg" />
              </div>
              <div class="timeline-content-card">
                <span class="timeline-number">03</span>
                <div class="timeline-text-wrap">
                  <h3 class="timeline-step-heading">ГОРЯЧЕЕ ПИТАНИЕ</h3>
                  <p class="timeline-step-desc">программа, локации, график, отчеты</p>
                </div>
              </div>
            </div>

            <!-- Step 4 -->
            <div class="timeline-step-row" v-motion-slide-visible-once-bottom>
              <div class="timeline-badge">
                <Users class="timeline-badge-svg" />
              </div>
              <div class="timeline-content-card">
                <span class="timeline-number">04</span>
                <div class="timeline-text-wrap">
                  <h3 class="timeline-step-heading">ПАРТНЕРЫ</h3>
                  <p class="timeline-step-desc">рестораны, меценаты, бизнес</p>
                </div>
              </div>
            </div>

            <!-- Step 5 -->
            <div class="timeline-step-row" v-motion-slide-visible-once-bottom>
              <div class="timeline-badge">
                <Landmark class="timeline-badge-svg" />
              </div>
              <div class="timeline-content-card">
                <span class="timeline-number">05</span>
                <div class="timeline-text-wrap">
                  <h3 class="timeline-step-heading">АКИМАТ ГОРОДА</h3>
                  <p class="timeline-step-desc">участие</p>
                </div>
              </div>
            </div>

            <!-- Step 6 -->
            <div class="timeline-step-row" v-motion-slide-visible-once-bottom>
              <div class="timeline-badge">
                <TrendingUp class="timeline-badge-svg" />
              </div>
              <div class="timeline-content-card">
                <span class="timeline-number">06</span>
                <div class="timeline-text-wrap">
                  <h3 class="timeline-step-heading">СТАТИСТИКА (LIVE)</h3>
                  <p class="timeline-step-desc">ключевые показатели онлайн</p>
                </div>
              </div>
            </div>

            <!-- Step 7 -->
            <div class="timeline-step-row" v-motion-slide-visible-once-bottom>
              <div class="timeline-badge">
                <FileText class="timeline-badge-svg" />
              </div>
              <div class="timeline-content-card">
                <span class="timeline-number">07</span>
                <div class="timeline-text-wrap">
                  <h3 class="timeline-step-heading">ОТЧЕТЫ</h3>
                  <p class="timeline-step-desc">скачать отчеты, документы</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="timeline-final-cta" v-motion-slide-visible-once-bottom>
          <button 
            @click="handleConnectRestaurant" 
            class="timeline-btn"
          >
            ПОДКЛЮЧИТЬСЯ К ПРОГРАММЕ
          </button>
        </div>
      </div>
    </section>

    <!-- 5. City Akimat Participation Block -->
    <section class="akimat-participation section-padding white-bg">
      <div class="container">
        <div class="akimat-card" v-motion-slide-visible-once-bottom>
          <div class="akimat-inner">
            <div class="akimat-left">
              <div class="landmark-icon-circle">
                <Landmark class="landmark-svg" />
              </div>
            </div>
            <div class="akimat-right">
              <h2 class="akimat-title">УЧАСТИЕ АКИМАТА ГОРОДА</h2>
              <ul class="akimat-list">
                <li class="akimat-list-item">
                  <div class="checkmark-wrapper">
                    <Check class="checkmark-icon" />
                  </div>
                  <span class="akimat-list-text">Информационное участие</span>
                </li>
                <li class="akimat-list-item">
                  <div class="checkmark-wrapper">
                    <Check class="checkmark-icon" />
                  </div>
                  <span class="akimat-list-text">Координация с социальными службами</span>
                </li>
          
              </ul>
            </div>
          </div>
          <div class="akimat-tagline">
            Партнерство во имя благополучия города и его жителей
          </div>
        </div>
      </div>
    </section>

    <!-- 6. Public & Transparent Banner -->
    <section class="transparency-banner" v-motion-slide-visible-once-bottom>
      <div class="container transparency-inner">
        <div class="shield-wrapper">
          <ShieldCheck class="shield-icon" />
        </div>
        <div class="transparency-text">
          <h2 class="transparency-title">ПУБЛИЧНО. ПРОЗРАЧНО. ОТВЕТСТВЕННО.</h2>
          <p class="transparency-subtitle">Под контролем общества и акимата города</p>
        </div>
      </div>
    </section>

    <!-- 7. Directions of Help Section (Appended Old Content) -->
    <section class="mission-directions section-padding">
      <div class="container">
        <div class="directions-card" v-motion-slide-visible-once-bottom>
          <h2 class="section-heading">Направления ресурсов</h2>
          <p class="subtitle">Часть средств и ресурсов партнёров GASTROMIR направляется на:</p>
          
          <div class="directions-grid">
            <div class="direction-item">
              <span class="icon-bullet">🔥</span>
              <p>приготовление горячей еды</p>
            </div>
            <div class="direction-item">
              <span class="icon-bullet">📦</span>
              <p>продуктовые наборы</p>
            </div>
            <div class="direction-item">
              <span class="icon-bullet">🍲</span>
              <p>социальные обеды</p>
            </div>
            <div class="direction-item">
              <span class="icon-bullet">🤝</span>
              <p>адресную помощь</p>
            </div>
          </div>

          <div class="delivery-note">
            💡 <strong>Примечание:</strong> Доставка питания осуществляется совместно с волонтёрами и социальными службами по заранее сформированным спискам нуждающихся семей и людей.
          </div>
        </div>
      </div>
    </section>

    <!-- 8. How System Works Section (Appended Old Content) -->
    <section class="system-section section-padding white-bg">
      <div class="container">
        <div class="section-header center">
          <h2 class="section-heading">Как работает система</h2>
          <p class="section-sub-header">Уникальная экосистема объединения усилий</p>
        </div>

        <div class="system-grid">
          <!-- 1. Restaurants -->
          <div class="system-card" v-motion-slide-visible-once-bottom>
            <div class="card-title-row">
              <Store class="system-icon orange" />
              <h3>Рестораны-партнёры</h3>
            </div>
            <p class="card-desc">Участвуют в социальной программе через:</p>
            <ul class="bullet-list">
              <li>1% от прибыли</li>
              <li>приготовление горячих обедов</li>
              <li>участие в благотворительных днях и акциях</li>
            </ul>
          </div>

          <!-- 2. Guests -->
          <div class="system-card" v-motion-slide-visible-once-bottom>
            <div class="card-title-row">
              <Users class="system-icon blue" />
              <h3>Гости заведений</h3>
            </div>
            <p class="card-desc">Могут поддержать проект:</p>
            <ul class="bullet-list">
              <li>через QR-пожертвования</li>
              <li>участвуя в социальных акциях</li>
              <li>посещая рестораны-партнёры</li>
            </ul>
            <div class="special-note">Каждый визит становится вкладом в доброе дело.</div>
          </div>

          <!-- 3. Volunteers -->
          <div class="system-card" v-motion-slide-visible-once-bottom>
            <div class="card-title-row">
              <HeartHandshake class="system-icon red" />
              <h3>Волонтёры и социальные службы</h3>
            </div>
            <p class="card-desc">Организуют:</p>
            <ul class="bullet-list">
              <li>доставку еды</li>
              <li>помощь нуждающимся</li>
              <li>распределение продуктовой поддержки</li>
            </ul>
          </div>

          <!-- 4. Akimat -->
          <div class="system-card" v-motion-slide-visible-once-bottom>
            <div class="card-title-row">
              <Landmark class="system-icon gold" />
              <h3>Поддержка акимата</h3>
            </div>
            <p class="card-desc">Проект способствует:</p>
            <ul class="bullet-list">
              <li>социальной поддержке населения</li>
              <li>развитию волонтёрского движения</li>
              <li>укреплению сотрудничества бизнеса и государства</li>
              <li>развитию социального предпринимательства в Казахстане</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- 9. Main Idea Section (Appended Old Content) -->
    <section class="main-idea section-padding">
      <div class="container">
        <div class="idea-box" v-motion-slide-visible-once-bottom>
          <div class="idea-icon">💡</div>
          <h2>Главная идея</h2>
          <div class="idea-content">
            <p class="primary-idea">
              Мы хотим создать систему, где ресторанный бизнес становится частью заботы о людях.
            </p>
            <div class="divider"></div>
            <p class="secondary-idea">
              Когда человек посещает ресторан-партнёр GASTROMIR — он не просто ужинает.<br>
              <strong>Он помогает накормить тех, кто нуждается в поддержке и тепле.</strong>
            </p>
          </div>
          <div class="cta-actions">
            <button @click="handleConnectRestaurant" class="btn btn-secondary">Подключить ресторан</button>
            <router-link to="/catalog" class="btn btn-outline">Смотреть каталог</router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { 
  Store, Heart, Users, Utensils, Wallet, Clock, MapPin, 
  ArrowDown, Landmark, Check, ShieldCheck, HeartHandshake,
  Settings, PieChart, Soup, TrendingUp, FileText, CheckCircle
} from 'lucide-vue-next'
import socialBg from '@/assets/social_background.png'

const authStore = useAuthStore()
const router = useRouter()

const timelineSection = ref(null)
const mealsScheduleSection = ref(null)
const showToast = ref(false)
const toastMessage = ref('')

const scrollToTimeline = () => {
  timelineSection.value?.scrollIntoView({ behavior: 'smooth' })
}

const handleConnectRestaurant = () => {
  if (authStore.isAuthenticated) {
    toastMessage.value = 'Вы уже подключены!'
    showToast.value = true
    setTimeout(() => {
      showToast.value = false
    }, 3500)
    mealsScheduleSection.value?.scrollIntoView({ behavior: 'smooth' })
  } else {
    router.push('/register')
  }
}
</script>

<style scoped>
.social-mission-page {
  background-color: var(--white);
  color: var(--primary);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Custom Toast Style */
.custom-toast {
  position: fixed;
  top: 5.5rem;
  right: 2rem;
  z-index: 2000;
  background-color: #046A50; /* Elegant brand emerald */
  color: var(--white);
  padding: 1rem 1.75rem;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(4, 106, 80, 0.35);
  display: flex;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.15);
  font-weight: 700;
  font-size: 1.05rem;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.toast-check-icon {
  width: 22px;
  height: 22px;
  stroke-width: 2.5px;
}

/* Toast Transitions */
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-fade-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}

.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

/* Common Background Utilities */
.white-bg {
  background-color: var(--white) !important;
}

/* Section Headings */
.section-heading {
  font-size: 2.25rem;
  font-weight: 800;
  color: #0b1c3f;
  margin-bottom: 0.75rem;
}

/* 1. Hero Section Styles */
.mission-hero {
  position: relative;
  background-size: cover;
  background-position: center;
  min-height: 540px;
  display: flex;
  align-items: center;
  padding: 7rem 0 5rem;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    linear-gradient(180deg, rgba(11, 18, 33, 0.85) 0%, rgba(11, 18, 33, 0.45) 80px, rgba(255, 255, 255, 0) 150px),
    linear-gradient(90deg, 
      rgba(255,255,255,1) 0%, 
      rgba(255,255,255,0.98) 35%, 
      rgba(255,255,255,0.75) 55%, 
      rgba(255,255,255,0.1) 100%
    );
  z-index: 1;
}

.hero-content-wrapper {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  align-items: center;
  gap: 3rem;
  width: 100%;
  margin-top: 1.5rem;
}

.hero-left-col {
  max-width: 600px;
}

.hero-title {
  font-size: 3.75rem;
  font-weight: 850;
  color: #0b1c3f; /* Premium Deep Navy */
  line-height: 1.15;
  margin-bottom: 1.5rem;
  letter-spacing: -1px;
}

.highlight-green {
  color: #046A50; /* Elegant deep emerald green matching the mockup */
}

.hero-description {
  font-size: 1.35rem;
  font-weight: 500;
  color: #4a5568; /* Soft Slate Gray */
  line-height: 1.5;
  margin-bottom: 2.5rem;
}

.btn-partner-scroll {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #046A50; /* Mockup Dark Emerald button */
  color: var(--white);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding: 1rem 2.25rem;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(4, 106, 80, 0.25);
  transition: all 0.3s ease;
  border: 2px solid transparent;
  cursor: pointer;
}

.btn-partner-scroll:hover {
  background-color: #03523e;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(4, 106, 80, 0.35);
}

.hero-right-col {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Flowchart Circle Diagram */
.flowchart-circle {
  background: var(--white);
  width: 320px;
  height: 320px;
  border-radius: 50%;
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.flowchart-circle:hover {
  transform: scale(1.03);
}

.flow-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  text-align: center;
}

.flow-icon-container {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background-color: #f1f5f9;
  border: 1.5px solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #334155;
  transition: all 0.3s ease;
}

.flow-icon {
  width: 17px;
  height: 17px;
}

.flow-icon.heart-filled {
  color: #e11d48;
  fill: #e11d48;
}

.highlight-pct {
  background-color: #f0fdf4;
  border-color: #4ade80;
  color: #15803d;
}

.pct-text {
  font-size: 0.75rem;
  font-weight: 800;
}

.flow-text {
  font-size: 0.65rem;
  font-weight: 800;
  color: #0b1c3f;
  letter-spacing: 0.5px;
}

.flow-arrow {
  margin: 0.15rem 0;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 18px;
}

.arrow-svg {
  width: 14px;
  height: 14px;
  stroke-width: 3px;
  animation: bounceArrow 2s infinite ease-in-out;
}

/* 2. Stats Banner Styles */
.stats-banner {
  background-color: #0B1221; /* Rich dark navy from mockup */
  color: var(--white);
  padding: 2.25rem 0;
  border-bottom: 4px solid #046A50; /* Emerald accent */
}

.stats-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex: 1;
  padding: 0 1rem;
}

.stat-icon-wrapper {
  color: var(--white);
  opacity: 0.9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon {
  width: 38px;
  height: 38px;
  stroke-width: 1.5px;
}

.stat-text {
  display: flex;
  flex-direction: column;
}

.stat-val {
  font-size: 1.85rem;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.5px;
  margin-bottom: 0.25rem;
}

.stat-desc {
  font-size: 0.85rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.2;
}

.stat-separator {
  width: 1px;
  height: 50px;
  background-color: rgba(255, 255, 255, 0.15);
}

/* 3. Step Checklist Timeline Styles */
.partnership-steps {
  background-color: var(--white);
  position: relative;
  overflow: hidden;
}

.timeline-main-title {
  font-size: 2.25rem;
  font-weight: 850;
  text-align: center;
  color: #0b1c3f;
  margin-bottom: 0.5rem;
  letter-spacing: -0.5px;
}

.timeline-subtitle {
  font-size: 1.15rem;
  text-align: center;
  color: var(--gray);
  margin-bottom: 4rem;
  font-weight: 500;
}

.timeline-wrapper {
  position: relative;
  max-width: 680px;
  margin: 0 auto 4rem;
  padding: 0 1rem;
}

.timeline-vertical-line {
  position: absolute;
  left: 28px; /* Perfectly centered with badges */
  top: 30px;
  bottom: 30px;
  width: 2px;
  background-color: #e2e8f0;
  z-index: 1;
}

.timeline-steps-list {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  position: relative;
  z-index: 2;
}

.timeline-step-row {
  display: flex;
  align-items: center;
  gap: 2rem;
  width: 100%;
}

.timeline-badge {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #0b1c3f; /* Deep brand navy matching the mockup */
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 8px 20px rgba(11, 28, 63, 0.25);
  border: 3px solid var(--white);
  transition: all 0.3s ease;
}

.timeline-step-row:hover .timeline-badge {
  transform: scale(1.12);
  background-color: #046A50; /* Highlight badge color to emerald on row hover */
  box-shadow: 0 8px 20px rgba(4, 106, 80, 0.35);
}

.timeline-badge-svg {
  width: 24px;
  height: 24px;
  stroke-width: 2px;
}

.timeline-content-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.25rem 1.75rem;
  flex-grow: 1;
  transition: all 0.3s ease;
}

.timeline-step-row:hover .timeline-content-card {
  transform: translateX(6px);
  background-color: var(--white);
  box-shadow: 0 8px 25px rgba(0,0,0,0.04);
  border-color: rgba(4, 106, 80, 0.2);
}

.timeline-number {
  font-size: 1.5rem;
  font-weight: 850;
  color: #046A50; /* Golden emerald highlight */
  letter-spacing: -0.5px;
  flex-shrink: 0;
  opacity: 0.95;
}

.timeline-text-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.timeline-step-heading {
  font-size: 1.15rem;
  font-weight: 850;
  color: #0b1c3f;
  margin: 0;
  letter-spacing: 0.3px;
}

.timeline-step-desc {
  font-size: 0.95rem;
  font-weight: 500;
  color: #64748b;
  margin: 0;
}

.timeline-final-cta {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
}

.timeline-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #046A50;
  color: var(--white);
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding: 1.1rem 2.5rem;
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(4, 106, 80, 0.25);
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.timeline-btn:hover {
  background-color: #03523e;
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(4, 106, 80, 0.35);
}

/* 4. Meals Schedule Section Styles */
.meals-schedule {
  background-color: var(--light);
}

.schedule-title {
  font-size: 1.85rem;
  font-weight: 800;
  text-align: center;
  color: #0B1221;
  letter-spacing: 0.5px;
  margin-bottom: 3.5rem;
  position: relative;
}

.schedule-title::after {
  content: '';
  position: absolute;
  bottom: -1rem;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background-color: #046A50;
  border-radius: 2px;
}

.schedule-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.schedule-card {
  background: var(--white);
  padding: 2.25rem 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.02);
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
}

.schedule-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05);
  border-color: rgba(4, 106, 80, 0.25);
}

.schedule-icon-circle {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background-color: #f0fdf4;
  color: #046A50;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.schedule-card:hover .schedule-icon-circle {
  background-color: #046A50;
  color: var(--white);
}

.schedule-card-icon {
  width: 24px;
  height: 24px;
}

.schedule-content {
  display: flex;
  flex-direction: column;
}

.schedule-label {
  font-size: 0.75rem;
  font-weight: 800;
  color: #64748B;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
}

.schedule-value {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0B1221;
  line-height: 1.3;
}

.schedule-sub {
  font-size: 0.95rem;
  color: #64748B;
  margin-top: 0.25rem;
}

.schedule-desc {
  font-size: 0.95rem;
  font-weight: 500;
  color: #475569;
  line-height: 1.45;
}

/* 5. City Akimat Participation Block Styles */
.akimat-participation {
  background-color: var(--light);
}

.akimat-card {
  background: var(--white);
  border-radius: 24px;
  padding: 3.5rem 3rem 2.5rem;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.03);
  border: 1px solid #e2e8f0;
  max-width: 960px;
  margin: 0 auto;
  transition: var(--transition);
}

.akimat-card:hover {
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.05);
  border-color: rgba(4, 106, 80, 0.2);
}

.akimat-inner {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 2.5rem;
  align-items: center;
  padding-bottom: 2.5rem;
  border-bottom: 2px dashed #e2e8f0;
}

.akimat-left {
  display: flex;
  justify-content: center;
  align-items: center;
}

.landmark-icon-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #f0fdf4;
  border: 3px solid #d1fae5;
  color: #046A50;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.4s ease;
}

.akimat-card:hover .landmark-icon-circle {
  transform: rotate(-5deg) scale(1.05);
}

.landmark-svg {
  width: 58px;
  height: 58px;
  stroke-width: 1.5px;
}

.akimat-right {
  display: flex;
  flex-direction: column;
}

.akimat-title {
  font-size: 1.85rem;
  font-weight: 850;
  color: #0b1c3f;
  margin-bottom: 1.5rem;
  letter-spacing: 0.5px;
}

.akimat-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.akimat-list-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.checkmark-wrapper {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #FEF3C7; /* Soft gold background */
  color: #D97706; /* Dark gold check */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.checkmark-icon {
  width: 14px;
  height: 14px;
  stroke-width: 3.5px;
}

.akimat-list-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: #334155;
}

.akimat-tagline {
  margin-top: 2rem;
  text-align: center;
  font-size: 1.25rem;
  font-weight: 750;
  color: #0b1c3f;
  letter-spacing: -0.2px;
}

/* 5. Public & Transparent Banner Styles */
.transparency-banner {
  background-color: #0B1221;
  color: var(--white);
  padding: 2rem 0;
  border-top: 3px solid #046A50;
  border-bottom: 3px solid #046A50;
}

.transparency-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  text-align: left;
}

.shield-wrapper {
  color: var(--white);
  opacity: 0.95;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 0 8px rgba(255,255,255,0.25));
}

.shield-icon {
  width: 48px;
  height: 48px;
  stroke-width: 1.5px;
}

.transparency-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.transparency-title {
  font-size: 1.45rem;
  font-weight: 800;
  letter-spacing: 0.75px;
  margin: 0;
}

.transparency-subtitle {
  font-size: 1.05rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.75);
  margin: 0;
}

/* 7. Directions Section Styles */
.mission-directions {
  background-color: var(--light);
}

.directions-card {
  background: var(--white);
  border-radius: 24px;
  padding: 3.5rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.02);
  border: 1px solid #f1f5f9;
  max-width: 1100px;
  margin: 0 auto;
}

.directions-card h2 {
  font-size: 2.25rem;
  margin-bottom: 0.5rem;
  color: #0b1c3f;
}

.directions-card .subtitle {
  color: var(--gray);
  font-size: 1.15rem;
  margin-bottom: 2.5rem;
  font-weight: 500;
}

.directions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.direction-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: #f8fafc;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  transition: var(--transition);
}

.direction-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.04);
  border-color: #046A50;
}

.icon-bullet {
  font-size: 1.5rem;
}

.direction-item p {
  font-weight: 700;
  font-size: 1.05rem;
  color: #0b1c3f;
  margin: 0;
}

.delivery-note {
  background: #FEF3C7;
  color: var(--secondary-dark);
  padding: 1.25rem 1.75rem;
  border-radius: 12px;
  font-size: 1rem;
  margin: 0;
  line-height: 1.6;
  border-left: 5px solid var(--secondary);
  font-weight: 500;
}

/* 8. How System Works Styles */
.center {
  text-align: center;
}

.section-sub-header {
  color: var(--gray);
  font-size: 1.15rem;
  margin-bottom: 3.5rem;
  font-weight: 500;
}

.system-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.system-card {
  background: var(--white);
  padding: 2.5rem 2rem;
  border-radius: 20px;
  box-shadow: 0 5px 25px rgba(0,0,0,0.02);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  transition: var(--transition);
}

.system-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.05);
  border-color: #046A50;
}

.card-title-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.system-icon {
  width: 28px;
  height: 28px;
  stroke-width: 2px;
}

.system-icon.orange { color: #f59e0b; }
.system-icon.blue { color: #2563eb; }
.system-icon.red { color: #ef4444; }
.system-icon.gold { color: #d97706; }

.system-card h3 {
  font-size: 1.25rem;
  color: #0b1c3f;
  margin: 0;
  font-weight: 800;
}

.card-desc {
  font-size: 0.95rem;
  color: var(--gray);
  margin-bottom: 1.25rem;
  font-weight: 600;
}

.bullet-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.bullet-list li {
  position: relative;
  padding-left: 1.5rem;
  font-size: 0.95rem;
  color: #475569;
  line-height: 1.45;
  font-weight: 500;
}

.bullet-list li::before {
  content: "—";
  position: absolute;
  left: 0;
  color: #046A50;
  font-weight: bold;
}

.special-note {
  margin-top: auto;
  padding-top: 1.5rem;
  font-size: 0.9rem;
  color: #046A50;
  font-weight: 700;
  border-top: 1px solid #f1f5f9;
  margin-top: 1.5rem;
}

/* 9. Main Idea Styles */
.main-idea {
  background: var(--light);
}

.idea-box {
  background: linear-gradient(135deg, #0B1221 0%, #1e293b 100%);
  border-radius: 32px;
  padding: 5rem 3rem;
  color: var(--white);
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.idea-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.idea-box h2 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: var(--white);
  font-weight: 800;
}

.idea-content {
  max-width: 700px;
  margin: 0 auto 3.5rem;
  line-height: 1.8;
}

.primary-idea {
  font-size: 1.45rem;
  font-weight: 700;
  color: var(--white);
  margin-bottom: 1.5rem;
}

.divider {
  height: 2px;
  background: #046A50;
  width: 100px;
  margin: 1.5rem auto;
}

.secondary-idea {
  font-size: 1.25rem;
  color: #cbd5e1;
}

.secondary-idea strong {
  color: #34d399;
}

.cta-actions {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.btn {
  display: inline-block;
  padding: 0.85rem 2rem;
  border-radius: 9999px;
  font-weight: 700;
  text-align: center;
  transition: var(--transition);
  cursor: pointer;
  border: none;
}

.btn-secondary {
  background: #046A50;
  color: var(--white);
  box-shadow: 0 4px 15px rgba(4, 106, 80, 0.2);
}

.btn-secondary:hover {
  background-color: #03523e;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(4, 106, 80, 0.35);
}

.btn-outline {
  border: 2px solid var(--white);
  color: var(--white);
  background: transparent;
}

.btn-outline:hover {
  background: var(--white);
  color: #0b1221;
}

/* Animations */
@keyframes bounceArrow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(3px); }
}

/* Responsive Styles */
@media (max-width: 1024px) {
  .hero-content-wrapper {
    grid-template-columns: 1.2fr 0.8fr;
    gap: 2rem;
  }
  .hero-title { font-size: 3rem; }
  .stats-inner {
    flex-wrap: wrap;
    justify-content: center;
    gap: 2rem;
  }
  .stat-item {
    flex: 0 0 45%;
  }
  .stat-separator {
    display: none;
  }
  .akimat-inner {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
  }
  .akimat-left {
    justify-content: center;
  }
  .akimat-list-item {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .mission-hero {
    min-height: auto;
    padding: 6.5rem 0 4rem;
  }
  .hero-overlay {
    background: 
      linear-gradient(180deg, rgba(11, 18, 33, 0.9) 0%, rgba(11, 18, 33, 0.6) 80px, rgba(255, 255, 255, 0.95) 150px),
      linear-gradient(180deg, 
        rgba(255,255,255,0.95) 0%, 
        rgba(255,255,255,0.95) 50%, 
        rgba(255,255,255,0.85) 100%
      );
  }
  .hero-content-wrapper {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 3rem;
  }
  .hero-left-col {
    max-width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .hero-title {
    font-size: 2.5rem;
  }
  .hero-description {
    font-size: 1.15rem;
  }
  .schedule-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  .transparency-inner {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  .directions-card {
    padding: 2rem 1.5rem;
  }
  .directions-card h2 {
    font-size: 1.85rem;
  }
  .timeline-vertical-line {
    left: 20px;
  }
  .timeline-badge {
    width: 42px;
    height: 42px;
    border-width: 2px;
  }
  .timeline-badge-svg {
    width: 18px;
    height: 18px;
  }
  .timeline-content-card {
    padding: 1rem;
    gap: 1rem;
  }
  .timeline-number {
    font-size: 1.25rem;
  }
  .timeline-step-heading {
    font-size: 1rem;
  }
  .timeline-step-desc {
    font-size: 0.85rem;
  }
  .timeline-btn {
    width: 100%;
    padding: 1rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  .stat-item {
    flex: 0 0 100%;
    justify-content: center;
    text-align: center;
    flex-direction: column;
    gap: 0.5rem;
  }
  .stat-icon {
    width: 32px;
    height: 32px;
  }
  .stat-val {
    font-size: 1.5rem;
  }
  .akimat-card {
    padding: 2rem 1.5rem;
  }
  .akimat-title {
    font-size: 1.45rem;
  }
  .akimat-list-text {
    font-size: 0.95rem;
  }
  .akimat-tagline {
    font-size: 1.05rem;
  }
  .transparency-title {
    font-size: 1.15rem;
  }
  .transparency-subtitle {
    font-size: 0.9rem;
  }
  .idea-box {
    padding: 3rem 1.5rem;
  }
  .idea-box h2 {
    font-size: 1.75rem;
  }
  .primary-idea {
    font-size: 1.15rem;
  }
  .secondary-idea {
    font-size: 0.95rem;
  }
}
</style>
