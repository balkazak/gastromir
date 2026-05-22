<template>
  <div class="social-mission-page">
    <section class="mission-hero">
      <div class="container hero-content">
        <div class="program-badge">
          <Heart class="icon-heart" />
          <span>Социальная программа «Мейірім Тарелкесі»</span>
        </div>
        <h1>Одно блюдо — одна надежда</h1>
        <p class="slogan-kaz">«Бір тағам — Бір үміт»</p>
        <p class="hero-desc">
          Платформа GASTROMIR объединяет бизнес и общество. Делая закупки у нас, каждый ресторан автоматически участвует в системной благотворительности и помогает кормить нуждающихся в тепле и поддержке.
        </p>
        <div class="hero-stats">
          <div class="stat-card">
            <span class="num">1%</span>
            <span class="label">дохода платформы направляется на помощь</span>
          </div>
          <div class="stat-card">
            <span class="num">100%</span>
            <span class="label">системность и прозрачность программы</span>
          </div>
        </div>
      </div>
    </section>

    <section class="how-it-works section-padding">
      <div class="container">
        <div class="section-header center">
          <h2>Как работает программа?</h2>
          <p>Простая и прозрачная цепочка добрых дел</p>
        </div>

        <div class="steps-grid">
          <div class="step-card">
            <div class="step-num">01</div>
            <h3>Закупка продуктов</h3>
            <p>Рестораны заказывают необходимые продукты через платформу GASTROMIR.</p>
          </div>
          <div class="step-card">
            <div class="step-num">02</div>
            <h3>Отчисление средств</h3>
            <p>GASTROMIR направляет фиксированный процент от своего оборота в благотворительный фонд программы «Мейірім Тарелкесі».</p>
          </div>
          <div class="step-card">
            <div class="step-num">03</div>
            <h3>Горячее питание</h3>
            <p>На собранные ресурсы организуется приготовление качественной горячей еды и сбор продуктовых наборов.</p>
          </div>
          <div class="step-card">
            <div class="step-num">04</div>
            <h3>Адресная доставка</h3>
            <p>Волонтёры и социальные службы при поддержке акимата доставляют помощь нуждающимся семьям по официальным спискам.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="partner-benefits section-padding bg-dark">
      <div class="container">
        <div class="section-header center light">
          <h2>Почему ресторанам выгодно участвовать?</h2>
          <p>Социальная ценность — это новая экономика доверия и устойчивости вашего бизнеса</p>
        </div>

        <div class="benefits-grid">
          <div class="benefit-card">
            <TrendingUp class="benefit-icon" />
            <h3>Финансовая стабильность</h3>
            <p>Централизованный закуп продуктов снижает себестоимость, минимизирует списания и оптимизирует операционные расходы.</p>
          </div>
          <div class="benefit-card">
            <Users2 class="benefit-icon" />
            <h3>Доверие и лояльность гостей</h3>
            <p>Современные гости выбирают ответственные бренды со смыслом. Ваше участие формирует сильное комьюнити и лояльность.</p>
          </div>
          <div class="benefit-card">
            <Award class="benefit-icon" />
            <h3>Сильный PR и репутация</h3>
            <p>Участие в значимых проектах дает позитивный общественный имидж, интересные инфоповоды и медийную ценность.</p>
          </div>
          <div class="benefit-card">
            <Landmark class="benefit-icon" />
            <h3>Поддержка локальных брендов</h3>
            <p>Программа создает мост с фермерами и местными брендами Казахстана, укрепляя экономику.</p>
          </div>
          <div class="benefit-card">
            <Sprout class="benefit-icon" />
            <h3>Переход к ESG-модели</h3>
            <p>Инвесторы и общество все больше ценят социальную ответственность. Gastromir помогает соответствовать мировым бизнес-стандартам.</p>
          </div>
          <div class="benefit-card">
            <Recycle class="benefit-icon" />
            <h3>Культура осознанности</h3>
            <p>Совместная логистика и борьба с пищевыми отходами развивают культуру разумного потребления.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-mission section-padding">
      <div class="container">
        <div class="cta-box">
          <Heart class="cta-heart-big" />
          <h2>Давайте создавать добрые изменения вместе</h2>
          <p>
            Подключаясь к экосистеме GASTROMIR, ваш ресторан не просто переходит на новый уровень эффективности снабжения. Вы дарите надежду и тепло тем, кто в этом нуждается.
          </p>
          <div class="cta-actions">
            <router-link to="/contacts" class="btn btn-secondary">Подключить ресторан</router-link>
            <router-link to="/catalog" class="btn btn-outline">Смотреть каталог</router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { Heart, TrendingUp, Users2, Award, Landmark, Sprout, Recycle } from 'lucide-vue-next'
