<template>
  <div class="admin-page">
    <section class="admin-header section-padding">
      <div class="container header-container admin-container">
        <div class="admin-profile" v-motion-slide-visible-once-bottom>
          <div class="shield-glow">
            <ShieldCheck :size="48" />
          </div>
          <div>
            <h1>Панель управления</h1>
            <p>Добро пожаловать в админ-панель GASTROMIR. Управляйте ценами, лимитами и накладными.</p>
          </div>
        </div>

        <div class="admin-tabs" v-motion-slide-visible-once-bottom>
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
            class="tab-btn"
          >
            <component :is="tab.icon" :size="18" /> {{ tab.name }}
          </button>
        </div>
      </div>
    </section>

    <section class="admin-content section-padding">
      <div class="container admin-container">
        <!-- Tab 1: Restaurants Management -->
        <div v-if="activeTab === 'restaurants'" class="tab-pane animate-fade">
          <div class="card-header">
            <h2>Зарегистрированные рестораны</h2>
            <p>Управляйте лимитами заказов и доступами для каждого ресторана</p>
          </div>

          <div v-if="loadingUsers" class="loading-state">
            <span class="loader"></span>
            <p>Загрузка списка ресторанов...</p>
          </div>

          <div v-else-if="restaurants.length === 0" class="empty-state">
            <Users :size="48" />
            <p>Нет зарегистрированных ресторанов</p>
          </div>

          <div v-else class="table-responsive">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Имя / Название</th>
                  <th>Электронная почта</th>
                  <th>Дата регистрации</th>
                  <th style="width: 220px;">Лимит на заказ (₸)</th>
                  <th style="width: 180px;">Скидка (%)</th>
                  <th style="text-align: right;">Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="res in restaurants" :key="res.id">
                  <td data-label="Ресторан" class="font-bold">{{ res.name }}</td>
                  <td data-label="Email">{{ res.email }}</td>
                  <td data-label="Регистрация">{{ formatDate(res.created_at) }}</td>
                  <td data-label="Лимит на заказ">
                    <div class="limit-edit-wrapper">
                      <input 
                        type="number" 
                        v-model.number="res.order_limit" 
                        class="limit-input"
                        placeholder="Лимит"
                      />
                      <button @click="updateLimit(res.id, res.order_limit)" class="btn-save-limit" title="Сохранить лимит">
                        <Check :size="16" />
                      </button>
                    </div>
                  </td>
                  <td data-label="Скидка (%)">
                    <div class="limit-edit-wrapper">
                      <input 
                        type="number" 
                        min="0"
                        max="100"
                        v-model.number="res.discount" 
                        class="limit-input"
                        placeholder="Скидка %"
                      />
                      <button @click="updateDiscount(res.id, res.discount)" class="btn-save-limit" title="Сохранить скидку">
                        <Check :size="16" />
                      </button>
                    </div>
                  </td>
                  <td data-label="Действия" style="text-align: right;">
                    <button @click="deleteRestaurant(res.id, res.name)" class="btn-delete" title="Удалить ресторан">
                      <Trash2 :size="18" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tab 4: Mutual Settlements (Взаиморасчеты) -->
        <div v-if="activeTab === 'debts'" class="tab-pane animate-fade">
          <div class="price-header-row" style="margin-bottom: 2rem; align-items: flex-start;">
            <div class="card-header" style="margin-bottom: 0;">
              <h2>Взаиморасчеты (дебиторская задолженность)</h2>
              <p>Управляйте отгрузками, оплатами и просроченной задолженностью ресторанов</p>
            </div>
            <div class="search-filters-box debts-actions-box" style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <button @click="showRecordPaymentModal = true" class="btn btn-secondary" style="background-color: var(--primary); border-color: var(--primary); display: flex; align-items: center; gap: 0.5rem; color: #fff;">
                <Plus :size="18" /> Внести оплату
              </button>
              <button @click="exportToCSV" class="btn btn-secondary" style="background-color: #10b981; border-color: #10b981; display: flex; align-items: center; gap: 0.5rem; color: #fff;">
                <FileText :size="18" /> Экспорт в Excel (CSV)
              </button>
              <button @click="generateDebtsPDF" class="btn btn-primary" :disabled="isGeneratingDebtsPDF" style="display: flex; align-items: center; gap: 0.5rem;">
                <Download :size="18" /> {{ isGeneratingDebtsPDF ? 'Генерация...' : 'Скачать PDF отчет' }}
              </button>
            </div>
          </div>

          <div v-if="loadingUsers" class="loading-state">
            <span class="loader"></span>
            <p>Загрузка данных взаиморасчетов...</p>
          </div>

          <div v-else-if="restaurants.length === 0" class="empty-state">
            <Users :size="48" />
            <p>Нет зарегистрированных ресторанов</p>
          </div>

          <div v-else>
            <div class="table-responsive">
              <table class="admin-table debts-table">
                <thead>
                  <tr>
                    <th>Покупатель</th>
                    <th style="width: 200px;">Отгружено, ₸</th>
                    <th style="width: 200px;">Оплачено, ₸</th>
                    <th>Текущая задолженность, ₸</th>
                    <th style="width: 200px;">Просроченная задолженность, ₸</th>
                    <th style="text-align: right; width: 100px;">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="res in restaurants" :key="res.id">
                    <td data-label="Покупатель" class="font-bold">{{ res.name }}</td>
                    
                    <td data-label="Отгружено, ₸">
                      <div class="limit-edit-wrapper">
                        <input 
                          type="number" 
                          v-model.number="res.shipped_amount" 
                          class="limit-input"
                          placeholder="0"
                        />
                      </div>
                    </td>
                    
                    <td data-label="Оплачено, ₸">
                      <div class="limit-edit-wrapper">
                        <input 
                          type="number" 
                          v-model.number="res.paid_amount" 
                          class="limit-input"
                          placeholder="0"
                        />
                      </div>
                    </td>
                    
                    <td data-label="Текущая задолженность, ₸" class="font-bold" :class="{ 'text-danger': (res.shipped_amount - res.paid_amount) > 0 }">
                      {{ formatPrice(res.shipped_amount - res.paid_amount) }} ₸
                    </td>
                    
                    <td data-label="Просроченная задолженность, ₸">
                      <div class="limit-edit-wrapper">
                        <input 
                          type="number" 
                          v-model.number="res.overdue_amount" 
                          class="limit-input"
                          placeholder="0"
                        />
                      </div>
                    </td>
                    
                    <td data-label="Действия" style="text-align: right;">
                      <div style="display: flex; gap: 0.5rem; justify-content: flex-end; align-items: center;">
                        <button 
                          @click="openPaymentsHistory(res)" 
                          class="btn-edit-row" 
                          title="История платежей"
                          style="background: rgba(37, 99, 235, 0.1); color: var(--accent); border-color: rgba(37, 99, 235, 0.2); padding: 0.4rem 0.6rem; border-radius: 8px; font-size: 0.85rem;"
                        >
                          <History :size="14" /> История оплат
                        </button>
                        <button 
                          @click="saveDebts(res.id, res.shipped_amount, res.paid_amount, res.overdue_amount)" 
                          class="btn-save-limit" 
                          title="Сохранить взаиморасчеты"
                        >
                          <Check :size="16" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  <!-- Total Row inside the table -->
                  <tr class="debts-table-total-row">
                    <td data-label="Покупатель" class="font-bold">ИТОГО:</td>
                    <td data-label="Отгружено, ₸" class="font-bold">{{ formatPrice(totalShipped) }} ₸</td>
                    <td data-label="Оплачено, ₸" class="font-bold text-success">{{ formatPrice(totalPaid) }} ₸</td>
                    <td data-label="Текущая задолженность, ₸" class="font-bold" :class="{ 'text-danger': totalDebt > 0 }">
                      {{ formatPrice(totalDebt) }} ₸
                    </td>
                    <td data-label="Просроченная задолженность, ₸" class="font-bold" :class="{ 'text-danger': totalOverdue > 0 }">
                      {{ formatPrice(totalOverdue) }} ₸
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Итого Summary Box -->
            <div class="debts-summary-card">
              <h3>Итого:</h3>
              <ul class="debts-summary-list">
                <li>
                  <span class="summary-label">Отгружено:</span>
                  <span class="summary-value">{{ formatPrice(totalShipped) }} ₸</span>
                </li>
                <li>
                  <span class="summary-label">Оплачено:</span>
                  <span class="summary-value text-success">{{ formatPrice(totalPaid) }} ₸</span>
                </li>
                <li>
                  <span class="summary-label">Долг:</span>
                  <span class="summary-value" :class="{ 'text-danger': totalDebt > 0 }">{{ formatPrice(totalDebt) }} ₸</span>
                </li>
                <li>
                  <span class="summary-label">Просрочка:</span>
                  <span class="summary-value" :class="{ 'text-danger': totalOverdue > 0 }">{{ formatPrice(totalOverdue) }} ₸</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Tab 5: General Purchases & Payments Daily Report -->
        <div v-if="activeTab === 'reports'" class="tab-pane animate-fade">
          <div class="price-header-row" style="margin-bottom: 2rem; align-items: flex-start; justify-content: space-between;">
            <div class="card-header" style="margin-bottom: 0;">
              <h2>Отчет по закупкам и оплатам по дням</h2>
              <p>Сводная статистика заказов и платежей с расчетом остатка долга</p>
            </div>
            
            <div class="search-filters-box debts-actions-box" style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <!-- Select Restaurant Dropdown -->
              <select v-model="selectedReportRestaurant" class="admin-select-filter">
                <option value="all">Все покупатели</option>
                <option v-for="res in restaurants" :key="res.id" :value="res.name">{{ res.name }}</option>
              </select>

              <!-- Select Month Dropdown -->
              <select v-model="selectedReportMonth" class="admin-select-filter">
                <option value="all">Все периоды</option>
                <option v-for="m in uniqueReportMonths" :key="m" :value="m">{{ m }}</option>
              </select>



              <button @click="exportReportToCSV" class="btn btn-secondary" style="background-color: #10b981; border-color: #10b981; display: flex; align-items: center; gap: 0.5rem; color: #fff;">
                <FileText :size="18" /> Экспорт в Excel (CSV)
              </button>

              <button @click="generateReportPDF" class="btn btn-primary" :disabled="isGeneratingReportPDF" style="display: flex; align-items: center; gap: 0.5rem;">
                <Download :size="18" /> {{ isGeneratingReportPDF ? 'Генерация...' : 'Скачать PDF отчет' }}
              </button>
            </div>
          </div>

          <div v-if="loadingOrders || loadingPayments" class="loading-state">
            <span class="loader"></span>
            <p>Загрузка данных отчета...</p>
          </div>

          <div v-else-if="dailyReportRows.length === 0" class="empty-state">
            <TrendingUp :size="48" />
            <p>Данные за этот период отсутствуют</p>
          </div>

          <div v-else>
            <!-- Daily Details Table -->
            <div class="table-responsive" style="margin-bottom: 2.5rem;">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Дата</th>
                    <th>Месяц</th>
                    <th>Год</th>
                    <th style="text-align: center;">Кол-во накладных</th>
                    <th style="text-align: right;">Сумма закупок, ₸</th>
                    <th style="text-align: right;">Оплата, ₸</th>
                    <th style="text-align: right;">Остаток, ₸</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in dailyReportRows" :key="row.date">
                    <td data-label="Дата" class="font-bold">{{ row.dateFormatted }}</td>
                    <td data-label="Месяц">{{ row.month }}</td>
                    <td data-label="Год">{{ row.year }}</td>
                    <td data-label="Кол-во накладных" style="text-align: center;">{{ row.orderCount }}</td>
                    <td data-label="Сумма закупок, ₸" style="text-align: right;" class="font-bold">{{ formatPrice(row.purchases) }} ₸</td>
                    <td data-label="Оплата, ₸" style="text-align: right;" class="text-success font-bold">{{ formatPrice(row.payments) }} ₸</td>
                    <td data-label="Остаток, ₸" style="text-align: right;" class="font-bold" :class="{ 'text-danger': row.balance > 0 }">{{ formatPrice(row.balance) }} ₸</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Monthly Summary Section -->
            <div class="price-header-row" style="margin-top: 2rem; margin-bottom: 1rem;">
              <div class="card-header" style="margin-bottom: 0;">
                <h2><Calendar :size="20" style="display: inline-block; vertical-align: middle; margin-right: 0.5rem;" /> ИТОГО ПО МЕСЯЦУ</h2>
              </div>
            </div>

            <div class="table-responsive">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Месяц</th>
                    <th>Год</th>
                    <th style="text-align: center;">Кол-во накладных</th>
                    <th style="text-align: right;">Общие закупки, ₸</th>
                    <th style="text-align: right;">Общие оплаты, ₸</th>
                    <th style="text-align: right;">Остаток долга, ₸</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in monthlySummaryRows" :key="row.month + row.year">
                    <td data-label="Месяц" class="font-bold">{{ row.month }}</td>
                    <td data-label="Год">{{ row.year }}</td>
                    <td data-label="Кол-во накладных" style="text-align: center;">{{ row.orderCount }}</td>
                    <td data-label="Общие закупки, ₸" style="text-align: right;" class="font-bold">{{ formatPrice(row.purchases) }} ₸</td>
                    <td data-label="Общие оплаты, ₸" style="text-align: right;" class="text-success font-bold">{{ formatPrice(row.payments) }} ₸</td>
                    <td data-label="Остаток долга, ₸" style="text-align: right;" class="font-bold" :class="{ 'text-danger': row.debt > 0 }">{{ formatPrice(row.debt) }} ₸</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Tab 2: Products Full Catalog Editor with Advanced Filters & Infinite Scroll -->
        <div v-if="activeTab === 'products'" class="tab-pane animate-fade">
          <div class="price-header-row">
            <div class="card-header">
              <h2>Редактор каталога товаров</h2>
              <p>Вы можете изменять любые характеристики товаров. Изменения сохраняются в базе данных.</p>
            </div>
            
            <div class="search-filters-box">
              <button @click="showAddProductModal = true" class="btn btn-secondary btn-add-product">
                <Plus :size="18" /> Добавить товар
              </button>

              <!-- Search Name -->
              <div class="admin-search-bar">
                <Search class="search-icon" :size="18" />
                <input 
                  type="text" 
                  v-model="productSearch" 
                  @input="resetLimit"
                  placeholder="Поиск по названию..." 
                />
              </div>

              <!-- Filter Category -->
              <select v-model="filterCategory" @change="resetLimit" class="admin-select-filter">
                <option value="all">Все категории</option>
                <option v-for="cat in uniqueCategories" :key="cat" :value="cat">{{ cat }}</option>
              </select>

              <!-- Filter Manufacturer -->
              <select v-model="filterManufacturer" @change="resetLimit" class="admin-select-filter">
                <option value="all">Все производители</option>
                <option v-for="man in uniqueManufacturers" :key="man" :value="man">{{ man }}</option>
              </select>
            </div>
          </div>

          <div v-if="loadingProducts" class="loading-state">
            <span class="loader"></span>
            <p>Загрузка каталога товаров...</p>
          </div>

          <div v-else>
            <div class="table-responsive">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th @click="toggleSort('name')" class="sortable-header">
                      <div class="header-content">
                        Наименование <ArrowUpDown :size="14" />
                      </div>
                    </th>
                    <th @click="toggleSort('category')" class="sortable-header">
                      <div class="header-content">
                        Категория <ArrowUpDown :size="14" />
                      </div>
                    </th>
                    <th @click="toggleSort('manufacturer')" class="sortable-header">
                      <div class="header-content">
                        Производитель <ArrowUpDown :size="14" />
                      </div>
                    </th>
                    <th style="width: 100px;">Ед. изм.</th>
                    <th @click="toggleSort('price')" class="sortable-header" style="width: 160px;">
                      <div class="header-content">
                        Цена (₸) <ArrowUpDown :size="14" />
                      </div>
                    </th>
                    <th style="text-align: right; width: 170px;">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="prod in displayedProducts" :key="prod.id">
                    <!-- Inline Editing State -->
                    <template v-if="editingProductId === prod.id">
                      <td data-label="Наименование">
                        <input type="text" v-model="editProductForm.name" class="inline-edit-input" />
                      </td>
                      <td data-label="Категория">
                        <select v-model="editProductForm.category" class="inline-edit-select">
                          <option v-for="cat in uniqueCategories" :key="cat" :value="cat">{{ cat }}</option>
                        </select>
                      </td>
                      <td data-label="Производитель">
                        <input type="text" v-model="editProductForm.manufacturer" class="inline-edit-input" />
                      </td>
                      <td data-label="Ед. изм.">
                        <input type="text" v-model="editProductForm.unit" class="inline-edit-input" style="width: 70px;" />
                      </td>
                      <td data-label="Цена (₸)">
                        <input type="number" step="0.01" v-model.number="editProductForm.price" class="inline-edit-input" />
                      </td>
                      <td data-label="Действия" style="text-align: right;">
                        <div class="edit-actions-row">
                          <button @click="saveProductEdit(prod.id)" class="btn-action-save" title="Сохранить изменения">
                            <Check :size="16" />
                          </button>
                          <button @click="cancelProductEdit" class="btn-action-cancel" title="Отмена">
                            <X :size="16" />
                          </button>
                        </div>
                      </td>
                    </template>

                    <!-- Normal State -->
                    <template v-else>
                      <td data-label="Наименование">{{ prod.name }}</td>
                      <td data-label="Категория"><span class="category-pill">{{ prod.category }}</span></td>
                      <td data-label="Производитель">{{ prod.manufacturer }}</td>
                      <td data-label="Ед. изм.">{{ prod.unit }}</td>
                      <td data-label="Цена (₸)" class="font-bold">{{ formatPrice(prod.price) }} ₸</td>
                      <td data-label="Действия" style="text-align: right;">
                        <div style="display: flex; gap: 0.5rem; justify-content: flex-end; align-items: center;">
                          <button @click="startProductEdit(prod)" class="btn-edit-row">
                            <Edit3 :size="18" /> Изменить
                          </button>
                          <button @click="deleteProduct(prod.id, prod.name)" class="btn-delete" title="Удалить товар">
                            <Trash2 :size="18" />
                          </button>
                        </div>
                      </td>
                    </template>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Scroll Sentinel (Infinite Scroll Loader) -->
            <div ref="scrollSentinel" class="scroll-sentinel">
              <div v-if="displayedLimit < filteredProducts.length" class="sentinel-loader">
                <span class="loader-dots"></span>
                <p>Загрузка товаров...</p>
              </div>
              <div v-else class="sentinel-end">
                🏁 Показаны все товары (всего: {{ filteredProducts.length }})
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 3: Monthly Invoices Log -->
        <div v-if="activeTab === 'invoices'" class="tab-pane animate-fade">
          <div class="price-header-row" style="margin-bottom: 2rem;">
            <div class="card-header" style="margin-bottom: 0;">
              <h2>История накладных и заказов</h2>
              <p>Полный список накладных по всем ресторанам с поиском и фильтрацией</p>
            </div>
            
            <div class="search-filters-box">
              <!-- Search Invoices -->
              <div class="admin-search-bar">
                <Search class="search-icon" :size="18" />
                <input 
                  type="text" 
                  v-model="invoiceSearch" 
                  placeholder="Поиск по накладной, ресторану..." 
                />
              </div>

              <!-- Filter Restaurant -->
              <select v-model="filterRestaurant" class="admin-select-filter">
                <option value="all">Все рестораны</option>
                <option v-for="res in uniqueInvoiceRestaurants" :key="res" :value="res">{{ res }}</option>
              </select>

              <!-- Month filter -->
              <select v-model="selectedMonth" class="admin-select-filter">
                <option value="all">Все месяцы</option>
                <option v-for="m in uniqueInvoiceMonths" :key="m" :value="m">{{ m }}</option>
              </select>
            </div>
          </div>

          <div v-if="loadingOrders" class="loading-state">
            <span class="loader"></span>
            <p>Загрузка списка заказов...</p>
          </div>

          <div v-else-if="filteredOrders.length === 0" class="empty-state">
            <ClipboardList :size="48" />
            <p>Накладные за этот период отсутствуют</p>
          </div>

          <div v-else class="table-responsive">
            <table class="admin-table">
              <thead>
                <tr>
                  <th @click="toggleInvoiceSort('id')" class="sortable-header" style="cursor: pointer;">
                    <div class="header-content">
                      Накладная № <ArrowUpDown :size="14" />
                    </div>
                  </th>
                  <th @click="toggleInvoiceSort('restaurant_name')" class="sortable-header" style="cursor: pointer;">
                    <div class="header-content">
                      Ресторан <ArrowUpDown :size="14" />
                    </div>
                  </th>
                  <th>Эл. почта</th>
                  <th @click="toggleInvoiceSort('created_at')" class="sortable-header" style="cursor: pointer;">
                    <div class="header-content">
                      Дата заказа <ArrowUpDown :size="14" />
                    </div>
                  </th>
                  <th>Кол-во товаров</th>
                  <th @click="toggleInvoiceSort('total_price')" class="sortable-header" style="cursor: pointer; width: 130px;">
                    <div class="header-content">
                      Сумма (₸) <ArrowUpDown :size="14" />
                    </div>
                  </th>
                  <th style="text-align: right; width: 155px;">Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in filteredOrders" :key="order.id">
                  <td data-label="Накладная" class="font-bold">
                    {{ getRestaurantPrefix(order.restaurant_name) }}-{{ String(getAdminRestaurantOrderNumber(order)).padStart(2, '0') }}
                  </td>
                  <td data-label="Ресторан">{{ order.restaurant_name }}</td>
                  <td data-label="Email">{{ order.restaurant_email }}</td>
                  <td data-label="Дата заказа">{{ formatDate(order.created_at) }}</td>
                  <td data-label="Товаров">{{ order.items.length }} поз.</td>
                  <td data-label="Сумма" class="invoice-price-col font-bold">{{ formatPrice(order.total_price) }} ₸</td>
                  <td data-label="Действия" style="text-align: right;">
                    <div style="display: flex; gap: 0.5rem; justify-content: flex-end; align-items: center;">
                      <button @click="generatePDFInvoice(order)" class="btn-inspect" title="Скачать PDF" :disabled="isGeneratingPDF">
                        <Download :size="18" />
                      </button>
                      <button @click="showInvoiceDetails(order)" class="btn-inspect" title="Просмотреть">
                        <Eye :size="18" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <!-- Details Invoice Modal -->
    <Transition name="fade">
      <div v-if="activeInvoice" class="details-modal-overlay" @click.self="activeInvoice = null">
        <div class="details-modal" v-motion-pop>
          <div class="details-modal-header">
            <h3>Детали накладной {{ getRestaurantPrefix(activeInvoice.restaurant_name) }}-{{ String(getAdminRestaurantOrderNumber(activeInvoice)).padStart(2, '0') }}</h3>
            <button @click="activeInvoice = null" class="close-btn"><X /></button>
          </div>
          <div class="details-modal-body">
            <div class="invoice-meta-info">
              <p><strong>Дата накладной:</strong> {{ formatDate(activeInvoice.created_at) }}</p>
              <p><strong>Ресторан:</strong> {{ activeInvoice.restaurant_name }}</p>
              <p><strong>Электронная почта:</strong> {{ activeInvoice.restaurant_email }}</p>
            </div>
            <table class="modal-invoice-table">
              <thead>
                <tr>
                  <th>Наименование товара</th>
                  <th style="text-align: center;">Кол-во</th>
                  <th style="text-align: right;">Цена</th>
                  <th style="text-align: right;">Сумма</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in activeInvoice.items" :key="item.id">
                  <td data-label="Товар">{{ item.name }}</td>
                  <td data-label="Кол-во" style="text-align: center;">
                    <div class="invoice-qty-edit">
                      <input 
                        type="number" 
                        step="0.01" 
                        min="0"
                        v-model.number="item.quantity" 
                        @input="updateInvoiceTotal" 
                        class="invoice-qty-input" 
                      />
                      <span class="invoice-qty-unit">{{ item.unit }}</span>
                    </div>
                  </td>
                  <td data-label="Цена" style="text-align: right;">
                    <div class="invoice-qty-edit" style="justify-content: flex-end;">
                      <input 
                        type="number" 
                        step="0.01" 
                        min="0"
                        v-model.number="item.price" 
                        @input="updateInvoiceTotal" 
                        class="invoice-qty-input" 
                        style="width: 85px; text-align: right;"
                      />
                      <span class="invoice-qty-unit">₸</span>
                    </div>
                  </td>
                  <td data-label="Сумма" style="text-align: right;">{{ formatPrice(item.price * item.quantity) }} ₸</td>
                </tr>
                <template v-if="activeInvoice.discount && parseFloat(activeInvoice.discount) > 0">
                  <tr class="modal-subtotal-row" style="font-size: 0.95rem; color: var(--gray);">
                    <td colspan="3" style="text-align: right; border-bottom: none; padding-top: 0.5rem; padding-bottom: 0.25rem;">Сумма без скидки:</td>
                    <td style="text-align: right; border-bottom: none; padding-top: 0.5rem; padding-bottom: 0.25rem;">{{ formatPrice(activeInvoice.original_price || activeInvoice.total_price / (1 - activeInvoice.discount / 100)) }} ₸</td>
                  </tr>
                  <tr class="modal-discount-row" style="font-size: 0.95rem; color: #ef4444;">
                    <td colspan="3" style="text-align: right; border-bottom: none; padding-top: 0.25rem; padding-bottom: 0.25rem;">Скидка ({{ parseFloat(activeInvoice.discount) }}%):</td>
                    <td style="text-align: right; border-bottom: none; padding-top: 0.25rem; padding-bottom: 0.25rem;">-{{ formatPrice((activeInvoice.original_price || activeInvoice.total_price / (1 - activeInvoice.discount / 100)) - activeInvoice.total_price) }} ₸</td>
                  </tr>
                </template>
                <tr class="modal-total-row">
                  <td colspan="3" class="total-label-cell"><strong>Итого к оплате:</strong></td>
                  <td style="text-align: right;" class="total-amount-cell"><strong>{{ formatPrice(activeInvoice.total_price) }} ₸</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="details-modal-footer">
            <button @click="activeInvoice = null" class="btn-cancel" :disabled="isSavingInvoice">Отмена</button>
            <button @click="saveInvoiceChanges" class="btn-submit" :disabled="isSavingInvoice">
              {{ isSavingInvoice ? 'Сохранение...' : 'Сохранить изменения' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showAddProductModal" class="details-modal-overlay" @click.self="closeAddProductModal">
        <div class="details-modal" v-motion-pop>
          <div class="details-modal-header">
            <h3>Добавить новый товар</h3>
            <button @click="closeAddProductModal" class="close-btn"><X /></button>
          </div>
          <div class="details-modal-body">
            <form @submit.prevent="submitAddProduct" class="add-product-form">
              <div class="form-group">
                <label for="new-prod-name">Наименование товара</label>
                <input id="new-prod-name" type="text" v-model="newProductForm.name" required placeholder="Например: Помидоры розовые" />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="new-prod-category">Категория</label>
                  <select id="new-prod-category" v-model="newProductForm.category" required>
                    <option value="" disabled>Выберите категорию</option>
                    <option v-for="cat in uniqueCategories" :key="cat" :value="cat">{{ cat }}</option>
                    <option value="NEW_CATEGORY">+ Новая категория</option>
                  </select>
                </div>
                <div class="form-group" v-if="newProductForm.category === 'NEW_CATEGORY'">
                  <label for="new-prod-category-custom">Название новой категории</label>
                  <input id="new-prod-category-custom" type="text" v-model="newProductForm.newCategory" required placeholder="Введите категорию" />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="new-prod-manufacturer">Производитель / Бренд</label>
                  <input id="new-prod-manufacturer" type="text" v-model="newProductForm.manufacturer" required placeholder="Например: Казахстан" />
                </div>
                <div class="form-group">
                  <label for="new-prod-unit">Единица измерения</label>
                  <select id="new-prod-unit" v-model="newProductForm.unit" required>
                    <option value="" disabled>Выберите ед. изм.</option>
                    <option value="кг">кг</option>
                    <option value="шт">шт</option>
                    <option value="уп">уп</option>
                    <option value="л">л</option>
                    <option value="короб">короб</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label for="new-prod-price">Цена (₸)</label>
                <input id="new-prod-price" type="number" step="0.01" min="0" v-model.number="newProductForm.price" required placeholder="Например: 1200" />
              </div>
              <div class="form-actions">
                <button type="button" @click="closeAddProductModal" class="btn-cancel">Отмена</button>
                <button type="submit" class="btn-submit">Добавить товар</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Record Payment Modal -->
    <Transition name="fade">
      <div v-if="showRecordPaymentModal" class="details-modal-overlay" @click.self="showRecordPaymentModal = false">
        <div class="details-modal" v-motion-pop>
          <div class="details-modal-header">
            <h3>Внести оплату (зарегистрировать платеж)</h3>
            <button @click="showRecordPaymentModal = false" class="close-btn"><X /></button>
          </div>
          <div class="details-modal-body">
            <form @submit.prevent="submitAddPayment" class="add-product-form">
              <!-- Select Restaurant -->
              <div class="form-group">
                <label for="payment-restaurant">Выберите ресторан / покупателя</label>
                <select id="payment-restaurant" v-model="newPaymentForm.user_id" required class="limit-input" style="width: 100%; font-weight: normal; margin-top: 0.5rem;">
                  <option value="" disabled>Выберите покупателя...</option>
                  <option v-for="res in restaurants" :key="res.id" :value="res.id">{{ res.name }}</option>
                </select>
              </div>

              <!-- Amount -->
              <div class="form-group" style="margin-top: 1rem;">
                <label for="payment-amount">Сумма оплаты (₸)</label>
                <input id="payment-amount" type="number" step="0.01" min="0.01" v-model.number="newPaymentForm.amount" required placeholder="Например: 50000" class="limit-input" style="width: 100%; font-weight: normal; margin-top: 0.5rem;" />
              </div>

              <!-- Custom Date (Optional) -->
              <div class="form-group" style="margin-top: 1rem;">
                <label for="payment-date">Дата платежа (по умолчанию: сегодня)</label>
                <input id="payment-date" type="datetime-local" v-model="newPaymentForm.created_at" class="limit-input" style="width: 100%; font-weight: normal; margin-top: 0.5rem;" />
              </div>

              <div class="form-actions" style="margin-top: 1.5rem;">
                <button type="button" @click="showRecordPaymentModal = false" class="btn-cancel">Отмена</button>
                <button type="submit" class="btn-submit" :disabled="isSavingPayment">
                  {{ isSavingPayment ? 'Сохранение...' : 'Зарегистрировать платеж' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Payments History Modal -->
    <Transition name="fade">
      <div v-if="showPaymentsHistoryModal" class="details-modal-overlay" @click.self="showPaymentsHistoryModal = false">
        <div class="details-modal" v-motion-pop style="max-width: 700px;">
          <div class="details-modal-header">
            <h3>История оплат: {{ selectedHistoryRestaurant?.name }}</h3>
            <button @click="showPaymentsHistoryModal = false" class="close-btn"><X /></button>
          </div>
          <div class="details-modal-body">
            <div v-if="restaurantPaymentsList.length === 0" class="empty-state" style="padding: 3rem 1rem; border: none; box-shadow: none;">
              <Wallet :size="36" style="margin-bottom: 1rem; opacity: 0.5;" />
              <p>История оплат пуста</p>
            </div>
            <table v-else class="modal-invoice-table">
              <thead>
                <tr>
                  <th>Дата платежа</th>
                  <th style="text-align: right; width: 200px;">Сумма (₸)</th>
                  <th style="text-align: right; width: 180px;">Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="pay in restaurantPaymentsList" :key="pay.id">
                  <!-- Inline edit mode for payment -->
                  <template v-if="editingPaymentId === pay.id">
                    <td>
                      <input type="datetime-local" v-model="editPaymentForm.created_at" class="inline-edit-input" />
                    </td>
                    <td style="text-align: right;">
                      <input type="number" step="0.01" min="0.01" v-model.number="editPaymentForm.amount" class="inline-edit-input" style="text-align: right;" />
                    </td>
                    <td style="text-align: right;">
                      <div class="edit-actions-row">
                        <button @click="savePaymentEdit(pay.id)" class="btn-action-save" title="Сохранить">
                          <Check :size="14" />
                        </button>
                        <button @click="cancelPaymentEdit" class="btn-action-cancel" title="Отмена">
                          <X :size="14" />
                        </button>
                      </div>
                    </td>
                  </template>
                  <!-- Read/Normal state for payment -->
                  <template v-else>
                    <td class="font-bold">{{ formatDate(pay.created_at) }}</td>
                    <td style="text-align: right;" class="text-success font-bold">{{ formatPrice(pay.amount) }} ₸</td>
                    <td style="text-align: right;">
                      <div style="display: flex; gap: 0.5rem; justify-content: flex-end; align-items: center;">
                        <button @click="startPaymentEdit(pay)" class="btn-edit-row" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; height: auto;">
                          <Edit3 :size="14" /> Изменить
                        </button>
                        <button @click="deletePayment(pay.id)" class="btn-delete" title="Удалить платеж" style="padding: 0.25rem;">
                          <Trash2 :size="16" />
                        </button>
                      </div>
                    </td>
                  </template>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="details-modal-footer">
            <button @click="showPaymentsHistoryModal = false" class="btn-cancel">Закрыть</button>
          </div>
        </div>
      </div>
    </Transition>

    <div class="pdf-offscreen-container" v-if="activeInvoice">
      <div ref="pdfTemplateRef" class="pdf-invoice-f32">
        <div class="f32-appendix">
          Приложение 26<br />
          к приказу Министра финансов<br />
          Республики Казахстан<br />
          от 20 декабря 2012 года № 562<br /><br />
          <strong>Форма 3-2</strong>
        </div>

        <table class="f32-org-header">
          <tr>
            <td style="width: 25%; font-size: 8px;">Организация (индивидуальный предприниматель)</td>
            <td class="f32-underline-cell" style="width: 50%; font-size: 10px;">ИП ИБРАЕВ "GASTROMIR"</td>
            <td style="width: 5%;"></td>
            <td style="width: 20%; text-align: right; vertical-align: top;">
              <table class="f32-iin-bin-table">
                <tr>
                  <td style="background-color: #f3f4f6; font-size: 7px; font-weight: bold; border: 1px solid #000; padding: 1px 4px;">ИИН/БИН</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000; padding: 2px 4px; font-weight: bold; font-size: 9px;">820727351424</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <div class="f32-doc-meta-container">
          <table class="f32-doc-meta-table">
            <thead>
              <tr>
                <th style="border: 1px solid #000; padding: 4px 10px; background-color: #f3f4f6; font-weight: bold; font-size: 8px;">Номер документа</th>
                <th style="border: 1px solid #000; padding: 4px 10px; background-color: #f3f4f6; font-weight: bold; font-size: 8px;">Дата составления</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid #000; padding: 4px 10px; text-align: center; font-weight: bold; font-size: 9px;">{{ getRestaurantPrefix(activeInvoice.restaurant_name) }}-{{ String(getAdminRestaurantOrderNumber(activeInvoice)).padStart(2, '0') }}</td>
                <td style="border: 1px solid #000; padding: 4px 10px; text-align: center; font-size: 9px;">{{ formatDateOnly(activeInvoice.created_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="f32-title" style="margin-bottom: 5px;">НАКЛАДНАЯ НА ОТПУСК ЗАПАСОВ НА СТОРОНУ</div>

        <table class="f32-bank-details-table" style="width: 100%; border-collapse: collapse; margin-bottom: 12px; border: 1px solid #000;">
          <tr>
            <td style="width: 50%; border: 1px solid #000; padding: 5px; font-size: 8px; vertical-align: top; text-align: left; line-height: 1.3;">
              <div style="font-weight: bold; font-size: 8.5px; margin-bottom: 3px; border-bottom: 1px solid #000; padding-bottom: 1px; color: #000;">ПОСТАВЩИК (ОТПРАВИТЕЛЬ):</div>
              <div><strong>ИП ИБРАЕВ "GASTROMIR"</strong></div>
              <div><strong>БИН (ИИН):</strong> 820727351424</div>
              <div><strong>Банк:</strong> АО "Kaspi Bank"</div>
              <div><strong>БИК:</strong> CASPKZKA &nbsp;&nbsp;&nbsp;&nbsp; <strong>КБе:</strong> 19</div>
              <div><strong>Номер счета (ИИК):</strong> KZ96722S000053776272</div>
              <div><strong>Адрес:</strong> г. Астана, ул. Григория Потанина, д. 2, кв./офис 26</div>
            </td>
            
            <td style="width: 50%; border: 1px solid #000; padding: 5px; font-size: 8px; vertical-align: top; text-align: left; line-height: 1.3;">
              <div style="font-weight: bold; font-size: 8.5px; margin-bottom: 3px; border-bottom: 1px solid #000; padding-bottom: 1px; color: #000;">ПОКУПАТЕЛЬ (ПОЛУЧАТЕЛЬ):</div>
              <div><strong>Компания:</strong> {{ activeInvoice.restaurant_name || '-' }}</div>
              <div><strong>БИН (ИИН):</strong> {{ activeInvoice.restaurant_bin_iin || '-' }}</div>
              <div><strong>Банк:</strong> {{ activeInvoice.restaurant_bank || '-' }}</div>
              <div><strong>БИК:</strong> {{ activeInvoice.restaurant_bic || '-' }} &nbsp;&nbsp;&nbsp;&nbsp; <strong>КБе:</strong> {{ activeInvoice.restaurant_kbe || '-' }}</div>
              <div><strong>Номер счета (ИИК):</strong> {{ activeInvoice.restaurant_account_number || '-' }}</div>
              <div><strong>Адрес:</strong> {{ activeInvoice.restaurant_address || '-' }}</div>
            </td>
          </tr>
        </table>

        <table class="f32-parties-table">
          <thead>
            <tr>
              <th style="border: 1px solid #000; padding: 4px 6px; background-color: #f3f4f6; font-weight: bold; text-align: center; font-size: 8px; width: 20%;">Организация (индивидуальный предприниматель) - отправитель</th>
              <th style="border: 1px solid #000; padding: 4px 6px; background-color: #f3f4f6; font-weight: bold; text-align: center; font-size: 8px; width: 25%;">Организация (индивидуальный предприниматель) - получатель</th>
              <th style="border: 1px solid #000; padding: 4px 6px; background-color: #f3f4f6; font-weight: bold; text-align: center; font-size: 8px; width: 15%;">Ответственный за поставку (Ф.И.О.)</th>
              <th style="border: 1px solid #000; padding: 4px 6px; background-color: #f3f4f6; font-weight: bold; text-align: center; font-size: 8px; width: 15%;">Транспортная организация</th>
              <th style="border: 1px solid #000; padding: 4px 6px; background-color: #f3f4f6; font-weight: bold; text-align: center; font-size: 8px; width: 25%;">Товарно-транспортная накладная (номер, дата)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #000; padding: 4px 6px; font-size: 8px;">ИП ИБРАЕВ "GASTROMIR", БИН 820727351424, г. Астана, ул. Григория Потанина, д. 2, кв./офис 26</td>
              <td style="border: 1px solid #000; padding: 4px 6px; font-size: 8px;">{{ activeInvoice.restaurant_name }}, ИИН/БИН {{ activeInvoice.restaurant_bin_iin || '—' }}, {{ activeInvoice.restaurant_address }}</td>
              <td style="border: 1px solid #000; padding: 4px 6px; font-size: 8px; text-align: center;">Ибраев Б. А.</td>
              <td style="border: 1px solid #000; padding: 4px 6px; font-size: 8px; text-align: center;">GASTROMIR Логистика</td>
              <td style="border: 1px solid #000; padding: 4px 6px; font-size: 8px; text-align: center;">{{ getRestaurantPrefix(activeInvoice.restaurant_name) }}-{{ String(getAdminRestaurantOrderNumber(activeInvoice)).padStart(2, '0') }}, {{ formatDateOnly(activeInvoice.created_at) }}</td>
            </tr>
          </tbody>
        </table>

        <table class="f32-items-table">
          <thead>
            <tr>
              <th rowspan="2" style="border: 1px solid #000; padding: 4px; background-color: #f3f4f6; font-weight: bold; text-align: center; font-size: 7.5px; width: 3%;">Номер по порядку</th>
              <th rowspan="2" style="border: 1px solid #000; padding: 4px; background-color: #f3f4f6; font-weight: bold; text-align: center; font-size: 7.5px; width: 35%;">Наименование, характеристика</th>
              <th rowspan="2" style="border: 1px solid #000; padding: 4px; background-color: #f3f4f6; font-weight: bold; text-align: center; font-size: 7.5px; width: 10%;">Номенклатурный номер</th>
              <th rowspan="2" style="border: 1px solid #000; padding: 4px; background-color: #f3f4f6; font-weight: bold; text-align: center; font-size: 7.5px; width: 8%;">Единица измерения</th>
              <th colspan="2" style="border: 1px solid #000; padding: 2px; background-color: #f3f4f6; font-weight: bold; text-align: center; font-size: 7.5px; width: 14%;">Количество</th>
              <th rowspan="2" style="border: 1px solid #000; padding: 4px; background-color: #f3f4f6; font-weight: bold; text-align: center; font-size: 7.5px; width: 10%;">Цена за единицу, в KZT</th>
              <th rowspan="2" style="border: 1px solid #000; padding: 4px; background-color: #f3f4f6; font-weight: bold; text-align: center; font-size: 7.5px; width: 10%;">Сумма с НДС, в KZT</th>
              <th rowspan="2" style="border: 1px solid #000; padding: 4px; background-color: #f3f4f6; font-weight: bold; text-align: center; font-size: 7.5px; width: 10%;">Сумма НДС, в KZT</th>
            </tr>
            <tr>
              <th style="border: 1px solid #000; padding: 2px; background-color: #f3f4f6; font-weight: bold; text-align: center; font-size: 6.5px;">подлежит отпуску</th>
              <th style="border: 1px solid #000; padding: 2px; background-color: #f3f4f6; font-weight: bold; text-align: center; font-size: 6.5px;">отпущено</th>
            </tr>
            <tr class="f32-col-nums">
              <td style="border: 1px solid #000; padding: 1px; text-align: center; font-size: 6px; background-color: #f9fafb;">1</td>
              <td style="border: 1px solid #000; padding: 1px; text-align: center; font-size: 6px; background-color: #f9fafb;">2</td>
              <td style="border: 1px solid #000; padding: 1px; text-align: center; font-size: 6px; background-color: #f9fafb;">3</td>
              <td style="border: 1px solid #000; padding: 1px; text-align: center; font-size: 6px; background-color: #f9fafb;">4</td>
              <td style="border: 1px solid #000; padding: 1px; text-align: center; font-size: 6px; background-color: #f9fafb;">5</td>
              <td style="border: 1px solid #000; padding: 1px; text-align: center; font-size: 6px; background-color: #f9fafb;">6</td>
              <td style="border: 1px solid #000; padding: 1px; text-align: center; font-size: 6px; background-color: #f9fafb;">7</td>
              <td style="border: 1px solid #000; padding: 1px; text-align: center; font-size: 6px; background-color: #f9fafb;">8</td>
              <td style="border: 1px solid #000; padding: 1px; text-align: center; font-size: 6px; background-color: #f9fafb;">9</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in activeInvoice.items" :key="item.id">
              <td style="border: 1px solid #000; padding: 3px; font-size: 8px; text-align: center;">{{ index + 1 }}</td>
              <td style="border: 1px solid #000; padding: 3px; font-size: 8px; text-align: left;">{{ item.name }}</td>
              <td style="border: 1px solid #000; padding: 3px; font-size: 8px; text-align: center;">GM-{{ String(item.id).slice(-4).padStart(4, '0') }}</td>
              <td style="border: 1px solid #000; padding: 3px; font-size: 8px; text-align: center;">{{ item.unit }}</td>
              <td style="border: 1px solid #000; padding: 3px; font-size: 8px; text-align: center;">{{ item.quantity }}</td>
              <td style="border: 1px solid #000; padding: 3px; font-size: 8px; text-align: center;">{{ item.quantity }}</td>
              <td style="border: 1px solid #000; padding: 3px; font-size: 8px; text-align: right;">{{ formatPrice(item.price) }}</td>
              <td style="border: 1px solid #000; padding: 3px; font-size: 8px; text-align: right;">{{ formatPrice(item.price * item.quantity) }}</td>
              <td style="border: 1px solid #000; padding: 3px; font-size: 8px; text-align: right;"></td>
            </tr>
            <template v-if="activeInvoice.discount && parseFloat(activeInvoice.discount) > 0">
              <tr class="f32-discount-row">
                <td colspan="7" style="border: 1px solid #000; padding: 3px; font-size: 8px; text-align: right; font-weight: bold; background-color: #f9fafb;">Сумма без скидки</td>
                <td style="border: 1px solid #000; padding: 3px; font-size: 8px; text-align: right; font-weight: bold; background-color: #f9fafb;">{{ formatPrice(activeInvoice.original_price || activeInvoice.total_price / (1 - activeInvoice.discount / 100)) }}</td>
                <td style="border: 1px solid #000; padding: 3px; font-size: 8px; text-align: right; font-weight: bold; background-color: #f9fafb;"></td>
              </tr>
              <tr class="f32-discount-row" style="color: #c2410c;">
                <td colspan="7" style="border: 1px solid #000; padding: 3px; font-size: 8px; text-align: right; font-weight: bold; background-color: #f9fafb;">Скидка ({{ parseFloat(activeInvoice.discount) }}%)</td>
                <td style="border: 1px solid #000; padding: 3px; font-size: 8px; text-align: right; font-weight: bold; background-color: #f9fafb;">-{{ formatPrice((activeInvoice.original_price || activeInvoice.total_price / (1 - activeInvoice.discount / 100)) - activeInvoice.total_price) }}</td>
                <td style="border: 1px solid #000; padding: 3px; font-size: 8px; text-align: right; font-weight: bold; background-color: #f9fafb;"></td>
              </tr>
            </template>
            <tr class="f32-total-row">
              <td colspan="4" style="border: 1px solid #000; padding: 3px; font-size: 8px; text-align: right; font-weight: bold; background-color: #f9fafb;">Итого к оплате</td>
              <td style="border: 1px solid #000; padding: 3px; font-size: 8px; text-align: center; font-weight: bold; background-color: #f9fafb;">{{ getInvoiceQty(activeInvoice) }}</td>
              <td style="border: 1px solid #000; padding: 3px; font-size: 8px; text-align: center; font-weight: bold; background-color: #f9fafb;">{{ getInvoiceQty(activeInvoice) }}</td>
              <td style="border: 1px solid #000; padding: 3px; font-size: 8px; background-color: #f9fafb;"></td>
              <td style="border: 1px solid #000; padding: 3px; font-size: 8px; text-align: right; font-weight: bold; background-color: #f9fafb;">{{ formatPrice(activeInvoice.total_price) }}</td>
              <td style="border: 1px solid #000; padding: 3px; font-size: 8px; text-align: right; font-weight: bold; background-color: #f9fafb;"></td>
            </tr>
          </tbody>
        </table>

        <div class="f32-words-section">
          <div class="f32-words-line" style="font-size: 8px; margin-bottom: 2px;">
            Всего отпущено количество запасов (прописью):
            <span class="f32-words-value" style="font-weight: bold; border-bottom: 1px solid #000; display: inline-block; padding: 0 4px; min-width: 250px;"></span>
          </div>
          <div class="f32-words-line" style="font-size: 8px;">
            на сумму (прописью), в KZT:
            <span class="f32-words-value" style="font-weight: bold; border-bottom: 1px solid #000; display: inline-block; padding: 0 4px; min-width: 350px;"></span>
          </div>
        </div>

        <table class="f32-signatures-table" style="width: 100%; margin-top: 15px; border-collapse: collapse; border: none;">
          <tr>
            <td style="width: 48%; border: none; padding: 0; vertical-align: top;">
              <table style="width: 100%; border-collapse: collapse; border: none;">
                <tr>
                  <td style="border: none; font-size: 8px; width: 80px; padding: 3px 0;">Отпуск разрешил</td>
                  <td style="border: none; padding: 3px 0;">
                    <table style="width: 100%; border-collapse: collapse; border: none;">
                      <tr>
                        <td style="border: none; border-bottom: 1px solid #000; font-size: 8px; width: 30%; text-align: center; padding: 0; line-height: 1;">Директор</td>
                        <td style="border: none; width: 5%; padding: 0;"></td>
                        <td style="border: none; border-bottom: 1px solid #000; font-size: 8px; width: 25%; padding: 0; position: relative; text-align: center;">
                          <img :src="signatureImg" style="position: absolute; left: 50%; transform: translateX(-50%); top: -35px; width: 70px; height: auto; pointer-events: none;" />
                        </td>
                        <td style="border: none; width: 5%; padding: 0;"></td>
                        <td style="border: none; border-bottom: 1px solid #000; font-size: 8px; width: 35%; text-align: center; padding: 0; line-height: 1;">Ибраев Б. А.</td>
                      </tr>
                      <tr>
                        <td style="border: none; font-size: 5px; color: #555; text-align: center; font-style: italic; padding: 0; line-height: 1.2;">должность</td>
                        <td style="border: none; padding: 0;"></td>
                        <td style="border: none; font-size: 5px; color: #555; text-align: center; font-style: italic; padding: 0; line-height: 1.2;">подпись</td>
                        <td style="border: none; padding: 0;"></td>
                        <td style="border: none; font-size: 5px; color: #555; text-align: center; font-style: italic; padding: 0; line-height: 1.2;">расшифровка подписи</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="border: none; font-size: 8px; padding: 10px 0 3px 0;">Главный бухгалтер</td>
                  <td style="border: none; padding: 10px 0 3px 0;">
                    <table style="width: 100%; border-collapse: collapse; border: none;">
                      <tr>
                        <td style="border: none; border-bottom: 1px solid #000; font-size: 8px; width: 40%; padding: 0;"></td>
                        <td style="border: none; width: 10%; padding: 0;"></td>
                        <td style="border: none; border-bottom: 1px solid #000; font-size: 8px; width: 50%; text-align: center; padding: 0; line-height: 1;"></td>
                      </tr>
                      <tr>
                        <td style="border: none; font-size: 5px; color: #555; text-align: center; font-style: italic; padding: 0; line-height: 1.2;">подпись</td>
                        <td style="border: none; padding: 0;"></td>
                        <td style="border: none; font-size: 5px; color: #555; text-align: center; font-style: italic; padding: 0; line-height: 1.2;">расшифровка подписи</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="border: none; font-size: 8px; padding: 10px 0 3px 0; font-weight: bold; position: relative;">
                    М.П.
                    <img :src="printImg" style="position: absolute; left: 10px; top: 20px; width: 95px; height: 95px; opacity: 0.85; pointer-events: none;" />
                  </td>
                  <td style="border: none; padding: 10px 0 3px 0;"></td>
                </tr>
                <tr>
                  <td style="border: none; font-size: 8px; padding: 10px 0 3px 0;">Отпустил</td>
                  <td style="border: none; padding: 10px 0 3px 0;">
                    <table style="width: 100%; border-collapse: collapse; border: none;">
                      <tr>
                        <td style="border: none; border-bottom: 1px solid #000; font-size: 8px; width: 40%; padding: 0; position: relative; text-align: center; height: 16px;">
                          <img :src="signatureImg" style="position: absolute; left: 50%; transform: translateX(-50%); top: -35px; width: 70px; height: auto; pointer-events: none;" />
                        </td>
                        <td style="border: none; width: 10%; padding: 0;"></td>
                        <td style="border: none; border-bottom: 1px solid #000; font-size: 8px; width: 50%; text-align: center; padding: 0; line-height: 1;">Ибраев Б. А.</td>
                      </tr>
                      <tr>
                        <td style="border: none; font-size: 5px; color: #555; text-align: center; font-style: italic; padding: 0; line-height: 1.2;">подпись</td>
                        <td style="border: none; padding: 0;"></td>
                        <td style="border: none; font-size: 5px; color: #555; text-align: center; font-style: italic; padding: 0; line-height: 1.2;">расшифровка подписи</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>

            <td style="width: 4%; border: none; padding: 0;"></td>

            <td style="width: 48%; border: none; padding: 0; vertical-align: top;">
              <table style="width: 100%; border-collapse: collapse; border: none;">
                <tr>
                  <td style="border: none; font-size: 8px; width: 80px; padding: 3px 0;">По доверенности</td>
                  <td style="border: none; padding: 3px 0; border-bottom: 1px solid #000; font-size: 8px; height: 12px;"></td>
                </tr>
                <tr>
                  <td style="border: none; font-size: 8px; padding: 10px 0 3px 0;">выданной</td>
                  <td style="border: none; padding: 10px 0 3px 0; border-bottom: 1px solid #000; font-size: 8px; height: 12px;"></td>
                </tr>
                <tr>
                  <td style="border: none; font-size: 8px; padding: 25px 0 3px 0;">Запасы получил</td>
                  <td style="border: none; padding: 25px 0 3px 0;">
                    <table style="width: 100%; border-collapse: collapse; border: none;">
                      <tr>
                        <td style="border: none; border-bottom: 1px solid #000; font-size: 8px; width: 40%; padding: 0;"></td>
                        <td style="border: none; width: 10%; padding: 0;"></td>
                        <td style="border: none; border-bottom: 1px solid #000; font-size: 8px; width: 50%; text-align: center; padding: 0; line-height: 1;">{{ activeInvoice.restaurant_name }}</td>
                      </tr>
                      <tr>
                        <td style="border: none; font-size: 5px; color: #555; text-align: center; font-style: italic; padding: 0; line-height: 1.2;">подпись</td>
                        <td style="border: none; padding: 0;"></td>
                        <td style="border: none; font-size: 5px; color: #555; text-align: center; font-style: italic; padding: 0; line-height: 1.2;">расшифровка подписи</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Debts Report PDF Template -->
    <div class="pdf-offscreen-container">
      <div ref="debtsPdfTemplateRef" class="pdf-debts-report">
        <h2 class="pdf-report-title">Акт сверки взаиморасчетов (сводный)</h2>
        <p class="pdf-report-meta"><strong>Дата составления:</strong> {{ formatDateOnly(new Date()) }}</p>
        <p class="pdf-report-meta"><strong>Организация:</strong> ИП ИБРАЕВ "GASTROMIR"</p>
        
        <table class="pdf-report-table">
          <thead>
            <tr>
              <th style="width: 5%;">#</th>
              <th>Покупатель</th>
              <th style="width: 20%; text-align: right;">Отгружено, ₸</th>
              <th style="width: 20%; text-align: right;">Оплачено, ₸</th>
              <th style="width: 20%; text-align: right;">Текущий долг, ₸</th>
              <th style="width: 15%; text-align: right;">Просрочка, ₸</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(res, index) in restaurants" :key="res.id">
              <td>{{ index + 1 }}</td>
              <td style="font-weight: bold;">{{ res.name }}</td>
              <td style="text-align: right;">{{ formatPrice(res.shipped_amount) }}</td>
              <td style="text-align: right;">{{ formatPrice(res.paid_amount) }}</td>
              <td style="text-align: right; font-weight: bold;">{{ formatPrice(res.shipped_amount - res.paid_amount) }}</td>
              <td style="text-align: right; color: #dc2626;">{{ formatPrice(res.overdue_amount) }}</td>
            </tr>
            <tr class="pdf-report-total-row">
              <td colspan="2"><strong>ИТОГО:</strong></td>
              <td style="text-align: right;"><strong>{{ formatPrice(totalShipped) }}</strong></td>
              <td style="text-align: right;"><strong>{{ formatPrice(totalPaid) }}</strong></td>
              <td style="text-align: right;"><strong>{{ formatPrice(totalDebt) }}</strong></td>
              <td style="text-align: right;"><strong>{{ formatPrice(totalOverdue) }}</strong></td>
            </tr>
          </tbody>
        </table>
        
        <div class="pdf-report-signatures">
          <div class="sig-block">
            <p>От ИП ИБРАЕВ "GASTROMIR":</p>
            <div class="sig-line">
              <span class="line">____________________</span>
              <span>Ибраев Б. А.</span>
            </div>
          </div>
          <div class="sig-block" style="text-align: right;">
            <p>Проверил администратор:</p>
            <div class="sig-line" style="justify-content: flex-end;">
              <span class="line">____________________</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Purchases Report PDF Template -->
    <div class="pdf-offscreen-container">
      <div ref="reportPdfTemplateRef" class="pdf-debts-report" style="width: 710px; padding: 20px; font-family: 'Arial', sans-serif;">
        <h2 class="pdf-report-title">Отчет по закупкам и оплатам по дням</h2>
        <p class="pdf-report-meta"><strong>Покупатель:</strong> {{ selectedReportRestaurant === 'all' ? 'Все рестораны' : selectedReportRestaurant }}</p>
        <p class="pdf-report-meta"><strong>Период:</strong> {{ selectedReportMonth === 'all' ? 'Все периоды' : selectedReportMonth }}</p>
        <p class="pdf-report-meta"><strong>Дата выгрузки:</strong> {{ formatDateOnly(new Date()) }}</p>

        <!-- Daily Table -->
        <table class="pdf-report-table">
          <thead>
            <tr>
              <th>Дата</th>
              <th>Месяц</th>
              <th>Год</th>
              <th style="text-align: center;">Накладные</th>
              <th style="text-align: right;">Закупки, ₸</th>
              <th style="text-align: right;">Оплаты, ₸</th>
              <th style="text-align: right;">Остаток, ₸</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in dailyReportRows" :key="row.date">
              <td style="font-weight: bold;">{{ row.dateFormatted }}</td>
              <td>{{ row.month }}</td>
              <td>{{ row.year }}</td>
              <td style="text-align: center;">{{ row.orderCount }}</td>
              <td style="text-align: right;">{{ formatPrice(row.purchases) }}</td>
              <td style="text-align: right; color: #16a34a;">{{ formatPrice(row.payments) }}</td>
              <td style="text-align: right; font-weight: bold;">{{ formatPrice(row.balance) }}</td>
            </tr>
          </tbody>
        </table>

        <div style="page-break-before: auto; height: 20px;"></div>

        <!-- Monthly Totals Table -->
        <h3 style="font-size: 12px; font-weight: bold; margin-top: 20px; margin-bottom: 10px; text-transform: uppercase;">ИТОГО ПО МЕСЯЦУ</h3>
        <table class="pdf-report-table">
          <thead>
            <tr>
              <th>Месяц</th>
              <th>Год</th>
              <th style="text-align: center;">Накладные</th>
              <th style="text-align: right;">Общие закупки, ₸</th>
              <th style="text-align: right;">Общие оплаты, ₸</th>
              <th style="text-align: right;">Остаток долга, ₸</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in monthlySummaryRows" :key="row.month + row.year">
              <td style="font-weight: bold;">{{ row.month }}</td>
              <td>{{ row.year }}</td>
              <td style="text-align: center;">{{ row.orderCount }}</td>
              <td style="text-align: right; font-weight: bold;">{{ formatPrice(row.purchases) }}</td>
              <td style="text-align: right; color: #16a34a; font-weight: bold;">{{ formatPrice(row.payments) }}</td>
              <td style="text-align: right; font-weight: bold; color: #dc2626;">{{ formatPrice(row.debt) }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Signatures -->
        <div class="pdf-report-signatures" style="margin-top: 50px;">
          <div class="sig-block">
            <p>От ИП ИБРАЕВ "GASTROMIR":</p>
            <div class="sig-line">
              <span class="line">____________________</span>
              <span>Ибраев Б. А.</span>
            </div>
          </div>
          <div class="sig-block" style="text-align: right;">
            <p>Получатель / Проверил:</p>
            <div class="sig-line" style="justify-content: flex-end;">
              <span class="line">____________________</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { ShieldCheck, Users, DollarSign, Calendar, Eye, Trash2, Check, Search, ClipboardList, X, Edit3, ArrowUpDown, Plus, FileText, Download, Wallet, TrendingUp, History } from 'lucide-vue-next'
import printImg from '@/assets/docs/print.png'
import signatureImg from '@/assets/docs/signature.png'

const authStore = useAuthStore()
const toastStore = useToastStore()

const pdfTemplateRef = ref(null)
const debtsPdfTemplateRef = ref(null)
const isGeneratingPDF = ref(false)
const isGeneratingDebtsPDF = ref(false)
const isSavingInvoice = ref(false)

const numberToWordsRu = (n) => {
  n = Math.round(parseFloat(n))
  if (isNaN(n) || n === 0) return 'ноль'
  
  const units = ['', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять']
  const unitsFeminine = ['', 'одна', 'две', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять']
  const teens = ['десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать']
  const tens = ['', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто']
  const hundreds = ['', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот', 'шестьсот', 'семьсот', 'восемьсот', 'девятьсот']
  
  const words = []
  
  const parseThousand = (num, isFeminine) => {
    let part = []
    const h = Math.floor(num / 100)
    const t = Math.floor((num % 100) / 10)
    const u = num % 10
    
    if (h > 0) part.push(hundreds[h])
    if (t === 1) {
      part.push(teens[u])
    } else {
      if (t > 1) part.push(tens[t])
      if (u > 0) part.push(isFeminine ? unitsFeminine[u] : units[u])
    }
    return part.join(' ')
  }
  
  let temp = n
  const billion = Math.floor(temp / 1000000000)
  temp %= 1000000000
  const million = Math.floor(temp / 1000000)
  temp %= 1000000
  const thousand = Math.floor(temp / 1000)
  const remainder = temp % 1000
  
  if (billion > 0) {
    words.push(parseThousand(billion, false))
    const u = billion % 10
    const t = billion % 100
    if (t >= 11 && t <= 19) words.push('миллиардов')
    else if (u === 1) words.push('миллиард')
    else if (u >= 2 && u <= 4) words.push('миллиарда')
    else words.push('миллиардов')
  }
  
  if (million > 0) {
    words.push(parseThousand(million, false))
    const u = million % 10
    const t = million % 100
    if (t >= 11 && t <= 19) words.push('миллионов')
    else if (u === 1) words.push('миллион')
    else if (u >= 2 && u <= 4) words.push('миллиона')
    else words.push('миллионов')
  }
  
  if (thousand > 0) {
    words.push(parseThousand(thousand, true))
    const u = thousand % 10
    const t = thousand % 100
    if (t >= 11 && t <= 19) words.push('тысяч')
    else if (u === 1) words.push('тысяча')
    else if (u >= 2 && u <= 4) words.push('тысячи')
    else words.push('тысяч')
  }
  
  if (remainder > 0) {
    words.push(parseThousand(remainder, false))
  }
  
  return words.filter(Boolean).join(' ')
}

const capitalizeFirst = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const calculateVAT = (sum) => {
  if (!sum) return 0
  return Math.round((sum * 12 / 112) * 100) / 100
}

const formatDateOnly = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}.${month}.${year}`
}

const getInvoiceQty = (order) => {
  if (!order || !order.items) return 0
  return order.items.reduce((sum, item) => sum + item.quantity, 0)
}

const generatePDFInvoice = async (order) => {
  if (!order) return
  isGeneratingPDF.value = true
  const originalActiveInvoice = activeInvoice.value

  try {
    const html2pdf = (await import('html2pdf.js')).default
    activeInvoice.value = JSON.parse(JSON.stringify(order))
    await nextTick()

    const currentOrderNum = `${getRestaurantPrefix(order.restaurant_name)}-${String(getAdminRestaurantOrderNumber(order)).padStart(2, '0')}`
    const element = pdfTemplateRef.value

    if (!element) {
      throw new Error('PDF template element not found in DOM')
    }

    const options = {
      margin: [0.3, 0.3, 0.3, 0.3],
      filename: `Накладная_Форма_3-2_${currentOrderNum}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }

    await html2pdf()
      .from(element)
      .set(options)
      .save()
  } catch (err) {
    console.error('Error generating PDF:', err)
    toastStore.error('Не удалось сгенерировать PDF. Попробуйте еще раз.')
  } finally {
    activeInvoice.value = originalActiveInvoice
    isGeneratingPDF.value = false
  }
}

const showAddProductModal = ref(false)
const newProductForm = reactive({
  name: '',
  price: '',
  category: '',
  newCategory: '',
  unit: '',
  manufacturer: ''
})

const closeAddProductModal = () => {
  showAddProductModal.value = false
  newProductForm.name = ''
  newProductForm.price = ''
  newProductForm.category = ''
  newProductForm.newCategory = ''
  newProductForm.unit = ''
  newProductForm.manufacturer = ''
}

const submitAddProduct = async () => {
  try {
    const finalCategory = newProductForm.category === 'NEW_CATEGORY'
      ? newProductForm.newCategory.trim()
      : newProductForm.category

    if (!finalCategory) {
      toastStore.warning('Пожалуйста, выберите или укажите категорию')
      return
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({
        name: newProductForm.name,
        price: parseFloat(newProductForm.price),
        category: finalCategory,
        unit: newProductForm.unit,
        manufacturer: newProductForm.manufacturer
      })
    })

    const data = await response.json()
    if (response.ok) {
      products.value.push(data.product)
      closeAddProductModal()
      toastStore.success('Товар успешно добавлен!')
    } else {
      toastStore.error(data.message || 'Ошибка при добавлении товара')
    }
  } catch (err) {
    console.error(err)
    toastStore.error('Не удалось добавить товар')
  }
}

const tabs = [
  { id: 'restaurants', name: 'Рестораны', icon: Users },
  { id: 'debts', name: 'Взаиморасчеты', icon: Wallet },
  { id: 'products', name: 'Каталог цен', icon: DollarSign },
  { id: 'invoices', name: 'Накладные', icon: ClipboardList },
  { id: 'reports', name: 'Отчет по дням', icon: TrendingUp }
]

const activeTab = ref('restaurants')
const productSearch = ref('')
const filterCategory = ref('all')
const filterManufacturer = ref('all')
const selectedMonth = ref('all')
const activeInvoice = ref(null)
const invoiceSearch = ref('')
const filterRestaurant = ref('all')
const sortInvoiceField = ref('created_at')
const sortInvoiceOrder = ref('desc')

// Sorting State
const sortField = ref('name')
const sortOrder = ref('asc') // 'asc' or 'desc'

// Infinite Scroll State
const scrollSentinel = ref(null)
const displayedLimit = ref(40)
let sentinelObserver = null

// Inline Editing Product State
const editingProductId = ref(null)
const editProductForm = reactive({
  name: '',
  price: 0,
  category: '',
  unit: '',
  manufacturer: ''
})

// Loaders & State Refs
const restaurants = ref([])
const loadingUsers = ref(true)

const products = ref([])
const loadingProducts = ref(true)

const orders = ref([])
const loadingOrders = ref(true)

const fetchRestaurants = async () => {
  try {
    loadingUsers.value = true
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/users`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    if (response.ok) {
      restaurants.value = await response.json()
    }
  } catch (err) {
    console.error('Failed to load restaurants:', err)
  } finally {
    loadingUsers.value = false
  }
}

const fetchProducts = async () => {
  try {
    loadingProducts.value = true
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`)
    if (response.ok) {
      products.value = await response.json()
    }
  } catch (err) {
    console.error('Failed to load products:', err)
  } finally {
    loadingProducts.value = false
    nextTick(() => {
      setupSentinelObserver()
    })
  }
}

const fetchOrders = async () => {
  try {
    loadingOrders.value = true
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    if (response.ok) {
      orders.value = await response.json()
    }
  } catch (err) {
    console.error('Failed to load orders:', err)
  } finally {
    loadingOrders.value = false
  }
}

// Infinite Scroll intersection trigger
const setupSentinelObserver = () => {
  if (sentinelObserver) sentinelObserver.disconnect()

  sentinelObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      if (displayedLimit.value < filteredProducts.value.length) {
        displayedLimit.value += 40
      }
    }
  }, {
    rootMargin: '150px' // Preload next products slightly early
  })

  if (scrollSentinel.value) {
    sentinelObserver.observe(scrollSentinel.value)
  }
}

// Reset displayed count whenever filtering or sorting changes
const resetLimit = () => {
  displayedLimit.value = 40
  // Re-observe after viewport updates
  nextTick(() => {
    if (scrollSentinel.value && sentinelObserver) {
      sentinelObserver.unobserve(scrollSentinel.value)
      sentinelObserver.observe(scrollSentinel.value)
    }
  })
}

// Observe tab change to trigger sentinel setup
watch(activeTab, (newTab) => {
  if (newTab === 'products') {
    nextTick(() => {
      setupSentinelObserver()
    })
  }
})

// Reset on searches and filters
watch([productSearch, filterCategory, filterManufacturer, sortField, sortOrder], () => {
  resetLimit()
})

// --- Payments & Purchase Report Logic ---
const payments = ref([])
const loadingPayments = ref(false)
const selectedReportRestaurant = ref('all')
const selectedReportMonth = ref('all')
const showRecordPaymentModal = ref(false)
const isSavingPayment = ref(false)
const isGeneratingReportPDF = ref(false)
const reportPdfTemplateRef = ref(null)

const showPaymentsHistoryModal = ref(false)
const selectedHistoryRestaurant = ref(null)
const editingPaymentId = ref(null)
const editPaymentForm = reactive({
  amount: '',
  created_at: ''
})

const restaurantPaymentsList = computed(() => {
  if (!selectedHistoryRestaurant.value) return []
  return payments.value.filter(p => p.user_id === selectedHistoryRestaurant.value.id)
})

const openPaymentsHistory = (restaurant) => {
  selectedHistoryRestaurant.value = restaurant
  showPaymentsHistoryModal.value = true
}

const startPaymentEdit = (payment) => {
  editingPaymentId.value = payment.id
  let dateObj = payment.created_at ? new Date(payment.created_at) : new Date()
  const tzOffset = dateObj.getTimezoneOffset() * 60000
  const localISOTime = (new Date(dateObj.getTime() - tzOffset)).toISOString().slice(0, 16)
  
  editPaymentForm.amount = payment.amount
  editPaymentForm.created_at = localISOTime
}

const cancelPaymentEdit = () => {
  editingPaymentId.value = null
  editPaymentForm.amount = ''
  editPaymentForm.created_at = ''
}

const savePaymentEdit = async (paymentId) => {
  if (!editPaymentForm.amount || editPaymentForm.amount <= 0) {
    toastStore.warning('Пожалуйста, введите корректную сумму оплаты.')
    return
  }
  
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/payments/${paymentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({
        amount: parseFloat(editPaymentForm.amount),
        created_at: editPaymentForm.created_at || null,
        user_id: selectedHistoryRestaurant.value?.id
      })
    })
    
    const data = await response.json()
    if (response.ok) {
      toastStore.success('Оплата успешно обновлена!')
      editingPaymentId.value = null
      await fetchPayments()
      await fetchRestaurants() // refresh client balance totals
    } else {
      toastStore.error(data.message || 'Ошибка при обновлении оплаты')
    }
  } catch (err) {
    console.error(err)
    toastStore.error('Не удалось обновить оплату')
  }
}

const deletePayment = async (paymentId) => {
  if (!confirm('Вы действительно хотите удалить этот платеж?')) {
    return
  }
  
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/payments/${paymentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    
    const data = await response.json()
    if (response.ok) {
      toastStore.success('Оплата успешно удалена!')
      await fetchPayments()
      await fetchRestaurants() // refresh client balance totals
    } else {
      toastStore.error(data.message || 'Ошибка при удалении оплаты')
    }
  } catch (err) {
    console.error(err)
    toastStore.error('Не удалось удалить оплату')
  }
}

const newPaymentForm = reactive({
  user_id: '',
  amount: '',
  created_at: ''
})

const fetchPayments = async () => {
  try {
    loadingPayments.value = true
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/payments`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    if (response.ok) {
      payments.value = await response.json()
    }
  } catch (err) {
    console.error('Failed to load payments:', err)
  } finally {
    loadingPayments.value = false
  }
}

// Helper to get formatted date string as YYYY-MM-DD
const formatDateString = (dateStr) => {
  const d = new Date(dateStr)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getRussianMonthName = (dateStr) => {
  const d = new Date(dateStr)
  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ]
  return months[d.getMonth()]
}

// Compute daily report rows
const dailyReportRows = computed(() => {
  const dateMap = {}

  // Filter orders by selected restaurant
  const filteredOrdersList = orders.value.filter(order => {
    if (selectedReportRestaurant.value === 'all') return true
    return order.restaurant_name === selectedReportRestaurant.value
  })

  // Filter payments by selected restaurant
  const filteredPaymentsList = payments.value.filter(pay => {
    if (selectedReportRestaurant.value === 'all') return true
    return pay.restaurant_name === selectedReportRestaurant.value
  })

  // Group orders by day
  filteredOrdersList.forEach(order => {
    const dayKey = formatDateString(order.created_at)
    if (!dateMap[dayKey]) {
      dateMap[dayKey] = {
        date: dayKey,
        purchases: 0,
        payments: 0,
        orderCount: 0
      }
    }
    dateMap[dayKey].purchases += parseFloat(order.total_price) || 0
    dateMap[dayKey].orderCount += 1
  })

  // Group payments by day
  filteredPaymentsList.forEach(pay => {
    const dayKey = formatDateString(pay.created_at)
    if (!dateMap[dayKey]) {
      dateMap[dayKey] = {
        date: dayKey,
        purchases: 0,
        payments: 0,
        orderCount: 0
      }
    }
    dateMap[dayKey].payments += parseFloat(pay.amount) || 0
  })

  // Sort daily rows chronologically
  const sortedDates = Object.keys(dateMap).sort((a, b) => new Date(a) - new Date(b))

  let runningBalance = 0
  const rows = sortedDates.map(dateStr => {
    const data = dateMap[dateStr]
    runningBalance = runningBalance + data.purchases - data.payments
    
    const d = new Date(dateStr)
    const formattedDate = d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
    
    return {
      date: dateStr,
      dateFormatted: formattedDate,
      month: getRussianMonthName(dateStr),
      year: d.getFullYear().toString(),
      orderCount: data.orderCount,
      purchases: data.purchases,
      payments: data.payments,
      balance: runningBalance
    }
  })

  // Apply month filter on the final rows (so running balance is computed correctly over history first!)
  if (selectedReportMonth.value !== 'all') {
    return rows.filter(row => {
      const monthYearText = `${row.month} ${row.year}`
      return monthYearText === selectedReportMonth.value
    })
  }

  return rows
})

// Compute monthly summary rows
const monthlySummaryRows = computed(() => {
  const monthMap = {}

  // Filter orders by selected restaurant
  const filteredOrdersList = orders.value.filter(order => {
    if (selectedReportRestaurant.value === 'all') return true
    return order.restaurant_name === selectedReportRestaurant.value
  })

  // Filter payments by selected restaurant
  const filteredPaymentsList = payments.value.filter(pay => {
    if (selectedReportRestaurant.value === 'all') return true
    return pay.restaurant_name === selectedReportRestaurant.value
  })

  // Group orders by month-year
  filteredOrdersList.forEach(order => {
    const d = new Date(order.created_at)
    const mName = getRussianMonthName(order.created_at)
    const year = d.getFullYear()
    const monthKey = `${mName} ${year}`
    
    if (!monthMap[monthKey]) {
      monthMap[monthKey] = {
        month: mName,
        year: year.toString(),
        orderCount: 0,
        purchases: 0,
        payments: 0,
        sortDate: new Date(year, d.getMonth(), 1)
      }
    }
    monthMap[monthKey].purchases += parseFloat(order.total_price) || 0
    monthMap[monthKey].orderCount += 1
  })

  // Group payments by month-year
  filteredPaymentsList.forEach(pay => {
    const d = new Date(pay.created_at)
    const mName = getRussianMonthName(pay.created_at)
    const year = d.getFullYear()
    const monthKey = `${mName} ${year}`
    
    if (!monthMap[monthKey]) {
      monthMap[monthKey] = {
        month: mName,
        year: year.toString(),
        orderCount: 0,
        purchases: 0,
        payments: 0,
        sortDate: new Date(year, d.getMonth(), 1)
      }
    }
    monthMap[monthKey].payments += parseFloat(pay.amount) || 0
  })

  // Sort months chronologically
  const sortedMonthKeys = Object.keys(monthMap).sort((a, b) => monthMap[a].sortDate - monthMap[b].sortDate)

  let runningDebt = 0
  const rows = sortedMonthKeys.map(key => {
    const data = monthMap[key]
    runningDebt = runningDebt + data.purchases - data.payments
    return {
      month: data.month,
      year: data.year,
      orderCount: data.orderCount,
      purchases: data.purchases,
      payments: data.payments,
      debt: runningDebt
    }
  })

  // Apply month filter if selected
  if (selectedReportMonth.value !== 'all') {
    return rows.filter(row => `${row.month} ${row.year}` === selectedReportMonth.value)
  }

  return rows
})

// Populating unique list of months for drop-downs
const uniqueReportMonths = computed(() => {
  const months = new Set()
  orders.value.forEach(order => {
    const d = new Date(order.created_at)
    const mName = getRussianMonthName(order.created_at)
    months.add(`${mName} ${d.getFullYear()}`)
  })
  payments.value.forEach(pay => {
    const d = new Date(pay.created_at)
    const mName = getRussianMonthName(pay.created_at)
    months.add(`${mName} ${d.getFullYear()}`)
  })
  return Array.from(months)
})

// Save payment logic
const submitAddPayment = async () => {
  if (!newPaymentForm.user_id || !newPaymentForm.amount) {
    toastStore.warning('Пожалуйста, выберите ресторан и введите сумму.')
    return
  }
  
  try {
    isSavingPayment.value = true
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({
        user_id: parseInt(newPaymentForm.user_id, 10),
        amount: parseFloat(newPaymentForm.amount),
        created_at: newPaymentForm.created_at || null
      })
    })
    
    const data = await response.json()
    if (response.ok) {
      toastStore.success('Оплата успешно зафиксирована!')
      showRecordPaymentModal.value = false
      // Reset form
      newPaymentForm.user_id = ''
      newPaymentForm.amount = ''
      newPaymentForm.created_at = ''
      // Re-fetch data
      await fetchPayments()
      await fetchRestaurants() // to update paid_amount in settlements
    } else {
      toastStore.error(data.message || 'Ошибка сохранения оплаты')
    }
  } catch (err) {
    console.error(err)
    toastStore.error('Не удалось сохранить оплату')
  } finally {
    isSavingPayment.value = false
  }
}

const exportReportToCSV = () => {
  const date = new Date().toLocaleDateString('ru-RU').replace(/\./g, '_')
  const restName = selectedReportRestaurant.value === 'all' ? 'Все_рестораны' : selectedReportRestaurant.value
  const monthName = selectedReportMonth.value === 'all' ? 'Все_периоды' : selectedReportMonth.value.replace(' ', '_')
  
  let csvContent = "\uFEFF"
  csvContent += `ОТЧЕТ ПО ЗАКУПКАМ И ОПЛАТАМ ПО ДНЯМ\n`
  csvContent += `Ресторан: ${selectedReportRestaurant.value === 'all' ? 'Все рестораны' : selectedReportRestaurant.value}\n`
  csvContent += `Период: ${selectedReportMonth.value === 'all' ? 'Все периоды' : selectedReportMonth.value}\n\n`
  
  const dailyHeaders = ['Дата', 'Месяц', 'Год', 'Кол-во накладных', 'Сумма закупок, KZT', 'Оплата, KZT', 'Остаток, KZT']
  csvContent += dailyHeaders.join(';') + '\n'
  
  dailyReportRows.value.forEach(row => {
    csvContent += [
      row.dateFormatted,
      row.month,
      row.year,
      row.orderCount,
      row.purchases,
      row.payments,
      row.balance
    ].join(';') + '\n'
  })
  
  csvContent += `\n\nИТОГО ПО МЕСЯЦУ\n`
  const monthlyHeaders = ['Месяц', 'Год', 'Кол-во накладных', 'Общие закупки, KZT', 'Общие оплаты, KZT', 'Остаток долга, KZT']
  csvContent += monthlyHeaders.join(';') + '\n'
  
  monthlySummaryRows.value.forEach(row => {
    csvContent += [
      row.month,
      row.year,
      row.orderCount,
      row.purchases,
      row.payments,
      row.debt
    ].join(';') + '\n'
  })
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `Отчет_закупки_${restName}_${monthName}_${date}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  toastStore.success('Отчет CSV успешно скачан!')
}

const generateReportPDF = async () => {
  if (!reportPdfTemplateRef.value) return
  isGeneratingReportPDF.value = true
  
  try {
    const html2pdf = (await import('html2pdf.js')).default
    const element = reportPdfTemplateRef.value
    
    const date = new Date().toLocaleDateString('ru-RU').replace(/\./g, '_')
    const restName = selectedReportRestaurant.value === 'all' ? 'Все_рестораны' : selectedReportRestaurant.value
    const monthName = selectedReportMonth.value === 'all' ? 'Все_периоды' : selectedReportMonth.value.replace(' ', '_')
    
    const options = {
      margin: [0.4, 0.4, 0.4, 0.4],
      filename: `Отчет_закупки_${restName}_${monthName}_${date}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }
    
    await html2pdf()
      .from(element)
      .set(options)
      .save()
      
    toastStore.success('PDF отчет успешно скачан!')
  } catch (err) {
    console.error('Error generating report PDF:', err)
    toastStore.error('Не удалось сгенерировать PDF отчет')
  } finally {
    isGeneratingReportPDF.value = false
  }
}

onMounted(() => {
  fetchRestaurants()
  fetchProducts()
  fetchOrders()
  fetchPayments()
})

onUnmounted(() => {
  if (sentinelObserver) sentinelObserver.disconnect()
})

// Unique Lists for Dropdown Filters
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
    'Ягоды и овощи с/м'
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

const uniqueManufacturers = computed(() => {
  return [...new Set(products.value.map(p => p.manufacturer))].sort()
})

// Multi-variable sorting & filtering
const filteredProducts = computed(() => {
  let list = products.value

  // Search by name
  if (productSearch.value) {
    const q = productSearch.value.toLowerCase()
    list = list.filter(p => p.name.toLowerCase().includes(q))
  }

  // Filter by category
  if (filterCategory.value !== 'all') {
    list = list.filter(p => p.category === filterCategory.value)
  }

  // Filter by manufacturer
  if (filterManufacturer.value !== 'all') {
    list = list.filter(p => p.manufacturer === filterManufacturer.value)
  }

  // Sort list
  list = [...list].sort((a, b) => {
    let fieldA = a[sortField.value]
    let fieldB = b[sortField.value]

    if (typeof fieldA === 'string') {
      fieldA = fieldA.toLowerCase()
      fieldB = fieldB.toLowerCase()
    }

    if (fieldA < fieldB) return sortOrder.value === 'asc' ? -1 : 1
    if (fieldA > fieldB) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })

  return list
})

// Slice catalog matching dynamic scroll state
const displayedProducts = computed(() => {
  return filteredProducts.value.slice(0, displayedLimit.value)
})

// Toggle column sorting
const toggleSort = (field) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
}

// Inline editing functions
const startProductEdit = (product) => {
  editingProductId.value = product.id
  editProductForm.name = product.name
  editProductForm.price = product.price
  editProductForm.category = product.category
  editProductForm.unit = product.unit
  editProductForm.manufacturer = product.manufacturer
}

const cancelProductEdit = () => {
  editingProductId.value = null
}

const saveProductEdit = async (prodId) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/products/${prodId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(editProductForm)
    })
    const data = await response.json()
    if (response.ok) {
      // Find and update item locally
      const idx = products.value.findIndex(p => p.id === prodId)
      if (idx !== -1) {
        products.value[idx] = { ...data.product }
      }
      editingProductId.value = null
      await fetchOrders()
      toastStore.success('Товар успешно обновлен!')
    } else {
      toastStore.error(data.message || 'Ошибка обновления')
    }
  } catch (err) {
    console.error(err)
    toastStore.error('Не удалось сохранить изменения')
  }
}

const getRestaurantPrefix = (name) => {
  if (!name) return 'ГМ'
  const clean = name.replace(/["'«»“”„“]/g, '').trim()
  const words = clean.split(/[\s\-]+/)
  let prefix = words.map(w => w.charAt(0).toUpperCase()).join('')
  if (prefix.length < 2) {
    prefix = clean.slice(0, 3).toUpperCase()
  }
  return prefix
}

const getAdminRestaurantOrderNumber = (order) => {
  if (!order || !orders.value.length) return 1
  const restaurantOrders = orders.value
    .filter(o => o.restaurant_name === order.restaurant_name)
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
  const index = restaurantOrders.findIndex(o => o.id === order.id)
  return index !== -1 ? index + 1 : 1
}

const uniqueInvoiceMonths = computed(() => {
  const months = new Set()
  orders.value.forEach(order => {
    const date = new Date(order.created_at)
    const monthYear = date.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })
    const capitalized = monthYear.charAt(0).toUpperCase() + monthYear.slice(1)
    months.add(capitalized)
  })
  return Array.from(months)
})

const uniqueInvoiceRestaurants = computed(() => {
  return [...new Set(orders.value.map(o => o.restaurant_name))].sort()
})

const filteredOrders = computed(() => {
  let list = orders.value

  // Search filter
  if (invoiceSearch.value) {
    const q = invoiceSearch.value.toLowerCase()
    list = list.filter(order => {
      const idStr = `№${order.id}`
      const prefix = getRestaurantPrefix(order.restaurant_name)
      const formattedId = `${prefix}-${String(getAdminRestaurantOrderNumber(order)).padStart(2, '0')}`
      return (
        order.id.toString().includes(q) ||
        idStr.toLowerCase().includes(q) ||
        formattedId.toLowerCase().includes(q) ||
        order.restaurant_name.toLowerCase().includes(q) ||
        order.restaurant_email.toLowerCase().includes(q)
      )
    })
  }

  // Restaurant filter
  if (filterRestaurant.value !== 'all') {
    list = list.filter(order => order.restaurant_name === filterRestaurant.value)
  }

  // Month filter
  if (selectedMonth.value !== 'all') {
    list = list.filter(order => {
      const date = new Date(order.created_at)
      const monthYear = date.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })
      const capitalized = monthYear.charAt(0).toUpperCase() + monthYear.slice(1)
      return capitalized === selectedMonth.value
    })
  }

  // Sorting
  list = [...list].sort((a, b) => {
    let valA, valB

    if (sortInvoiceField.value === 'id') {
      valA = a.id
      valB = b.id
    } else if (sortInvoiceField.value === 'restaurant_name') {
      valA = a.restaurant_name.toLowerCase()
      valB = b.restaurant_name.toLowerCase()
    } else if (sortInvoiceField.value === 'created_at') {
      valA = new Date(a.created_at).getTime()
      valB = new Date(b.created_at).getTime()
    } else if (sortInvoiceField.value === 'total_price') {
      valA = a.total_price
      valB = b.total_price
    } else {
      valA = new Date(a.created_at).getTime()
      valB = new Date(b.created_at).getTime()
    }

    if (valA < valB) return sortInvoiceOrder.value === 'asc' ? -1 : 1
    if (valA > valB) return sortInvoiceOrder.value === 'asc' ? 1 : -1
    return 0
  })

  return list
})

const toggleInvoiceSort = (field) => {
  if (sortInvoiceField.value === field) {
    sortInvoiceOrder.value = sortInvoiceOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortInvoiceField.value = field
    sortInvoiceOrder.value = 'asc'
  }
}

const updateLimit = async (userId, limit) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/users/${userId}/limit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({ limit })
    })
    const data = await response.json()
    if (response.ok) {
      toastStore.success(data.message)
    } else {
      toastStore.error(data.message || 'Ошибка обновления')
    }
  } catch (err) {
    console.error(err)
    toastStore.error('Не удалось обновить лимит')
  }
}

const updateDiscount = async (userId, discount) => {
  if (discount === undefined || isNaN(discount) || discount < 0 || discount > 100) {
    toastStore.warning('Некорректный процент скидки (должен быть от 0 до 100)')
    return
  }
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/users/${userId}/discount`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({ discount })
    })
    const data = await response.json()
    if (response.ok) {
      toastStore.success(data.message)
    } else {
      toastStore.error(data.message || 'Ошибка обновления')
    }
  } catch (err) {
    console.error(err)
    toastStore.error('Не удалось обновить скидку')
  }
}

const deleteRestaurant = async (userId, name) => {
  if (!confirm(`Вы действительно хотите безвозвратно удалить ресторан "${name}"?`)) return
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    const data = await response.json()
    if (response.ok) {
      toastStore.success(data.message)
      restaurants.value = restaurants.value.filter(r => r.id !== userId)
    } else {
      toastStore.error(data.message || 'Ошибка удаления')
    }
  } catch (err) {
    console.error(err)
    toastStore.error('Не удалось удалить ресторан')
  }
}

