<template>
  <Transition name="fade">
    <div v-if="showToast" class="toast-success">
      <span>✅ Накладная отправлена на Email!</span>
    </div>
  </Transition>

  <Transition name="fade">
    <div v-if="cartStore.isModalOpen" class="modal-overlay" @click.self="cartStore.closeModal">
      <div class="modal-content" v-motion-pop>
        <div class="modal-header">
          <h2>Корзина</h2>
          <button @click="cartStore.closeModal" class="close-btn"><X /></button>
        </div>

        <div v-if="cartStore.items.length > 0" class="modal-body">
          <div class="cart-items">
            <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
              <div class="item-details">
                <h4>{{ item.name }}</h4>
                <p>{{ formatPrice(item.price) }} ₸ <span class="unit">/ {{ item.unit }}</span></p>
                <span v-if="item.unit === 'кг'" class="weight-badge">⚖️ весовой</span>
              </div>
              <div class="item-actions">
                <div class="qty-control">
                  <button @click="cartStore.updateQuantity(item.id, -1)">-</button>
                  <span>{{ item.quantity }}</span>
                  <button @click="cartStore.updateQuantity(item.id, 1)">+</button>
                </div>
                <button @click="cartStore.removeItem(item.id)" class="remove-btn"><Trash2 :size="18" /></button>
              </div>
            </div>
          </div>

          <div class="order-form" v-if="authStore.isAuthenticated">
            <h3>Детали заказа</h3>
            <div class="form-group">
              <label>Название ресторана / Клиент</label>
              <input type="text" v-model="orderData.customerName" placeholder="Например: Угли Дипломат" required />
            </div>
            <div class="form-group">
              <label>Телефон для связи</label>
              <input 
                type="tel" 
                :value="orderData.phone" 
                @input="onPhoneInput" 
                placeholder="+7 (700) 000 00 00" 
                maxlength="18"
                required 
              />
            </div>
            <div class="form-group">
              <label>Адрес доставки</label>
              <input type="text" v-model="orderData.address" placeholder="Например: ул. Абая 52, офис 4" required />
            </div>
            <div class="form-group">
              <label>Дата доставки (ДД.ММ.ГГГГ)</label>
              <input 
                type="text" 
                :value="orderData.deliveryDate" 
                @input="onDateInput" 
                placeholder="Например: 19.05.2026" 
                maxLength="10"
                required 
                :class="{ 'input-error': orderData.deliveryDate && !isDateValid }"
              />
              <span v-if="orderData.deliveryDate && !isDateValid" class="error-message">
                Введите корректную дату (не в прошлом) в формате ДД.ММ.ГГГГ
              </span>
            </div>
            <div class="form-group">
              <label>Выберите время доставки:</label>
              <select v-model="orderData.deliveryTime" class="form-select">
                <option value="До 14:00">До 14:00</option>
                <option value="До 18:00">До 18:00</option>
              </select>
            </div>
            <div class="form-group">
              <label>Способ оплаты</label>
              <select v-model="orderData.paymentMethod" class="form-select">
                <option v-for="method in paymentMethods" :key="method.id" :value="method.name">
                  {{ method.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="modal-footer">
            <p v-if="cartStore.hasWeightItems" class="weight-disclaimer">
              ⚖️ Для весовых товаров итоговая стоимость зависит от фактического веса и рассчитывается после сборки заказа.
            </p>
            <p v-if="cartStore.hasFreshItems" class="fresh-disclaimer">
              🥬 Цены на свежую продукцию (овощи, фрукты, зелень, салаты) являются плавающими и зависят от сезонности, качества и ежедневных поставок.
            </p>
            <div class="total-row">
              <span>Итого к оплате:</span>
              <strong>{{ formatPrice(cartStore.totalPrice) }} ₸</strong>
            </div>
            
            <div v-if="!authStore.isAuthenticated" class="auth-warning-box">
              🔑 Пожалуйста, <router-link to="/login" @click="cartStore.closeModal"><b>войдите в систему</b></router-link> или <router-link to="/register" @click="cartStore.closeModal"><b>зарегистрируйтесь</b></router-link>, чтобы отправлять заказы и просматривать накладные.
            </div>
            
            <div v-else-if="isOverLimit" class="limit-warning-box">
              ⚠️ Сумма заказа ({{ formatPrice(cartStore.totalPrice) }} ₸) превышает ваш лимит ({{ formatPrice(authStore.user?.order_limit) }} ₸). Уберите товары или обратитесь к администратору.
            </div>
            
            <div class="footer-actions" v-if="authStore.isAuthenticated">
              <button 
                class="btn btn-primary btn-block" 
                @click="sendToEmail" 
                :disabled="isOverLimit || !orderData.customerName || !orderData.phone || isSendingEmail || !isDateValid"
              >
                {{ isSendingEmail ? 'Отправка...' : 'Отправить заказ' }}
              </button>

              <button 
                class="btn btn-whatsapp btn-block" 
                @click="sendToWhatsApp" 
                :disabled="isOverLimit || !orderData.customerName || !orderData.phone || !isDateValid"
              >
                Отправить в WhatsApp
              </button>
              
              <button 
                class="btn btn-secondary btn-block" 
                @click="generatePDFInvoice" 
                :disabled="!orderData.customerName || !orderData.address || !orderData.phone || isGeneratingPDF || !isDateValid"
              >
                {{ isGeneratingPDF ? 'Генерация PDF...' : 'Скачать накладную (PDF)' }}
              </button>
            </div>
          </div>
        </div>

        <div v-else class="empty-cart">
          <ShoppingCart :size="64" />
          <p>Ваша корзина пуста</p>
          <button @click="cartStore.closeModal" class="btn btn-primary">Вернуться к покупкам</button>
        </div>
      </div>
    </div>
  </Transition>

  <div class="pdf-offscreen-container">
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
              <td style="border: 1px solid #000; padding: 4px 10px; text-align: center; font-weight: bold; font-size: 9px;">{{ orderNum }}</td>
              <td style="border: 1px solid #000; padding: 4px 10px; text-align: center; font-size: 9px;">{{ invoiceDate }}</td>
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
            <div><strong>БИК:</strong> CASPKZKA &nbsp;&nbsp;&nbsp;&nbsp; <strong>КБе:</strong> 17</div>
            <div><strong>Номер счета (ИИК):</strong> KZ91722S000047745678</div>
            <div><strong>Адрес:</strong> г. Алматы</div>
          </td>
          
          <!-- Restaurant (Buyer) Details -->
          <td style="width: 50%; border: 1px solid #000; padding: 5px; font-size: 8px; vertical-align: top; text-align: left; line-height: 1.3;">
            <div style="font-weight: bold; font-size: 8.5px; margin-bottom: 3px; border-bottom: 1px solid #000; padding-bottom: 1px; color: #000;">ПОКУПАТЕЛЬ (ПОЛУЧАТЕЛЬ):</div>
            <div><strong>Компания:</strong> {{ authStore.user?.name || orderData.customerName || '-' }}</div>
            <div><strong>БИН (ИИН):</strong> {{ authStore.user?.bin_iin || '-' }}</div>
            <div><strong>Банк:</strong> {{ authStore.user?.bank || '-' }}</div>
            <div><strong>БИК:</strong> {{ authStore.user?.bic || '-' }} &nbsp;&nbsp;&nbsp;&nbsp; <strong>КБе:</strong> {{ authStore.user?.kbe || '-' }}</div>
            <div><strong>Номер счета (ИИК):</strong> {{ authStore.user?.account_number || '-' }}</div>
            <div><strong>Адрес:</strong> {{ authStore.user?.address || orderData.address || '-' }}</div>
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
            <td style="border: 1px solid #000; padding: 4px 6px; font-size: 8px;">ИП ИБРАЕВ "GASTROMIR", БИН 820727351424, г. Алматы</td>
            <td style="border: 1px solid #000; padding: 4px 6px; font-size: 8px;">{{ orderData.customerName }}, ИИН/БИН {{ authStore.user?.bin_iin || '—' }}, {{ orderData.address }}</td>
            <td style="border: 1px solid #000; padding: 4px 6px; font-size: 8px; text-align: center;">Ибраев Б. А.</td>
            <td style="border: 1px solid #000; padding: 4px 6px; font-size: 8px; text-align: center;">GASTROMIR Логистика</td>
            <td style="border: 1px solid #000; padding: 4px 6px; font-size: 8px; text-align: center;">{{ orderNum }}, {{ invoiceDate }}</td>
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
          <tr v-for="(item, index) in cartStore.items" :key="item.id">
            <td style="border: 1px solid #000; padding: 3px; font-size: 8px; text-align: center;">{{ index + 1 }}</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 8px; text-align: left;">{{ item.name }}</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 8px; text-align: center;">GM-{{ String(item.id).slice(-4).padStart(4, '0') }}</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 8px; text-align: center;">{{ item.unit }}</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 8px; text-align: center;">{{ item.quantity }}</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 8px; text-align: center;">{{ item.quantity }}</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 8px; text-align: right;">{{ formatPrice(item.price) }}</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 8px; text-align: right;">{{ formatPrice(item.price * item.quantity) }}</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 8px; text-align: right;">{{ formatPrice(calculateVAT(item.price * item.quantity)) }}</td>
          </tr>
          <tr class="f32-total-row">
            <td colspan="4" style="border: 1px solid #000; padding: 3px; font-size: 8px; text-align: right; font-weight: bold; background-color: #f9fafb;">Итого</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 8px; text-align: center; font-weight: bold; background-color: #f9fafb;">{{ totalQuantity }}</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 8px; text-align: center; font-weight: bold; background-color: #f9fafb;">{{ totalQuantity }}</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 8px; background-color: #f9fafb;"></td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 8px; text-align: right; font-weight: bold; background-color: #f9fafb;">{{ formatPrice(cartStore.totalPrice) }}</td>
            <td style="border: 1px solid #000; padding: 3px; font-size: 8px; text-align: right; font-weight: bold; background-color: #f9fafb;">{{ formatPrice(calculateVAT(cartStore.totalPrice)) }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Quantity and Prices in Russian Words -->
      <div class="f32-words-section">
        <div class="f32-words-line" style="font-size: 8px; margin-bottom: 2px;">
          Всего отпущено количество запасов (прописью):
          <span class="f32-words-value" style="font-weight: bold; border-bottom: 1px solid #000; display: inline-block; padding: 0 4px; min-width: 250px;">{{ capitalizeFirst(numberToWordsRu(totalQuantity)) }}</span>
        </div>
        <div class="f32-words-line" style="font-size: 8px;">
          на сумму (прописью), в KZT:
          <span class="f32-words-value" style="font-weight: bold; border-bottom: 1px solid #000; display: inline-block; padding: 0 4px; min-width: 350px;">{{ capitalizeFirst(numberToWordsRu(cartStore.totalPrice)) }} тенге 00 тиын</span>
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
                      <td style="border: none; border-bottom: 1px solid #000; font-size: 8px; width: 50%; text-align: center; padding: 0; line-height: 1;">{{ orderData.customerName }}</td>
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
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'
import printImg from '@/assets/docs/print.png'
import signatureImg from '@/assets/docs/signature.png'
import { X, Trash2, ShoppingCart, Check, FileText, Landmark, Hash, Globe, CreditCard } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { parse, isValid, isBefore, startOfDay, format } from 'date-fns'
import { formatPhone } from '@/utils/format'

const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()

const pdfTemplateRef = ref(null)
const isGeneratingPDF = ref(false)

const numberToWordsRu = (n) => {
  if (n === 0) return 'ноль'
  
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

const pastOrdersCount = ref(0)
const fetchPastOrdersCount = async () => {
  if (!authStore.token) return
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    if (response.ok) {
      const list = await response.json()
      pastOrdersCount.value = list.length
    }
  } catch (err) {
    console.error('Failed to fetch orders count:', err)
  }
}

const totalQuantity = computed(() => {
  return cartStore.items.reduce((sum, item) => sum + item.quantity, 0)
})

const totalQuantityInWords = computed(() => {
  const q = totalQuantity.value
  return `${q} (${numberToWordsRu(q)})`
})

const totalPriceInWords = computed(() => {
  const p = cartStore.totalPrice
  return `${numberToWordsRu(p)}`
})

const calculateVAT = (sum) => {
  return Math.round((sum * 12 / 112) * 100) / 100
}

const orderNum = computed(() => {
  const prefix = getRestaurantPrefix(authStore.user?.name || orderData.customerName)
  const seqNum = String(pastOrdersCount.value + 1).padStart(2, '0')
  return `${prefix}-${seqNum}`
})

const paymentMethods = [
  { id: 'cash', name: 'Наличный расчет' },
  { id: 'transfer', name: 'Перевод Kaspi' },
  { id: 'qr', name: 'Kaspi QR' },
  { id: 'invoice', name: 'Счет на оплату' },
  { id: 'deferred', name: 'Отсрочка платежа' }
]

const todayStr = format(new Date(), 'dd.MM.yyyy')

const orderData = reactive({
  customerName: authStore.user?.name || '',
  address: authStore.user?.address || localStorage.getItem('gastromir_address') || '',
  phone: authStore.user?.phone || localStorage.getItem('gastromir_phone') || '',
  paymentMethod: 'Наличный расчет',
  deliveryDate: todayStr,
  deliveryTime: 'До 14:00'
})

const onPhoneInput = (event) => {
  orderData.phone = formatPhone(event.target.value)
}

// Keep prefilled customerName up-to-date
watch(() => authStore.user, (newUser) => {
  if (newUser) {
    if (!orderData.customerName) orderData.customerName = newUser.name
    if (!orderData.phone && newUser.phone) orderData.phone = newUser.phone
    if (!orderData.address && newUser.address) orderData.address = newUser.address
  }
}, { immediate: true })

watch(() => orderData.phone, (newPhone) => {
  if (newPhone) {
    localStorage.setItem('gastromir_phone', newPhone)
  }
})

watch(() => orderData.address, (newAddress) => {
  if (newAddress) {
    localStorage.setItem('gastromir_address', newAddress)
  }
})

watch(() => cartStore.isModalOpen, (isOpen) => {
  if (isOpen) {
    fetchPastOrdersCount()
    if (!orderData.phone) {
      orderData.phone = authStore.user?.phone || localStorage.getItem('gastromir_phone') || ''
    }
    if (!orderData.address) {
      orderData.address = authStore.user?.address || localStorage.getItem('gastromir_address') || ''
    }
    if (!orderData.customerName) {
      orderData.customerName = authStore.user?.name || ''
    }
  }
})

const isOverLimit = computed(() => {
  if (!authStore.isAuthenticated) return false
  if (authStore.user?.role === 'admin') return false
  const limit = authStore.user?.order_limit || 500000.00
  return cartStore.totalPrice > limit
})

const onDateInput = (event) => {
  let value = event.target.value.replace(/\D/g, '')
  if (value.length > 8) value = value.slice(0, 8)
  
  let formatted = ''
  if (value.length > 0) {
    formatted += value.slice(0, 2)
  }
  if (value.length > 2) {
    formatted += '.' + value.slice(2, 4)
  }
  if (value.length > 4) {
    formatted += '.' + value.slice(4, 8)
  }
  orderData.deliveryDate = formatted
}

const isDateValid = computed(() => {
  const dateStr = orderData.deliveryDate
  if (!dateStr || dateStr.length !== 10) return false
  const parsed = parse(dateStr, 'dd.MM.yyyy', new Date())
  if (!isValid(parsed)) return false
  const today = startOfDay(new Date())
  return !isBefore(parsed, today)
})

const invoiceDate = computed(() => {
  const d = new Date()
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}.${month}.${year}`
})

const barItems = computed(() => {
  const barCategories = ['Чай-кофе', 'Сиропы', 'Орехи']
  return cartStore.items.filter(item => barCategories.includes(item.category))
})

const mainItems = computed(() => {
  const barCategories = ['Чай-кофе', 'Сиропы', 'Орехи']
  return cartStore.items.filter(item => !barCategories.includes(item.category))
})

const mainItemsTotal = computed(() => {
  return mainItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const barItemsTotal = computed(() => {
  return barItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU').format(price)
}

const placeOrderInDatabase = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({
        items: cartStore.items,
        totalPrice: cartStore.totalPrice
      })
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || 'Ошибка сохранения заказа в бэкенд')
    }
    return true
  } catch (err) {
    console.error(err)
    alert(err.message || 'Ошибка подключения к серверу')
    return false
  }
}

const sendToWhatsApp = async () => {
  if (!authStore.isAuthenticated) {
    cartStore.closeModal()
    router.push('/login')
    return
  }

  const newWindow = window.open('', '_blank')

  const saved = await placeOrderInDatabase()
  if (!saved) {
    if (newWindow) {
      newWindow.close()
    }
    return
  }

  const itemsText = cartStore.items.map(item => `- ${item.name}: ${item.quantity} ${item.unit} x ${formatPrice(item.price)} тг`).join('\n')
  const totalText = `Итого: ${formatPrice(cartStore.totalPrice)} тг`
  const message = `👋 *Новый заказ в GASTROMIR!*\n\n*Ресторан:* ${orderData.customerName}\n*Телефон:* ${orderData.phone}\n*Адрес:* ${orderData.address}\n*Способ оплаты:* ${orderData.paymentMethod}\n*Дата доставки:* ${orderData.deliveryDate}\n*Время доставки:* ${orderData.deliveryTime}\n\n*Заказ:*\n${itemsText}\n\n*${totalText}*`
  
  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = `https://wa.me/77015141404?text=${encodedMessage}`

  if (newWindow) {
    newWindow.location.href = whatsappUrl
  } else {
    window.open(whatsappUrl, '_blank')
  }

  cartStore.clearCart()
  cartStore.closeModal()
}

const isSendingEmail = ref(false)
const showToast = ref(false)

const showSuccessToast = () => {
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 4000)
}

const sendToEmail = async () => {
  if (!authStore.isAuthenticated) {
    cartStore.closeModal()
    router.push('/login')
    return
  }

  isSendingEmail.value = true
  const saved = await placeOrderInDatabase()
  if (!saved) {
    isSendingEmail.value = false
    return
  }

  const date = new Date().toLocaleDateString('ru-RU')
  const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })

  const itemsList = cartStore.items.map((item, i) =>
    `${i + 1}. ${item.name} — ${item.quantity} ${item.unit} × ${formatPrice(item.price)} = ${formatPrice(item.quantity * item.price)} тг`
  ).join('\n')

  const weightNote = cartStore.hasWeightItems
    ? '\n\nПРИМЕЧАНИЕ: Для весовых товаров итоговая стоимость зависит от фактического веса и рассчитывается после сборки заказа.'
    : ''

  const freshNote = cartStore.hasFreshItems
    ? '\n\nПРИМЕЧАНИЕ: Цены на свежую продукцию (овощи, фрукты, зелень, салаты) являются плавающими и зависят от сезонности, качества и ежедневных поставок.'
    : ''

  const message = `===============================\nНАКЛАДНАЯ\n===============================\n\nПоставщик: GASTROMIR ИП ИБРАЕВ\nБИН/ИИН: 820727351424\nТелефон: +7 701 514 14 04\n\nПолучатель: ${orderData.customerName}\nТелефон: ${orderData.phone}\nАдрес: ${orderData.address}\nСпособ оплаты: ${orderData.paymentMethod}\nДата доставки: ${orderData.deliveryDate}\nВремя доставки: ${orderData.deliveryTime}\n\nДата заказа: ${date}\nВремя заказа: ${time}\n\n--------------------------------\nТОВАР\n--------------------------------\n${itemsList}\n\n--------------------------------\nИТОГО: ${formatPrice(cartStore.totalPrice)} тг\nК ОПЛАТЕ: ${formatPrice(cartStore.totalPrice)} тг\n\n================================\nСпасибо за заказ!\nGASTRO MIR\n================================${weightNote}${freshNote}`

  try {
    const formDataPayload = new FormData()
    formDataPayload.append("access_key", "a4c51ae1-a7d6-4ac4-9d54-3183cb69f4f5")
    formDataPayload.append("subject", `Новый заказ от ${orderData.customerName}`)
    formDataPayload.append("from_name", "GASTROMIR")
    formDataPayload.append("Ресторан", orderData.customerName)
    formDataPayload.append("Телефон", orderData.phone)
    formDataPayload.append("Адрес", orderData.address)
    formDataPayload.append("Способ оплаты", orderData.paymentMethod)
    formDataPayload.append("Дата доставки", orderData.deliveryDate)
    formDataPayload.append("Время доставки", orderData.deliveryTime)
    formDataPayload.append("Накладная", message)

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formDataPayload
    })

    if (response.ok) {
      cartStore.clearCart()
      cartStore.closeModal()
      orderData.customerName = authStore.user?.name || ''
      orderData.phone = ''
      orderData.address = ''
      orderData.paymentMethod = 'Наличный расчет'
      orderData.deliveryDate = todayStr
      orderData.deliveryTime = 'До 14:00'
      showSuccessToast()
    } else {
      alert('Ошибка при отправке. Попробуйте ещё раз.')
    }
  } catch (error) {
    console.error('Ошибка отправки:', error)
    alert('Ошибка при отправке. Проверьте подключение к интернету.')
  } finally {
    isSendingEmail.value = false
  }
}

