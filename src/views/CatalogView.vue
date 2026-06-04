<template>
  <div class="catalog-page">
    <section class="page-header section-padding">
      <div class="container">
        <h1>Наш <span>ассортимент</span></h1>
        <p>Более 1000 позиций по актуальным ценам. Заказывайте в один клик.</p>
        
        <div class="search-bar">
          <Search class="search-icon" />
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Поиск товаров (например: моцарелла, креветки...)"
            @input="filterProducts"
          />
        </div>
      </div>
    </section>

    <!-- Categories Bar: outside .container for proper sticky/fixed positioning -->
    <div class="categories-bar-wrapper">
      <div class="container">
        <div 
          class="categories-bar" 
          ref="categoriesBarRef"
          @mousedown="handleMouseDown"
          @mouseleave="handleMouseLeave"
          @mouseup="handleMouseUp"
          @mousemove="handleMouseMove"
        >
          <button 
            :class="{ active: activeCategory === 'all' }"
            @click="setActiveCategory('all')"
            class="category-pill-btn"
          >
            Все товары
          </button>
          <button 
            v-for="cat in uniqueCategories" 
            :key="cat"
            :class="{ active: activeCategory === cat }"
            @click="setActiveCategory(cat)"
            class="category-pill-btn"
          >
            {{ cat }}
          </button>
        </div>
      </div>
    </div>

    <section class="catalog-content section-padding">
      <div class="container">
        <div class="catalog-layout">
          <!-- Products Grid -->
          <main class="products-main" ref="productsRef">
            <div v-if="loading" class="loading-state">
              <span class="loader"></span>
              <p>Загрузка каталога товаров...</p>
            </div>

            <template v-else>
              <div 
                v-if="isFreshProduceVisible && filteredProducts.length > 0" 
                class="fresh-produce-note"
                v-motion-slide-visible-top
              >
                <div class="fresh-produce-icon">
                  <Info :size="20" />
                </div>
                <p>Цены на свежую продукцию (овощи, фрукты, зелень, салаты) являются плавающими и зависят от сезонности, качества и ежедневных поставок.</p>
              </div>

              <div class="products-grid" v-if="displayedProducts.length > 0">
                <div 
                  class="product-card" 
                  v-for="product in displayedProducts" 
                  :key="product.id"
                  v-motion-slide-visible-bottom
                >
                  <div class="product-info">
                    <div class="product-header">
                      <span class="product-badge">{{ product.category }}</span>
                      <h4>{{ product.name }}</h4>
                    </div>
                    <p class="manufacturer">{{ product.manufacturer }}</p>
                    <div class="product-footer">
                      <div class="price-box">
                        <span class="price">{{ formatPrice(product.price) }} ₸</span>
                        <span class="unit">/ {{ product.unit }}</span>
                      </div>
                      <div class="cart-actions">
                        <div class="quantity-selector">
                          <button @click="decrementQty(product.id)">-</button>
                          <span>{{ getItemQty(product.id) }}</span>
                          <button @click="incrementQty(product.id)">+</button>
                        </div>
                        <button 
                          class="btn-add" 
                          @click="addToCart(product)"
                          :class="{ 'in-cart': isItemInCart(product.id) }"
                        >
                          <ShoppingCart v-if="!isItemInCart(product.id)" :size="18" />
                          <Check v-else :size="18" />
                        </button>
                      </div>
                    </div>
                    <p v-if="isWeightProduct(product)" class="weight-note">
                      ⚖️ Весовой товар — итоговая стоимость зависит от фактического веса
                    </p>
                  </div>
                </div>
              </div>
              
              <!-- Scroll Sentinel for Infinite Scroll -->
              <div ref="scrollSentinel" class="scroll-sentinel"></div>

              <div class="no-results" v-if="displayedProducts.length === 0">
                <PackageX :size="64" />
                <h3>Ничего не найдено</h3>
                <p>Попробуйте изменить параметры поиска</p>
              </div>
            </template>
          </main>
        </div>
      </div>
    </section>

    <!-- Floating Cart Summary -->
    <div class="cart-summary" v-if="cartStore.totalItems > 0" v-motion-pop>
      <div class="cart-info">
        <ShoppingCart :size="24" />
        <div>
          <span>{{ cartStore.totalItems }} товаров</span>
          <p>{{ formatPrice(cartStore.totalPrice) }} ₸</p>
        </div>
      </div>
      <button @click="cartStore.openModal" class="btn btn-secondary">Оформить заказ</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { Search, ShoppingCart, Check, PackageX, Info } from 'lucide-vue-next'
