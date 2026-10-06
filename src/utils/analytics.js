// GA4 & Metrika Event Tracking Helper

const getGaId = () => {
  if (typeof window === 'undefined') return 'G-XN3ZX5EX86'
  const id = window.GA_MEASUREMENT_ID || import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XN3ZX5EX86'
  return (id && id !== 'G-MEASUREMENT_ID' && !id.includes('%')) ? id : 'G-XN3ZX5EX86'
}

const getYmId = () => {
  if (typeof window === 'undefined') return 113462837
  const id = Number(window.YA_COUNTER_ID) || Number(import.meta.env.VITE_YM_COUNTER_ID) || 113462837
  return (id > 0 && !isNaN(id)) ? id : 113462837
}

// Track SPA Page Views for both GA4 and Yandex Metrika
export const trackPageView = (to) => {
  const pagePath = to.fullPath || to.path
  const pageTitle = to.meta?.title || document.title

  // GA4 page_view
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    const gaId = getGaId()
    if (gaId) {
      window.gtag('event', 'page_view', {
        page_path: pagePath,
        page_title: pageTitle,
        page_location: window.location.href
      })
    }
  }

  // Yandex Metrika hit (SPA)
  if (typeof window !== 'undefined' && typeof window.ym === 'function') {
    const ymId = getYmId()
    if (ymId) {
      window.ym(ymId, 'hit', pagePath, {
        title: pageTitle,
        referer: window.location.href
      })
    }
  }

  if (import.meta.env.DEV) {
    console.log(`[Analytics PageView] ${pagePath} — "${pageTitle}"`)
  }
}

// Track Custom Conversion Events & Goals
export const trackEvent = (eventName, params = {}) => {
  // Google Analytics 4 (gtag)
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params)
  }

  // Yandex Metrika (reachGoal)
  if (typeof window !== 'undefined' && typeof window.ym === 'function') {
    const ymId = getYmId()
    if (ymId) {
      window.ym(ymId, 'reachGoal', eventName, params)
    }
  }

  // Dev log for verification in browser console
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

export const trackOrderCompleted = (orderData = {}) => {
  trackEvent('order_completed', {
    sum: orderData.sum,
    items_count: orderData.items_count,
    method: orderData.method || 'online'
  })
}

