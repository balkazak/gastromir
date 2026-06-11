<template>
  <div class="profile-page">
    <section class="profile-header section-padding animate-fade">
      <div class="container header-container">
        <div class="user-info-card" v-motion-slide-visible-once-bottom>
          <div class="avatar-glow">
            <User :size="48" class="avatar-icon" />
          </div>
          <div class="user-meta">
            <h1>{{ authStore.user?.name }}</h1>
            <p class="email">{{ authStore.user?.email }}</p>
            <span class="badge">Ресторан</span>
          </div>
        </div>

        <div class="limit-status-card" v-motion-slide-visible-once-bottom>
          <div class="card-glow"></div>
          <div class="user-details-box">
            <div class="details-row">
              <Phone :size="20" class="details-icon" />
              <div>
                <h4>Телефон:</h4>
                <p>{{ authStore.user?.phone || 'Не указан' }}</p>
              </div>
            </div>
            <div class="details-row" style="margin-top: 1rem;">
              <MapPin :size="20" class="details-icon" />
              <div>
                <h4>Адрес доставки:</h4>
                <p>{{ authStore.user?.address || 'Не указан' }}</p>
              </div>
            </div>
            <!-- BIN / IIN -->
            <div class="details-row" style="margin-top: 1rem;">
              <FileText :size="20" class="details-icon" />
              <div>
                <h4>БИН (ИИН):</h4>
                <p>{{ authStore.user?.bin_iin || 'Не указан' }}</p>
              </div>
            </div>
            <!-- Bank -->
            <div class="details-row" style="margin-top: 1rem;">
              <Landmark :size="20" class="details-icon" />
              <div>
                <h4>Банк:</h4>
                <p>{{ authStore.user?.bank || 'Не указан' }}</p>
              </div>
            </div>
            <!-- KBe & BIC -->
            <div style="display: flex; gap: 1.5rem; margin-top: 1rem;">
              <div class="details-row" style="flex: 1;">
                <Hash :size="20" class="details-icon" />
                <div>
                  <h4>КБе:</h4>
                  <p>{{ authStore.user?.kbe || 'Не указан' }}</p>
                </div>
              </div>
              <div class="details-row" style="flex: 1;">
                <Globe :size="20" class="details-icon" />
                <div>
                  <h4>БИК:</h4>
                  <p>{{ authStore.user?.bic || 'Не указан' }}</p>
                </div>
              </div>
            </div>
            <!-- Account Number -->
            <div class="details-row" style="margin-top: 1rem;">
              <CreditCard :size="20" class="details-icon" />
              <div>
                <h4>Номер счета:</h4>
                <p>{{ authStore.user?.account_number || 'Не указан' }}</p>
              </div>
            </div>
            <button @click="openEditModal" class="btn btn-secondary btn-edit-profile" style="margin-top: 1.5rem; width: 100%;">
              <Edit3 :size="16" /> Редактировать профиль
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="invoices-section section-padding">
      <div class="container">
        <!-- Profile Tabs -->
        <div class="profile-tabs" v-motion-slide-visible-once-bottom>
          <button 
            :class="{ active: activeTab === 'invoices' }"
            @click="activeTab = 'invoices'"
            class="profile-tab-btn"
          >
            <ClipboardList :size="18" /> История накладных
          </button>
          <button 
            :class="{ active: activeTab === 'reports' }"
            @click="activeTab = 'reports'"
            class="profile-tab-btn"
          >
            <TrendingUp :size="18" /> Отчет по закупкам
          </button>
        </div>

        <!-- Tab 1: Invoices List -->
        <div v-if="activeTab === 'invoices'" class="tab-pane animate-fade">
          <div class="price-header-row" style="margin-bottom: 2rem; display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 1.5rem;">
            <div class="card-header" style="margin-bottom: 0;">
              <h2>История <span>накладных</span></h2>
              <p>Все ваши накладные с возможностью поиска, фильтрации и скачивания PDF</p>
            </div>
            
            <div class="search-filters-box debts-actions-box" style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; width: 100%; max-width: 600px;">
              <input 
                type="text" 
                v-model="searchInvoiceQuery" 
                placeholder="Поиск по № накладной или товару..." 
                class="admin-select-filter" 
                style="flex: 1; min-width: 200px; padding-right: 1rem;"
              />
              <VueDatePicker 
                v-model="invoiceDateRange" 
                range 
                :enable-time-picker="false" 
                :time-config="{ enableTimePicker: false }"
                :locale="ru" 
                placeholder="Выберите период" 
                auto-apply 
                key="profile-invoices-datepicker"
                style="width: 220px;"
              />
            </div>
          </div>

          <div v-if="loading" class="loading-state">
            <span class="loader"></span>
            <p>Загрузка истории накладных...</p>
          </div>

          <div v-else-if="orders.length === 0" class="empty-state" v-motion-pop>
            <ClipboardList :size="64" />
            <h3>Накладных пока нет</h3>
            <p>Сделайте свой первый заказ в каталоге товаров!</p>
            <router-link to="/catalog" class="btn btn-secondary">Перейти в каталог</router-link>
          </div>

          <div v-else-if="filteredOrders.length === 0" class="empty-state">
            <ClipboardList :size="48" />
            <p>Накладные по вашему запросу не найдены</p>
          </div>

          <div v-else>
            <div class="table-responsive">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>№ Накладной</th>
                    <th>Дата составления</th>
                    <th>Краткий состав</th>
                    <th style="text-align: right;">Сумма с НДС</th>
                    <th style="text-align: center;">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="order in filteredOrders" :key="order.id">
                    <td data-label="№ Накладной" class="font-bold">
                      № {{ order.waybill_number || `${getRestaurantPrefix(authStore.user?.name)}-${String(getRestaurantOrderNumber(order)).padStart(2, '0')}` }}
                    </td>
                    <td data-label="Дата составления">{{ formatDate(order.created_at) }}</td>
                    <td data-label="Краткий состав" style="max-width: 350px;">
                      <div style="display: flex; flex-wrap: wrap; gap: 0.35rem;">
                        <span v-for="(item, index) in order.items.slice(0, 2)" :key="index" style="display: inline-block; font-size: 0.8rem; background: #f1f5f9; padding: 0.15rem 0.4rem; border-radius: 6px; color: var(--primary-light);">
                          {{ item.name }} ({{ item.quantity }} {{ item.unit }})
                        </span>
                        <span v-if="order.items.length > 2" style="font-size: 0.8rem; color: var(--gray); align-self: center;">
                          и еще {{ order.items.length - 2 }}...
                        </span>
                      </div>
                    </td>
                    <td data-label="Сумма с НДС" style="text-align: right;" class="font-bold">{{ formatPrice(order.total_price) }} ₸</td>
                    <td data-label="Действия" style="text-align: center;">
                      <div style="display: flex; gap: 0.5rem; justify-content: center; align-items: center; flex-wrap: wrap;">
                        <button @click="showInvoiceDetails(order)" class="btn btn-secondary" style="padding: 0.4rem 0.85rem; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 0.25rem;">
                          <Eye :size="14" /> Детали
                        </button>
                        <button @click="downloadPDFInvoiceDirectly(order)" class="btn btn-primary" style="padding: 0.4rem 0.85rem; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 0.25rem;">
                          <Download :size="14" /> PDF
                        </button>
                        <button @click="repeatOrder(order)" class="btn btn-secondary" style="padding: 0.4rem 0.85rem; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 0.25rem; border-color: #10b981; color: #10b981; background: transparent;">
                          <RotateCcw :size="14" /> Повторить
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Tab 2: Purchases Report -->
        <div v-if="activeTab === 'reports'" class="tab-pane animate-fade">
          <div class="price-header-row" style="margin-bottom: 2rem; display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 1.5rem;">
            <div class="card-header" style="margin-bottom: 0;">
              <h2>Отчет по закупкам и оплатам по дням</h2>
              <p>Сводная статистика ваших заказов и платежей с расчетом остатка долга</p>
            </div>
            
            <div class="search-filters-box debts-actions-box" style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;">
              <VueDatePicker 
                v-model="reportDateRange" 
                range 
                :enable-time-picker="false" 
                :time-config="{ enableTimePicker: false }"
                :locale="ru" 
                placeholder="Выберите период" 
                auto-apply 
                key="profile-reports-datepicker"
                style="width: 220px;"
              />

              <!-- Actions -->
              <!-- <button @click="exportReportToCSV" class="btn btn-secondary" style="background-color: #10b981; border-color: #10b981; display: flex; align-items: center; gap: 0.5rem; color: #fff;">
                <FileText :size="18" /> Экспорт в Excel (CSV)
              </button> -->

              <button @click="generateReportPDF" class="btn btn-primary" :disabled="isGeneratingReportPDF" style="display: flex; align-items: center; gap: 0.5rem;">
                <Download :size="18" /> {{ isGeneratingReportPDF ? 'Генерация...' : 'Скачать PDF отчет' }}
              </button>
            </div>
          </div>

          <div v-if="loading || loadingPayments" class="loading-state">
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
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in dailyReportRows" :key="row.date">
                    <td data-label="Дата" class="font-bold">{{ row.dateFormatted }}</td>
                    <td data-label="Месяц">{{ row.month }}</td>
                    <td data-label="Год">{{ row.year }}</td>
                    <td data-label="Кол-во накладных" style="text-align: center;">{{ row.orderCount }}</td>
                    <td data-label="Сумма закупок, ₸" style="text-align: right;" class="font-bold">{{ formatPrice(row.purchases) }} ₸</td>
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
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in monthlySummaryRows" :key="row.month + row.year">
                    <td data-label="Месяц" class="font-bold">{{ row.month }}</td>
                    <td data-label="Год">{{ row.year }}</td>
                    <td data-label="Кол-во накладных" style="text-align: center;">{{ row.orderCount }}</td>
                    <td data-label="Общие закупки, ₸" style="text-align: right;" class="font-bold">{{ formatPrice(row.purchases) }} ₸</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Detailed Invoice Modal -->
    <Transition name="fade">
      <div v-if="activeInvoice" class="details-modal-overlay" @click.self="isEditingInvoice ? cancelEditingInvoice() : activeInvoice = null">
        <div class="details-modal" v-motion-pop>
          <div class="details-modal-header">
            <h3>{{ isEditingInvoice ? 'Редактирование накладной' : 'Детали накладной' }} {{ activeInvoice.waybill_number || `№${activeInvoice.id}` }}</h3>
            <button @click="isEditingInvoice ? cancelEditingInvoice() : activeInvoice = null" class="close-btn"><X /></button>
          </div>
          <div class="details-modal-body">
            <div class="invoice-meta-info" style="margin-bottom: 1.5rem;">
              <p><strong>Дата заказа:</strong> {{ formatDate(activeInvoice.created_at) }}</p>
              <p><strong>Получатель:</strong> {{ authStore.user?.name }}</p>
              <p><strong>Электронная почта:</strong> {{ authStore.user?.email }}</p>
            </div>

            <div v-if="isEditingInvoice" style="margin-bottom: 1.5rem; position: relative;">
              <label style="display: block; font-weight: 700; color: var(--primary); margin-bottom: 0.5rem; text-transform: uppercase; font-size: 0.85rem;">Добавить товар в накладную</label>
              <input 
                type="text" 
                v-model="productSearchQuery" 
                placeholder="Введите название товара..." 
                style="width: 100%; padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid #ddd; outline: none; font-size: 0.95rem;"
              />
              <div v-if="filteredProductsToSelect.length > 0" style="position: absolute; top: 100%; left: 0; right: 0; background: white; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); z-index: 10; margin-top: 0.25rem; max-height: 200px; overflow-y: auto;">
                <div 
                  v-for="prod in filteredProductsToSelect" 
                  :key="prod.id" 
                  @click="addProductToInvoice(prod)"
                  style="padding: 0.75rem 1rem; border-bottom: 1px solid #f1f5f9; cursor: pointer; display: flex; justify-content: space-between; align-items: center;"
                >
                  <span style="font-weight: 600; font-size: 0.9rem;">{{ prod.name }}</span>
                  <span style="font-size: 0.85rem; color: var(--gray);">{{ formatPrice(prod.price) }} ₸ / {{ prod.unit }}</span>
                </div>
              </div>
            </div>

            <table class="modal-invoice-table">
              <thead>
                <tr>
                  <th>Наименование товара</th>
                  <th style="text-align: center;">Кол-во</th>
                  <th style="text-align: right;">Цена</th>
                  <th style="text-align: right;">Сумма</th>
                  <th v-if="isEditingInvoice" style="width: 50px;"></th>
                </tr>
              </thead>
              <tbody v-if="!isEditingInvoice">
                <tr v-for="item in activeInvoice.items" :key="item.id">
                  <td data-label="Товар">{{ item.name }}</td>
                  <td data-label="Кол-во" style="text-align: center;">{{ item.quantity }} {{ item.unit }}</td>
                  <td data-label="Цена" style="text-align: right;">{{ formatPrice(item.price) }} ₸</td>
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
              <tbody v-else>
                <tr v-for="item in editableItems" :key="item.id">
                  <td data-label="Товар">{{ item.name }}</td>
                  <td data-label="Кол-во" style="text-align: center;">
                    <div style="display: inline-flex; align-items: center; gap: 0.5rem; justify-content: center;">
                      <button type="button" @click="decreaseQty(item)" style="border: 1px solid #cbd5e1; background: #fff; width: 24px; height: 24px; border-radius: 4px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer;">
                        <Minus :size="12" />
                      </button>
                      <span style="font-weight: bold; width: 30px; text-align: center;">{{ item.quantity }}</span>
                      <button type="button" @click="increaseQty(item)" style="border: 1px solid #cbd5e1; background: #fff; width: 24px; height: 24px; border-radius: 4px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer;">
                        <Plus :size="12" />
                      </button>
                      <span style="font-size: 0.85rem; color: var(--gray);">{{ item.unit }}</span>
                    </div>
                  </td>
                  <td data-label="Цена" style="text-align: right;">{{ formatPrice(item.price) }} ₸</td>
                  <td data-label="Сумма" style="text-align: right;">{{ formatPrice(item.price * item.quantity) }} ₸</td>
                  <td style="text-align: center;">
                    <button type="button" @click="removeProductFromInvoice(item)" style="color: #ef4444; border: none; background: transparent; cursor: pointer; display: inline-flex; align-items: center; justify-content: center;">
                      <Trash2 :size="16" />
                    </button>
                  </td>
                </tr>
                <template v-if="activeInvoice.discount && parseFloat(activeInvoice.discount) > 0">
                  <tr class="modal-subtotal-row" style="font-size: 0.95rem; color: var(--gray);">
                    <td colspan="4" style="text-align: right; border-bottom: none; padding-top: 0.5rem; padding-bottom: 0.25rem;">Сумма без скидки:</td>
                    <td style="text-align: right; border-bottom: none; padding-top: 0.5rem; padding-bottom: 0.25rem;">{{ formatPrice(editableOriginalPrice) }} ₸</td>
                  </tr>
                  <tr class="modal-discount-row" style="font-size: 0.95rem; color: #ef4444;">
                    <td colspan="4" style="text-align: right; border-bottom: none; padding-top: 0.25rem; padding-bottom: 0.25rem;">Скидка ({{ parseFloat(activeInvoice.discount) }}%):</td>
                    <td style="text-align: right; border-bottom: none; padding-top: 0.25rem; padding-bottom: 0.25rem;">-{{ formatPrice(editableOriginalPrice - editableTotalPrice) }} ₸</td>
                  </tr>
                </template>
                <tr class="modal-total-row">
                  <td colspan="4" class="total-label-cell"><strong>Итого к оплате:</strong></td>
                  <td style="text-align: right;" class="total-amount-cell"><strong>{{ formatPrice(editableTotalPrice) }} ₸</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="details-modal-footer" style="display: flex; gap: 1rem; flex-direction: column;">
            <template v-if="!isEditingInvoice">
              <button @click="startEditingInvoice" class="btn btn-secondary btn-block" style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; border-color: var(--secondary); color: var(--secondary); background: transparent;">
                <Edit3 :size="18" /> Редактировать накладную
              </button>
              <button @click="generatePDFInvoice(activeInvoice)" class="btn btn-primary btn-block" style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 0;" :disabled="isGeneratingPDF">
                <FileText :size="18" /> {{ isGeneratingPDF ? 'Генерация PDF...' : 'Скачать накладную (PDF)' }}
              </button>
              <button @click="repeatOrder(activeInvoice)" class="btn btn-secondary btn-block" style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 0;">
                <RotateCcw :size="18" /> Повторить и Дополнить заказ
              </button>
            </template>
            <template v-else>
              <button @click="saveEditedInvoice" class="btn btn-primary btn-block" style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                Сохранить изменения
              </button>
              <button @click="cancelEditingInvoice" class="btn btn-secondary btn-block" style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 0; background: transparent;">
                Отмена
              </button>
            </template>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Edit Profile Modal -->
    <Transition name="fade">
      <div v-if="isEditModalOpen" class="details-modal-overlay" @click.self="closeEditModal">
        <div class="details-modal" v-motion-pop>
          <div class="details-modal-header">
            <h3>Редактирование профиля</h3>
            <button @click="closeEditModal" class="close-btn"><X /></button>
          </div>
          <form @submit.prevent="handleUpdateProfile">
            <div class="details-modal-body">
              <div v-if="modalErrorMsg" class="error-banner" style="margin-bottom: 1.5rem;">
                {{ modalErrorMsg }}
              </div>
              <div v-else-if="authStore.error" class="error-banner" style="margin-bottom: 1.5rem;">
                {{ authStore.error }}
              </div>

              <div class="form-group" style="margin-bottom: 1.25rem;">
                <label style="display: block; font-weight: 700; color: var(--primary); margin-bottom: 0.5rem; text-transform: uppercase; font-size: 0.85rem;">Номер телефона</label>
                <input 
                  type="tel" 
                  :value="editForm.phone" 
                  @input="onPhoneInput" 
                  placeholder="+7 (700) 000 00 00" 
                  maxlength="18"
                  required 
                  style="width: 100%; padding: 1rem 1.25rem; border-radius: 1rem; border: 1px solid #ddd; outline: none; font-size: 1rem; color: var(--primary);"
                />
              </div>

              <div class="form-group" style="margin-bottom: 1.25rem;">
                <label style="display: block; font-weight: 700; color: var(--primary); margin-bottom: 0.5rem; text-transform: uppercase; font-size: 0.85rem;">Адрес доставки</label>
                <input 
                  type="text" 
                  @input="editForm.address = $event.target.value"
                  :value="editForm.address"
                  placeholder="ул. Абая 52, офис 4" 
                  required 
                  style="width: 100%; padding: 1rem 1.25rem; border-radius: 1rem; border: 1px solid #ddd; outline: none; font-size: 1rem; color: var(--primary);"
                />
              </div>

              <div class="form-group" style="margin-bottom: 1.25rem;">
                <label style="display: block; font-weight: 700; color: var(--primary); margin-bottom: 0.5rem; text-transform: uppercase; font-size: 0.85rem;">БИН (ИИН) ресторана</label>
                <input 
                  type="text" 
                  v-model="editForm.bin_iin" 
                  placeholder="123456789012" 
                  required 
                  style="width: 100%; padding: 1rem 1.25rem; border-radius: 1rem; border: 1px solid #ddd; outline: none; font-size: 1rem; color: var(--primary);"
                />
              </div>

              <div class="form-group" style="margin-bottom: 1.25rem;">
                <label style="display: block; font-weight: 700; color: var(--primary); margin-bottom: 0.5rem; text-transform: uppercase; font-size: 0.85rem;">Наименование банка</label>
                <input 
                  type="text" 
                  v-model="editForm.bank" 
                  placeholder="АО &quot;Kaspi Bank&quot;" 
                  required 
                  style="width: 100%; padding: 1rem 1.25rem; border-radius: 1rem; border: 1px solid #ddd; outline: none; font-size: 1rem; color: var(--primary);"
                />
              </div>

              <div class="form-group" style="margin-bottom: 1.25rem;">
                <label style="display: block; font-weight: 700; color: var(--primary); margin-bottom: 0.5rem; text-transform: uppercase; font-size: 0.85rem;">КБе</label>
                <input 
                  type="text" 
                  v-model="editForm.kbe" 
                  placeholder="17" 
                  required 
                  style="width: 100%; padding: 1rem 1.25rem; border-radius: 1rem; border: 1px solid #ddd; outline: none; font-size: 1rem; color: var(--primary);"
                />
              </div>

              <div class="form-group" style="margin-bottom: 1.25rem;">
                <label style="display: block; font-weight: 700; color: var(--primary); margin-bottom: 0.5rem; text-transform: uppercase; font-size: 0.85rem;">БИК</label>
                <input 
                  type="text" 
                  v-model="editForm.bic" 
                  placeholder="CASPKZKA" 
                  required 
                  style="width: 100%; padding: 1rem 1.25rem; border-radius: 1rem; border: 1px solid #ddd; outline: none; font-size: 1rem; color: var(--primary);"
                />
              </div>

              <div class="form-group" style="margin-bottom: 1.25rem;">
                <label style="display: block; font-weight: 700; color: var(--primary); margin-bottom: 0.5rem; text-transform: uppercase; font-size: 0.85rem;">Номер счета</label>
                <input 
                  type="text" 
                  v-model="editForm.account_number" 
                  placeholder="KZ000000000000000000" 
                  required 
                  style="width: 100%; padding: 1rem 1.25rem; border-radius: 1rem; border: 1px solid #ddd; outline: none; font-size: 1rem; color: var(--primary);"
                />
              </div>

              <div class="form-group" style="margin-bottom: 1.25rem;">
                <label style="display: block; font-weight: 700; color: var(--primary); margin-bottom: 0.5rem; text-transform: uppercase; font-size: 0.85rem;">Новый пароль (оставьте пустым, если не хотите менять)</label>
                <input 
                  type="password" 
                  v-model="editForm.password" 
                  placeholder="••••••••" 
                  style="width: 100%; padding: 1rem 1.25rem; border-radius: 1rem; border: 1px solid #ddd; outline: none; font-size: 1rem; color: var(--primary);"
                />
              </div>

              <div class="form-group" style="margin-bottom: 1.25rem;">
                <label style="display: block; font-weight: 700; color: var(--primary); margin-bottom: 0.5rem; text-transform: uppercase; font-size: 0.85rem;">Подтвердите новый пароль</label>
                <input 
                  type="password" 
                  v-model="editForm.confirmPassword" 
                  placeholder="••••••••" 
                  style="width: 100%; padding: 1rem 1.25rem; border-radius: 1rem; border: 1px solid #ddd; outline: none; font-size: 1rem; color: var(--primary);"
                />
              </div>
            </div>
            <div class="details-modal-footer">
              <button type="submit" class="btn btn-secondary btn-block" :disabled="authStore.loading">
                {{ authStore.loading ? 'Сохранение...' : 'Сохранить изменения' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  <!-- Hidden print template for Form 3-2 PDF Waybill -->
  <div class="pdf-offscreen-container" v-if="activeInvoice">
    <div ref="pdfTemplateRef" class="pdf-invoice-f32">
      <!-- Appendix Header -->
      <div class="f32-appendix">
        Приложение 26<br />
        к приказу Министра финансов<br />
        Республики Казахстан<br />
        от 20 декабря 2012 года № 562<br /><br />
        <strong>Форма 3-2</strong>
      </div>

      <!-- Sender Organization Header -->
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

      <!-- Document Metadata Centered Table -->
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
              <td style="border: 1px solid #000; padding: 4px 10px; text-align: center; font-weight: bold; font-size: 9px;">{{ activeInvoice.waybill_number || `${getRestaurantPrefix(authStore.user?.name)}-${String(getRestaurantOrderNumber(activeInvoice)).padStart(2, '0')}` }}</td>
              <td style="border: 1px solid #000; padding: 4px 10px; text-align: center; font-size: 9px;">{{ formatDateOnly(activeInvoice.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Primary Centered Title -->
      <div class="f32-title" style="margin-bottom: 5px;">НАКЛАДНАЯ НА ОТПУСК ЗАПАСОВ НА СТОРОНУ</div>

      <!-- Supplier vs Buyer Bank & Legal Account Details Table -->
      <table class="f32-bank-details-table" style="width: 100%; border-collapse: collapse; margin-bottom: 12px; border: 1px solid #000;">
        <tr>
          <!-- GASTROMIR (Supplier) Details -->
          <td style="width: 50%; border: 1px solid #000; padding: 5px; font-size: 8px; vertical-align: top; text-align: left; line-height: 1.3;">
            <div style="font-weight: bold; font-size: 8.5px; margin-bottom: 3px; border-bottom: 1px solid #000; padding-bottom: 1px; color: #000;">ПОСТАВЩИК (ОТПРАВИТЕЛЬ):</div>
            <div><strong>ИП ИБРАЕВ "GASTROMIR"</strong></div>
            <div><strong>БИН (ИИН):</strong> 820727351424</div>
            <div><strong>Банк:</strong> АО "Kaspi Bank"</div>
            <div><strong>БИК:</strong> CASPKZKA &nbsp;&nbsp;&nbsp;&nbsp; <strong>КБе:</strong> 19</div>
            <div><strong>Номер счета (ИИК):</strong> KZ96722S000053776272</div>
            <div><strong>Адрес:</strong> г. Астана, ул. Григория Потанина, д. 2, кв./офис 26</div>
          </td>
          
          <!-- Restaurant (Buyer) Details -->
          <td style="width: 50%; border: 1px solid #000; padding: 5px; font-size: 8px; vertical-align: top; text-align: left; line-height: 1.3;">
            <div style="font-weight: bold; font-size: 8.5px; margin-bottom: 3px; border-bottom: 1px solid #000; padding-bottom: 1px; color: #000;">ПОКУПАТЕЛЬ (ПОЛУЧАТЕЛЬ):</div>
            <div><strong>Компания:</strong> {{ authStore.user?.name || '-' }}</div>
            <div><strong>БИН (ИИН):</strong> {{ authStore.user?.bin_iin || '-' }}</div>
            <div><strong>Банк:</strong> {{ authStore.user?.bank || '-' }}</div>
            <div><strong>БИК:</strong> {{ authStore.user?.bic || '-' }} &nbsp;&nbsp;&nbsp;&nbsp; <strong>КБе:</strong> {{ authStore.user?.kbe || '-' }}</div>
            <div><strong>Номер счета (ИИК):</strong> {{ authStore.user?.account_number || '-' }}</div>
            <div><strong>Адрес:</strong> {{ authStore.user?.address || '-' }}</div>
          </td>
        </tr>
      </table>

      <!-- Secondary Meta Table (Sender / Recipient / Transport) -->
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
            <td style="border: 1px solid #000; padding: 4px 6px; font-size: 8px;">{{ authStore.user?.name }}, ИИН/БИН {{ authStore.user?.bin_iin || '—' }}, {{ authStore.user?.address }}</td>
            <td style="border: 1px solid #000; padding: 4px 6px; font-size: 8px; text-align: center;">Ибраев Б. А.</td>
            <td style="border: 1px solid #000; padding: 4px 6px; font-size: 8px; text-align: center;">GASTROMIR Логистика</td>
            <td style="border: 1px solid #000; padding: 4px 6px; font-size: 8px; text-align: center;">{{ activeInvoice.waybill_number || `${getRestaurantPrefix(authStore.user?.name)}-${String(getRestaurantOrderNumber(activeInvoice)).padStart(2, '0')}` }}, {{ formatDateOnly(activeInvoice.created_at) }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Dynamic Items Grid Table -->
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

      <!-- Quantity and Prices in Russian Words -->
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

      <!-- Signature Blocks Grid -->
      <table class="f32-signatures-table" style="width: 100%; margin-top: 15px; border-collapse: collapse; border: none;">
        <tr>
          <!-- Left Signatures -->
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

          <!-- Spacer -->
          <td style="width: 4%; border: none; padding: 0;"></td>

          <!-- Right Signatures -->
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
                      <td style="border: none; border-bottom: 1px solid #000; font-size: 8px; width: 50%; text-align: center; padding: 0; line-height: 1;">{{ authStore.user?.name }}</td>
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

  <!-- Purchases Report PDF Template -->
  <div class="pdf-offscreen-container">
    <div ref="reportPdfTemplateRef" class="pdf-debts-report" style="width: 710px; padding: 20px; font-family: 'Arial', sans-serif;">
      <h2 class="pdf-report-title">Отчет по закупкам и оплатам по дням</h2>
      <p class="pdf-report-meta"><strong>Покупатель:</strong> {{ authStore.user?.name || 'Ресторан' }}</p>
      <p class="pdf-report-meta"><strong>Период:</strong> {{ selectedReportMonthText }}</p>
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
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in dailyReportRows" :key="row.date">
            <td style="font-weight: bold;">{{ row.dateFormatted }}</td>
            <td>{{ row.month }}</td>
            <td>{{ row.year }}</td>
            <td style="text-align: center;">{{ row.orderCount }}</td>
            <td style="text-align: right;">{{ formatPrice(row.purchases) }}</td>
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
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in monthlySummaryRows" :key="row.month + row.year">
            <td style="font-weight: bold;">{{ row.month }}</td>
            <td>{{ row.year }}</td>
            <td style="text-align: center;">{{ row.orderCount }}</td>
            <td style="text-align: right; font-weight: bold;">{{ formatPrice(row.purchases) }}</td>
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
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { ru } from 'date-fns/locale'
import printImg from '@/assets/docs/print.png'
import signatureImg from '@/assets/docs/signature.png'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import { User, Calendar, Eye, RotateCcw, ClipboardList, X, Phone, MapPin, Edit3, FileText, Landmark, Hash, Globe, CreditCard, TrendingUp, Download, Plus, Minus, Trash2 } from 'lucide-vue-next'
import { formatPhone } from '@/utils/format'

const authStore = useAuthStore()
const cartStore = useCartStore()
const toastStore = useToastStore()
const router = useRouter()
const orders = ref([])
const loading = ref(true)
const activeInvoice = ref(null)

const pdfTemplateRef = ref(null)
const isGeneratingPDF = ref(false)

const activeTab = ref('invoices')

const searchInvoiceQuery = ref('')
const invoiceDateRange = ref(null)

const isEditingInvoice = ref(false)
const editableItems = ref([])
const allProducts = ref([])
const productSearchQuery = ref('')

const fetchAllProducts = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://gastroback-production.up.railway.app'}/api/products`)
    if (response.ok) {
      allProducts.value = await response.json()
    }
  } catch (err) {
    console.error('Failed to fetch products:', err)
  }
}

const startEditingInvoice = async () => {
  if (!allProducts.value.length) {
    await fetchAllProducts()
  }
  editableItems.value = activeInvoice.value.items.map(item => ({ ...item }))
  isEditingInvoice.value = true
}

const cancelEditingInvoice = () => {
  isEditingInvoice.value = false
  editableItems.value = []
  productSearchQuery.value = ''
}

const addProductToInvoice = (product) => {
  const existing = editableItems.value.find(item => item.id === product.id)
  if (existing) {
    existing.quantity += 1
  } else {
    editableItems.value.push({
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit || 'шт',
      category: product.category,
      manufacturer: product.manufacturer || 'Не указан',
      quantity: 1
    })
  }
  productSearchQuery.value = ''
}

const decreaseQty = (item) => {
  if (item.quantity > 1) {
    item.quantity -= 1
  } else {
    removeProductFromInvoice(item)
  }
}

const increaseQty = (item) => {
  item.quantity += 1
}

const removeProductFromInvoice = (item) => {
  editableItems.value = editableItems.value.filter(i => i.id !== item.id)
}

const editableOriginalPrice = computed(() => {
  return editableItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const editableTotalPrice = computed(() => {
  const discount = parseFloat(activeInvoice.value?.discount || 0)
  return Math.round((editableOriginalPrice.value * (1 - discount / 100)) * 100) / 100
})

const filteredProductsToSelect = computed(() => {
  if (!productSearchQuery.value.trim()) return []
  const q = productSearchQuery.value.toLowerCase()
  return allProducts.value.filter(p => p.name.toLowerCase().includes(q)).slice(0, 5)
})

const saveEditedInvoice = async () => {
  if (editableItems.value.length === 0) {
    toastStore.error('Накладная не может быть пустой')
    return
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://gastroback-production.up.railway.app'}/api/orders/${activeInvoice.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({
        items: editableItems.value,
        totalPrice: editableTotalPrice.value,
        discount: parseFloat(activeInvoice.value.discount || 0),
        originalPrice: editableOriginalPrice.value
      })
    })

    const data = await response.json()
    if (response.ok) {
      toastStore.success('Накладная успешно обновлена')
      const idx = orders.value.findIndex(o => o.id === activeInvoice.value.id)
      if (idx !== -1) {
        orders.value[idx] = data.order
      }
      activeInvoice.value = data.order
      isEditingInvoice.value = false
    } else {
      toastStore.error(data.message || 'Ошибка при сохранении накладной')
    }
  } catch (err) {
    console.error('Failed to update order:', err)
    toastStore.error('Сетевая ошибка при сохранении накладной')
  }
}

const downloadPDFInvoiceDirectly = async (order) => {
  activeInvoice.value = order
  await nextTick()
  await generatePDFInvoice(order)
  activeInvoice.value = null
}

const filteredOrders = computed(() => {
  let list = [...orders.value]
  if (invoiceDateRange.value && invoiceDateRange.value.length === 2) {
    const [start, end] = invoiceDateRange.value
    if (start && end) {
      const startTime = new Date(start).setHours(0, 0, 0, 0)
      const endTime = new Date(end).setHours(23, 59, 59, 999)
      list = list.filter(order => {
        const orderTime = new Date(order.created_at).getTime()
        return orderTime >= startTime && orderTime <= endTime
      })
    }
  }
  if (searchInvoiceQuery.value.trim()) {
    const q = searchInvoiceQuery.value.toLowerCase().trim()
    list = list.filter(order => {
      const orderNum = order.waybill_number || `${getRestaurantPrefix(authStore.user?.name)}-${String(getRestaurantOrderNumber(order)).padStart(2, '0')}`
      const matchesNum = order.id.toString().includes(q) || orderNum.toLowerCase().includes(q)
      const matchesProducts = order.items.some(item => item.name.toLowerCase().includes(q))
      return matchesNum || matchesProducts
    })
  }
  return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})

const reportDateRange = ref(null)

const selectedReportMonthText = computed(() => {
  if (!reportDateRange.value || reportDateRange.value.length < 2) return 'Все периоды'
  const [start, end] = reportDateRange.value
  if (!start || !end) return 'Все периоды'
  return `${formatDateOnly(start)} - ${formatDateOnly(end)}`
})

const selectedReportMonthFileText = computed(() => {
  if (!reportDateRange.value || reportDateRange.value.length < 2) return 'Все_периоды'
  const [start, end] = reportDateRange.value
  if (!start || !end) return 'Все_периоды'
  return `${formatDateOnly(start).replace(/\./g, '_')}_по_${formatDateOnly(end).replace(/\./g, '_')}`
})

const payments = ref([])
const loadingPayments = ref(false)
const isGeneratingReportPDF = ref(false)
const reportPdfTemplateRef = ref(null)

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

const getRestaurantOrderNumber = (order) => {
  if (!order || !orders.value.length) return 1
  const sorted = [...orders.value].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
  const index = sorted.findIndex(o => o.id === order.id)
  return index !== -1 ? index + 1 : 1
}

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

  try {
    const html2pdf = (await import('html2pdf.js')).default
    const currentOrderNum = order.waybill_number || `${getRestaurantPrefix(authStore.user?.name)}-${String(getRestaurantOrderNumber(order)).padStart(2, '0')}`
    const element = pdfTemplateRef.value

    const d = new Date(order.created_at)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    const formattedDate = `${day}.${month}.${year}`

    const options = {
      margin: [0.3, 0.3, 0.3, 0.3],
      filename: `${formattedDate}_Накладная_Форма_3-2_${currentOrderNum}.pdf`,
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
  } finally {
    isGeneratingPDF.value = false
  }
}

const isEditModalOpen = ref(false)
const modalErrorMsg = ref('')
const editForm = reactive({
  phone: '',
  address: '',
  bin_iin: '',
  bank: '',
  kbe: '',
  bic: '',
  account_number: '',
  password: '',
  confirmPassword: ''
})

const openEditModal = () => {
  editForm.phone = authStore.user?.phone || ''
  editForm.address = authStore.user?.address || ''
  editForm.bin_iin = authStore.user?.bin_iin || ''
  editForm.bank = authStore.user?.bank || ''
  editForm.kbe = authStore.user?.kbe || ''
  editForm.bic = authStore.user?.bic || ''
  editForm.account_number = authStore.user?.account_number || ''
  editForm.password = ''
  editForm.confirmPassword = ''
  modalErrorMsg.value = ''
  isEditModalOpen.value = true
}

const closeEditModal = () => {
  isEditModalOpen.value = false
}

const onPhoneInput = (event) => {
  editForm.phone = formatPhone(event.target.value)
}

const handleUpdateProfile = async () => {
  modalErrorMsg.value = ''

  if (editForm.password) {
    if (editForm.password !== editForm.confirmPassword) {
      modalErrorMsg.value = 'Пароли не совпадают'
      return
    }
    if (editForm.password.length < 6) {
      modalErrorMsg.value = 'Пароль должен содержать минимум 6 символов'
      return
    }
  }

  if (!editForm.phone || editForm.phone.length < 18) {
    modalErrorMsg.value = 'Введите корректный номер телефона'
    return
  }

  if (!editForm.address.trim()) {
    modalErrorMsg.value = 'Укажите адрес доставки'
    return
  }

  if (!editForm.bin_iin.trim()) {
    modalErrorMsg.value = 'Укажите БИН (ИИН) ресторана'
    return
  }

  if (!editForm.bank.trim()) {
    modalErrorMsg.value = 'Укажите наименование банка'
    return
  }

  if (!editForm.kbe.trim()) {
    modalErrorMsg.value = 'Укажите КБе'
    return
  }

  if (!editForm.bic.trim()) {
    modalErrorMsg.value = 'Укажите БИК'
    return
  }

  if (!editForm.account_number.trim()) {
    modalErrorMsg.value = 'Укажите номер банковского счета'
    return
  }

  const success = await authStore.updateProfile(
    editForm.phone, 
    editForm.address, 
    editForm.password,
    editForm.bin_iin,
    editForm.bank,
    editForm.kbe,
    editForm.bic,
    editForm.account_number
  )
  if (success) {
    isEditModalOpen.value = false
  }
}

const fetchOrders = async () => {
  try {
    loading.value = true
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://gastroback-production.up.railway.app'}/api/orders`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    if (response.ok) {
      orders.value = await response.json()
    }
  } catch (err) {
    console.error('Failed to fetch orders:', err)
  } finally {
    loading.value = false
  }
}

const fetchPayments = async () => {
  try {
    loadingPayments.value = true
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://gastroback-production.up.railway.app'}/api/payments`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    if (response.ok) {
      payments.value = await response.json()
    }
  } catch (err) {
    console.error('Failed to fetch payments:', err)
  } finally {
    loadingPayments.value = false
  }
}

