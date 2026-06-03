<template>
  <div class="ai-order-page">
    <!-- Hero Section -->
    <section class="page-header section-padding">
    </section>

    <!-- Main Content -->
    <section class="ai-content section-padding">
      <div class="container-wide">
        <div class="ai-grid">
          <!-- Left Column: AI Assistant Chat & Input -->
          <div class="chat-card" v-motion-slide-left>
            <div class="chat-header">
              <div class="agent-avatar">
                <Sparkles :size="20" class="sparkles-icon" />
              </div>
              <div class="agent-info">
                <h3>Gastromir AI Агент</h3>
                <span class="status-indicator">В сети</span>
              </div>
            </div>

            <!-- Chat Message Window -->
            <div class="chat-messages" ref="chatMessagesRef">
              <div v-for="msg in chatHistory" :key="msg.id" :class="['message-bubble', msg.sender]">
                <div class="message-content">
                  <p>{{ msg.text }}</p>
                  <span class="message-time">{{ msg.time }}</span>
                </div>
              </div>

              <!-- Typing/Processing Indicator -->
              <div v-if="isProcessing" class="message-bubble agent processing">
                <div class="message-content">
                  <div class="parsing-steps">
                    <div v-for="(step, idx) in processingSteps" :key="idx" class="step-item" :class="step.status">
                      <span class="step-dot"></span>
                      <span class="step-text">{{ step.text }}</span>
                    </div>
                  </div>
                  <div class="typing-loader">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Input Area -->
            <div class="chat-input-area">
              <div class="textarea-wrapper">
                <textarea 
                  v-model="rawListText" 
                  placeholder="Вставьте список товаров...&#10;Пример:&#10;осьминог бейби -5 пач&#10;мидии -2 кг&#10;бургер булочки -30 шт&#10;сыр гауда -2"
                  :disabled="isProcessing"
                  rows="10"
                ></textarea>
              </div>

              <div class="chat-actions">
                <button 
                  class="btn btn-secondary btn-process" 
                  @click="processList"
                  :disabled="isProcessing || !rawListText.trim()"
                >
                  <Zap v-if="!isProcessing" :size="18" />
                  <span v-else class="spinner"></span>
                  {{ isProcessing ? 'Распознавание...' : 'Распознать список' }}
                </button>
                <button 
                  class="btn-clear-text" 
                  @click="clearInput"
                  :disabled="isProcessing || !rawListText.trim()"
                >
                  Очистить всё
                </button>
              </div>
            </div>
          </div>

          <!-- Right Column: Matching Results Table -->
          <div class="results-card" v-motion-slide-right>
            <div class="card-header">
              <h2>Результаты сопоставления</h2>
              <span class="badge" v-if="parsedItems.length > 0">
                Распознано: {{ parsedItems.length }}
              </span>
            </div>

            <div class="card-body">
              <!-- Placeholder State -->
              <div v-if="parsedItems.length === 0 && !isProcessing" class="empty-state">
                <Bot :size="64" class="bot-icon" />
                <h3>Ассистент готов к работе</h3>
                <p>Введите или вставьте ваш список продуктов в текстовое поле слева, а затем нажмите кнопку «Распознать список».</p>
              </div>

              <!-- Loading State -->
              <div v-else-if="parsedItems.length === 0 && isProcessing" class="loading-state-results">
                <span class="loader"></span>
                <p>AI агент сопоставляет товары с каталогом продукции...</p>
              </div>

              <!-- Mapped List View -->
              <div v-else class="results-container">
                <div class="table-responsive">
                  <table class="results-table">
                    <thead>
                      <tr>
                        <th width="50" class="center-col"><input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll" /></th>
                        <th>Товар в Gastromir</th>
                        <th width="130" class="center-col">Кол-во</th>
                        <th width="135" class="right-col">Стоимость</th>
                        <th width="60" class="center-col"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in parsedItems" :key="item.id" :class="{ 'disabled-row': !item.enabled, 'active-row-z': item.isDropdownOpen || item.showSuggestions }">
                        <!-- Checkbox selection -->
                        <td class="selection-cell center-col" data-label="Выбрать">
                          <input type="checkbox" v-model="item.enabled" />
                        </td>

                        <!-- Matched Product Dropdown Selector / Manual Input -->
                        <td class="product-match-col" :class="{ 'active-dropdown-cell': item.isDropdownOpen || item.showSuggestions }" data-label="Товар в Gastromir">
                          <div class="match-inputs">
                            <div class="product-selector-wrapper">
                              <!-- Custom Select Dropdown -->
                              <div 
                                v-if="item.candidateProducts.length > 0 && !item.showSearchInput"
                                class="custom-select-container"
                              >
                                <div 
                                  class="custom-select-trigger" 
                                  @click.stop="toggleDropdown(item)"
                                  :class="{ 'opened': item.isDropdownOpen }"
                                >
                                  <div class="trigger-selected-info">
                                    <span class="trigger-name">{{ item.selectedProductName || 'Выберите товар...' }}</span>
                                    <span class="trigger-meta" v-if="item.matchedProduct">
                                      ({{ formatPrice(item.matchedProduct.price) }} ₸/{{ item.matchedProduct.unit }})
                                    </span>
                                  </div>
                                  <ChevronDown :size="16" class="arrow-icon" />
                                </div>

                                <div class="custom-select-dropdown" v-if="item.isDropdownOpen">
                                  <div 
                                    v-for="p in item.candidateProducts" 
                                    :key="p.id"
                                    class="custom-select-option"
                                    :class="{ 'selected': item.selectedProductName === p.name }"
                                    @click="selectCustomOption(item, p)"
                                  >
                                    <div class="option-details">
                                      <span class="option-name">{{ p.name }}</span>
                                      <div class="option-meta">
                                        <span class="option-price">{{ formatPrice(p.price) }} ₸ / {{ p.unit }}</span>
                                        <span class="option-category">{{ p.category }}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div class="custom-select-option search-trigger" @click="selectCustomOptionSearch(item)">
                                    <span class="option-name">🔍 Искать другой товар в каталоге...</span>
                                  </div>
                                </div>
                              </div>

                              <!-- Cross (X) button to reset select and open search input -->
                              <button 
                                v-if="item.candidateProducts.length > 0 && !item.showSearchInput"
                                @click="resetToSearch(item)"
                                class="btn-clear-search"
                                title="Ввести свой вариант"
                              >
                                <X :size="14" />
                              </button>

                              <!-- Manual Lookup Field with clear cross (X) button -->
                              <div v-if="item.showSearchInput || item.candidateProducts.length === 0" class="manual-input-row-wrapper">
                                <div class="manual-input-row">
                                  <input 
                                    type="text" 
                                    v-model="item.manualSearchQuery" 
                                    @input="onSearchInput(item)"
                                    @focus="item.showSuggestions = true"
                                    @change="onManualSearchChange(item)"
                                    placeholder="Введите название..."
                                    class="manual-search"
                                  />
                                  <button 
                                    @click="clearManualSearch(item)" 
                                    class="btn-clear-search"
                                    title="Очистить или закрыть поиск"
                                  >
                                    <X :size="14" />
                                  </button>
                                </div>
                                
                                <!-- Search Suggestions Dropdown -->
                                <div 
                                  class="search-suggestions-dropdown" 
                                  v-if="item.showSuggestions && getSearchSuggestions(item.manualSearchQuery).length > 0"
                                >
                                  <div 
                                    v-for="p in getSearchSuggestions(item.manualSearchQuery)" 
                                    :key="p.id"
                                    class="suggestion-option"
                                    @click="selectSuggestion(item, p)"
                                  >
                                    <span class="suggestion-name">{{ p.name }}</span>
                                    <div class="suggestion-meta">
                                      <span class="suggestion-price">{{ formatPrice(p.price) }} ₸ / {{ p.unit }}</span>
                                      <span class="suggestion-category">{{ p.category }}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <!-- Muted Subtitle showing Raw User Query and Match Status -->
                            <div class="raw-query-subtitle">
                              <span>Запрос: <strong>{{ item.raw }}</strong></span>
                              <span class="parsed-spec" v-if="item.extractedQty || item.extractedUnit">
                                ({{ item.extractedQty }} {{ item.extractedUnit }})
                              </span>
                              <span :class="['status-dot', item.status]" :title="getStatusText(item.status)"></span>
                            </div>
                            
                            <span v-if="item.matchedProduct" class="catalog-details">
                              Категория: {{ item.matchedProduct.category }} | Производитель: {{ item.matchedProduct.manufacturer }}
                            </span>
                          </div>
                        </td>

                        <!-- Quantity Selector -->
                        <td class="quantity-cell center-col" data-label="Кол-во">
                          <div class="quantity-control" v-if="item.matchedProduct">
                            <button @click="adjustQty(item, -1)" :disabled="item.quantity <= 1">-</button>
                            <input type="number" v-model.number="item.quantity" min="1" @change="validateQty(item)" />
                            <button @click="adjustQty(item, 1)">+</button>
                            <span class="item-unit">{{ item.matchedProduct.unit }}</span>
                          </div>
                          <span v-else class="text-muted">—</span>
                        </td>

                        <!-- Total Cost -->
                        <td class="price-col right-col" data-label="Стоимость">
                          <template v-if="item.matchedProduct">
                            <span class="total-item-price">{{ formatPrice(item.matchedProduct.price * item.quantity) }} ₸</span>
                            <span class="price-per-unit">{{ formatPrice(item.matchedProduct.price) }} ₸/{{ item.matchedProduct.unit }}</span>
                          </template>
                          <span v-else class="text-muted">—</span>
                        </td>

                        <!-- Action Column: Delete Row Trash Button -->
                        <td class="actions-cell center-col" data-label="Удалить">
                          <button @click="removeRow(item.id)" class="btn-row-delete" title="Удалить строку">
                            <Trash2 :size="16" />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Bottom Summary Section -->
                <div class="summary-section">
                  <div class="summary-details">
                    <div class="summary-row">
                      <span>Выбрано позиций:</span>
                      <strong>{{ enabledItemsCount }} из {{ parsedItems.length }}</strong>
                    </div>
                    <div class="summary-row total">
                      <span>Итоговая сумма:</span>
                      <strong>{{ formatPrice(totalPrice) }} ₸</strong>
                    </div>
                  </div>

                  <!-- Cart actions -->
                  <div class="action-buttons">
                    <button 
                      class="btn btn-primary" 
                      @click="addAllToCart" 
                      :disabled="enabledItemsCount === 0"
                    >
                      <ShoppingCart :size="20" /> Добавить в корзину
                    </button>
                    <button 
                      class="btn btn-secondary" 
                      @click="instantCheckout" 
                      :disabled="enabledItemsCount === 0"
                    >
                      <Zap :size="20" /> Оформить заказ в 1 клик
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { Sparkles, Trash2, Zap, Bot, ShoppingCart, X, ChevronDown } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import { useAuthStore } from '@/stores/auth'
import localProductsFallback from '@/data/products.json'

