import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/horeca',
      name: 'horeca',
      component: () => import('../views/HorecaView.vue'),
      meta: {
        title: 'Поставщик продуктов для ресторанов и кафе в Астане | GASTROMIR',
        description: 'Комплексное B2B снабжение ресторанов, баров, кофеен и отелей в Астане. Более 1000 товаров: бакалея, сыры, мясо, овощи, хозтовары в одном заказе.'
      }
    },
    {
      path: '/dostavka',
      name: 'dostavka',
      component: () => import('../views/DeliveryView.vue'),
      meta: {
        title: 'Доставка продуктов для ресторанов Астана — условия и график | GASTROMIR',
        description: 'Ежедневная доставка продуктов и хозяйственных товаров по ресторанам и заведениям HoReCa в Астане с 07:00 до 18:00.'
      }
    },
    {
      path: '/price',
      name: 'price',
      component: () => import('../views/PriceView.vue'),
      meta: {
        title: 'Оптовый прайс-лист продуктов для ресторанов Астана | GASTROMIR',
        description: 'Актуальный оптовый прайс-лист продуктов для заведений общепита в Астане. Скачать PDF прайс и запросить индивидуальные условия.'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        title: 'О компании GASTROMIR — поставщик для HoReCa в Астане',
        description: 'GASTROMIR — надежный поставщик продуктов и товаров для ресторанного бизнеса в Астане.'
      }
    },
    {
      path: '/catalog',
      name: 'catalog',
      component: () => import('../views/CatalogView.vue'),
      meta: {
        title: 'Каталог продуктов для ресторанов — купить оптом в Астане | GASTROMIR',
        description: 'Оптовый каталог продуктов питания и хозтоваров для кухни ресторана и кафе. Заказ в один клик с доставкой по Астане.'
      }
    },
    {
      path: '/process',
      name: 'process',
      component: () => import('../views/ProcessView.vue'),
      meta: {
        title: 'Как мы работаем — сервис снабжения HoReCa | GASTROMIR',
        description: 'Простой и прозрачный процесс закупки для ресторанов: от заявки до приемки на кухне.'
      }
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: () => import('../views/ContactView.vue'),
      meta: {
        title: 'Поставщик продуктов для ресторанов в Астане — Контакты | GASTROMIR',
        description: 'Контакты компании GASTROMIR: склад, телефон отдела снабжения, WhatsApp, график работы и реквизиты.'
      }
    },
    {
      path: '/social-mission',
      name: 'social-mission',
      component: () => import('../views/SocialMissionView.vue'),
      meta: {
        title: 'Социальная инициатива «Мейірім Тарелкесі» | GASTROMIR',
        description: 'Благотворительная программа помощи нуждающимся при поддержке заведений питания и Акимата города Астана.'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { guestOnly: true, title: 'Вход в личный кабинет | GASTROMIR' }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { guestOnly: true, title: 'Регистрация заведения | GASTROMIR' }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true, title: 'Личный кабинет закупщика B2B | GASTROMIR' }
    },
    {
      path: '/restaurant-order',
      name: 'restaurant-order',
      component: () => import('../views/RestaurantOrderView.vue'),
      meta: { requiresAuth: true, title: 'Заказ в 1 клик по списку | GASTROMIR' }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      meta: { requiresAdmin: true, title: 'Панель управления | GASTROMIR' }
    },
    {
      // 404 Not Found fallback
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Update Title and Meta Description for SEO
  const defaultTitle = 'GASTROMIR — Поставщик продуктов для ресторанов в Астане'
  const defaultDesc = 'GASTROMIR — поставщик продуктов питания и хозтоваров для ресторанов, кафе, баров и общепита в Астане. Более 1 000 товаров в одном заказе.'
  
  document.title = to.meta.title || defaultTitle

  let metaDescription = document.querySelector('meta[name="description"]')
  if (!metaDescription) {
    metaDescription = document.createElement('meta')
    metaDescription.setAttribute('name', 'description')
    document.head.appendChild(metaDescription)
  }
  metaDescription.setAttribute('content', to.meta.description || defaultDesc)

  // Canonical tag handling
  let canonicalLink = document.querySelector('link[rel="canonical"]')
  if (!canonicalLink) {
    canonicalLink = document.createElement('link')
    canonicalLink.setAttribute('rel', 'canonical')
    document.head.appendChild(canonicalLink)
  }
  canonicalLink.setAttribute('href', `https://gastromir.kz${to.path}`)

  // Restore user session if token exists but no user is loaded
  if (authStore.token && !authStore.user) {
    await authStore.fetchUser()
  }

  // Handle access guards
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    next({ name: 'profile' })
  } else if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
  } else if (to.meta.requiresAdmin && (!authStore.isAuthenticated || authStore.user?.role !== 'admin')) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router

