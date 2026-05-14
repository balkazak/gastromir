<template>
  <div class="process-page">
    <section class="page-header section-padding">
      <div class="container">
        <h1>Как мы <span>работаем</span></h1>
        <p>От заказа до поставки — прозрачный и быстрый процесс.</p>
      </div>
    </section>

    <!-- Steps Section -->
    <section class="steps section-padding">
      <div class="container">
        <div class="steps-flow">
          <div 
            class="step-item" 
            v-for="(step, i) in steps" 
            :key="i"
            v-motion-slide-visible-bottom
          >
            <div class="step-num">{{ i + 1 }}</div>
            <div class="step-content">
              <h3>{{ step.title }}</h3>
              <p>{{ step.desc }}</p>
            </div>
            <div v-if="i < steps.length - 1" class="step-arrow">
              <ChevronRight v-if="!isMobile" />
              <ChevronDown v-else />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- For Whom Section -->
    <section class="for-whom section-padding bg-white">
      <div class="container">
        <div class="section-header center">
          <h2>Для кого наш сервис</h2>
          <p>Мы работаем со всеми форматами HoReCa</p>
        </div>
        <div class="whom-grid">
          <div class="whom-card" v-for="item in targetAudience" :key="item">
            <CheckCircle class="whom-icon" />
            <span>{{ item }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="benefits section-padding bg-primary">
      <div class="container">
        <div class="section-header center">
          <h2 class="text-white">Выгоды клиента</h2>
        </div>
        <div class="benefits-grid">
          <div class="benefit-box" v-for="(b, i) in benefits" :key="i">
            <h3>{{ b.title }}</h3>
            <p>{{ b.text }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ChevronRight, ChevronDown, CheckCircle } from 'lucide-vue-next'

const isMobile = ref(false)

const steps = [
  { title: 'Заказ клиента', desc: 'Вы выбираете нужные позиции в системе за 30 секунд.' },
  { title: 'Обработка', desc: 'Наша система моментально принимает и подтверждает заказ.' },
  { title: 'Сборка', desc: 'Контроль качества на каждом этапе упаковки.' },
  { title: 'Доставка', desc: 'Оперативная доставка до дверей вашей кухни.' },
  { title: 'Получение', desc: 'Проверка и закрытие сделки. Всё вовремя.' }
]

const targetAudience = [
  'Рестораны', 'Кафе', 'Бары', 'Гостиницы', 'Dark kitchen', 'Кейтеринг'
]

const benefits = [
  { title: 'Экономия времени', text: 'Команда тратит меньше времени на рутину.' },
  { title: 'Меньше ошибок', text: 'Автоматизация исключает человеческий фактор.' },
  { title: 'Контроль закупа', text: 'Вся история и статистика в одном месте.' },
  { title: 'Стабильность', text: 'Ваша кухня работает без остановок.' }
]

onMounted(() => {
  isMobile.value = window.innerWidth < 768
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 768
  })
})
</script>

<style scoped>
.page-header {
  background: var(--primary);
  color: var(--white);
  padding-top: 12rem;
  text-align: center;
}

@media (max-width: 768px) {
  .page-header { padding-top: 7rem; }
}

@media (max-width: 480px) {
  .page-header { padding-top: 5.5rem; }
}

.page-header h1 span { color: var(--secondary); }

.steps-flow {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.step-item {
  flex: 1;
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.step-num {
  width: 60px;
  height: 60px;
  background: var(--primary);
  color: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  border: 4px solid #f1f5f9;
}

.step-content h3 { margin-bottom: 0.75rem; color: var(--primary); font-size: 1.1rem; }
.step-content p { color: var(--gray); font-size: 0.9rem; line-height: 1.4; }

.step-arrow {
  position: absolute;
  top: 30px;
  right: -15px;
  color: var(--primary-light);
  opacity: 0.5;
}

.whom-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
}

.whom-card {
  background: #f8fafc;
  padding: 2rem;
  border-radius: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  transition: var(--transition);
}

.whom-card:hover {
  background: var(--primary-light);
  color: var(--white);
}

.whom-icon { width: 32px; height: 32px; }
.whom-card span { font-weight: 700; font-size: 1.1rem; }

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
}

.benefit-box {
  background: rgba(255,255,255,0.1);
  padding: 2.5rem;
  border-radius: 2rem;
  color: var(--white);
  border: 1px solid rgba(255,255,255,0.2);
}

.benefit-box h3 { margin-bottom: 1rem; color: var(--secondary); }
.benefit-box p { color: #cbd5e1; }

.bg-primary { background: var(--primary); }
.bg-white { background: var(--white); }
.text-white { color: var(--white); }

@media (max-width: 768px) {
  .steps-flow { flex-direction: column; gap: 2rem; }
  .step-arrow { position: static; margin-top: 0.5rem; }
  .step-num { width: 45px; height: 45px; font-size: 1.2rem; margin-bottom: 1rem; border-width: 3px; }
  .step-content h3 { font-size: 1rem; margin-bottom: 0.5rem; }
  .step-content p { font-size: 0.8rem; }
  .whom-grid { gap: 1rem; margin-top: 2rem; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); }
  .whom-card { padding: 1.25rem; border-radius: 1rem; gap: 0.5rem; }
  .whom-icon { width: 24px; height: 24px; }
  .whom-card span { font-size: 0.9rem; }
  .benefits-grid { gap: 1rem; margin-top: 2rem; }
  .benefit-box { padding: 1.5rem; border-radius: 1.25rem; }
  .benefit-box h3 { font-size: 1rem; margin-bottom: 0.5rem; }
  .benefit-box p { font-size: 0.85rem; }
  .section-header p { font-size: 0.9rem; }
}
</style>