const cartStore = useCartStore()
const toastStore = useToastStore()
const authStore = useAuthStore()

const rawListText = ref('')
const isProcessing = ref(false)
const parsedItems = ref([])
const products = ref([])
const chatMessagesRef = ref(null)
const processingSteps = ref([])



const chatHistory = ref([
  {
    id: 1,
    sender: 'agent',
    text: 'Приветствую! Я Gastromir AI Агент по закупкам. Вставьте список продуктов, которые вам нужны. Я автоматически разберу строки, распознаю количество и найду совпадения в каталоге товаров.',
    time: formatTime(new Date())
  }
])

const fetchProducts = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`)
    if (response.ok) {
      products.value = await response.json()
    } else {
      products.value = localProductsFallback
    }
  } catch (err) {
    console.error('Failed to fetch catalog from database, using local fallback:', err)
    products.value = localProductsFallback
  }
}

onMounted(() => {
  fetchProducts()
  window.addEventListener('click', closeAllDropdowns)
})

onUnmounted(() => {
  window.removeEventListener('click', closeAllDropdowns)
})

function closeAllDropdowns(e) {
  if (!e.target.closest('.custom-select-container') && !e.target.closest('.manual-input-row-wrapper')) {
    parsedItems.value.forEach(item => {
      item.isDropdownOpen = false
      item.showSuggestions = false
    })
  }
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}



function clearInput() {
  rawListText.value = ''
  parsedItems.value = []
}

// Russian fuzzy search mapping
const ALIASES = {
  'осьминог': 'осьминоги baby бейби',
  'ббк': 'bbq барбекю',
  'ббк соус': 'соус bbq барбекю',
  'фетв': 'фета фетакса сиртаки фету',
  'кур': 'куриное курица филе цыпленок цыпленка курин куринный',
  'дрожь': 'дрожжи',
  'аригано': 'орегано оригано',
  'картошка': 'картофель картошка',
  'помидор': 'помидоры томаты томатная томат соус',
  'лук': 'лук репчатый',
  'зелень': 'зелень укроп петрушка кинза базилик',
  'укроп': 'зелень укроп',
  'базилик': 'зелень базилик',
  'романо': 'салат романо',
  'айсберг': 'салат айсберг',
  'индейка': 'индейки индейка филе',
  'сыр гауда': 'гауда сыр',
  'пицца соус': 'соус томатный пиццы пицца',
  'сырные палочки': 'сырные палочки полуфабрикаты',
  'кольца кальмара': 'кольца кальмара кальмары панировке',
  'луковые кольца': 'луковые кольца панировке',
  'креветки тигровые': 'креветки тигровые морепродукты'
}

function normalizeString(str) {
  if (!str) return ''
  return str
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^a-zа-я0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Fuzzy matching engine returning multiple product matches
function findMatchingProducts(query) {
  const normQuery = normalizeString(query)
  if (!normQuery) return []
  
  const queryTokens = normQuery.split(' ').filter(t => t.length > 1)
  if (queryTokens.length === 0) {
    queryTokens.push(normQuery)
  }
  
  const matches = []
  
  for (const product of products.value) {
    const normName = normalizeString(product.name)
    const normCategory = normalizeString(product.category)
    const productTokens = normName.split(' ')
    
    let matchScore = 0
    let matchedTokenCount = 0
    
    for (const qToken of queryTokens) {
      let tokenMatched = false
      
      // 1. Direct or substring matching
      for (const pToken of productTokens) {
        if (pToken === qToken) {
          matchScore += 1.0
          matchedTokenCount++
          tokenMatched = true
          break
        } else if (pToken.length > 2 && qToken.length > 2) {
          if (pToken.startsWith(qToken) || qToken.startsWith(pToken)) {
            matchScore += 0.8
            matchedTokenCount++
            tokenMatched = true
            break
          } else if (pToken.includes(qToken) || qToken.includes(pToken)) {
            matchScore += 0.5
            matchedTokenCount++
            tokenMatched = true
            break
          }
        }
      }
      
      // 2. Check aliases if token not matched
      if (!tokenMatched) {
        for (const [key, aliasVal] of Object.entries(ALIASES)) {
          const normKey = normalizeString(key)
          if (normKey.includes(qToken) || qToken.includes(normKey)) {
            const aliasWords = aliasVal.split(' ')
            for (const aWord of aliasWords) {
              for (const pToken of productTokens) {
                if (pToken === aWord) {
                  matchScore += 0.75
                  matchedTokenCount++
                  tokenMatched = true
                  break
                } else if (pToken.length > 2 && aWord.length > 2) {
                  if (pToken.startsWith(aWord) || aWord.startsWith(pToken)) {
                    matchScore += 0.75
                    matchedTokenCount++
                    tokenMatched = true
                    break
                  }
                }
              }
              if (tokenMatched) break
            }
          }
          if (tokenMatched) break
        }
      }
    }
    
    if (matchedTokenCount > 0) {
      let score = matchScore / queryTokens.length
      
      // Exact substring match bonus
      if (normName.includes(normQuery)) {
        score += 0.25
      }
      
      // Category match bonus
      for (const qToken of queryTokens) {
        if (normCategory.includes(qToken)) {
          score += 0.1
          break
        }
      }
      
      score = Math.min(score, 1.2)
      
      if (score >= 0.15) {
        matches.push({ product, score })
      }
    }
  }
  
  matches.sort((a, b) => b.score - a.score)
  return matches.map(m => m.product)
}

const processList = async () => {
  if (!rawListText.value.trim()) return

  isProcessing.value = true
  parsedItems.value = []
  
  chatHistory.value.push({
    id: Date.now() + 1,
    sender: 'user',
    text: `Распознай список покупок:\n${rawListText.value.substring(0, 150)}${rawListText.value.length > 150 ? '...' : ''}`,
    time: formatTime(new Date())
  })
  
  scrollToBottom()

  processingSteps.value = [
    { text: 'Разбиение текста на строки и очистка пробелов...', status: 'running' },
    { text: 'Определение количества и единиц (кг, шт, пач)...', status: 'pending' },
    { text: 'Интеллектуальный поиск совпадений в прайс-листе...', status: 'pending' }
  ]

  await delay(500)
  processingSteps.value[0].status = 'done'
  processingSteps.value[1].status = 'running'

  const lines = rawListText.value.split('\n')
  const results = []

  await delay(600)
  processingSteps.value[1].status = 'done'
  processingSteps.value[2].status = 'running'

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i].trim()
    if (!rawLine) continue

    const qtyMatch = rawLine.match(/[-—\s]+(\d+([.,]\d+)?)\s*(кг|гр|грамм|г|шт|пач|пачек|пачки|уп|уп\.|коробка|кор|мешок|ящик|качан|качана|качанов|бутылка|бут|пакет|пак)?\b/i)

    let query = rawLine
    let quantity = 1
    let unit = 'шт'

    if (qtyMatch) {
      const fullMatch = qtyMatch[0]
      quantity = parseFloat(qtyMatch[1].replace(',', '.'))
      unit = qtyMatch[3] || 'шт'
      const matchIndex = rawLine.lastIndexOf(fullMatch)
      if (matchIndex !== -1) {
        query = rawLine.substring(0, matchIndex).trim()
      }
    } else {
      const unitMatch = rawLine.match(/\s+(мешок|ящик|коробка|пачка|уп|качан)\b/i)
      if (unitMatch) {
        const fullMatch = unitMatch[0]
        quantity = 1
        unit = unitMatch[1]
        const matchIndex = rawLine.lastIndexOf(fullMatch)
        if (matchIndex !== -1) {
          query = rawLine.substring(0, matchIndex).trim()
        }
      }
    }

    query = query.replace(/^[-—\s*,.]+/, '').replace(/[-—\s*,.]+$/, '').trim()

    const matches = findMatchingProducts(query)
    
    let status = 'not_found'
    let matchedProduct = null
    
    if (matches.length === 1) {
      status = 'exact'
      matchedProduct = matches[0]
    } else if (matches.length > 1) {
      status = 'partial'
      matchedProduct = matches[0]
    }

    results.push({
      id: i + 1,
      raw: rawLine,
      query,
      extractedQty: quantity,
      extractedUnit: unit,
      quantity,
      candidateProducts: matches.slice(0, 5), // top 5 choices
      matchedProduct,
      selectedProductName: matchedProduct ? matchedProduct.name : '',
      manualSearchQuery: '',
      showSearchInput: false,
      isDropdownOpen: false,
      status,
      enabled: status !== 'not_found'
    })
  }

  await delay(800)
  processingSteps.value[2].status = 'done'

  parsedItems.value = results
  isProcessing.value = false

  const exactCount = results.filter(r => r.status === 'exact').length
  const partialCount = results.filter(r => r.status === 'partial').length
  const notFoundCount = results.filter(r => r.status === 'not_found').length

  chatHistory.value.push({
    id: Date.now() + 2,
    sender: 'agent',
    text: `Готово! Обработано ${results.length} строк.\n• Точных совпадений: ${exactCount}\n• Частичных (варианты): ${partialCount}\n• Не найдено: ${notFoundCount}\n\nПроверьте результаты в таблице справа, выберите нужные товары и нажмите «Добавить в корзину».`,
    time: formatTime(new Date())
  })

  scrollToBottom()
  toastStore.success('Список успешно распознан!')
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function scrollToBottom() {
  nextTick(() => {
    if (chatMessagesRef.value) {
      chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
    }
  })
}

// Product Selector Helpers
function toggleDropdown(item) {
  const currentState = item.isDropdownOpen
  parsedItems.value.forEach(x => {
    x.isDropdownOpen = false
  })
  item.isDropdownOpen = !currentState
}

function selectCustomOption(item, product) {
  item.selectedProductName = product.name
  item.matchedProduct = product
  item.status = 'exact'
  item.enabled = true
  item.isDropdownOpen = false
}

function selectCustomOptionSearch(item) {
  item.showSearchInput = true
  item.matchedProduct = null
  item.status = 'not_found'
  item.enabled = false
  item.isDropdownOpen = false
}

function onManualSearchChange(item) {
  const found = products.value.find(p => p.name === item.manualSearchQuery)
  if (found) {
    item.matchedProduct = found
    item.selectedProductName = found.name
    item.status = 'exact'
    item.enabled = true
    item.showSearchInput = false
    item.showSuggestions = false
    
    if (!item.candidateProducts.some(p => p.id === found.id)) {
      item.candidateProducts.unshift(found)
    }
  } else {
    item.matchedProduct = null
    item.status = 'not_found'
    item.enabled = false
  }
}

function getSearchSuggestions(query) {
  if (!query || query.trim().length < 2) return []
  const normQuery = normalizeString(query)
  
  const matches = []
  for (const product of products.value) {
    const normName = normalizeString(product.name)
    if (normName.includes(normQuery)) {
      let score = 0
      if (normName.startsWith(normQuery)) {
        score += 2
      } else {
        score += 1
      }
      matches.push({ product, score })
    }
  }
  
  matches.sort((a, b) => b.score - a.score)
  return matches.map(m => m.product).slice(0, 8)
}

function onSearchInput(item) {
  item.showSuggestions = true
}

function selectSuggestion(item, product) {
  item.matchedProduct = product
  item.selectedProductName = product.name
  item.manualSearchQuery = product.name
  item.status = 'exact'
  item.enabled = true
  item.showSearchInput = false
  item.showSuggestions = false
  
  if (!item.candidateProducts.some(p => p.id === product.id)) {
    item.candidateProducts.unshift(product)
  }
}

function clearManualSearch(item) {
  if (item.manualSearchQuery) {
    item.manualSearchQuery = ''
  } else {
    item.showSearchInput = false
    if (item.candidateProducts.length > 0) {
      item.matchedProduct = item.candidateProducts[0]
      item.selectedProductName = item.candidateProducts[0].name
      item.status = 'partial'
      item.enabled = true
    } else {
      item.status = 'not_found'
      item.enabled = false
    }
  }
}

function resetToSearch(item) {
  item.showSearchInput = true
  item.selectedProductName = ''
  item.manualSearchQuery = ''
  item.matchedProduct = null
  item.status = 'not_found'
  item.enabled = false
}

function removeRow(id) {
  parsedItems.value = parsedItems.value.filter(item => item.id !== id)
  toastStore.info('Строка удалена из списка')
}

function adjustQty(item, delta) {
  item.quantity += delta
  if (item.quantity < 1) item.quantity = 1
}

function validateQty(item) {
  if (typeof item.quantity !== 'number' || item.quantity < 1) {
    item.quantity = 1
  }
}

// Selection computations
const isAllSelected = computed(() => {
  return parsedItems.value.length > 0 && parsedItems.value.every(item => item.enabled)
})

function toggleSelectAll() {
  const targetState = !isAllSelected.value
  parsedItems.value.forEach(item => {
    item.enabled = targetState
  })
}

const enabledItemsCount = computed(() => {
  return parsedItems.value.filter(item => item.enabled && item.matchedProduct).length
})

const totalPrice = computed(() => {
  return parsedItems.value.reduce((sum, item) => {
    if (item.enabled && item.matchedProduct) {
      return sum + (item.matchedProduct.price * item.quantity)
    }
    return sum
  }, 0)
})

function getStatusText(status) {
  if (status === 'exact') return 'Точно'
  if (status === 'partial') return 'Варианты'
  return 'Не найдено'
}

function formatPrice(price) {
  return new Intl.NumberFormat('ru-RU').format(price)
}

// Cart additions
function addAllToCart() {
  cartStore.clearCart()
  let addedCount = 0
  parsedItems.value.forEach(item => {
    if (item.enabled && item.matchedProduct) {
      cartStore.items.push({
        ...item.matchedProduct,
        quantity: item.quantity
      })
      addedCount++
    }
  })

  if (addedCount > 0) {
    toastStore.success(`Добавлено ${addedCount} товаров в корзину!`)
    cartStore.openModal()
  } else {
    toastStore.warning('Нет выбранных товаров для добавления')
  }
}

async function instantCheckout() {
  if (enabledItemsCount.value === 0) {
    toastStore.warning('Сначала сопоставьте и выберите хотя бы один товар')
    return
  }

  if (authStore.user && totalPrice.value > authStore.user.order_limit) {
    toastStore.error(`Лимит кредитования превышен. Максимально допустимая сумма: ${formatPrice(authStore.user.order_limit)} ₸`)
    return
  }

  cartStore.clearCart()
  parsedItems.value.forEach(item => {
    if (item.enabled && item.matchedProduct) {
      cartStore.items.push({
        ...item.matchedProduct,
        quantity: item.quantity
      })
    }
  })

  cartStore.openModal()
  toastStore.success('Корзина заполнена! Подтвердите оформление в форме справа.')
}
</script>

<style scoped>
.ai-order-page {
  background-color: var(--light);
  min-height: 100vh;
}

.page-header {
  background: linear-gradient(135deg, #0B1221 0%, #1E293B 100%);
  color: var(--white);
  padding-top: 60px;
  padding-bottom: 50px;
  text-align: center;
}

.page-header h1 span {
  display: inline-block;
}

.container-wide {
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  padding: 0 2rem;
}

.ai-content {
  padding-top: 3rem;
  padding-bottom: 6rem;
}

.ai-grid {
  display: grid;
  grid-template-columns: 1fr 1.7fr;
  gap: 2rem;
  align-items: start;
}

@media (max-width: 1100px) {
  .ai-grid {
    grid-template-columns: 1fr;
  }
}

/* Chat Card Styling */
.chat-card {
  background: var(--white);
  border-radius: 1.5rem;
  box-shadow: var(--shadow);
  border: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  height: 650px;
  overflow: hidden;
}

.chat-header {
  padding: 1.25rem 1.5rem;
  background: #0B1221;
  color: var(--white);
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.agent-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--gradient-orange);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.4);
}

.agent-info h3 {
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0;
}

.status-indicator {
  font-size: 0.8rem;
  color: #10B981;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.status-indicator::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #10B981;
}

.chat-messages {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.message-bubble {
  max-width: 85%;
  display: flex;
}

.message-bubble.agent {
  align-self: flex-start;
}

.message-bubble.user {
  align-self: flex-end;
}

.message-content {
  padding: 1rem 1.25rem;
  border-radius: 1.25rem;
  font-size: 0.95rem;
  line-height: 1.5;
  position: relative;
  box-shadow: 0 2px 6px rgba(0,0,0,0.02);
}

.agent .message-content {
  background: var(--white);
  color: var(--primary);
  border-bottom-left-radius: 0.25rem;
  border: 1px solid #e2e8f0;
}

.user .message-content {
  background: var(--primary);
  color: var(--white);
  border-bottom-right-radius: 0.25rem;
  white-space: pre-wrap;
}

.message-time {
  font-size: 0.75rem;
  color: var(--gray);
  margin-top: 0.5rem;
  display: block;
  text-align: right;
}

.user .message-time {
  color: rgba(255,255,255,0.6);
}

/* Chat Input Styling */
.chat-input-area {
  padding: 1.25rem;
  background: var(--white);
  border-top: 1px solid #f1f5f9;
}

.textarea-wrapper {
  position: relative;
  margin-bottom: 1rem;
}

.chat-input-area textarea {
  width: 100%;
  padding: 1rem;
  border-radius: 1rem;
  border: 1.5px solid #cbd5e1;
  resize: none;
  font-family: inherit;
  font-size: 0.95rem;
  outline: none;
  transition: var(--transition);
  background: #f8fafc;
}

.chat-input-area textarea:focus {
  border-color: var(--secondary);
  background: var(--white);
  box-shadow: 0 0 10px rgba(245,158,11,0.08);
}

.chat-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-process {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1rem;
  padding: 0.85rem;
}

.btn-clear-text {
  padding: 0.85rem 1.5rem;
  border-radius: 0.75rem;
  border: 1.5px solid #e2e8f0;
  color: var(--gray);
  background: var(--white);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.btn-clear-text:hover:not(:disabled) {
  background: #fecaca;
  color: #ef4444;
  border-color: #fca5a5;
}

/* Typing animation & steps */
.typing-loader {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 1rem;
}

.typing-loader span {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: var(--gray);
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out both;
}

.typing-loader span:nth-child(1) { animation-delay: -0.32s; }
.typing-loader span:nth-child(2) { animation-delay: -0.16s; }

@keyframes typing {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.parsing-steps {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  border-left: 2px solid #e2e8f0;
  padding-left: 1rem;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: var(--transition);
}

.step-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #cbd5e1;
}

.step-item.done { color: #10B981; }
.step-item.done .step-dot { background: #10B981; }
.step-item.running { color: var(--secondary-dark); font-weight: 600; }
.step-item.running .step-dot { 
  background: var(--secondary); 
  animation: pulse-dot 1s infinite alternate; 
}
.step-item.pending { color: var(--gray); opacity: 0.5; }

@keyframes pulse-dot {
  from { transform: scale(1); opacity: 0.5; }
  to { transform: scale(1.5); opacity: 1; }
}

/* Results Card Styling */
.results-card {
  background: var(--white);
  border-radius: 1.5rem;
  box-shadow: var(--shadow);
  border: 1px solid #f1f5f9;
  min-height: 650px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  font-size: 1.3rem;
  color: var(--primary);
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.empty-state {
  margin: auto;
  text-align: center;
  padding: 3rem;
  color: var(--gray);
  max-width: 400px;
}

.bot-icon {
  color: var(--secondary);
  opacity: 0.7;
  margin-bottom: 1.5rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.empty-state h3 {
  color: var(--primary);
  margin-bottom: 0.75rem;
}

.empty-state p {
  font-size: 0.9rem;
  line-height: 1.5;
}

.loading-state-results {
  margin: auto;
  text-align: center;
  color: var(--gray);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loader {
  width: 40px;
  height: 40px;
  border: 4px solid #f1f5f9;
  border-bottom-color: var(--secondary);
  border-radius: 50%;
  animation: rotation 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes rotation {
  to { transform: rotate(360deg); }
}

/* Table layout and alignments */
.results-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
}

.table-responsive {
  max-height: 450px;
  overflow-y: auto;
  border-bottom: 1px solid #f1f5f9;
}

.results-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  text-align: left;
  font-size: 0.85rem;
  table-layout: fixed;
}

.results-table tr {
  position: relative;
  z-index: 1;
}

.results-table tr.active-row-z {
  z-index: 50 !important;
}

.results-table th,
.results-table td {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.results-table th {
  background-color: #f8fafc;
  color: var(--primary);
  font-weight: 700;
  position: sticky;
  top: 0;
  z-index: 120;
  font-size: 0.9rem;
}

/* Horizontal alignment helpers */
.center-col {
  text-align: center;
}

.right-col {
  text-align: right;
}

.row-actions-box {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  justify-content: center;
}

.btn-row-delete {
  background: none;
  border: none;
  color: var(--gray);
  opacity: 0.5;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.btn-row-delete:hover {
  color: #ef4444;
  opacity: 1;
  transform: scale(1.15);
}

.disabled-row {
  background-color: #fafbfd;
}

.disabled-row td:not(.product-match-col) {
  opacity: 0.6;
}

.disabled-row .raw-query-subtitle,
.disabled-row .catalog-details {
  opacity: 0.6;
}

.disabled-row .custom-select-trigger:not(.opened) {
  opacity: 0.75;
}

.disabled-row .manual-search:not(:focus) {
  opacity: 0.75;
}

.user-text-col {
  display: flex;
  flex-direction: column;
}

.raw-text {
  font-weight: 600;
  color: var(--primary);
}

.parsed-spec {
  font-size: 0.75rem;
  color: var(--gray);
}

.match-status-badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 2rem;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  text-align: center;
  width: 90px;
}

.match-status-badge.exact {
  background: #DEF7EC;
  color: #03543F;
}

.match-status-badge.partial {
  background: #FEF3C7;
  color: #92400E;
}

.match-status-badge.not_found {
  background: #FDE8E8;
  color: #9B1C1C;
}

.product-match-col {
  min-width: 150px;
  position: relative;
  z-index: 1;
}

.product-match-col.active-dropdown-cell {
  z-index: 50 !important;
}

.match-inputs {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.product-selector-wrapper {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  width: 100%;
  min-width: 0;
}

.custom-select-container {
  position: relative;
  flex: 1;
  min-width: 0;
}

.custom-select-trigger {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 38px;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1.5px solid #cbd5e1;
  font-size: 0.85rem;
  background: #ffffff;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0,0,0,0.02);
  transition: var(--transition);
  user-select: none;
  min-width: 0;
}

.custom-select-trigger:hover {
  border-color: var(--secondary);
}

.custom-select-trigger.opened {
  border-color: var(--secondary);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
}

.trigger-selected-info {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
}

.trigger-name {
  color: var(--primary);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
}

.trigger-meta {
  font-size: 0.75rem;
  color: var(--gray);
  flex-shrink: 0;
}

.arrow-icon {
  color: var(--gray);
  transition: transform 0.2s ease;
  flex-shrink: 0;
  margin-left: 0.25rem;
}

.custom-select-trigger.opened .arrow-icon {
  transform: rotate(180deg);
}

/* Custom Dropdown List */
.custom-select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.03);
  margin-top: 0.35rem;
  max-height: 240px;
  overflow-y: auto;
  z-index: 100;
}

.custom-select-option {
  padding: 0.65rem 0.85rem;
  cursor: pointer;
  transition: background 0.15s ease;
  border-bottom: 1px solid #f1f5f9;
  text-align: left;
}

.custom-select-option:last-child {
  border-bottom: none;
}

.custom-select-option:hover {
  background-color: #f8fafc;
}

.custom-select-option.selected {
  background-color: rgba(245, 158, 11, 0.05);
}

.custom-select-option.selected .option-name {
  color: var(--secondary-dark);
  font-weight: 600;
}

.option-details {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.option-name {
  font-size: 0.85rem;
  color: var(--primary);
  line-height: 1.3;
}

.option-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--gray);
  margin-top: 0.15rem;
}

.option-price {
  font-weight: 600;
}

.option-category {
  font-style: italic;
  opacity: 0.85;
}

.search-trigger {
  background-color: #f8fafc;
  color: var(--primary);
  font-weight: 500;
}

.search-trigger:hover {
  background-color: #f1f5f9;
  color: var(--secondary-dark);
}

.manual-input-row {
  display: flex;
  gap: 0.5rem;
  width: 100%;
  min-width: 0;
}

.manual-search {
  flex: 1;
  height: 38px;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1.5px solid #cbd5e1;
  font-size: 0.85rem;
  outline: none;
  background: #ffffff;
  transition: var(--transition);
  min-width: 0;
}

.manual-search:focus {
  border-color: var(--secondary);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
}

.btn-clear-search {
  background: #f1f5f9;
  border: 1.5px solid #e2e8f0;
  color: var(--primary);
  border-radius: 0.5rem;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  flex-shrink: 0;
}

.btn-clear-search:hover {
  background: #fecaca;
  border-color: #fca5a5;
  color: #ef4444;
}

.raw-query-subtitle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--gray);
  margin-top: 0.25rem;
}

.raw-query-subtitle strong {
  color: var(--primary);
  font-weight: 500;
}

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-dot.exact {
  background-color: #10B981;
  box-shadow: 0 0 6px #10B981;
}

.status-dot.partial {
  background-color: #F59E0B;
  box-shadow: 0 0 6px #F59E0B;
}

.status-dot.not_found {
  background-color: #EF4444;
  box-shadow: 0 0 6px #EF4444;
}

.catalog-details {
  display: block;
  font-size: 0.7rem;
  color: var(--gray);
  margin-top: 0.15rem;
}

/* Quantity manipulation */
.quantity-control {
  display: flex;
  align-items: center;
  background: #f1f5f9;
  border-radius: 9999px;
  padding: 0.2rem;
  width: fit-content;
  margin: 0 auto;
}

.quantity-control button {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.8rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.quantity-control button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-control input {
  width: 45px;
  text-align: center;
  font-weight: 600;
  background: none;
  border: none;
  font-size: 0.85rem;
  outline: none;
  -moz-appearance: textfield;
}

.quantity-control input::-webkit-outer-spin-button,
.quantity-control input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.item-unit {
  font-size: 0.75rem;
  color: var(--gray);
  margin-right: 0.5rem;
  margin-left: 0.25rem;
}

.price-col {
  min-width: 120px;
}

.total-item-price {
  font-weight: 700;
  color: var(--primary);
  font-size: 0.95rem;
  display: block;
}

.price-per-unit {
  font-size: 0.7rem;
  color: var(--gray);
  display: block;
}

/* Bottom summary section */
.summary-section {
  padding: 1.5rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.summary-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  color: var(--gray);
  font-size: 0.95rem;
}

.summary-row.total {
  font-size: 1.2rem;
  color: var(--primary);
  border-top: 1px dashed #cbd5e1;
  padding-top: 0.75rem;
  margin-top: 0.25rem;
}

.summary-row.total strong {
  color: var(--secondary-dark);
  font-size: 1.35rem;
}

.limit-status-card {
  background: var(--white);
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 1.25rem;
}

.limit-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  color: var(--primary);
}

.limit-progress-bar {
  height: 6px;
  background-color: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #10B981;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-fill.exceeded {
  background-color: #ef4444;
}

.limit-warning {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  font-weight: 500;
  line-height: 1.3;
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

.action-buttons button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.85rem;
  border-radius: 9999px;
  font-weight: 700;
}

/* Spinner */
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-bottom-color: currentColor;
  border-radius: 50%;
  display: inline-block;
  animation: rotation 0.8s linear infinite;
}

/* Blink Glow */
.blink-text {
  display: inline-block;
  animation: glow-pulse-hero 1.6s infinite ease-in-out;
  font-weight: 800;
  padding: 0 4px;
}

.results-table thead tr {
  z-index: inherit;
}

@keyframes glow-pulse-hero {
  0% {
    color: var(--secondary);
    text-shadow: 0 0 4px rgba(245, 158, 11, 0.4);
  }
  50% {
    color: #fbbf24;
    text-shadow: 0 0 15px rgba(245, 158, 11, 0.8), 0 0 25px rgba(245, 158, 11, 0.5);
    transform: scale(1.03);
  }
  100% {
    color: var(--secondary);
    text-shadow: 0 0 4px rgba(245, 158, 11, 0.4);
  }
}

.text-muted {
  color: var(--gray);
  opacity: 0.6;
}

/* Mobile Responsiveness & Layout Refinement (Card Layout) */
@media (max-width: 768px) {
  .results-table thead {
    display: none;
  }
  
  .results-table, 
  .results-table tbody, 
  .results-table tr, 
  .results-table td {
    display: block;
    width: 100%;
  }
  
  .results-table tr {
    background: var(--white);
    border: 1px solid #e2e8f0;
    border-radius: 1.25rem;
    padding: 1.25rem;
    margin-bottom: 1.25rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
    transition: var(--transition);
  }

  .results-table tr:hover {
    border-color: var(--secondary);
  }
  
  .results-table td {
    border-bottom: none;
    padding: 0.5rem 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left !important;
  }
  
  .results-table td::before {
    content: attr(data-label);
    font-weight: 700;
    color: var(--primary);
    font-size: 0.8rem;
    flex-shrink: 0;
    width: 35%;
  }

  .product-match-col {
    min-width: unset;
  }

  .product-match-col .match-inputs {
    flex-grow: 1;
    max-width: 65%;
  }

  .quantity-control {
    margin: 0 0 0 auto;
  }

  .price-col {
    min-width: unset;
    flex-direction: row;
    justify-content: flex-end;
    align-items: baseline;
    gap: 0.5rem;
  }

  .price-col .total-item-price {
    display: inline;
  }

  .price-col .price-per-unit {
    display: inline;
  }
}

.manual-input-row-wrapper {
  position: relative;
  flex: 1;
  min-width: 0;
}

.search-suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.03);
  margin-top: 0.35rem;
  max-height: 220px;
  overflow-y: auto;
  z-index: 110;
}

.suggestion-option {
  padding: 0.65rem 0.85rem;
  cursor: pointer;
  transition: background 0.15s ease;
  border-bottom: 1px solid #f1f5f9;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.suggestion-option:last-child {
  border-bottom: none;
}

.suggestion-option:hover {
  background-color: #f8fafc;
}

.suggestion-name {
  font-size: 0.85rem;
  color: var(--primary);
  line-height: 1.3;
  font-weight: 500;
}

.suggestion-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--gray);
  margin-top: 0.15rem;
}

.suggestion-price {
  font-weight: 600;
}

.suggestion-category {
  font-style: italic;
  opacity: 0.85;
}
</style>