const deleteProduct = async (productId, name) => {
  if (!confirm(`Вы действительно хотите удалить товар "${name}"?`)) return
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    if (response.ok) {
      products.value = products.value.filter(p => p.id !== productId)
      toastStore.success(`Товар "${name}" успешно удален!`)
    } else {
      const data = await response.json()
      toastStore.error(data.message || 'Ошибка при удалении товара')
    }
  } catch (err) {
    console.error(err)
    toastStore.error('Не удалось удалить товар')
  }
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatPrice = (price) => {
  const p = parseFloat(price)
  if (isNaN(p)) return '0'
  return new Intl.NumberFormat('ru-RU').format(p)
}

const showInvoiceDetails = (order) => {
  activeInvoice.value = JSON.parse(JSON.stringify(order))
}

const updateInvoiceTotal = () => {
  if (activeInvoice.value && activeInvoice.value.items) {
    const originalSum = activeInvoice.value.items.reduce((sum, item) => {
      return sum + (item.price * (parseFloat(item.quantity) || 0))
    }, 0)
    
    // Recalculate discounted total if there is a discount
    const discount = parseFloat(activeInvoice.value.discount || 0)
    activeInvoice.value.original_price = originalSum
    activeInvoice.value.total_price = Math.round((originalSum * (1 - discount / 100)) * 100) / 100
  }
}