onMounted(() => {
  fetchOrders()
  fetchPayments()
})

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

  // Group orders by day
  orders.value.forEach(order => {
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
  payments.value.forEach(pay => {
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

  if (reportDateRange.value && reportDateRange.value.length === 2) {
    const [start, end] = reportDateRange.value
    if (start && end) {
      const startTime = new Date(start).setHours(0, 0, 0, 0)
      const endTime = new Date(end).setHours(23, 59, 59, 999)
      return rows.filter(row => {
        const rowTime = new Date(row.date).getTime()
        return rowTime >= startTime && rowTime <= endTime
      })
    }
  }

  return rows
})

// Compute monthly summary rows
const monthlySummaryRows = computed(() => {
  const monthMap = {}

  // Group orders by month-year
  orders.value.forEach(order => {
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
  payments.value.forEach(pay => {
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

  if (reportDateRange.value && reportDateRange.value.length === 2) {
    const [start, end] = reportDateRange.value
    if (start && end) {
      const startYear = new Date(start).getFullYear()
      const startMonth = new Date(start).getMonth()
      const endYear = new Date(end).getFullYear()
      const endMonth = new Date(end).getMonth()
      return rows.filter(row => {
        const rowYear = parseInt(row.year)
        const monthNames = [
          'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
          'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ]
        const rowMonthIndex = monthNames.indexOf(row.month)
        if (rowMonthIndex === -1) return true
        const rowTime = new Date(rowYear, rowMonthIndex, 1).getTime()
        const compareStart = new Date(startYear, startMonth, 1).getTime()
        const compareEnd = new Date(endYear, endMonth, 1).getTime()
        return rowTime >= compareStart && rowTime <= compareEnd
      })
    }
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

const exportReportToCSV = () => {
  const date = new Date().toLocaleDateString('ru-RU').replace(/\./g, '_')
  const restName = (authStore.user?.name || 'Ресторан').replace(/\s+/g, '_')
  const monthName = selectedReportMonthFileText.value
  
  let csvContent = "\uFEFF"
  csvContent += `ОТЧЕТ ПО ЗАКУПКАМ И ОПЛАТАМ ПО ДНЯМ\n`
  csvContent += `Ресторан: ${authStore.user?.name || ''}\n`
  csvContent += `Период: ${selectedReportMonthText.value}\n\n`
  
  const dailyHeaders = ['Дата', 'Месяц', 'Год', 'Кол-во накладных', 'Сумма закупок, KZT']
  csvContent += dailyHeaders.join(';') + '\n'
  
  dailyReportRows.value.forEach(row => {
    csvContent += [
      row.dateFormatted,
      row.month,
      row.year,
      row.orderCount,
      row.purchases
    ].join(';') + '\n'
  })
  
  csvContent += `\n\nИТОГО ПО МЕСЯЦУ\n`
  const monthlyHeaders = ['Месяц', 'Год', 'Кол-во накладных', 'Общие закупки, KZT']
  csvContent += monthlyHeaders.join(';') + '\n'
  
  monthlySummaryRows.value.forEach(row => {
    csvContent += [
      row.month,
      row.year,
      row.orderCount,
      row.purchases
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
    const restName = (authStore.user?.name || 'Ресторан').replace(/\s+/g, '_')
    const monthName = selectedReportMonthFileText.value
    
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

const groupedOrders = computed(() => {
  const groups = {}
  orders.value.forEach(order => {
    const date = new Date(order.created_at)
    const monthYear = date.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })
    const capitalized = monthYear.charAt(0).toUpperCase() + monthYear.slice(1)
    if (!groups[capitalized]) {
      groups[capitalized] = []
    }
    groups[capitalized].push(order)
  })
  return groups
})

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
  activeInvoice.value = order
}

const repeatOrder = (order) => {
  cartStore.clearCart()
  order.items.forEach(item => {
    // Add product to cart with its saved quantity
    const product = {
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category || 'Бакалея',
      unit: item.unit || 'шт',
      manufacturer: item.manufacturer || 'Не указан'
    }
    for (let i = 0; i < item.quantity; i++) {
      cartStore.addItem(product)
    }
  })
  activeInvoice.value = null
  router.push('/catalog')
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background-color: var(--light);
}

.profile-header {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
  padding-top: 10rem;
  padding-bottom: 5rem;
  color: var(--white);
}

.header-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.user-info-card {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.avatar-glow {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--secondary);
  box-shadow: 0 0 25px rgba(245, 158, 11, 0.25);
}

.user-meta h1 {
  font-size: 2.2rem;
  color: var(--white);
  margin-bottom: 0.25rem;
}

.user-meta .email {
  color: var(--gray);
  margin-bottom: 0.75rem;
}

.badge {
  display: inline-block;
  background: rgba(245, 158, 11, 0.15);
  color: var(--secondary);
  border: 1px solid rgba(245, 158, 11, 0.3);
  padding: 0.25rem 1rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
}

.limit-status-card {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 2.5rem;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.card-glow {
  position: absolute;
  top: -50%;
  right: -50%;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%);
  filter: blur(20px);
}

.limit-info {
  display: flex;
  align-items: center;
  gap: 1.75rem;
}

.limit-icon {
  color: var(--secondary);
  background: rgba(245, 158, 11, 0.1);
  padding: 1rem;
  border-radius: 18px;
  width: 64px;
  height: 64px;
}

.limit-info h3 {
  font-size: 1rem;
  color: var(--gray);
  margin-bottom: 0.25rem;
}

.limit-info h2 {
  font-size: 2.4rem;
  color: var(--white);
  font-weight: 800;
  margin-bottom: 0.25rem;
}

.limit-info p {
  font-size: 0.85rem;
  color: var(--gray);
  opacity: 0.8;
}

.section-title {
  margin-bottom: 4rem;
  text-align: center;
}

.section-title h2 span {
  background: var(--gradient-orange);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.month-group {
  margin-bottom: 4rem;
}

.month-title {
  font-size: 1.5rem;
  color: var(--primary);
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0.75rem;
}

.orders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 2rem;
}

.invoice-card {
  background: var(--white);
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 1.75rem;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: var(--transition);
}

.invoice-card:hover {
  transform: translateY(-3px);
  border-color: var(--secondary);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.05);
}

.invoice-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 1.25rem;
  margin-bottom: 1.25rem;
}

.invoice-num {
  display: block;
  font-weight: 700;
  color: var(--primary);
  font-size: 1.1rem;
}

.invoice-date {
  font-size: 0.85rem;
  color: var(--gray);
}

.invoice-price {
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--secondary-dark);
}

.invoice-items-preview {
  margin-bottom: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.preview-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--primary-light);
}

.preview-more {
  font-size: 0.85rem;
  color: var(--gray);
  font-style: italic;
  margin-top: 0.25rem;
}

.invoice-card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.btn-details {
  color: var(--primary);
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.btn-details:hover {
  color: var(--secondary);
}

.btn-repeat {
  padding: 0.5rem 1.25rem;
  font-size: 0.9rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 6rem 2rem;
  color: var(--gray);
}

.empty-state h3 {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--primary);
}

.empty-state p {
  margin-bottom: 2rem;
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

.details-modal-footer {
  padding: 1.5rem 2rem;
  background: #f8fafc;
  border-top: 1px solid #f1f5f9;
}

.btn-block {
  width: 100%;
  padding: 1rem;
  border-radius: 14px;
}

.loader {
  width: 48px;
  height: 48px;
  border: 5px solid rgba(11, 18, 33, 0.1);
  border-radius: 50%;
  border-top-color: var(--secondary);
  display: inline-block;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 992px) {
  .header-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .avatar-glow { width: 70px; height: 70px; }
  .user-meta h1 { font-size: 1.8rem; }
  .limit-info h2 { font-size: 2rem; }
  .orders-grid { grid-template-columns: 1fr; }
  .details-modal { max-height: 95vh; border-radius: 16px; width: 100%; }
  .details-modal-body { padding: 1.25rem; }

  /* Responsive table inside invoice details modal */
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
}
.user-details-box {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
}

.details-row {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.details-icon {
  color: var(--secondary);
  margin-top: 0.2rem;
}

.details-row h4 {
  font-size: 0.9rem;
  color: var(--gray);
  margin-bottom: 0.15rem;
}

.details-row p {
  font-size: 1.1rem;
  color: var(--white);
  font-weight: 600;
  line-height: 1.4;
}

.btn-edit-profile {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  font-size: 0.95rem;
  border-radius: 12px;
}

.error-banner {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 0.9rem;
  text-align: center;
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

/* Custom Profile Tabs Styles */
.profile-tabs {
  display: flex;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  padding: 0.35rem;
  border-radius: 16px;
  gap: 0.25rem;
  margin-bottom: 2.5rem;
  max-width: fit-content;
}

.profile-tab-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--primary-light);
  opacity: 0.8;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.profile-tab-btn:hover {
  opacity: 1;
  background: rgba(0, 0, 0, 0.03);
}

.profile-tab-btn.active {
  background: var(--secondary);
  color: var(--white);
  opacity: 1;
}

/* Reports Tables and Filters Styling */
.price-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.card-header h2 {
  font-size: 1.5rem;
  color: var(--primary);
  margin-bottom: 0.25rem;
  font-weight: 700;
}

.card-header p {
  color: var(--gray);
  font-size: 0.95rem;
}

.admin-select-filter {
  padding: 0.6rem 2.25rem 0.6rem 1rem;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  font-weight: 600;
  font-size: 0.9rem;
  background: white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E") no-repeat right 0.75rem center;
  appearance: none;
  cursor: pointer;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.admin-table th {
  background: #f8fafc;
  padding: 1.25rem 1rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--gray);
  text-transform: uppercase;
  border-bottom: 1px solid #e2e8f0;
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
</style>
