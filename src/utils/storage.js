/**
 * Safe LocalStorage Utilities with try/catch error handling
 */

export function safeGetItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (err) {
    console.warn(`Error reading localStorage key "${key}":`, err);
    return defaultValue;
  }
}

export function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`Error setting localStorage key "${key}":`, err);
    return false;
  }
}

export function getStorageItem(key, defaultValue = null) {
  return safeGetItem(key, defaultValue);
}

export function setStorageItem(key, value) {
  return safeSetItem(key, value);
}

const RECENTLY_VIEWED_KEY = 'ator_ali_recently_viewed';
const ORDERS_KEY = 'ator_ali_orders';

export function getRecentlyViewed() {
  return safeGetItem(RECENTLY_VIEWED_KEY, []);
}

export function addRecentlyViewed(product) {
  if (!product || !product.id) return [];
  try {
    const existing = getRecentlyViewed();
    const filtered = existing.filter((item) => item.id !== product.id);
    const updated = [product, ...filtered].slice(0, 8); // Keep last 8 opened products
    safeSetItem(RECENTLY_VIEWED_KEY, updated);
    return updated;
  } catch (err) {
    console.warn('Error saving recently viewed product:', err);
    return [];
  }
}

export function getSavedOrders() {
  return safeGetItem(ORDERS_KEY, []);
}

export function saveOrderToStorage(order) {
  if (!order) return [];
  try {
    const existing = getSavedOrders();
    const updated = [order, ...existing];
    safeSetItem(ORDERS_KEY, updated);
    return updated;
  } catch (err) {
    console.warn('Error saving order to localStorage:', err);
    return [];
  }
}
