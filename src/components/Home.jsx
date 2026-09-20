import React, { useState } from 'react';
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
import { MOCK_PRODUCTS } from '../data/products';
import { BANGLADESH_DISTRICTS } from '../data/districts';
import { formatBDT } from '../utils/currency';
import { X, ArrowLeft, Grid, User, LogIn, CheckCircle2 } from 'lucide-react';

/**
 * Home Component - ATOR ALI (Clean White Modern Theme)
 */
export default function Home({ onResetSplash }) {
  const [activeTab, setActiveTab] = useState('home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeSearchTerm, setActiveSearchTerm] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [cartItems, setCartItems] = useState([
    { ...MOCK_PRODUCTS[0], quantity: 1 },
    { ...MOCK_PRODUCTS[1], quantity: 1 }
  ]);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartBDT = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Group products by section categories
  const sections = [
    {
      id: 'new-arrivals',
      title: 'NEW ARRIVALS',
      products: MOCK_PRODUCTS.filter((p) => p.category === 'NEW ARRIVALS')
    },
    {
      id: 'premium-perfume-oil',
      title: 'PREMIUM PERFUME OIL',
      products: MOCK_PRODUCTS.filter((p) => p.category === 'PREMIUM PERFUME OIL')
    },
    {
      id: 'attar-collection',
      title: 'ATTAR COLLECTION',
      products: MOCK_PRODUCTS.filter((p) => p.category === 'ATTAR COLLECTION')
    },
    {
      id: 'combo-offers',
      title: 'COMBO OFFERS',
      products: MOCK_PRODUCTS.filter((p) => p.category === 'COMBO OFFERS')
    }
  ];

  const handleAddToCart = (prod) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === prod.id);
      if (existing) {
        return prev.map((item) =>
          item.id === prod.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...prod, quantity: 1 }];
    });
  };

  const handleBuyNow = (prod) => {
    handleAddToCart(prod);
    setIsCheckoutOpen(true);
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
    handleBuyNow(prod);
  };

  const searchResults = activeSearchTerm
    ? MOCK_PRODUCTS.filter(
        (p) =>
          p.title.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(activeSearchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 pb-20 selection:bg-black selection:text-white">
      {/* Header */}
      <Header
        cartCount={cartCount}
        onLogoClick={() => setActiveSearchTerm(null)}
        onCartClick={() => setIsCartOpen(true)}
        onToggleSearch={() => setIsSearchOpen((prev) => !prev)}
        isSearchOpen={isSearchOpen}
      />

      {/* Floating Cart Widget on Right Edge */}
      <FloatingCart
        itemCount={cartCount}
        totalAmount={totalCartBDT}
        onClick={() => setIsCartOpen(true)}
      />

      {/* Search Bar (visible when toggled or when active search exists) */}
      {(isSearchOpen || activeSearchTerm) && (
        <div className="bg-white border-b border-gray-100 py-2 px-4 shadow-xs animate-in slide-in-from-top duration-200">
          <SearchBar
            onSearchSubmit={handleSearchSubmit}
            onSelectProduct={handleSelectProduct}
            autoFocus={isSearchOpen}
          />
        </div>
      )}

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

      {/* Category Drawer / Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-gray-200 shadow-2xl relative text-gray-900">
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-black hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Grid className="w-5 h-5 text-black" />
              <h3 className="text-lg font-bold text-black">Product Categories</h3>
            </div>

            <div className="space-y-2">
              {sections.map((sec) => (
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
                    {sec.products.length} Items
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Login Placeholder Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-gray-200 shadow-2xl relative text-center text-gray-900 space-y-4">
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-black hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-black mx-auto border border-gray-200">
              <LogIn className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-bold text-black">Customer Login</h3>
            <p className="text-xs text-gray-500">
              Enter your mobile number to access your order history and saved addresses.
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

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 pt-3 space-y-6">
        {/* Active Search Results View */}
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
            </div>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {searchResults.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onBuyNow={handleBuyNow}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-200">
                <p className="text-sm font-bold text-gray-800">
                  No matching products found for "{activeSearchTerm}"
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Normal Store View */
          <>
            {/* Banner Carousel */}
            <HeroBanner
              onShopNowClick={() => {
                const elem = document.getElementById('new-arrivals');
                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* SECTIONS */}
            {sections.map((sec) => (
              <section key={sec.id} id={sec.id} aria-label={sec.title} className="space-y-3 pt-2">
                {/* Section Header Row */}
                <div className="flex items-center justify-between pb-1 border-b border-gray-100">
                  <div className="relative">
                    <h2 className="text-base sm:text-lg font-extrabold text-black uppercase tracking-wider font-sans">
                      {sec.title}
                    </h2>
                    {/* Thin gold underline */}
                    <span className="absolute -bottom-[5px] left-0 w-12 h-[3px] bg-[#D4AF37] rounded-full" />
                  </div>

                  {/* Black rounded "See All" button */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsCategoryModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-full transition-colors cursor-pointer shadow-xs"
                  >
                    See All
                  </button>
                </div>

                {/* 2 columns on mobile product grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {sec.products.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onBuyNow={handleBuyNow}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </section>
            ))}

            {/* WhatsApp Banner above footer */}
            <WhatsAppBanner />
          </>
        )}
      </main>

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