const saveInvoiceChanges = async () => {
  if (isSavingInvoice.value) return
  isSavingInvoice.value = true
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/orders/${activeInvoice.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({
        items: activeInvoice.value.items,
        totalPrice: activeInvoice.value.total_price,
        discount: parseFloat(activeInvoice.value.discount || 0),
        originalPrice: parseFloat(activeInvoice.value.original_price || activeInvoice.value.total_price)
      })
    })

    const data = await response.json()
    if (response.ok) {
      const idx = orders.value.findIndex(o => o.id === activeInvoice.value.id)
      if (idx !== -1) {
        orders.value[idx] = { 
          ...orders.value[idx], 
          ...data.order 
        }
      }
      activeInvoice.value = null
      toastStore.success('Накладная успешно сохранена!')
    } else {
      toastStore.error(data.message || 'Ошибка сохранения')
    }
  } catch (err) {
    console.error(err)
    toastStore.error('Не удалось сохранить изменения')
  } finally {
    isSavingInvoice.value = false
  }
}

const totalShipped = computed(() => {
  return restaurants.value.reduce((sum, r) => sum + (parseFloat(r.shipped_amount) || 0), 0)
})

const totalPaid = computed(() => {
  return restaurants.value.reduce((sum, r) => sum + (parseFloat(r.paid_amount) || 0), 0)
})