const generatePDFInvoice = async () => {
  if (!authStore.isAuthenticated) {
    cartStore.closeModal()
    router.push('/login')
    return
  }
  if (!pdfTemplateRef.value) return
  isGeneratingPDF.value = true

  try {
    const html2pdf = (await import('html2pdf.js')).default
    const currentOrderNum = orderNum.value
    const element = pdfTemplateRef.value

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
  } finally {
    isGeneratingPDF.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.modal-content {
  background: var(--white);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  border-radius: 2rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.modal-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
}

.cart-items {
  margin-bottom: 2rem;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.item-img {
  width: 60px;
  height: 60px;
  border-radius: 0.75rem;
  object-fit: cover;
}

.item-details {
  flex: 1;
}

.item-details h4 {
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.item-details p {
  color: var(--primary);
  font-weight: 700;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.qty-control {
  display: flex;
  align-items: center;
  background: #f1f5f9;
  border-radius: 9999px;
  padding: 0.25rem;
}

.qty-control button {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.qty-control span {
  width: 30px;
  text-align: center;
  font-weight: 600;
}

.remove-btn {
  color: #ef4444;
  opacity: 0.6;
}

.remove-btn:hover {
  opacity: 1;
}

.order-form {
  background: #f8fafc;
  padding: 2rem;
  border-radius: 2rem;
  margin-bottom: 2rem;
  border: 1px solid #e2e8f0;
}

.weight-badge {
  display: inline-block;
  font-size: 0.7rem;
  color: var(--secondary-dark);
  background: #FEF3C7;
  padding: 0.15rem 0.5rem;
  border-radius: 0.35rem;
  margin-top: 0.25rem;
  font-weight: 600;
}

.weight-disclaimer {
  font-size: 0.8rem;
  color: var(--secondary-dark);
  background: #FEF3C7;
  padding: 0.6rem 0.75rem;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.fresh-disclaimer {
  font-size: 0.8rem;
  color: var(--secondary-dark);
  background: #FEF3C7;
  padding: 0.6rem 0.75rem;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.order-form h3 {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  color: var(--primary);
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-group input {
  width: 100%;
  padding: 1rem 1.25rem;
  border-radius: 1rem;
  border: 1px solid #ddd;
  background: var(--white);
  outline: none;
  font-size: 1rem;
  transition: var(--transition);
}

.form-group input:focus {
  border-color: var(--secondary);
  box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.1);
}

.modal-footer {
  padding: 1.5rem 2rem;
  background: #f8fafc;
  border-top: 1px solid #f1f5f9;
}

.total-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
}

.btn-block {
  width: 100%;
  padding: 1rem;
}

.empty-cart {
  padding: 5rem 2rem;
  text-align: center;
  color: var(--gray);
}

.empty-cart p {
  margin: 1.5rem 0;
}

.close-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.close-btn:hover {
  background: #f1f5f9;
}

.footer-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-whatsapp {
  background: #25D366;
  color: var(--white);
}

.btn-whatsapp:hover {
  background: #128C7E;
  transform: translateY(-2px);
}

.btn-outline-dark {
  border: 1px solid var(--primary);
  color: var(--primary);
}

.btn-outline-dark:hover {
  background: var(--primary);
  color: var(--white);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 600px) {
  .modal-overlay { padding: 0; }
  .modal-content { 
    max-height: 100dvh; 
    border-radius: 0; 
    height: 100dvh;
  }
  .modal-body { padding: 1.25rem; }
  .cart-item { gap: 1rem; }
  .order-form { padding: 1.5rem; border-radius: 1.5rem; }
  .modal-footer { padding: 1.25rem; padding-bottom: calc(1.25rem + env(safe-area-inset-bottom)); }
  .total-row { font-size: 1.1rem; }
}

.toast-success {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: #22c55e;
  color: #fff;
  padding: 1rem 2rem;
  border-radius: 1rem;
  font-size: 1rem;
  font-weight: 600;
  z-index: 9999;
  box-shadow: 0 8px 30px rgba(34,197,94,0.35);
  white-space: nowrap;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateX(-50%) translateY(20px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}

.payment-methods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.payment-method-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid #ddd;
  background: var(--white);
  cursor: pointer;
  transition: var(--transition);
  user-select: none;
}

.payment-method-card:hover {
  border-color: var(--secondary);
  background: rgba(245, 158, 11, 0.02);
}

.payment-method-card.active {
  border-color: var(--secondary);
  background: rgba(245, 158, 11, 0.05);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.checkbox-indicator {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: var(--white);
  transition: var(--transition);
}

.payment-method-card.active .checkbox-indicator {
  border-color: var(--secondary);
  background: var(--secondary);
  color: var(--white);
}

.method-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--primary);
}

.form-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-family: inherit;
  background-color: var(--white);
  color: var(--primary);
  cursor: pointer;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  padding-right: 2.5rem;
}

.form-select:hover {
  border-color: var(--secondary);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.form-select:focus {
  outline: none;
  border-color: var(--secondary);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.2);
}

.form-select option {
  padding: 0.5rem;
  background-color: var(--white);
  color: var(--primary);
}

.pdf-offscreen-container {
  position: absolute;
  left: -9999px;
  top: -9999px;
  width: 710px;
}

/* Warnings in checkout */
.auth-warning-box {
  background: rgba(37, 99, 235, 0.08);
  border: 1px solid rgba(37, 99, 235, 0.2);
  color: var(--accent);
  padding: 1rem;
  border-radius: 1rem;
  margin-bottom: 1.25rem;
  font-size: 0.9rem;
  line-height: 1.4;
  text-align: center;
}

.auth-warning-box a {
  color: var(--accent);
  text-decoration: underline;
}

.limit-warning-box {
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.25);
  color: #ef4444;
  padding: 1rem;
  border-radius: 1rem;
  margin-bottom: 1.25rem;
  font-size: 0.9rem;
  line-height: 1.4;
  text-align: center;
  font-weight: 500;
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
</style>
