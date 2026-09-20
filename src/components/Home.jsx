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
import { getStorefrontData } from '../lib/storefrontData';
import { safeGetItem, safeSetItem } from '../utils/storage';
import { X, ArrowLeft, Grid, LogIn, ArrowUp, SlidersHorizontal } from 'lucide-react';

/**
 * Home Component - Extrovat Lifestyle
 */
export default function Home({ onResetSplash, isAdmin = false }) {
  const [storefrontProducts, setStorefrontProducts] = useState(MOCK_PRODUCTS);
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

  // Updated Category Names
  const categoriesList = [
    'Attar',
    'Perfume',
    'Body Spray',
    'Oud & Agarwood',
    'Gift Sets',
    'Lifestyle',
    'Combo Offers',
    'Under ৳999'
  ];

  // Recently Viewed state
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Cart state from safe storage or default
  const [cartItems, setCartItems] = useState(() => {
    return safeGetItem('extrovat_cart', [
      { ...MOCK_PRODUCTS[0], quantity: 1, selectedSize: '12ml' },
      { ...MOCK_PRODUCTS[1], quantity: 1, selectedSize: '6ml' }
    ]);
  });

  // Save cart to localStorage
  useEffect(() => {
    safeSetItem('extrovat_cart', cartItems);
  }, [cartItems]);

  // Load storefront products from Firestore or cache with fallback
  useEffect(() => {
    let isMounted = true;
    getStorefrontData()
      .then((data) => {
        if (isMounted && data && Array.isArray(data.products) && data.products.length > 0) {
          setStorefrontProducts(data.products);
        }
      })
      .catch((err) => {
        console.warn('Failed to load storefront data, using fallback:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Load recently viewed
  useEffect(() => {
    const loaded = safeGetItem('extrovat_recently_viewed', []);
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

  const addToRecentlyViewed = (product) => {
    if (!product) return;
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      const updated = [product, ...filtered].slice(0, 8);
      safeSetItem('extrovat_recently_viewed', updated);
      return updated;
    });
  };

  const handleClearRecentlyViewed = () => {
    setRecentlyViewed([]);
    safeSetItem('extrovat_recently_viewed', []);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartBDT = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Home Page Sections
  const sections = categoriesList.map((catName) => {
    const sectionId = catName.toLowerCase().replace(/\s+/g, '-').replace('&', 'and');
    return {
      id: sectionId,
      title: catName,
      categoryKey: catName
    };
  });

  // Helper to filter and sort product list
  const applyFiltersAndSort = (productList) => {
    let filtered = productList.filter((p) => {
      const matchesPrice = p.price <= priceRange;
      const matchesCat =
        selectedCategories.length === 0 || selectedCategories.includes(p.category);
      // Special logic for "Under ৳999" category filter option
      if (selectedCategories.includes('Under ৳999') && p.price >= 1000) {
        return false;
      }
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
        storefrontProducts.filter(
          (p) =>
            (p.title || p.name || '').toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
            (p.category || p.categoryName || '').toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
            (p.note && p.note.toLowerCase().includes(activeSearchTerm.toLowerCase()))
        )
      )
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FC] text-[#0E1330] pb-24 selection:bg-[#2436F5] selection:text-white font-sans">
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
        isAdmin={isAdmin}
      />

      {/* Floating Cart Widget on Right Edge */}
      <FloatingCart
        itemCount={cartCount}
        totalAmount={totalCartBDT}
        onClick={() => setIsCartOpen(true)}
      />

      {/* Search Bar Row */}
      {(isSearchOpen || activeSearchTerm) && (
        <div className="bg-[#F7F8FC] border-b-2 border-[#0E1330] py-2.5 px-4 sticky top-16 z-30 animate-in slide-in-from-top duration-200">
          <div className="max-w-7xl mx-auto flex items-center gap-2">
            <div className="flex-1">
              <SearchBar
                onSearchSubmit={handleSearchSubmit}
                onSelectProduct={handleSelectProduct}
                autoFocus={isSearchOpen}
                products={storefrontProducts}
              />
            </div>
            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              aria-label="Open filter options"
              className="p-3 bg-[#0E1330] text-[#FFFFFF] hover:bg-[#2436F5] border-2 border-[#0E1330] rounded-xl transition-colors cursor-pointer shrink-0 flex items-center justify-center shadow-[2px_2px_0px_#0E1330]"
            >
              <SlidersHorizontal className="w-5 h-5 text-[#FFC933]" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E1330]/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FFFFFF] rounded-[24px] max-w-sm w-full p-6 border-2 border-[#0E1330] shadow-[4px_4px_0px_#0E1330] relative text-[#0E1330]">
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl border-2 border-[#0E1330] bg-[#FFFFFF] text-[#0E1330] hover:bg-[#F7F8FC] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Grid className="w-5 h-5 text-[#2436F5]" />
              <h3 className="text-lg font-heading font-extrabold text-[#0E1330]">Product categories</h3>
            </div>

            <div className="space-y-2">
              {sections.map((sec) => {
                const count = storefrontProducts.filter((p) => {
                  if (sec.categoryKey === 'Under ৳999') return p.price < 1000;
                  return p.category === sec.categoryKey;
                }).length;

                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => {
                      setIsCategoryModalOpen(false);
                      const elem = document.getElementById(sec.id);
                      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full text-left py-3 px-4 rounded-xl bg-[#F7F8FC] hover:bg-[#FFC933] font-heading font-bold text-xs uppercase tracking-wider text-[#0E1330] transition-colors flex items-center justify-between cursor-pointer border-2 border-[#0E1330]"
                  >
                    <span>{sec.title}</span>
                    <span className="text-[10px] bg-[#0E1330] text-[#FFFFFF] px-2 py-0.5 rounded-full font-heading font-bold">
                      {count} items
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E1330]/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FFFFFF] rounded-[24px] max-w-sm w-full p-6 border-2 border-[#0E1330] shadow-[4px_4px_0px_#0E1330] relative text-center text-[#0E1330] space-y-4">
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl border-2 border-[#0E1330] bg-[#FFFFFF] text-[#0E1330] hover:bg-[#F7F8FC] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 bg-[#FFC933] rounded-full flex items-center justify-center text-[#0E1330] mx-auto border-2 border-[#0E1330] shadow-[2px_2px_0px_#0E1330]">
              <LogIn className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-heading font-extrabold text-[#0E1330]">Customer login</h3>
            <p className="text-xs font-sans text-[#5B6079]">
              Enter mobile number to view order history and saved addresses.
            </p>

            <input
              type="tel"
              placeholder="e.g. 01712345678"
              className="w-full px-3 py-2.5 bg-[#F7F8FC] border-2 border-[#0E1330] rounded-xl text-xs text-center font-bold focus:outline-none focus:border-[#2436F5]"
            />

            <button
              type="button"
              onClick={() => setIsLoginModalOpen(false)}
              className="w-full py-3 bg-[#2436F5] text-[#FFFFFF] font-heading font-extrabold text-xs uppercase tracking-wider rounded-full border-2 border-[#0E1330] shadow-[2px_2px_0px_#0E1330] transition-colors cursor-pointer"
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
            <div className="flex items-center justify-between bg-[#FFFFFF] p-4 rounded-[20px] border-2 border-[#0E1330] shadow-[3px_3px_0px_#0E1330]">
              <div>
                <button
                  type="button"
                  onClick={() => setActiveSearchTerm(null)}
                  className="inline-flex items-center gap-1 text-xs font-heading font-bold text-[#0E1330] hover:underline mb-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to store
                </button>
                <h2 className="text-lg sm:text-xl font-heading font-extrabold text-[#0E1330]">
                  Search results for "{activeSearchTerm}"
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsFilterOpen(true)}
                className="px-3.5 py-2 bg-[#0E1330] text-[#FFFFFF] text-xs font-heading font-bold rounded-full border border-[#0E1330] flex items-center gap-1 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#FFC933]" /> Filters
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
              <div className="bg-[#FFFFFF] rounded-[20px] p-8 text-center border-2 border-[#0E1330] space-y-2">
                <p className="text-sm font-heading font-bold text-[#0E1330]">
                  No matching products found for "{activeSearchTerm}"
                </p>
                <p className="text-xs font-sans text-[#5B6079]">
                  Try adjusting filters or search keywords.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-2 inline-block px-4 py-2 bg-[#2436F5] text-[#FFFFFF] border-2 border-[#0E1330] text-xs font-heading font-bold rounded-full"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Normal Home Page View */
          <>
            {/* Hero Banner Carousel */}
            <HeroBanner
              onShopNowClick={() => {
                const elem = document.getElementById('attar');
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
            <ScentFinderQuiz onAddToCart={handleAddToCart} products={storefrontProducts} />

            {/* Product Category Sections */}
            {sections.map((sec) => {
              const categoryProducts = applyFiltersAndSort(
                storefrontProducts.filter((p) => {
                  if (sec.categoryKey === 'Under ৳999') return p.price < 1000;
                  return p.category === sec.categoryKey;
                })
              );

              if (categoryProducts.length === 0) return null;

              return (
                <section key={sec.id} id={sec.id} aria-label={sec.title} className="space-y-3 pt-2">
                  {/* Section Header Row */}
                  <div className="flex items-center justify-between pb-2 border-b-2 border-[#0E1330]">
                    <div className="relative">
                      <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#0E1330] tracking-tight">
                        {sec.title}
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategories([sec.categoryKey]);
                        setIsFilterOpen(true);
                      }}
                      className="px-4 py-1.5 bg-[#FFFFFF] text-[#0E1330] border-2 border-[#0E1330] shadow-[2px_2px_0px_#0E1330] font-heading font-bold text-xs rounded-full transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
                    >
                      See all
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

      {/* Storefront Footer with Staff Login Link */}
      <footer className="border-t-2 border-[#0E1330] bg-[#FFFFFF] py-6 px-4 mt-8 mb-16 text-center text-xs font-sans text-[#5B6079]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <p className="font-heading font-bold text-[#0E1330]">
              © {new Date().getFullYear()} Extrovat Lifestyle. All rights reserved.
            </p>
            <span className="hidden sm:inline text-[#5B6079]">•</span>
            <span className="text-[10px] font-mono text-[#5B6079]">
              v1.0 ({typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : 'dev'})
            </span>
          </div>
          <a
            href="#/admin/login"
            className="text-[11px] font-heading font-bold text-[#5B6079] hover:text-[#2436F5] underline underline-offset-2 transition-colors cursor-pointer"
          >
            Staff login
          </a>
        </div>
      </footer>

      {/* Back To Top Floating Button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="fixed bottom-20 left-4 z-40 p-3 bg-[#FFFFFF] text-[#0E1330] hover:bg-[#FFC933] rounded-full border-2 border-[#0E1330] shadow-[3px_3px_0px_#0E1330] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer animate-in fade-in"
        >
          <ArrowUp className="w-5 h-5 text-[#0E1330]" />
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