const totalDebt = computed(() => {
  return totalShipped.value - totalPaid.value
})

const totalOverdue = computed(() => {
  return restaurants.value.reduce((sum, r) => sum + (parseFloat(r.overdue_amount) || 0), 0)
})

const saveDebts = async (userId, shipped, paid, overdue) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/users/${userId}/debts`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({
        shipped_amount: shipped || 0,
        paid_amount: paid || 0,
        overdue_amount: overdue || 0
      })
    })
    const data = await response.json()
    if (response.ok) {
      toastStore.success('Данные взаиморасчетов сохранены!')
      const idx = restaurants.value.findIndex(r => r.id === userId)
      if (idx !== -1) {
        restaurants.value[idx].shipped_amount = parseFloat(shipped) || 0
        restaurants.value[idx].paid_amount = parseFloat(paid) || 0
        restaurants.value[idx].overdue_amount = parseFloat(overdue) || 0
      }
    } else {
      toastStore.error(data.message || 'Ошибка обновления')
    }
  } catch (err) {
    console.error(err)
    toastStore.error('Не удалось обновить взаиморасчеты')
  }
}

const exportToCSV = () => {
  const headers = ['Покупатель', 'Отгружено, KZT', 'Оплачено, KZT', 'Текущая задолженность, KZT', 'Просроченная задолженность, KZT']
  const rows = restaurants.value.map(res => [
    res.name,
    res.shipped_amount,
    res.paid_amount,
    res.shipped_amount - res.paid_amount,
    res.overdue_amount
  ])
  rows.push([
    'ИТОГО',
    totalShipped.value,
    totalPaid.value,
    totalDebt.value,
    totalOverdue.value
  ])
  
  const csvContent = "\uFEFF" + [
    headers.join(';'),
    ...rows.map(e => e.join(';'))
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  
  const date = new Date().toLocaleDateString('ru-RU').replace(/\./g, '_')
  link.setAttribute("download", `Отчет_взаиморасчеты_${date}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  toastStore.success('Отчет CSV успешно скачан!')
}