</script>

<style scoped>
.social-mission-page {
  background-color: var(--white);
  color: var(--dark);
}

.mission-hero {
  padding: 12rem 0 8rem;
  background: linear-gradient(135deg, #091e2b 0%, #004b49 100%);
  color: var(--white);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.program-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  background: rgba(255, 255, 255, 0.1);
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

h1 {
  font-size: 3.8rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.slogan-kaz {
  font-size: 1.8rem;
  color: var(--secondary, #ff8c00);
  font-weight: 700;
  font-style: italic;
  margin-bottom: 2rem;
}

.hero-desc {
  font-size: 1.25rem;
  max-width: 800px;
  margin: 0 auto 3.5rem;
  opacity: 0.9;
  line-height: 1.6;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
}

.stat-card {
  background: rgba(255, 255, 255, 0.04);
  padding: 1.5rem 2rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  min-width: 250px;
  backdrop-filter: blur(5px);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.06);
}

.stat-card .num {
  display: block;
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--secondary, #ff8c00);
  margin-bottom: 0.5rem;
}

.stat-card .label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
}

.step-card {
  background: #f8fafc;
  padding: 2.5rem 2rem;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  position: relative;
  transition: all 0.3s ease;
}

.step-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.05);
  background: var(--white);
  border-color: var(--primary-light, #38bdf8);
}

.step-num {
  font-size: 2.5rem;
  font-weight: 800;
  color: rgba(37, 99, 235, 0.15);
  margin-bottom: 1rem;
}

.step-card h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: var(--primary, #0B1221);
}

.step-card p {
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.5;
}

.bg-dark {
  background: #0b1221;
  color: var(--white);
}

.section-header.light h2 {
  color: var(--white);
}

.section-header.light p {
  color: #94a3b8;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
}

.benefit-card {
  background: rgba(255, 255, 255, 0.02);
  padding: 2.5rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.3s ease;
}

.benefit-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.04);
  border-color: var(--secondary, #ff8c00);
}

.benefit-icon {
  width: 36px;
  height: 36px;
  color: var(--secondary, #ff8c00);
  margin-bottom: 1.5rem;
}

.benefit-card h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: var(--white);
}

.benefit-card p {
  color: #94a3b8;
  font-size: 0.95rem;
  line-height: 1.6;
}

.cta-mission {
  background: #f8fafc;
}

.cta-box {
  background: linear-gradient(135deg, #0b1221 0%, #1e293b 100%);
  border-radius: 32px;
  padding: 5rem 3rem;
  color: var(--white);
  text-align: center;
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.cta-heart-big {
  width: 64px;
  height: 64px;
  color: #ff5e62;
  fill: #ff5e62;
  margin-bottom: 2rem;
  animation: pulse 2s infinite;
}

.cta-box h2 {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: var(--white);
}

.cta-box p {
  font-size: 1.15rem;
  max-width: 700px;
  margin: 0 auto 3rem;
  color: #cbd5e1;
  line-height: 1.6;
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
  padding: 0.65rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
}

.btn-outline:hover {
  background: var(--white);
  color: #0b1221;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

@media (max-width: 768px) {
  h1 {
    font-size: 2.2rem;
  }
  .slogan-kaz {
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
  }
  .hero-desc {
    font-size: 1rem;
    margin-bottom: 2.5rem;
  }
  .hero-stats {
    gap: 1rem;
  }
  .stat-card {
    min-width: 100%;
  }
  .cta-box {
    padding: 3rem 1.5rem;
  }
  .cta-box h2 {
    font-size: 1.6rem;
  }
  .cta-box p {
    font-size: 1rem;
  }
}
</style>
