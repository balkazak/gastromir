<template>
  <div class="delivery-page">
    <section class="page-header section-padding">
      <div class="container text-center">
        <div class="header-badge">Логистика HoReCa</div>
        <h1>Доставка продуктов для ресторанов в Астане</h1>
        <p>Ежедневная поставка продуктов питания и хозяйственных товаров точно к началу смены кухни</p>
      </div>
    </section>

    <section class="delivery-details-section section-padding">
      <div class="container">
        <div class="conditions-grid">
          <div class="condition-card" v-for="(card, i) in conditions" :key="i">
            <component :is="card.icon" class="cond-icon" :size="32" />
            <h3>{{ card.title }}</h3>
            <p>{{ card.desc }}</p>
          </div>
        </div>

        <div class="zones-wrapper">
          <div class="zones-header">
            <h2>Зоны и график доставки</h2>
            <p>Доставляем по всем районам города Астана (Есиль, Алматы, Байконур, Сарыарка, поселок Косшы и окрестности)</p>
          </div>

          <div class="schedule-table-wrap">
            <table class="schedule-table">
              <thead>
                <tr>
                  <th>Рейс</th>
                  <th>Время доставки</th>
                  <th>Прием заказов</th>
                  <th>Условия</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Утренний рейс</strong></td>
                  <td>07:00 – 14:00</td>
                  <td>До 22:00 предыдущего дня</td>
                  <td>Основной закуп продуктов кухни</td>
                </tr>
                <tr>
                  <td><strong>Дневной рейс</strong></td>
                  <td>14:00 – 18:00</td>
                  <td>До 12:00 текущего дня</td>
                  <td>Дозаказ и срочные позиции</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="delivery-cta-card">
          <div class="cta-inner">
            <h3>Узнайте точные условия для вашего адреса</h3>
            <p>Свяжитесь с диспетчером логистики или отправьте адрес заведения:</p>
            <div class="cta-actions">
              <a :href="whatsappUrl" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp" @click="handleWhatsApp('delivery_page')">
                Уточнить доставку в WhatsApp
              </a>
              <router-link to="/catalog" class="btn btn-secondary">
                Собрать заказ в каталоге
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Clock, Truck, ShieldCheck, MapPin } from 'lucide-vue-next'
import { trackWhatsAppClick } from '@/utils/analytics'

const conditions = [
  {
    icon: Clock,
    title: 'Ежедневно с 07:00 до 18:00',
    desc: 'Доставка работает 7 дней в неделю без выходных. Заказы приходят до открытия зала.'
  },
  {
    icon: Truck,
    title: 'Специализированный транспорт',
    desc: 'Соблюдение температурного режима (заморозка, охлажденное мясо, свежие овощи и зелень).'
  },
  {
    icon: ShieldCheck,
    title: 'Контроль свежести при приемке',
    desc: 'Шеф-повар или су-шеф проверяет товар при выгрузке. Немедленный обмен в случае любых нареканий.'
  },
  {
    icon: MapPin,
    title: 'Вся Астана и пригород',
    desc: 'Регулярные маршруты по Левому и Правому берегу, а также прилегающим зонам заведений.'
  }
]

const whatsappUrl = computed(() => {
  const msg = encodeURIComponent('Здравствуйте! Хочу уточнить условия и время доставки продуктов по нашему адресу в Астане.')
  return `https://wa.me/77015141404?text=${msg}`
})

const handleWhatsApp = (src) => {
  trackWhatsAppClick(src)
}
</script>

<style scoped>
.page-header {
  background: linear-gradient(135deg, #0B1221 0%, #1A2338 100%);
  color: #FFFFFF;
  padding: 11rem 0 4rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.header-badge {
  display: inline-block;
  padding: 0.35rem 1rem;
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid #F59E0B;
  color: #F59E0B;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
}

h1 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.page-header p {
  color: #94A3B8;
  font-size: 1.2rem;
  max-width: 700px;
  margin: 0 auto;
}

.conditions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.condition-card {
  background: #FFFFFF;
  padding: 2rem;
  border-radius: 1.5rem;
  border: 1px solid #E2E8F0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
}

.cond-icon {
  color: #F59E0B;
  margin-bottom: 1rem;
}

.condition-card h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #0B1221;
}

.condition-card p {
  color: #64748B;
  font-size: 0.95rem;
}

.zones-wrapper {
  background: #FFFFFF;
  border-radius: 1.5rem;
  border: 1px solid #E2E8F0;
  padding: 3rem;
  margin-bottom: 4rem;
}

.zones-header h2 {
  font-size: 2rem;
  color: #0B1221;
  margin-bottom: 0.5rem;
}

.zones-header p {
  color: #64748B;
  margin-bottom: 2rem;
}

.schedule-table-wrap {
  overflow-x: auto;
}

.schedule-table {
  width: 100%;
  border-collapse: collapse;
}

.schedule-table th, .schedule-table td {
  padding: 1.25rem 1rem;
  text-align: left;
  border-bottom: 1px solid #E2E8F0;
}

.schedule-table th {
  background: #F8FAFC;
  color: #475569;
  font-weight: 700;
  font-size: 0.9rem;
}

.delivery-cta-card {
  background: #0B1221;
  color: #FFFFFF;
  border-radius: 2rem;
  padding: 3.5rem 2rem;
  text-align: center;
}

.delivery-cta-card h3 {
  font-size: 1.8rem;
  margin-bottom: 0.75rem;
}

.delivery-cta-card p {
  color: #94A3B8;
  margin-bottom: 2rem;
}

.cta-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-whatsapp {
  background: #25D366;
  color: #FFFFFF;
}

@media (max-width: 768px) {
  .page-header {
    padding: 7rem 0 3rem;
  }
  h1 {
    font-size: 2rem;
  }
  .zones-wrapper {
    padding: 1.5rem;
  }
}
</style>
