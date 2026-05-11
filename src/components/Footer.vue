<template>
  <footer class="footer">
    <div class="container section-padding">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="logo">GASTRO<span class="orange">MIR</span></div>
          <p>Мы не просто поставляем продукты. Мы упрощаем работу ресторана.</p>
          <div class="socials">
            <!-- Add social icons here if needed -->
          </div>
        </div>

        <div class="footer-links">
          <h4>Навигация</h4>
          <router-link to="/">Главная</router-link>
          <router-link to="/catalog">Каталог</router-link>
          <router-link to="/process">Как мы работаем</router-link>
          <router-link to="/about">О нас</router-link>
        </div>

        <div class="footer-contact">
          <h4>Контакты</h4>
          <p>📍 г. Астана, Шоссе Алаш 4/2</p>
          <p>📩 gastromir.kz@gmail.com</p>
          <p>🕘 Ежедневно с 07:00 до 18:00</p>
        </div>

        <div class="footer-legal">
          <h4>Реквизиты</h4>
          <p>ИП Сатубалдина З.А.</p>
          <p>БИН: 540725400961</p>
          <p>АО “Kaspi Bank”</p>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2026 GASTROMIR. Все права защищены.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--dark);
  color: var(--white);
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr 1.5fr;
  gap: 4rem;
}

.logo {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: var(--white);
}

.logo .orange {
  background: var(--gradient-orange);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.footer-brand p {
  color: var(--gray);
  max-width: 300px;
}

h4 {
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  color: var(--white);
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-links a {
  color: var(--gray);
}

.footer-links a:hover {
  color: var(--secondary);
}

.footer-contact p, .footer-legal p {
  color: var(--gray);
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.footer-bottom {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255,255,255,0.1);
  text-align: center;
  color: var(--gray);
  font-size: 0.85rem;
}

@media (max-width: 992px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
}

@media (max-width: 576px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
}
</style>
