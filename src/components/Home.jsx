import React, { useState, useEffect } from 'react';
import Header from './Header';
import SearchBar from './SearchBar';
import HeroBanner from './HeroBanner';
import ProductCard from './ProductCard';
import FloatingCart from './FloatingCart';
import BottomNav from './BottomNav';
import CartDrawer from './CartDrawer';
import CheckoutModal from './CheckoutModal';
import OrderSuccessModal from './OrderSuccessModal';
import WhatsAppBanner from './WhatsAppBanner';
import FlashSaleStrip from './FlashSaleStrip';
import FilterSheet from './FilterSheet';
import QuickViewModal from './QuickViewModal';
import RecentlyViewed from './RecentlyViewed';
import ScentFinderQuiz from './ScentFinderQuiz';
import OrderTrackingModal from './OrderTrackingModal';
import InstallPrompt from './InstallPrompt';

import { MOCK_PRODUCTS } from '../data/products';
import { safeGetItem, safeSetItem } from '../utils/storage';
import { X, ArrowLeft, Grid, User, LogIn, ArrowUp, SlidersHorizontal, Sparkles } from 'lucide-react';

/**
 * Home Component - ATOR ALI (Clean White Modern Theme)
 */
export default function Home({ onResetSplash }) {
  const [activeTab, setActiveTab] = useState('home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeSearchTerm, setActiveSearchTerm] = useState(null);

  // Cart & Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Filter states
  const maxPrice = 20000;
  const [priceRange, setPriceRange] = useState(maxPrice);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState('popular');

  // Available categories list
  const categoriesList = [
    'NEW ARRIVALS',
    'PREMIUM PERFUME OIL',
    'ATTAR COLLECTION',
    'COMBO OFFERS'
  ];

  // Recently Viewed state
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Cart state from safe storage or default
  const [cartItems, setCartItems] = useState(() => {
    return safeGetItem('ator_ali_cart', [
      { ...MOCK_PRODUCTS[0], quantity: 1, selectedSize: '12ml' },
      { ...MOCK_PRODUCTS[1], quantity: 1, selectedSize: '6ml' }
    ]);
  });

  // Save cart to localStorage
  useEffect(() => {
    safeSetItem('ator_ali_cart', cartItems);
  }, [cartItems]);

  // Load recently viewed
  useEffect(() => {
    const loaded = safeGetItem('ator_ali_recently_viewed', []);
    setRecentlyViewed(loaded);
  }, []);

  // Back to top scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Add to recently viewed
  const addToRecentlyViewed = (product) => {
    if (!product) return;
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      const updated = [product, ...filtered].slice(0, 8);
      safeSetItem('ator_ali_recently_viewed', updated);
      return updated;
    });
  };

  const handleClearRecentlyViewed = () => {
    setRecentlyViewed([]);
    safeSetItem('ator_ali_recently_viewed', []);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartBDT = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Sections
  const sections = [
    {
      id: 'new-arrivals',
      title: 'NEW ARRIVALS',
      categoryKey: 'NEW ARRIVALS'
    },
    {
      id: 'premium-perfume-oil',
      title: 'PREMIUM PERFUME OIL',
      categoryKey: 'PREMIUM PERFUME OIL'
    },
    {
      id: 'attar-collection',
      title: 'ATTAR COLLECTION',
      categoryKey: 'ATTAR COLLECTION'
    },
    {
      id: 'combo-offers',
      title: 'COMBO OFFERS',
      categoryKey: 'COMBO OFFERS'
    }
  ];

  // Helper to filter and sort product list
  const applyFiltersAndSort = (productList) => {
    let filtered = productList.filter((p) => {
      const matchesPrice = p.price <= priceRange;
      const matchesCat =
        selectedCategories.length === 0 || selectedCategories.includes(p.category);
      return matchesPrice && matchesCat;
    });

    if (sortBy === 'price-low-high') {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high-low') {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      filtered = [...filtered].sort((a, b) => b.id - a.id);
    }

    return filtered;
  };

  const handleToggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleResetFilters = () => {
    setPriceRange(maxPrice);
    setSelectedCategories([]);
    setSortBy('popular');
  };

  const handleAddToCart = (prod, selectedSize = '12ml') => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.id === prod.id && item.selectedSize === selectedSize
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prev, { ...prod, quantity: 1, selectedSize }];
    });
    addToRecentlyViewed(prod);
  };

  const handleBuyNow = (prod, selectedSize = '12ml') => {
    handleAddToCart(prod, selectedSize);
    setIsCheckoutOpen(true);
  };

  const handleQuickView = (prod) => {
    setQuickViewProduct(prod);
    addToRecentlyViewed(prod);
  };

  const handleUpdateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleOpenCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleSuccessOrder = () => {
    setIsCheckoutOpen(false);
    setCartItems([]);
    setIsSuccessOpen(true);
  };

  const handleSearchSubmit = (term) => {
    setActiveSearchTerm(term);
  };

  const handleSelectProduct = (prod) => {
    handleQuickView(prod);
  };

  const searchResults = activeSearchTerm
    ? applyFiltersAndSort(
        MOCK_PRODUCTS.filter(
          (p) =>
            p.title.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
            (p.note && p.note.toLowerCase().includes(activeSearchTerm.toLowerCase()))
        )
      )
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 pb-24 selection:bg-black selection:text-white font-sans">
      {/* Install Prompt for PWA */}
      <InstallPrompt />

      {/* Header */}
      <Header
        cartCount={cartCount}
        onLogoClick={() => setActiveSearchTerm(null)}
        onCartClick={() => setIsCartOpen(true)}
        onToggleSearch={() => setIsSearchOpen((prev) => !prev)}
        isSearchOpen={isSearchOpen}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
      />

      {/* Floating Cart Widget on Right Edge */}
      <FloatingCart
        itemCount={cartCount}
        totalAmount={totalCartBDT}
        onClick={() => setIsCartOpen(true)}
      />

      {/* Search Bar Row */}
      {(isSearchOpen || activeSearchTerm) && (
        <div className="bg-white border-b border-gray-100 py-2.5 px-4 shadow-xs sticky top-14 z-30 animate-in slide-in-from-top duration-200">
          <div className="max-w-7xl mx-auto flex items-center gap-2">
            <div className="flex-1">
              <SearchBar
                onSearchSubmit={handleSearchSubmit}
                onSelectProduct={handleSelectProduct}
                autoFocus={isSearchOpen}
              />
            </div>
            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              aria-label="Open filter options"
              className="p-3 bg-black text-white hover:bg-gray-800 rounded-xl transition-colors cursor-pointer shrink-0 flex items-center justify-center"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Filter Bottom Sheet Modal */}
      <FilterSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        categories={categoriesList}
        selectedCategories={selectedCategories}
        onToggleCategory={handleToggleCategory}
        maxPrice={maxPrice}
        priceRange={priceRange}
        onChangePriceRange={setPriceRange}
        sortBy={sortBy}
        onChangeSortBy={setSortBy}
        onClearAllFilters={handleResetFilters}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {/* Track Order Modal */}
      <OrderTrackingModal
        isOpen={isTrackOrderOpen}
        onClose={() => setIsTrackOrderOpen(false)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onOpenCheckout={handleOpenCheckout}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onSuccessOrder={handleSuccessOrder}
      />

      {/* Order Success Confirmation Modal */}
      <OrderSuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
      />

      {/* Category Drawer Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-gray-200 shadow-2xl relative text-gray-900">
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Grid className="w-5 h-5 text-black" />
              <h3 className="text-lg font-bold text-black">Product Categories</h3>
            </div>

            <div className="space-y-2">
              {sections.map((sec) => {
                const count = MOCK_PRODUCTS.filter((p) => p.category === sec.categoryKey).length;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => {
                      setIsCategoryModalOpen(false);
                      const elem = document.getElementById(sec.id);
                      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full text-left py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 font-bold text-xs uppercase tracking-wider text-gray-800 transition-colors flex items-center justify-between cursor-pointer border border-gray-100"
                  >
                    <span>{sec.title}</span>
                    <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full font-bold">
                      {count} Items
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-gray-200 shadow-2xl relative text-center text-gray-900 space-y-4">
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-black mx-auto border border-gray-200">
              <LogIn className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-bold text-black">Customer Login</h3>
            <p className="text-xs text-gray-500">
              Enter your mobile number to view order history and saved addresses.
            </p>

            <input
              type="tel"
              placeholder="e.g. 01712345678"
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-center font-bold focus:outline-hidden focus:border-black"
            />

            <button
              type="button"
              onClick={() => setIsLoginModalOpen(false)}
              className="w-full py-3 bg-black hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
            >
              Send OTP
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 pt-3 space-y-6">
        {/* Search Results View */}
        {activeSearchTerm ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-200">
              <div>
                <button
                  type="button"
                  onClick={() => setActiveSearchTerm(null)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-black hover:underline mb-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
                </button>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Search Results for "{activeSearchTerm}"
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsFilterOpen(true)}
                className="px-3 py-1.5 bg-black text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
              </button>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {searchResults.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onBuyNow={handleBuyNow}
                    onAddToCart={handleAddToCart}
                    onQuickView={handleQuickView}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-200 space-y-2">
                <p className="text-sm font-bold text-gray-800">
                  No matching products found for "{activeSearchTerm}"
                </p>
                <p className="text-xs text-gray-500">
                  Try adjusting your filters or search keywords.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-2 inline-block px-4 py-2 bg-black text-white text-xs font-bold rounded-xl"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Normal Home Page View */
          <>
            {/* Hero Banner Slider */}
            <HeroBanner
              onShopNowClick={() => {
                const elem = document.getElementById('new-arrivals');
                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Flash Sale Countdown Strip */}
            <FlashSaleStrip
              onExploreSale={() => {
                const elem = document.getElementById('combo-offers');
                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Scent Finder Interactive Quiz */}
            <ScentFinderQuiz onAddToCart={handleAddToCart} />

            {/* Product Category Sections */}
            {sections.map((sec) => {
              const categoryProducts = applyFiltersAndSort(
                MOCK_PRODUCTS.filter((p) => p.category === sec.categoryKey)
              );

              if (categoryProducts.length === 0) return null;

              return (
                <section key={sec.id} id={sec.id} aria-label={sec.title} className="space-y-3 pt-2">
                  {/* Section Header Row */}
                  <div className="flex items-center justify-between pb-1 border-b border-gray-100">
                    <div className="relative">
                      <h2 className="text-base sm:text-lg font-extrabold text-black uppercase tracking-wider font-sans">
                        {sec.title}
                      </h2>
                      {/* Gold Accent Line */}
                      <span className="absolute -bottom-[5px] left-0 w-12 h-[3px] bg-[#D4AF37] rounded-full" />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategories([sec.categoryKey]);
                        setIsFilterOpen(true);
                      }}
                      className="px-3.5 py-1.5 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-full transition-colors cursor-pointer shadow-xs"
                    >
                      Filter & See All
                    </button>
                  </div>

                  {/* 2 columns on mobile product grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {categoryProducts.map((prod) => (
                      <ProductCard
                        key={prod.id}
                        product={prod}
                        onBuyNow={handleBuyNow}
                        onAddToCart={handleAddToCart}
                        onQuickView={handleQuickView}
                      />
                    ))}
                  </div>
                </section>
              );
            })}

            {/* Recently Viewed Horizontal Scroll */}
            <RecentlyViewed
              products={recentlyViewed}
              onQuickView={handleQuickView}
              onAddToCart={handleAddToCart}
              onClear={handleClearRecentlyViewed}
            />

            {/* WhatsApp Contact Banner above Footer */}
            <WhatsAppBanner />
          </>
        )}
      </main>

      {/* Back To Top Floating Button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="fixed bottom-20 right-4 z-40 p-3 bg-black text-white hover:bg-gray-800 rounded-full shadow-lg border border-gray-700 transition-all active:scale-90 cursor-pointer animate-in fade-in"
        >
          <ArrowUp className="w-5 h-5 text-white" />
        </button>
      )}

      {/* Fixed Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabSelect={(tab) => setActiveTab(tab)}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCategory={() => setIsCategoryModalOpen(true)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />
    </div>
  );
}
