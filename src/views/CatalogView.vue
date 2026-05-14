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

    <section class="catalog-content section-padding">
      <div class="container">
        <div class="catalog-layout">
          <!-- Categories Sidebar -->
          <aside class="sidebar">
            <h3>Категории</h3>
            <ul class="category-list">
              <li 
                :class="{ active: activeCategory === 'all' }"
                @click="setActiveCategory('all')"
              >
                Все товары
              </li>
              <li 
                v-for="cat in uniqueCategories" 
                :key="cat"
                :class="{ active: activeCategory === cat }"
                @click="setActiveCategory(cat)"
              >
                {{ cat }}
              </li>
            </ul>
          </aside>

          <!-- Products Grid -->
          <main class="products-main" ref="productsRef">
            <div class="products-grid" v-if="filteredProducts.length > 0">
              <div 
                class="product-card" 
                v-for="product in filteredProducts" 
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
                  <p v-if="product.unit === 'кг'" class="weight-note">
                    ⚖️ Весовой товар — итоговая стоимость зависит от фактического веса
                  </p>
                </div>
              </div>
            </div>
            <div class="no-results" v-else>
              <PackageX :size="64" />
              <h3>Ничего не найдено</h3>
              <p>Попробуйте изменить параметры поиска</p>
            </div>
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
import { ref, computed, onMounted } from 'vue'
import { Search, ShoppingCart, Check, PackageX } from 'lucide-vue-next'
import productsData from '@/data/products.json'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const searchQuery = ref('')
const activeCategory = ref('all')
const productsRef = ref(null)

const filteredProducts = computed(() => {
  return productsData.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                        p.category.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = activeCategory.value === 'all' || p.category === activeCategory.value
    return matchesSearch && matchesCategory
  })
})

const uniqueCategories = computed(() => {
  return [...new Set(productsData.map(p => p.category))]
})

const setActiveCategory = (cat) => {
  activeCategory.value = cat
  if (productsRef.value) {
    const headerHeight = 100 // Adjust based on navbar height
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
  const product = productsData.find(p => p.id === id)
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
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 3rem;
}

.sidebar h3 {
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
}

.category-list {
  list-style: none;
}

.category-list li {
  padding: 0.75rem 1.25rem;
  border-radius: 1rem;
  cursor: pointer;
  transition: var(--transition);
  color: var(--gray);
  margin-bottom: 0.5rem;
}

.category-list li:hover {
  background: #f1f5f9;
  color: var(--primary);
}

.category-list li.active {
  background: var(--primary);
  color: var(--white);
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

@media (max-width: 1024px) {
  .catalog-layout { grid-template-columns: 200px 1fr; gap: 2rem; }
}

@media (max-width: 768px) {
  .catalog-layout { grid-template-columns: 1fr; }
  .sidebar { 
    position: sticky;
    top: 80px;
    z-index: 10;
    background: var(--white);
    padding: 1rem;
    margin-bottom: 2rem;
    border-radius: 1rem;
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    overflow-x: auto;
  }
  .category-list {
    display: flex;
    gap: 0.5rem;
  }
  .category-list li {
    white-space: nowrap;
    margin-bottom: 0;
    padding: 0.5rem 1rem;
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
</style>
