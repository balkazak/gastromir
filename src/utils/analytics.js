// GA4 & Metrika Event Tracking Helper
export const trackEvent = (eventName, params = {}) => {
  // Google Analytics 4 (gtag)
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params)
  }

  // Yandex Metrika (ym)
  if (typeof window !== 'undefined' && typeof window.ym === 'function' && window.YA_COUNTER_ID) {
    window.ym(window.YA_COUNTER_ID, 'reachGoal', eventName, params)
  }

  // Dev log for verification
  if (import.meta.env.DEV) {
    console.log(`[Analytics Event] ${eventName}`, params)
  }
}

export const trackWhatsAppClick = (source = 'unknown') => {
  trackEvent('click_whatsapp', { source })
}

export const trackPhoneClick = (phone = '') => {
  trackEvent('click_phone', { phone })
}

export const trackQuickOrder = (method = 'whatsapp') => {
  trackEvent('quick_order', { method })
}

export const trackUploadPurchaseList = (fileType = 'text') => {
  trackEvent('upload_purchase_list', { file_type: fileType })
}

export const trackDownloadPrice = (format = 'pdf') => {
  trackEvent('download_price', { format })
}
