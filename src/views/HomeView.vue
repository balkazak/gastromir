<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container hero-grid">
        <div 
          class="hero-content"
          v-motion
          :initial="{ opacity: 0, x: -50 }"
          :enter="{ opacity: 1, x: 0, transition: { duration: 800 } }"
        >
          <div class="badge">HoReCa Supply Solutions</div>
          <h1>Закупка для ресторанов <span>в один клик</span></h1>
          <p>Мы не просто поставляем продукты. Мы упрощаем работу ресторана, экономя ваше время и ресурсы кухни.</p>
          <div class="hero-actions">
            <router-link to="/contacts" class="btn btn-primary">Подключить ресторан</router-link>
            <router-link to="/catalog" class="btn btn-outline">Смотреть каталог</router-link>
          </div>
          <div class="hero-stats">
            <div class="stat">
              <span class="stat-num">30 сек</span>
              <span class="stat-label">на оформление</span>
            </div>
            <div class="stat">
              <span class="stat-num">100%</span>
              <span class="stat-label">контроль качества</span>
            </div>
          </div>
        </div>
        <div 
          class="hero-image"
          v-motion
          :initial="{ opacity: 0, scale: 0.8 }"
          :enter="{ opacity: 1, scale: 1, transition: { duration: 1000 } }"
        >
          <div class="image-wrapper">
             <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Chef in kitchen" />
             <div class="floating-card">
                <Zap class="icon" />
                <div>
                  <h4>Быстрый заказ</h4>
                  <p>Экономия времени шефа</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Comparison Section -->
    <section class="comparison section-padding">
      <div class="container">
        <div class="section-header center">
          <h2>Почему выбирают нас?</h2>
          <p>Сравните сами: классический подход против современных технологий</p>
        </div>
        
        <div class="comparison-grid">
          <div class="comp-card standard" v-motion-slide-visible-left>
            <h3>Обычный поставщик</h3>
            <ul>
              <li><X class="icon-bad" /> Дозвон по телефону / WhatsApp</li>
              <li><X class="icon-bad" /> Ожидание подтверждения наличия</li>
              <li><X class="icon-bad" /> Ошибки в накладных вручную</li>
              <li><X class="icon-bad" /> Нестабильный график поставок</li>
            </ul>
          </div>
          
          <div class="vs-badge">VS</div>
          
          <div class="comp-card gastromir" v-motion-slide-visible-right>
            <div class="card-logo">GASTROMIR</div>
            <ul>
              <li><Check class="icon-good" /> Заказ в приложении за 30 сек</li>
              <li><Check class="icon-good" /> Актуальное наличие онлайн</li>
              <li><Check class="icon-good" /> Авто-генерация документов</li>
              <li><Check class="icon-good" /> Точное время доставки</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Partners Section -->
    <section class="partners">
      <div class="container">
        <p class="section-tag">Нам доверяют</p>
        <div class="partners-list">
          <div class="partner">Угли</div>
          <div class="partner">BAO</div>
          <div class="partner">The Kitchen</div>
          <div class="partner">Gastronomy</div>
          <div class="partner">Urban Cafe</div>
        </div>
      </div>
    </section>

    <!-- Highlights Section -->
    <section class="highlights section-padding">
      <div class="container">
        <div class="section-header center">
          <h2>GASTROMIR — это:</h2>
          <p>Современная экосистема для снабжения вашего бизнеса</p>
        </div>
        
        <div class="highlights-grid">
          <div class="h-card" v-motion-slide-visible-bottom v-for="(item, index) in highlights" :key="index">
            <component :is="item.icon" class="h-icon" />
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="offer-section">
      <div class="container">
        <div class="offer-card">
          <div class="offer-content">
            <h2>Первые 10 ресторанов:</h2>
            <ul>
              <li><Check class="icon" /> скидка -2%</li>
              <li><Check class="icon" /> персональные условия</li>
              <li><Check class="icon" /> приоритетная обработка</li>
              <li><Check class="icon" /> закреплённый менеджер</li>
            </ul>
            <router-link to="/contacts" class="btn btn-secondary">Занять место</router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { Zap, Package, Truck, Users, Brain, Check, X } from 'lucide-vue-next'

const highlights = [
  { icon: Zap, title: 'Быстрый заказ', text: 'Оформление за 30 секунд. Минимум действий — максимум результата.' },
  { icon: Package, title: 'Всё для кухни', text: 'Овощи, фрукты, бакалея, рыба и заморозка в одном месте.' },
  { icon: Truck, title: 'Стабильная доставка', text: 'Мы понимаем ритм HoReCa и доставляем вовремя.' },
  { icon: Users, title: 'Сервис для HoReCa', text: 'Понимаем задачи кухни, шеф-повара и закупщика.' },
  { icon: Brain, title: 'Умная система', text: 'Повтор заказов, шаблоны и история закупок в один клик.' }
]
</script>

