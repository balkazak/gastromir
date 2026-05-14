<template>
  <div class="about-page">
    <section class="page-header section-padding">
      <div class="container">
        <h1>О компании <span>GASTROMIR</span></h1>
        <p>Мы строим долгосрочные отношения и становимся частью стабильной работы ресторана.</p>
      </div>
    </section>

    <!-- Values Section -->
    <section class="values section-padding bg-white">
      <div class="container">
        <div class="section-header">
          <h2>Ценности GASTROMIR</h2>
        </div>
        <div class="values-grid">
          <div class="value-item" v-for="(v, i) in values" :key="i" v-motion-slide-visible-bottom>
            <div class="value-number">0{{ i + 1 }}</div>
            <h3>{{ v.title }}</h3>
            <p>{{ v.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Comparison Section -->
    <section class="comparison section-padding">
      <div class="container">
        <div class="section-header center">
          <h2>Чем мы отличаемся</h2>
          <p>Сравнение системы и обычного поставщика</p>
        </div>
        <div class="comparison-grid">
          <div class="comp-card standard" v-motion-slide-visible-left>
            <h3>Обычный поставщик</h3>
            <ul>
              <li v-for="(row, i) in comparison" :key="i">
                <X class="icon-bad" /> {{ row.bad }}
              </li>
            </ul>
          </div>
          
          <div class="vs-badge">VS</div>
          
          <div class="comp-card gastromir" v-motion-slide-visible-right>
            <div class="card-logo">GASTROMIR</div>
            <ul>
              <li v-for="(row, i) in comparison" :key="i">
                <Check class="icon-good" /> {{ row.good }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Problems Section -->
    <section class="problems section-padding bg-dark">
      <div class="container">
        <div class="problems-grid">
          <div class="problems-content">
            <h2 class="text-white">Решаем реальные боли кухни</h2>
            <div class="problem-list">
              <div class="problem-item" v-for="(p, i) in problems" :key="i">
                <AlertCircle class="icon-red" />
                <span>{{ p }}</span>
              </div>
            </div>
          </div>
          <div class="problems-solution">
            <div class="sol-card">
              <h3>Наш приоритет:</h3>
              <ul>
                <li>✅ Скорость</li>
                <li>✅ Стабильность</li>
                <li>✅ Наличие товара</li>
                <li>✅ Оперативная доставка</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { X, Check, AlertCircle } from 'lucide-vue-next'

const values = [
  { title: 'Скорость', text: 'Заказ за 30 секунд. Минимум действий — максимум результата.' },
  { title: 'Надёжность', text: 'Стабильные поставки и контроль качества — основа нашей работы.' },
  { title: 'Удобство', text: 'Повтор заказов и шаблоны экономят время команды.' },
  { title: 'HoReCa Focus', text: 'Понимаем ритм бизнеса и задачи шеф-поваров.' },
  { title: 'Экономия', text: 'Меньше звонков и таблиц. Больше времени на сервис.' },
  { title: 'Партнёрство', text: 'Мы становимся частью стабильной работы вашего ресторана.' }
]

const comparison = [
  { bad: 'Хаос в закупках', good: 'Система и автоматизация' },
  { bad: 'Ручной процесс (звонки/таблицы)', good: 'Заказ в один клик' },
  { bad: 'Задержки и неопределенность', good: 'Стабильность и контроль' },
  { bad: 'Десятки разных поставщиков', good: 'Всё в одном месте' }
]

const problems = [
  'Задержки поставок',
  'Пересорт и ошибки в сборке',
  'Потери времени на поиск позиций',
  'Нестабильное качество продуктов'
]
</script>

<style scoped>
.page-header {
  background: var(--primary);
  color: var(--white);
  padding-top: 12rem;
  text-align: center;
}

.page-header h1 {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .page-header { padding-top: 7rem; }
  .page-header h1 { font-size: 2rem; margin-bottom: 0.75rem; }
}

@media (max-width: 480px) {
  .page-header { padding-top: 5.5rem; }
  .page-header h1 { font-size: 1.6rem; }
}

.page-header span {
  color: var(--secondary);
}

.bg-white { background: var(--white); }
.bg-dark { background: var(--dark); }
.text-white { color: var(--white); }

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  margin-top: 4rem;
}

.value-item {
  position: relative;
  padding: 2rem;
  border-left: 4px solid var(--primary-light);
}

@media (max-width: 768px) {
  .values-grid { gap: 1.5rem; margin-top: 2rem; grid-template-columns: 1fr; }
  .value-item { padding: 1.25rem; }
  .value-number { font-size: 2.5rem; }
}

.value-number {
  font-size: 4rem;
  font-weight: 800;
  color: var(--primary);
  opacity: 0.1;
  position: absolute;
  top: 0;
  right: 1rem;
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

.problems-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.problem-list {
  margin-top: 2rem;
}

.problem-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #cbd5e1;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.icon-red { color: #f87171; }

.sol-card {
  background: var(--white);
  padding: 3rem;
  border-radius: 2rem;
}

.sol-card h3 { margin-bottom: 1.5rem; color: var(--primary); }
.sol-card ul { list-style: none; }
.sol-card li { margin-bottom: 1rem; font-size: 1.2rem; font-weight: 600; }

@media (max-width: 768px) {
  .problems-grid { grid-template-columns: 1fr; gap: 2rem; }
  .comparison-grid { grid-template-columns: 1fr; margin-top: 2rem; }
  .comp-card { padding: 1.5rem; }
  .comp-card h3 { font-size: 1.15rem; margin-bottom: 1.25rem; }
  .comp-card li { font-size: 0.9rem; gap: 0.75rem; margin-bottom: 0.75rem; }
  .card-logo { font-size: 1.4rem; margin-bottom: 1.25rem; }
  .vs-badge { width: 45px; height: 45px; font-size: 1rem; margin: -0.75rem auto; }
  .problem-item { font-size: 0.9rem; margin-bottom: 1rem; gap: 0.75rem; }
  .sol-card { padding: 1.5rem; }
  .sol-card li { font-size: 1rem; margin-bottom: 0.5rem; }
  .section-header p { font-size: 0.9rem; }
}
</style>