const generateDebtsPDF = async () => {
  if (!debtsPdfTemplateRef.value) return
  isGeneratingDebtsPDF.value = true
  
  try {
    const html2pdf = (await import('html2pdf.js')).default
    const element = debtsPdfTemplateRef.value
    
    const date = new Date().toLocaleDateString('ru-RU').replace(/\./g, '_')
    const options = {
      margin: [0.4, 0.4, 0.4, 0.4],
      filename: `Отчет_взаиморасчеты_${date}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }
    
    await html2pdf()
      .from(element)
      .set(options)
      .save()
      
    toastStore.success('PDF отчет успешно скачан!')
  } catch (err) {
    console.error('Error generating debts PDF:', err)
    toastStore.error('Не удалось сгенерировать PDF отчет')
  } finally {
    isGeneratingDebtsPDF.value = false
  }
}
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background-color: var(--light);
}

.admin-header {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
  padding-top: 10rem;
  padding-bottom: 4rem;
  color: var(--white);
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
}

.admin-profile {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  max-width: 600px;
}

.shield-glow {
  width: 70px;
  height: 70px;
  border-radius: 20px;
  background: rgba(37, 99, 235, 0.15);
  border: 1px solid rgba(37, 99, 235, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-light);
  box-shadow: 0 0 20px rgba(37, 99, 235, 0.3);
  flex-shrink: 0;
}

.admin-profile h1 {
  font-size: 2rem;
  margin-bottom: 0.25rem;
}

.admin-profile p {
  color: var(--gray);
  font-size: 0.95rem;
  line-height: 1.4;
}

.admin-tabs {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.35rem;
  border-radius: 16px;
  gap: 0.25rem;
}

.tab-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--white);
  opacity: 0.8;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tab-btn:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.05);
}

.tab-btn.active {
  background: var(--secondary);
  color: var(--white);
  opacity: 1;
}

.admin-content {
  padding-top: 3rem;
  padding-bottom: 6rem;
}

.card-header {
  margin-bottom: 2rem;
}

.card-header h2 {
  font-size: 1.6rem;
  color: var(--primary);
  margin-bottom: 0.25rem;
}

.card-header p {
  color: var(--gray);
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
  background: var(--white);
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  box-shadow: var(--shadow);
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.admin-table th {
  background: #f8fafc;
  padding: 1.25rem 1rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--gray);
  text-transform: uppercase;
  border-bottom: 1px solid #e2e8f0;
  user-select: none;
}

.sortable-header {
  cursor: pointer;
  transition: color 0.3s ease;
}

.sortable-header:hover {
  color: var(--secondary-dark);
}

.header-content {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.admin-table td {
  padding: 1.25rem 1rem;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.95rem;
  color: var(--primary-light);
}

.font-bold {
  font-weight: 700;
  color: var(--primary);
}

.category-pill {
  background: #f1f5f9;
  color: var(--primary);
  font-weight: 600;
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  text-transform: uppercase;
}

.limit-edit-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  max-width: 180px;
}

.limit-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-weight: 700;
  color: var(--primary);
  outline: none;
}

.limit-input:focus {
  border-color: var(--secondary);
}

.btn-save-limit {
  background: var(--primary);
  color: var(--white);
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-save-limit:hover {
  background: var(--secondary);
}

.btn-delete {
  color: var(--gray);
  padding: 0.5rem;
}

.btn-delete:hover {
  color: #ef4444;
  transform: scale(1.1);
}

.btn-inspect {
  color: var(--primary);
  padding: 0.5rem;
}

.btn-inspect:hover {
  color: var(--secondary);
  transform: scale(1.1);
}

/* Search Filters Box styling */
.price-header-row, .invoice-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.search-filters-box {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.admin-search-bar {
  position: relative;
  width: 250px;
}

.admin-search-bar input {
  width: 100%;
  padding: 0.6rem 1rem 0.6rem 2.5rem;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  outline: none;
  font-size: 0.9rem;
}

.admin-search-bar input:focus {
  border-color: var(--secondary);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.admin-search-bar .search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray);
}

.admin-select-filter {
  padding: 0.6rem 1.75rem 0.6rem 1rem;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  font-weight: 600;
  font-size: 0.9rem;
  background-color: white;
  appearance: none;
  cursor: pointer;
  background: white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E") no-repeat right 0.75rem center;
}

/* Inline Edit Controls */
.inline-edit-input, .inline-edit-select {
  width: 100%;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid var(--secondary);
  font-size: 0.9rem;
  outline: none;
  color: var(--primary);
  background: rgba(245, 158, 11, 0.02);
}

.inline-edit-select {
  appearance: none;
  cursor: pointer;
  background: rgba(245, 158, 11, 0.02) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E") no-repeat right 0.5rem center;
  padding-right: 1.75rem;
}

.inline-edit-input:focus, .inline-edit-select:focus {
  background: white;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.2);
}

.edit-actions-row {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.btn-action-save {
  background: #22c55e;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-action-save:hover {
  background: #16a34a;
}

.btn-action-cancel {
  background: #ef4444;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-action-cancel:hover {
  background: #dc2626;
}

.btn-edit-row {
  background: rgba(245, 158, 11, 0.1);
  color: var(--secondary-dark);
  border: 1px solid rgba(245, 158, 11, 0.2);
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.btn-edit-row:hover {
  background: var(--secondary);
  color: white;
  border-color: var(--secondary);
}

/* Infinite Scroll Sentinel Styling */
.scroll-sentinel {
  padding: 3rem 0;
  text-align: center;
  font-weight: 600;
  color: var(--gray);
}

.sentinel-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.loader-dots {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: block;
  margin: 0 auto;
  position: relative;
  color: var(--secondary);
  box-sizing: border-box;
  animation: shadowPulse 2s linear infinite;
}

@keyframes shadowPulse {
  0% {
    box-shadow: -24px 0 var(--secondary), -8px 0 rgba(245, 158, 11, 0.2), 8px 0 rgba(245, 158, 11, 0.2), 24px 0 rgba(245, 158, 11, 0.2);
  }
  16.666% {
    box-shadow: -24px 0 rgba(245, 158, 11, 0.2), -8px 0 var(--secondary), 8px 0 rgba(245, 158, 11, 0.2), 24px 0 rgba(245, 158, 11, 0.2);
  }
  33.333% {
    box-shadow: -24px 0 rgba(245, 158, 11, 0.2), -8px 0 rgba(245, 158, 11, 0.2), 8px 0 var(--secondary), 24px 0 rgba(245, 158, 11, 0.2);
  }
  50.000% {
    box-shadow: -24px 0 rgba(245, 158, 11, 0.2), -8px 0 rgba(245, 158, 11, 0.2), 8px 0 rgba(245, 158, 11, 0.2), 24px 0 var(--secondary);
  }
  66.666% {
    box-shadow: -24px 0 rgba(245, 158, 11, 0.2), -8px 0 rgba(245, 158, 11, 0.2), 8px 0 var(--secondary), 24px 0 rgba(245, 158, 11, 0.2);
  }
  83.333% {
    box-shadow: -24px 0 rgba(245, 158, 11, 0.2), -8px 0 var(--secondary), 8px 0 rgba(245, 158, 11, 0.2), 24px 0 rgba(245, 158, 11, 0.2);
  }
  100% {
    box-shadow: -24px 0 var(--secondary), -8px 0 rgba(245, 158, 11, 0.2), 8px 0 rgba(245, 158, 11, 0.2), 24px 0 rgba(245, 158, 11, 0.2);
  }
}

.sentinel-end {
  font-size: 0.95rem;
  color: var(--gray);
  padding: 1rem;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  display: inline-block;
}

.month-filter-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.month-filter-group label {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--primary);
}

.admin-select {
  padding: 0.6rem 1.5rem 0.6rem 1rem;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  font-weight: 600;
  appearance: none;
  background: white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E") no-repeat right 0.75rem center;
}

.invoice-price-col {
  font-weight: 800;
  color: var(--secondary-dark);
}

/* Loaders / States */
.loading-state, .empty-state {
  text-align: center;
  padding: 5rem 2rem;
  background: var(--white);
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  color: var(--gray);
  box-shadow: var(--shadow);
}

.loader {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(11, 18, 33, 0.1);
  border-radius: 50%;
  border-top-color: var(--secondary);
  display: inline-block;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Modal details styling */
.details-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  z-index: 3000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.details-modal {
  background: var(--white);
  width: 100%;
  max-width: 650px;
  max-height: 85vh;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
}

.details-modal-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.details-modal-header h3 {
  font-size: 1.3rem;
  color: var(--primary);
}

.details-modal-body {
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
}

.invoice-meta-info {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 1.25rem 1.5rem;
  border-radius: 16px;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.invoice-meta-info p {
  margin-bottom: 0.5rem;
}

.invoice-meta-info p:last-child {
  margin-bottom: 0;
}

.modal-invoice-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.modal-invoice-table th {
  background: #f1f5f9;
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--gray);
  text-transform: uppercase;
}

.modal-invoice-table td {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.95rem;
}

.modal-total-row td {
  border-bottom: none;
  font-size: 1.1rem;
  padding-top: 1.5rem;
}

.close-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #f1f5f9;
}

.btn-add-product {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 10px;
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
}

.add-product-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--primary);
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  font-size: 0.95rem;
  outline: none;
  background: white;
  transition: var(--transition);
}

.form-group input:focus,
.form-group select:focus {
  border-color: var(--secondary);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-submit {
  background: var(--gradient-orange);
  color: var(--white);
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
}

.btn-submit:hover {
  filter: brightness(1.1);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
}

.btn-cancel {
  background: #f1f5f9;
  color: var(--primary);
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
}

.btn-cancel:hover {
  background: #e2e8f0;
}

.invoice-qty-edit {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
}

.invoice-qty-input {
  width: 65px;
  border: none;
  background: transparent;
  outline: none;
  font-weight: 700;
  color: var(--primary);
  text-align: center;
  font-size: 0.95rem;
}

.invoice-qty-unit {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--gray);
}

.details-modal-footer {
  padding: 1.25rem 2rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

@media (max-width: 992px) {
  .header-container {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 768px) {
  .admin-tabs { width: 100%; flex-direction: column; }
  .tab-btn { justify-content: center; }
  .price-header-row, .invoice-header-row { flex-direction: column; align-items: flex-start; }
  .search-filters-box { width: 100%; flex-direction: column; align-items: stretch; }
  .admin-search-bar { width: 100%; }

  /* Mobile responsive layout for all tables */
  .admin-table, 
  .admin-table thead, 
  .admin-table tbody, 
  .admin-table tr, 
  .admin-table td {
    display: block;
  }

  .admin-table thead {
    display: none; /* Hide default layout headers */
  }

  .admin-table tr {
    margin-bottom: 1.5rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
  }

  .admin-table tr:last-child {
    margin-bottom: 0;
  }

  .admin-table td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f1f5f9;
    padding: 0.75rem 0.5rem;
    text-align: right;
  }

  .admin-table td:last-child {
    border-bottom: none;
  }

  .admin-table td::before {
    content: attr(data-label);
    font-weight: 700;
    color: var(--gray);
    font-size: 0.75rem;
    text-transform: uppercase;
    text-align: left;
  }

  .limit-edit-wrapper {
    max-width: 100%;
    width: 60%;
    justify-content: flex-end;
  }

  .edit-actions-row {
    width: 100%;
    justify-content: flex-end;
  }

  .modal-invoice-table, 
  .modal-invoice-table thead, 
  .modal-invoice-table tbody, 
  .modal-invoice-table tr, 
  .modal-invoice-table td {
    display: block;
  }
  .modal-invoice-table thead {
    display: none;
  }
  .modal-invoice-table tr {
    margin-bottom: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 0.75rem;
    background: #f8fafc;
  }
  .modal-invoice-table td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f1f5f9;
    padding: 0.5rem 0.25rem;
    text-align: right;
  }
  .modal-invoice-table td:last-child {
    border-bottom: none;
  }
  .modal-invoice-table td::before {
    content: attr(data-label);
    font-weight: 700;
    color: var(--gray);
    font-size: 0.75rem;
    text-transform: uppercase;
  }
  .modal-total-row td.total-label-cell {
    display: flex;
    justify-content: space-between;
  }
  .modal-total-row td.total-amount-cell {
    display: flex;
    justify-content: flex-end;
    font-size: 1.2rem;
    color: var(--secondary-dark);
  }

  .details-modal {
    max-height: 95vh;
    border-radius: 16px;
    width: 100%;
  }
  .details-modal-body {
    padding: 1.25rem;
  }
}

.pdf-offscreen-container {
  position: absolute;
  left: -9999px;
  top: -9999px;
  width: 710px;
}

.pdf-invoice-f32 {
  font-family: 'Arial', 'Helvetica', sans-serif;
  color: #000;
  background: #fff;
  padding: 15px 15px 80px 15px;
  width: 710px;
  box-sizing: border-box;
}

.f32-appendix {
  text-align: right;
  font-size: 8px;
  line-height: 1.2;
  margin-bottom: 10px;
  font-style: italic;
}

.f32-org-header {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 8px;
}

.f32-org-header td {
  border: none;
  font-size: 8px;
  padding: 2px 0;
}

.f32-underline-cell {
  border-bottom: 1px solid #000 !important;
  font-weight: bold;
}

.f32-iin-bin-table {
  border-collapse: collapse;
  float: right;
}

.f32-iin-bin-table td {
  border: 1px solid #000 !important;
  font-size: 8px;
  padding: 2px 6px;
  text-align: center;
  font-weight: bold;
}

.f32-doc-meta-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
}

.f32-doc-meta-table {
  border-collapse: collapse;
}

.f32-doc-meta-table th, .f32-doc-meta-table td {
  border: 1px solid #000;
  font-size: 8px;
  padding: 4px 10px;
  text-align: center;
}

.f32-doc-meta-table th {
  background-color: #f3f4f6;
  font-weight: bold;
}

.f32-title {
  text-align: center;
  font-size: 13px;
  font-weight: bold;
  margin: 15px 0;
  letter-spacing: 0.5px;
}

.f32-parties-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px;
}

.f32-parties-table th, .f32-parties-table td {
  border: 1px solid #000;
  font-size: 8px;
  padding: 4px 6px;
  vertical-align: middle;
}

.f32-parties-table th {
  background-color: #f3f4f6;
  font-weight: bold;
  text-align: center;
}

.f32-parties-table td {
  text-align: left;
}

.f32-items-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 10px;
}

.f32-items-table th, .f32-items-table td {
  border: 1px solid #000;
  font-size: 8px;
  padding: 3px 5px;
  vertical-align: middle;
}

.f32-items-table th {
  background-color: #f3f4f6;
  font-weight: bold;
  text-align: center;
}

.f32-col-nums td {
  text-align: center !important;
  font-size: 7px;
  background-color: #f9fafb;
}

.f32-total-row td {
  font-weight: bold;
  background-color: #f9fafb;
}

.f32-words-section {
  font-size: 8.5px;
  line-height: 1.5;
  margin-bottom: 20px;
}

.f32-words-line {
  margin-bottom: 4px;
}

.f32-words-value {
  font-weight: bold;
  border-bottom: 1px solid #000;
  display: inline-block;
  padding-left: 5px;
  padding-right: 5px;
}

.admin-container {
  max-width: 1400px !important;
}

.debts-summary-card {
  margin-top: 2rem;
  background: var(--white);
  padding: 1.5rem 2rem;
  border-radius: 1.5rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  max-width: 400px;
}

.debts-summary-card h3 {
  font-size: 1.1rem;
  color: var(--primary);
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.debts-summary-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.debts-summary-list li {
  display: flex;
  justify-content: space-between;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--primary);
}

.summary-label {
  color: var(--gray);
}

.summary-value {
  font-weight: 700;
}

.text-success {
  color: #16a34a !important;
}

.text-danger {
  color: #dc2626 !important;
}

.debts-table td input {
  margin: 0;
}

@media (max-width: 768px) {
  .debts-table input.limit-input {
    width: 100% !important;
    max-width: 120px !important;
  }
}

/* Debts PDF Report Styles */
.pdf-debts-report {
  font-family: 'Arial', sans-serif;
  color: #000;
  background: #fff;
  padding: 20px;
  width: 710px;
  box-sizing: border-box;
}
.pdf-report-title {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
}
.pdf-report-meta {
  font-size: 10px;
  margin-bottom: 5px;
}
.pdf-report-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
  margin-bottom: 25px;
}
.pdf-report-table th, .pdf-report-table td {
  border: 1px solid #000;
  font-size: 9px;
  padding: 5px;
  text-align: left;
}
.pdf-report-table th {
  background-color: #f3f4f6;
  font-weight: bold;
  text-align: center;
}
.pdf-report-total-row td {
  font-weight: bold;
  background-color: #f9fafb;
}
.pdf-report-signatures {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
  font-size: 10px;
}
.sig-block {
  width: 45%;
}
.sig-block p {
  margin-bottom: 15px;
  font-weight: bold;
}
.sig-line {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}
.sig-line .line {
  font-family: monospace;
}

/* Debts Table Total Row Styles */
.debts-table-total-row {
  background-color: #f8fafc;
  font-weight: 700;
  border-top: 2px solid #cbd5e1;
}
.debts-table-total-row td {
  font-weight: 700;
  color: var(--primary) !important;
  font-size: 1rem;
}
</style>