<style scoped>
.hero {
  padding: 10rem 0 6rem;
  background: linear-gradient(135deg, #0B1221 0%, #1E293B 100%);
  color: var(--white);
  overflow: hidden;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  align-items: center;
  gap: 4rem;
}

.badge {
  display: inline-block;
  padding: 0.5rem 1.2rem;
  background: var(--accent);
  color: var(--white);
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.85rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

h1 {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  color: var(--white);
}

h1 span {
  background: var(--gradient-orange);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: block;
}

.hero-content p {
  font-size: 1.25rem;
  color: #CBD5E1;
  margin-bottom: 2.5rem;
  max-width: 600px;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
}

.btn-outline {
  border: 2px solid var(--white);
  color: var(--white);
  padding: 0.65rem 1.5rem;
}

.btn-outline:hover {
  background: var(--white);
  color: var(--primary);
}

.hero-stats {
  display: flex;
  gap: 3rem;
}

.stat-num {
  display: block;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--secondary);
}

.stat-label {
  color: var(--gray);
  font-size: 0.9rem;
}

.image-wrapper {
  position: relative;
}

.image-wrapper img {
  width: 100%;
  border-radius: 2rem;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.floating-card {
  position: absolute;
  bottom: 2rem;
  left: -2rem;
  background: var(--white);
  padding: 1.5rem;
  border-radius: 1.5rem;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  gap: 1rem;
  animation: float 3s ease-in-out infinite;
  z-index: 10;
}

@media (max-width: 768px) {
  .floating-card {
    left: 1rem;
    bottom: 1rem;
    padding: 1rem;
  }
}

.floating-card h4 {
  color: var(--primary);
  margin-bottom: 0.2rem;
}

.floating-card p {
  color: var(--secondary);
  font-weight: 600;
  margin: 0 !important;
  font-size: 0.9rem !important;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.floating-card .icon {
  color: var(--secondary);
  width: 32px;
  height: 32px;
}

/* Comparison Styles */
.comparison-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 2rem;
  margin-top: 4rem;
}

.comp-card {
  background: var(--white);
  padding: 3rem;
  border-radius: 2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  border: 1px solid #f1f5f9;
}

.comp-card h3 {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
}

.comp-card.standard h3 { color: var(--gray); }
.comp-card.gastromir {
  background: var(--primary);
  color: var(--white);
  border: 2px solid var(--secondary);
  transform: scale(1.05);
}

.card-logo {
  font-size: 1.8rem;
  font-weight: 900;
  color: var(--secondary);
  text-align: center;
  margin-bottom: 2rem;
}

.comp-card ul {
  list-style: none;
}

.comp-card li {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
  font-size: 1.1rem;
}

.icon-bad { color: #EF4444; }
.icon-good { color: var(--secondary); }

.vs-badge {
  background: var(--secondary);
  color: var(--white);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 1.2rem;
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.4);
}

.partners {
  padding: 3rem 0;
  border-top: 1px solid #eee;
}

.section-tag {
  text-align: center;
  color: var(--gray);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 2rem;
}

.partners-list {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 2rem;
  opacity: 0.5;
  filter: grayscale(1);
}

.partner {
  font-size: 1.5rem;
  font-weight: 700;
}

.highlights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
}

.h-card {
  background: var(--white);
  padding: 2.5rem;
  border-radius: 1.5rem;
  transition: var(--transition);
  border: 1px solid #f1f5f9;
}

.h-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow);
}

.h-icon {
  color: var(--primary-light);
  width: 40px;
  height: 40px;
  margin-bottom: 1.5rem;
}

.section-header.center {
  text-align: center;
}

.offer-section {
  padding-bottom: 6rem;
}

.offer-card {
  background: var(--primary);
  border-radius: 3rem;
  padding: 4rem;
  color: var(--white);
  position: relative;
  overflow: hidden;
}

.offer-card::after {
  content: '💎';
  position: absolute;
  top: -2rem;
  right: -2rem;
  font-size: 15rem;
  opacity: 0.1;
}

.offer-content h2 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
}

.offer-content ul {
  list-style: none;
  margin-bottom: 2.5rem;
}

.offer-content li {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.offer-content .icon {
  color: var(--secondary);
}

@media (max-width: 992px) {
  .hero-grid {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 3rem;
  }
  .hero-content p {
    margin-left: auto;
    margin-right: auto;
  }
  .hero-actions {
    justify-content: center;
    flex-direction: column;
  }
  .hero-stats {
    justify-content: center;
    gap: 2rem;
  }
  .image-wrapper {
    max-width: 100%;
    margin: 0 auto;
  }
  h1 {
    font-size: 2.8rem;
  }
  .comparison-grid {
    grid-template-columns: 1fr;
  }
  .vs-badge {
    margin: -1rem auto;
    z-index: 5;
  }
  .comp-card.gastromir {
    transform: none;
    margin-top: 1rem;
  }
}

@media (max-width: 600px) {
  h1 { font-size: 2.2rem; }
  .comp-card { padding: 2rem; }
  .offer-card { padding: 2rem; border-radius: 2rem; }
  .offer-content h2 { font-size: 1.8rem; }
}
</style>