import { useCartStore, isWeightProduct } from '@/stores/cart'

const cartStore = useCartStore()
const searchQuery = ref('')
const activeCategory = ref('all')
const productsRef = ref(null)
const categoriesBarRef = ref(null)

// Mouse drag scroll handlers for categories bar
let isDown = false
let startX
let scrollLeft

const handleMouseDown = (e) => {
  const bar = categoriesBarRef.value
  if (!bar || bar.scrollWidth <= bar.clientWidth) return
  isDown = true
  bar.classList.add('active-drag')
  startX = e.pageX - bar.offsetLeft
  scrollLeft = bar.scrollLeft
}

const handleMouseLeave = () => {
  isDown = false
  const bar = categoriesBarRef.value
  if (bar) bar.classList.remove('active-drag')
}

const handleMouseUp = () => {
  isDown = false
  const bar = categoriesBarRef.value
  if (bar) bar.classList.remove('active-drag')
}

const handleMouseMove = (e) => {
  if (!isDown) return
  e.preventDefault()
  const bar = categoriesBarRef.value
  if (!bar) return
  const x = e.pageX - bar.offsetLeft
  const walk = (x - startX) * 2 // scroll multiplier
  bar.scrollLeft = scrollLeft - walk
}

const products = ref([])
const loading = ref(true)

// Infinite Scroll State
const scrollSentinel = ref(null)
const displayedLimit = ref(40)
let sentinelObserver = null

const fetchProducts = async () => {
  try {
    loading.value = true
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://gastroback-production.up.railway.app'}/api/products`)
    if (response.ok) {
      products.value = await response.json()
    }
  } catch (err) {
    console.error('Failed to fetch products:', err)
  } finally {
    loading.value = false
    nextTick(() => {
      setupSentinelObserver()
    })
  }
}

const setupSentinelObserver = () => {
  if (sentinelObserver) sentinelObserver.disconnect()

  sentinelObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      if (displayedLimit.value < filteredProducts.value.length) {
        displayedLimit.value += 40
      }
    }
  }, {
    rootMargin: '250px' // Smooth preloading
  })

  if (scrollSentinel.value) {
    sentinelObserver.observe(scrollSentinel.value)
  }
}

const resetLimit = () => {
  displayedLimit.value = 40
  nextTick(() => {
    if (scrollSentinel.value && sentinelObserver) {
      sentinelObserver.unobserve(scrollSentinel.value)
      sentinelObserver.observe(scrollSentinel.value)
    }
  })
}

// Reset displayed limits when search query or active category changes
watch([searchQuery, activeCategory], () => {
  resetLimit()
})

onMounted(() => {
  fetchProducts()
})

onUnmounted(() => {
  if (sentinelObserver) sentinelObserver.disconnect()
})

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                        p.category.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = activeCategory.value === 'all' || p.category === activeCategory.value
    return matchesSearch && matchesCategory
  })
})

const displayedProducts = computed(() => {
  return filteredProducts.value.slice(0, displayedLimit.value)
})

const uniqueCategories = computed(() => {
  const cats = [...new Set(products.value.map(p => p.category))]
  const categoryOrder = [
    'Бакалея',
    'Фрукты',
    'Овощи',
    'Зелень',
    'Ягоды',
    'Салаты',
    'Масла и жиры',
    'Молочные продукты',
    'Сыры и сырные продукты',
    'Колбасные изделия и х/к',
    'Морепродукты',
    'Мука и мучные изделия',
    'Мясо птицы',
    'Полуфабрикаты и картофельные изделия',
    'Суши бар',
    'Соусы и уксусы',
    'Консервация',
    'Крупы',
    'Кондитерские',
    'Орехи',
    'Приправы и специи',
    'Сиропы',
    'Чай-кофе',
    'Ягоды и овощи с/м',
    'Хоз.товары'
  ]
  return cats.sort((a, b) => {
    let idxA = categoryOrder.indexOf(a)
    let idxB = categoryOrder.indexOf(b)
    if (idxA === -1) idxA = 9999
    if (idxB === -1) idxB = 9999
    if (idxA !== idxB) {
      return idxA - idxB
    }
    return a.localeCompare(b, 'ru')
  })
})

