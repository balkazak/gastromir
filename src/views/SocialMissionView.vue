<template>
  <div class="social-mission-page">
    <!-- Hero Section -->
    <section class="mission-hero">
      <div class="container hero-content">
        <div class="program-badge" v-motion-pop>
          <Heart class="icon-heart" />
          <span>Социальная инициатива «Мейірім Тарелкесі»</span>
        </div>
        <h1 v-motion-slide-visible-once-bottom>Мейірім Тарелкесі</h1>
        <p class="hero-desc" v-motion-slide-visible-once-bottom>
          При поддержке акимата, партнёров и волонтёров проект <br>
          «Мейірім Тарелкесі» направлен на организацию горячего питания для людей, нуждающихся в помощи.
        </p>
      </div>
    </section>

    <!-- Main Content Grid -->
    <section class="mission-details section-padding">
      <div class="container">
        <!-- Directions of Help Card -->
        <div class="directions-card" v-motion-slide-visible-once-bottom>
          <h2>Направления ресурсов</h2>
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
          <p class="delivery-note">
            💡 <strong>Примечание:</strong> Доставка питания осуществляется совместно с волонтёрами и социальными службами по заранее сформированным спискам нуждающихся семей и людей.
          </p>
        </div>

        <!-- How System Works Section -->
        <div class="system-section">
          <div class="section-header center">
            <h2>Как работает система</h2>
            <p>Уникальная экосистема объединения усилий</p>
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
      </div>
    </section>

    <!-- Main Idea Section -->
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
            <router-link to="/register" class="btn btn-secondary">Подключить ресторан</router-link>
            <router-link to="/catalog" class="btn btn-outline">Смотреть каталог</router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { Heart, Store, Users, HeartHandshake, Landmark } from 'lucide-vue-next'
</script>

<style scoped>
.social-mission-page {
  background-color: var(--light);
  color: var(--primary);
  min-height: 100vh;
}

.mission-hero {
  padding: 12rem 0 7rem;
  background: linear-gradient(135deg, #0B1221 0%, #1E293B 100%);
  color: var(--white);
  text-align: center;
  position: relative;
}

.program-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 99px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
}

.icon-heart {
  color: #ff5e62;
  fill: #ff5e62;
  animation: pulse 2s infinite;
}

.mission-hero h1 {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  background: var(--gradient-orange);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-desc {
  font-size: 1.3rem;
  max-width: 800px;
  margin: 0 auto;
  opacity: 0.9;
  line-height: 1.6;
}

/* Directions Card Styling */
.directions-card {
  background: var(--white);
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.03);
  margin-bottom: 5rem;
  border: 1px solid #f1f5f9;
}

.directions-card h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: var(--primary);
}

.directions-card .subtitle {
  color: var(--gray);
  font-size: 1.1rem;
  margin-bottom: 2.5rem;
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
  border-color: var(--secondary);
}

.icon-bullet {
  font-size: 1.5rem;
}

.direction-item p {
  font-weight: 600;
  font-size: 1.05rem;
  color: var(--primary);
  margin: 0;
}

.delivery-note {
  background: #FEF3C7;
  color: var(--secondary-dark);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.5;
  border-left: 4px solid var(--secondary);
}

/* How System Works Section */
.system-section {
  margin-top: 2rem;
}

.center {
  text-align: center;
}

.section-header h2 {
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
}

.section-header p {
  color: var(--gray);
  font-size: 1.1rem;
  margin-bottom: 3.5rem;
}

.system-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.system-card {
  background: var(--white);
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
  border: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  transition: var(--transition);
}

.system-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.06);
  border-color: var(--secondary);
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
}

.system-icon.orange { color: #f59e0b; }
.system-icon.blue { color: #2563eb; }
.system-icon.red { color: #ef4444; }
.system-icon.gold { color: #d97706; }

.system-card h3 {
  font-size: 1.25rem;
  color: var(--primary);
  margin: 0;
}

.card-desc {
  font-size: 0.95rem;
  color: var(--gray);
  margin-bottom: 1rem;
  font-weight: 500;
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
  color: var(--primary);
  line-height: 1.4;
}

.bullet-list li::before {
  content: "—";
  position: absolute;
  left: 0;
  color: var(--secondary);
  font-weight: bold;
}

.special-note {
  margin-top: auto;
  padding-top: 1.5rem;
  font-size: 0.85rem;
  color: var(--secondary-dark);
  font-weight: 600;
  border-top: 1px solid #f1f5f9;
  margin-top: 1.5rem;
}

/* Main Idea Section Styles */
.main-idea {
  background: #f8fafc;
}

.idea-box {
  background: linear-gradient(135deg, #0B1221 0%, #1E293B 100%);
  border-radius: 32px;
  padding: 5rem 3rem;
  color: var(--white);
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
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
}

.idea-content {
  max-width: 700px;
  margin: 0 auto 3.5rem;
  line-height: 1.8;
}

.primary-idea {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--white);
  margin-bottom: 1.5rem;
}

.divider {
  height: 2px;
  background: var(--gradient-orange);
  width: 100px;
  margin: 1.5rem auto;
}

.secondary-idea {
  font-size: 1.15rem;
  color: #cbd5e1;
}

.secondary-idea strong {
  color: var(--secondary);
}

.cta-actions {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.btn-outline {
  border: 2px solid var(--white);
  color: var(--white);
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-weight: 600;
  transition: var(--transition);
}

.btn-outline:hover {
  background: var(--white);
  color: #0b1221;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
}

@media (max-width: 768px) {
  .mission-hero { padding: 9rem 0 5rem; }
  .mission-hero h1 { font-size: 2.2rem; }
  .hero-desc { font-size: 1.05rem; }
  .directions-card { padding: 2rem 1.5rem; }
  .directions-card h2 { font-size: 1.6rem; }
  .section-header h2 { font-size: 1.7rem; }
  .idea-box { padding: 3.5rem 1.5rem; }
  .idea-box h2 { font-size: 1.8rem; }
  .primary-idea { font-size: 1.15rem; }
  .secondary-idea { font-size: 1rem; }
}
</style>
