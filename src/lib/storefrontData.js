import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';
import { MOCK_PRODUCTS } from '../data/products';

const CACHE_KEY = 'extrovat_storefront_cache';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Normalizes raw product document from Firestore or mock data into a uniform storefront format.
 */
export function normalizeProduct(rawDoc, docId) {
  if (!rawDoc || typeof rawDoc !== 'object') {
    rawDoc = {};
  }
  const id = docId || rawDoc.id || `prod-${Math.random().toString(36).substring(2, 9)}`;
  const name = rawDoc.name || rawDoc.title || 'Extrovat Product';
  const categoryName = rawDoc.categoryName || rawDoc.category || 'Attar';
  const price = typeof rawDoc.price === 'number' ? rawDoc.price : Number(rawDoc.price) || 0;
  const oldPrice = rawDoc.oldPrice ? Number(rawDoc.oldPrice) : null;
  const stock = typeof rawDoc.stock === 'number' ? rawDoc.stock : (rawDoc.stockCount ?? 10);

  // Format images array
  let images = [];
  if (Array.isArray(rawDoc.images) && rawDoc.images.length > 0) {
    images = rawDoc.images.filter(Boolean);
  } else if (rawDoc.image) {
    images = [rawDoc.image];
  } else {
    images = ['https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=400'];
  }

  // Format sizes
  let sizes = ['6ml', '12ml'];
  if (Array.isArray(rawDoc.sizes) && rawDoc.sizes.length > 0) {
    sizes = rawDoc.sizes;
  }

  return {
    id,
    title: name,
    name,
    category: categoryName,
    categoryName,
    categoryId: rawDoc.categoryId || '',
    brandId: rawDoc.brandId || '',
    brandName: rawDoc.brandName || '',
    slug: rawDoc.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    price,
    oldPrice,
    stockCount: stock,
    stock,
    lowStockThreshold: rawDoc.lowStockThreshold ?? 5,
    inStock: stock > 0,
    badge: rawDoc.badge || '',
    status: rawDoc.status || 'active',
    image: images[0],
    images,
    sizes,
    note: rawDoc.note || 'fresh',
    strength: rawDoc.strength || 'moderate',
    occasion: rawDoc.occasion || 'daily',
    description: rawDoc.description || 'Premium Extrovat fragrance product.',
    rating: typeof rawDoc.rating === 'number' ? rawDoc.rating : 4.8,
    reviewsCount: typeof rawDoc.reviewsCount === 'number' ? rawDoc.reviewsCount : 12
  };
}

/**
 * Fetch storefront products, categories, and brands with 5-minute sessionStorage caching.
 * Falls back to MOCK_PRODUCTS if Firestore read fails or products collection is empty.
 */
export async function getStorefrontData() {
  // Check sessionStorage cache
  try {
    const cachedStr = sessionStorage.getItem(CACHE_KEY);
    if (cachedStr) {
      const cached = JSON.parse(cachedStr);
      if (cached && cached.timestamp && Date.now() - cached.timestamp < CACHE_TTL_MS) {
        if (Array.isArray(cached.products) && cached.products.length > 0) {
          return cached;
        }
      }
    }
  } catch (err) {
    console.warn('sessionStorage cache read error:', err);
  }

  // Attempt Firestore fetch
  try {
    if (!db) {
      throw new Error('Firestore db is null or not initialized');
    }
    const productsRef = collection(db, 'products');
    let fetchedProducts = [];

    try {
      const q = query(productsRef, where('status', '==', 'active'));
      const productsSnap = await getDocs(q);
      productsSnap.forEach((docSnap) => {
        fetchedProducts.push(normalizeProduct(docSnap.data(), docSnap.id));
      });
    } catch (activeErr) {
      console.warn('Active products query error, falling back:', activeErr);
    }

    // If query returned no active products, try fetching all products as fallback
    if (fetchedProducts.length === 0) {
      try {
        const allProductsSnap = await getDocs(productsRef);
        allProductsSnap.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.status === 'active' || !data.status) {
            fetchedProducts.push(normalizeProduct(data, docSnap.id));
          }
        });
      } catch (allErr) {
        console.warn('All products query fallback error:', allErr);
      }
    }

    // Fetch categories
    let fetchedCategories = [];
    try {
      const catSnap = await getDocs(collection(db, 'categories'));
      catSnap.forEach((docSnap) => {
        fetchedCategories.push({ id: docSnap.id, ...docSnap.data() });
      });
    } catch (e) {
      console.warn('Categories fetch fallback:', e);
    }

    // Fetch brands
    let fetchedBrands = [];
    try {
      const brandSnap = await getDocs(collection(db, 'brands'));
      brandSnap.forEach((docSnap) => {
        fetchedBrands.push({ id: docSnap.id, ...docSnap.data() });
      });
    } catch (e) {
      console.warn('Brands fetch fallback:', e);
    }

    // If Firestore returned active products, cache and return
    if (fetchedProducts.length > 0) {
      const payload = {
        timestamp: Date.now(),
        products: fetchedProducts,
        categories: fetchedCategories,
        brands: fetchedBrands
      };
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(payload));
      } catch (err) {
        console.warn('sessionStorage cache write error:', err);
      }
      return payload;
    }
  } catch (firestoreErr) {
    console.warn('Firestore storefront fetch failed, falling back to mock data:', firestoreErr);
  }

  // Fallback to mock data
  const fallbackProducts = MOCK_PRODUCTS.map((prod) => normalizeProduct(prod, prod.id));
  const defaultCategories = [
    { id: 'cat-attar', name: 'Attar', slug: 'attar' },
    { id: 'cat-perfume', name: 'Perfume', slug: 'perfume' },
    { id: 'cat-body-spray', name: 'Body Spray', slug: 'body-spray' },
    { id: 'cat-oud', name: 'Oud & Agarwood', slug: 'oud-and-agarwood' },
    { id: 'cat-gift-sets', name: 'Gift Sets', slug: 'gift-sets' },
    { id: 'cat-lifestyle', name: 'Lifestyle', slug: 'lifestyle' },
    { id: 'cat-combo', name: 'Combo Offers', slug: 'combo-offers' }
  ];
  const defaultBrands = [
    { id: 'brand-extrovat', name: 'Extrovat Signature', slug: 'extrovat-signature' },
    { id: 'brand-royal', name: 'Royal Oud Co.', slug: 'royal-oud-co' }
  ];

  const fallbackPayload = {
    timestamp: Date.now(),
    products: fallbackProducts,
    categories: defaultCategories,
    brands: defaultBrands
  };

  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(fallbackPayload));
  } catch (err) {
    console.warn('sessionStorage cache write error:', err);
  }

  return fallbackPayload;
}

/**
 * Safely fetches approved reviews for storefront (using where("status", "==", "approved")) with try/catch fallback.
 */
export async function getApprovedReviews(productId) {
  try {
    if (!db) return [];
    const reviewsRef = collection(db, 'reviews');
    const q = query(reviewsRef, where('status', '==', 'approved'));
    const snap = await getDocs(q);
    const results = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      if (!productId || data.productId === productId) {
        results.push({ id: docSnap.id, ...data });
      }
    });
    return results;
  } catch (err) {
    console.warn('Failed to load approved reviews from Firestore:', err);
    return [];
  }
}

/**
 * Clear the storefront sessionStorage cache (call after admin creates/updates/deletes products)
 */
export function clearStorefrontCache() {
  try {
    sessionStorage.removeItem(CACHE_KEY);
  } catch (e) {
    console.warn('Failed to clear storefront cache:', e);
  }
}