const isFreshProduceVisible = computed(() => {
  const freshCategories = ['Овощи', 'Зелень', 'Салаты', 'Фрукты']
  if (freshCategories.includes(activeCategory.value)) {
    return true
  }
  return filteredProducts.value.some(p => freshCategories.includes(p.category))
})

const setActiveCategory = (cat) => {
  searchQuery.value = ''
  activeCategory.value = cat
  if (productsRef.value) {
    const headerHeight = 100
    const elementPosition = productsRef.value.getBoundingClientRect().top + window.pageYOffset
    const offsetPosition = elementPosition - headerHeight

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU').format(price)
}

// Store Bridge
const addToCart = (product) => cartStore.addItem(product)
const incrementQty = (id) => {
  const product = products.value.find(p => p.id === id)
  if (product) cartStore.addItem(product)
}
const decrementQty = (id) => cartStore.updateQuantity(id, -1)

const getItemQty = (id) => {
  const item = cartStore.items.find(i => i.id === id)
  return item ? item.quantity : 0
}

const isItemInCart = (id) => {
  return cartStore.items.some(i => i.id === id && i.quantity > 0)
}
</script>

<style scoped>
.page-header {
  background: linear-gradient(135deg, #0B1221 0%, #1E293B 100%);
  color: var(--white);
  padding-top: 10rem;
  padding-bottom: 6rem;
  text-align: center;
}

.page-header h1 span { 
  background: var(--gradient-orange);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.search-bar {
  max-width: 700px;
  margin: 3rem auto 0;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray);
}

.search-bar input {
  width: 100%;
  padding: 1.25rem 1.5rem 1.25rem 4rem;
  border-radius: 9999px;
  border: none;
  background: var(--white);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  font-size: 1.1rem;
  outline: none;
  transition: var(--transition);
}

.search-bar input:focus {
  box-shadow: 0 10px 30px rgba(37, 99, 235, 0.2);
}

.catalog-layout {
  display: block;
}

/* Categories Horizontal Scroll Bar Styles */
.categories-bar-wrapper {
  position: sticky;
  top: 75px; /* stick right below header/navbar */
  z-index: 200;
  background-color: #f8fafc;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e2e8f0;
  width: 100%;
}

.categories-bar {
  display: flex;
  flex-wrap: wrap; /* Wrap chips on desktop */
  gap: 0.75rem;
  padding: 0.5rem 0.25rem;
  user-select: none;
}

.category-pill-btn {
  white-space: nowrap;
  padding: 0.6rem 1.5rem;
  border-radius: 9999px;
  border: 1.5px solid rgba(11, 18, 33, 0.18);
  background: var(--white);
  color: var(--primary);
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 6px rgba(11, 18, 33, 0.06);
  letter-spacing: 0.01em;
}

.category-pill-btn:hover {
  border-color: var(--secondary);
  color: var(--secondary-dark);
  background: rgba(245, 158, 11, 0.07);
  box-shadow: 0 4px 14px rgba(245, 158, 11, 0.15);
  transform: translateY(-1px);
}

.category-pill-btn.active {
  background: linear-gradient(135deg, var(--secondary) 0%, var(--secondary-dark) 100%);
  border-color: transparent;
  color: var(--white);
  box-shadow: 0 4px 16px rgba(245, 158, 11, 0.35);
  font-weight: 700;
  transform: translateY(-1px);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.product-card {
  background: var(--white);
  border-radius: 1.25rem;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  border: 1px solid #f1f5f9;
  transition: var(--transition);
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  border-color: var(--secondary);
}

.product-info {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-header {
  margin-bottom: 1rem;
}

.product-badge {
  display: inline-block;
  background: #f1f5f9;
  color: var(--secondary);
  padding: 0.25rem 0.75rem;
  border-radius: 2rem;
  font-size: 0.7rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.product-info h4 {
  font-size: 1.1rem;
  line-height: 1.4;
  color: var(--primary);
  margin: 0;
}

.manufacturer {
  font-size: 0.85rem;
  color: var(--gray);
  margin-bottom: 1.5rem;
}

.weight-note {
  font-size: 0.75rem;
  color: var(--secondary-dark);
  background: #FEF3C7;
  padding: 0.4rem 0.6rem;
  border-radius: 0.5rem;
  margin-top: 0.75rem;
  line-height: 1.3;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--primary);
}

.unit {
  font-size: 0.85rem;
  color: var(--gray);
}

.cart-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-selector {
  display: flex;
  align-items: center;
  background: #f1f5f9;
  border-radius: 9999px;
  padding: 0.25rem;
}

.quantity-selector button {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.quantity-selector span {
  width: 30px;
  text-align: center;
  font-weight: 600;
  font-size: 0.9rem;
}

.btn-add {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--primary);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-add.in-cart {
  background: var(--accent);
}

.no-results {
  text-align: center;
  padding: 5rem 0;
  color: var(--gray);
}

.no-results h3 { margin-top: 1.5rem; color: var(--primary); }

.cart-summary {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: var(--white);
  padding: 1rem 2rem;
  border-radius: 2rem;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  gap: 2rem;
  z-index: 1000;
  border: 2px solid var(--secondary);
}

.cart-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cart-info span { font-weight: 700; color: var(--primary); }
.cart-info p { font-size: 0.9rem; color: var(--gray); }

@media (max-width: 768px) {
  .categories-bar-wrapper {
    top: 84px; /* Adjust sticky top position below mobile navbar (height ~84px) */
    margin-bottom: 1.5rem;
    padding: 0.5rem 0;
  }
  .categories-bar {
    flex-wrap: nowrap; /* Horizontal scrolling on mobile */
    overflow-x: auto;
    scrollbar-width: none; /* Hide scrollbar for Firefox */
    cursor: grab;
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
  }
  .categories-bar::-webkit-scrollbar {
    display: none; /* Hide scrollbar for Chrome/Safari/Edge */
  }
  .categories-bar.active-drag {
    cursor: grabbing;
  }
  .category-pill-btn {
    padding: 0.5rem 1.25rem;
    font-size: 0.85rem;
  }
}

@media (max-width: 600px) {
  .products-grid { grid-template-columns: 1fr; }
  .cart-summary {
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
    justify-content: space-between;
    padding: 0.75rem 1.25rem;
    gap: 1rem;
  }
  .cart-info { gap: 0.5rem; }
}

/* Mobile: fixed categories bar always at top of viewport */
@media (max-width: 768px) {
  .categories-bar-wrapper {
    position: fixed;
    top: 87px; /* below the mobile navbar (55px logo + 2*16px padding) */
    left: 0;
    right: 0;
    z-index: 200;
    padding: 0.6rem 0;
    box-shadow: 0 4px 16px rgba(0,0,0,0.10);
  }

  .categories-bar {
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    padding: 0.25rem 0.5rem;
  }

  .categories-bar::-webkit-scrollbar {
    display: none;
  }

  /* Push catalog content down so it's not hidden under fixed bar */
  .catalog-content {
    padding-top: calc(64px + 3rem) !important;
  }
}

.fresh-produce-note {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.06) 0%, rgba(251, 191, 36, 0.08) 100%);
  border: 1px solid rgba(245, 158, 11, 0.25);
  padding: 1.25rem 1.5rem;
  border-radius: 1.25rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.03);
  backdrop-filter: blur(10px);
  transition: var(--transition);
}

.fresh-produce-note p {
  color: #c27803;
  font-size: 0.95rem;
  line-height: 1.5;
  font-weight: 500;
  margin: 0;
}

.fresh-produce-icon {
  color: var(--secondary);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(245, 158, 11, 0.1);
  width: 42px;
  height: 42px;
  border-radius: 50%;
}

@media (max-width: 768px) {
  .fresh-produce-note {
    padding: 1rem;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }
  .fresh-produce-note p {
    font-size: 0.85rem;
  }
  .fresh-produce-icon {
    width: 32px;
    height: 32px;
  }
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 0;
  color: var(--gray);
}

.loader {
  width: 48px;
  height: 48px;
  border: 5px solid rgba(255, 255, 255, 0.1);
  border-bottom-color: var(--secondary);
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
  margin-bottom: 1.5rem;
}

@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
