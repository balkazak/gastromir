<template>
  <footer class="footer">
    <div class="container section-padding">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="logo">GASTRO<span class="orange">MIR</span></div>
          <p>Мы не просто поставляем продукты. Мы упрощаем работу ресторана.</p>
          <router-link to="/social-mission" class="social-program">
            <img src="@/assets/social_logo.png" alt="Мейірім тәрелкесі" class="social-logo" />
            <div class="social-info">
              <span class="social-tag">Участник</span>
              <span class="social-name">Социальная инициатива «Мейірім Тарелкесі»</span>
            </div>
          </router-link>
          
          <div class="social-program akimat-partner-card">
            <img src="@/assets/akimat.png" alt="Акимат города Астана" class="social-logo akimat-badge" />
            <div class="social-info">
              <span class="social-tag">Официальный партнер</span>
              <span class="social-name">Акимат города Астана</span>
            </div>
          </div>
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
          <router-link to="/social-mission">Социальная инициатива «Мейірім Тарелкесі»</router-link>
        </div>

        <div class="footer-contact">
          <h4>Контакты</h4>
          <p>📍 г. Астана, Шоссе Алаш 4/2</p>
          <p>📩 gastromir.kz@gmail.com</p>
          <p>🕘 Ежедневно с 07:00 до 18:00</p>
        </div>

        <div class="footer-legal">
          <h4>Реквизиты</h4>
          <p>GASTROMIR ИП ИБРАЕВ</p>
          <p>БИН: 820727351424</p>
          <p>АО “Kaspi Bank”</p>
          <p>KZ96722S000053776272</p>
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
  padding-top: 6rem;
  padding-bottom: 2rem;
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

.akimat-partner-card {
  margin-top: 1rem !important;
  cursor: default;
}

.akimat-badge {
  background: #ffffff;
  padding: 4px;
}

.social-program {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  max-width: 320px;
  transition: all 0.3s ease;
}

.social-program:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.social-logo {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  object-fit: cover;
  background: #ffffff;
  padding: 2px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
}

.social-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.social-tag {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--secondary, #ff8c00);
  font-weight: 700;
}

.social-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--white);
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
