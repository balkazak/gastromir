/**
 * Service for submitting website forms and inquiries directly to the GASTROMIR backend.
 * Replaces third-party providers (e.g. Web3Forms) and handles file attachments without size/cost restrictions.
 */

const getApiBaseUrl = () => {
  return import.meta.env.VITE_API_URL || 'https://gastroback-production.up.railway.app';
};

/**
 * Sends a form submission to the backend API.
 * 
 * @param {Object} options
 * @param {string} options.formType - Identifier for the form (e.g. 'quick_purchase_list', 'contact_lead', 'price_request', 'horeca_lead', 'cart_invoice')
 * @param {string} [options.subject] - Email / notification subject
 * @param {string} [options.restaurant] - Restaurant or organization name
 * @param {string} [options.name] - Contact person's name
 * @param {string} [options.phone] - Contact phone number
 * @param {string} [options.email] - Contact email address
 * @param {string} [options.message] - Text notes, purchase list, or comments
 * @param {File|null} [options.file] - Optional attached file (Excel, PDF, Word, Photo)
 * @param {Object} [options.details] - Any extra key-value pairs (e.g. categories, delivery time, invoice details)
 * @returns {Promise<{ success: boolean, message: string, id: number, file_url?: string }>}
 */
export async function submitForm({
  formType = 'custom',
  subject = '',
  restaurant = '',
  name = '',
  phone = '',
  email = '',
  message = '',
  file = null,
  details = null
}) {
  const formData = new FormData();
  formData.append('form_type', formType);
  
  if (subject) formData.append('subject', subject);
  if (restaurant) formData.append('restaurant', restaurant);
  if (name) formData.append('name', name);
  if (phone) formData.append('phone', phone);
  if (email) formData.append('email', email);
  if (message) formData.append('message', message);
  if (file) formData.append('attachment', file);
  if (details && typeof details === 'object') {
    formData.append('details', JSON.stringify(details));
  }

  const baseUrl = getApiBaseUrl();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch(`${baseUrl}/api/forms/submit`, {
      method: 'POST',
      body: formData,
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const result = await response.json().catch(() => ({}));

    if (!response.ok || result.success === false) {
      const errorMsg = result.message || `Ошибка сервера (${response.status})`;
      throw new Error(errorMsg);
    }

    return result;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Превышено время ожидания ответа сервера. Пожалуйста, повторите попытку или свяжитесь с нами через WhatsApp.');
    }
    throw err;
  }
}
