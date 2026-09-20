import React, { useState } from 'react';
import Header from './Header';
import SearchBar from './SearchBar';
import HeroBanner from './HeroBanner';
import FlashSaleStrip from './FlashSaleStrip';
import PromoBanner from './PromoBanner';
import WhatsAppBanner from './WhatsAppBanner';
import CartDrawer from './CartDrawer';
import CheckoutModal from './CheckoutModal';
import OrderSuccessModal from './OrderSuccessModal';
import { MOCK_PRODUCTS } from '../data/products';
import { formatBDT, formatUSD } from '../utils/currency';
import {
  Star,
  ShoppingBag,
  ArrowLeft,
  Filter,
  SlidersHorizontal,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  Eye,
  X
} from 'lucide-react';

/**
 * Home Component - ATOR ALI (Black & Gold Theme with Dual Currency BDT/USD & Full Checkout)
 */
export default function Home({ isDarkMode, onToggleDarkMode, onResetSplash }) {
  const [activeSearchTerm, setActiveSearchTerm] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const [cartItems, setCartItems] = useState([
    { ...MOCK_PRODUCTS[0], quantity: 1, size: '6ml Pure Oil' },
    { ...MOCK_PRODUCTS[1], quantity: 1, size: '50ml Spray' }
  ]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchSubmit = (term) => {
    setActiveSearchTerm(term);
    setSelectedProduct(null);
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setActiveSearchTerm(product.title);
  };

  const handleClearSearchResults = () => {
    setActiveSearchTerm(null);
    setSelectedProduct(null);
  };

  const handleAddToCart = (e, prod) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === prod.id);
      if (existing) {
        return prev.map((item) =>
          item.id === prod.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          ...prod,
          quantity: 1,
          size: prod.category.includes('Attar') ? '6ml Pure Oil' : '50ml Spray'
        }
      ];
    });
    setIsCartOpen(true);
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

  const searchResults = activeSearchTerm
    ? MOCK_PRODUCTS.filter(
        (p) =>
          p.title.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(activeSearchTerm.toLowerCase())
      )
    : [];

  const firstGroupProducts = MOCK_PRODUCTS.slice(0, 4);
  const secondGroupProducts = MOCK_PRODUCTS.slice(4);

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B0B] text-white transition-colors duration-200 pb-12 selection:bg-[#D4AF37] selection:text-black">
      {/* Sticky Header */}
      <Header
        cartCount={cartCount}
        isDarkMode={isDarkMode}
        onToggleDarkMode={onToggleDarkMode}
        onResetSplash={onResetSplash}
        onLogoClick={handleClearSearchResults}
        onCartClick={() => setIsCartOpen(true)}
      />

      {/* Cart Drawer Modal */}
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

      {/* Order Success Confirmation Screen */}
      <OrderSuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        {/* Search Bar Section */}
        <section aria-label="Product Search" className="mb-2">
          <SearchBar
            onSearchSubmit={handleSearchSubmit}
            onSelectProduct={handleSelectProduct}
          />
        </section>

        {/* SEARCH RESULTS VIEW */}
        {activeSearchTerm ? (
          <div className="animate-in fade-in duration-200 py-2">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-[#14120C] p-4 rounded-2xl border border-[#D4AF37]/30 shadow-md">
              <div>
                <button
                  type="button"
                  onClick={handleClearSearchResults}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] hover:underline mb-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to ATOR ALI Store
                </button>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
                  Search Results for <span className="text-[#D4AF37]">"{activeSearchTerm}"</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Found {searchResults.length} {searchResults.length === 1 ? 'item' : 'items'} matching your query
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-[#1F1B12] text-[#E5D7B5] rounded-xl border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-colors cursor-pointer"
                >
                  <Filter className="w-3.5 h-3.5 text-[#D4AF37]" /> Filter
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-[#1F1B12] text-[#E5D7B5] rounded-xl border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-colors cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4AF37]" /> Sort
                </button>
              </div>
            </div>

            {/* Selected Product Highlight Card */}
            {selectedProduct && (
              <div className="mb-8 bg-gradient-to-br from-[#14120C] via-[#221B0C] to-[#0B0B0B] text-white p-6 rounded-3xl shadow-xl relative overflow-hidden border border-[#D4AF37]/40">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-full md:w-1/3 aspect-square max-w-xs rounded-2xl overflow-hidden bg-[#14120C] border border-[#D4AF37]/30">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="inline-block px-3 py-1 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full text-xs font-bold uppercase tracking-wider border border-[#D4AF37]/30">
                      Selected Highlight
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white">
                      {selectedProduct.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {selectedProduct.description}
                    </p>

                    {/* Dual Currency Display */}
                    <div className="flex flex-wrap items-baseline gap-2 pt-2">
                      <span className="text-3xl font-extrabold text-[#D4AF37]">
                        {formatBDT(selectedProduct.price)}
                      </span>
                      <span className="text-sm font-semibold text-slate-300">
                        ({formatUSD(selectedProduct.price)})
                      </span>
                      {selectedProduct.originalPrice && (
                        <span className="text-xs line-through text-slate-500 ml-2">
                          {formatUSD(selectedProduct.originalPrice)} · {formatBDT(selectedProduct.originalPrice)}
                        </span>
                      )}
                    </div>

                    <div className="pt-3 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, selectedProduct)}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#D4AF37] hover:bg-[#E5BF42] text-black font-extrabold rounded-full text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg shadow-[#D4AF37]/20 cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4 text-black" /> Add to Cart
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuickViewProduct(selectedProduct)}
                        className="px-5 py-3 bg-[#1F1B12] hover:bg-[#2A2418] text-[#E5D7B5] border border-[#D4AF37]/30 rounded-full text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                      >
                        Full Product View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Results Product Grid */}
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {searchResults.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onAddToCart={(e) => handleAddToCart(e, prod)}
                    onQuickView={() => setQuickViewProduct(prod)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-[#14120C] rounded-3xl p-12 text-center border border-[#D4AF37]/20 shadow-lg">
                <div className="w-16 h-16 bg-[#1A1812] rounded-full flex items-center justify-center text-[#D4AF37] mx-auto mb-4 border border-[#D4AF37]/30">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  No matching products found
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  We couldn't find any items matching "{activeSearchTerm}". Try searching for popular terms like "Oud", "Musk", or "Attar".
                </p>
                <button
                  type="button"
                  onClick={handleClearSearchResults}
                  className="mt-6 px-6 py-2.5 bg-[#D4AF37] hover:bg-[#E5BF42] text-black font-extrabold text-xs rounded-full uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Explore Entire Collection
                </button>
              </div>
            )}
          </div>
        ) : (
          /* STORE FRONT CONTENT */
          <div className="space-y-6">
            {/* HERO CAROUSEL BANNER */}
            <HeroBanner
              onShopNowClick={() => {
                const catalogElem = document.getElementById('catalog');
                if (catalogElem) catalogElem.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Category Badges horizontal scroll */}
            <section aria-label="Product Categories" className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {['All Scents', 'Pure Attar', 'Royal Musk', 'Oud & Wood', 'Perfume Sprays', 'Gift Sets', 'New Arrivals'].map((cat, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    idx === 0
                      ? 'bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20'
                      : 'bg-[#14120C] text-slate-300 border border-[#D4AF37]/20 hover:border-[#D4AF37]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </section>

            {/* FLASH SALE STRIP (below categories) */}
            <FlashSaleStrip
              onExploreSale={() => {
                const catalogElem = document.getElementById('catalog');
                if (catalogElem) catalogElem.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Trust Badges */}
            <section aria-label="Store Guarantees" className="grid grid-cols-3 gap-3 bg-[#14120C] p-4 rounded-2xl border border-[#D4AF37]/20 text-center text-xs">
              <div className="flex flex-col items-center gap-1.5 p-2">
                <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                <span className="font-semibold text-slate-200">100% Organic & Pure</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-2 border-x border-[#D4AF37]/20">
                <Truck className="w-5 h-5 text-[#D4AF37]" />
                <span className="font-semibold text-slate-200">Express Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-2">
                <RotateCcw className="w-5 h-5 text-[#D4AF37]" />
                <span className="font-semibold text-slate-200">30-Day Easy Returns</span>
              </div>
            </section>

            {/* Featured Product Catalog */}
            <section id="catalog" aria-label="Featured Products" className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-wide">
                    ATOR ALI Collection
                  </h2>
                  <p className="text-xs text-[#D4AF37]/80 font-medium">
                    Signature attars, oud oils and luxury spray perfumes
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/30">
                  {MOCK_PRODUCTS.length} Fragrances
                </span>
              </div>

              {/* First 2 Rows of Products (4 items) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {firstGroupProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={(e) => handleAddToCart(e, product)}
                    onQuickView={() => setQuickViewProduct(product)}
                  />
                ))}
              </div>

              {/* PROMO BANNER (between 2nd and 3rd product rows) */}
              <PromoBanner
                onPromoClick={() => {
                  const catalogElem = document.getElementById('catalog');
                  if (catalogElem) catalogElem.scrollIntoView({ behavior: 'smooth' });
                }}
              />

              {/* Remaining Product Rows */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {secondGroupProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={(e) => handleAddToCart(e, product)}
                    onQuickView={() => setQuickViewProduct(product)}
                  />
                ))}
              </div>
            </section>

            {/* WHATSAPP BANNER (above footer) */}
            <WhatsAppBanner />
          </div>
        )}
      </main>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#0B0B0B] rounded-3xl max-w-lg w-full p-6 border border-[#D4AF37]/40 shadow-2xl relative overflow-hidden text-white">
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              aria-label="Close product view"
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white bg-[#1C180E] border border-[#D4AF37]/20 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col sm:flex-row gap-5 items-center">
              <div className="w-full sm:w-1/2 aspect-square rounded-2xl overflow-hidden bg-[#14120C] border border-[#D4AF37]/30">
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 space-y-2">
                <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider">
                  {quickViewProduct.category}
                </span>
                <h3 className="text-xl font-bold font-serif text-white">
                  {quickViewProduct.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {quickViewProduct.description}
                </p>

                {/* Dual Currency Price Display */}
                <div className="flex flex-wrap items-baseline gap-2 pt-2">
                  <span className="text-2xl font-extrabold text-[#D4AF37]">
                    {formatBDT(quickViewProduct.price)}
                  </span>
                  <span className="text-xs font-semibold text-slate-300">
                    ({formatUSD(quickViewProduct.price)})
                  </span>
                  {quickViewProduct.originalPrice && (
                    <span className="text-xs line-through text-slate-500 block">
                      {formatUSD(quickViewProduct.originalPrice)} · {formatBDT(quickViewProduct.originalPrice)}
                    </span>
                  )}
                </div>

                <div className="pt-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      handleAddToCart(e, quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="w-full py-3 bg-[#D4AF37] hover:bg-[#E5BF42] text-black font-extrabold rounded-full text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Product Card Subcomponent with Dual Currency Display */
function ProductCard({ product, onAddToCart, onQuickView }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="group bg-[#14120C] rounded-2xl border border-[#D4AF37]/25 shadow-md hover:border-[#D4AF37]/60 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Product Image */}
      <div className="relative aspect-square w-full bg-[#0B0B0B] overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#0B0B0B]/90 backdrop-blur-md text-[#D4AF37] text-[10px] font-bold tracking-wider uppercase border border-[#D4AF37]/30">
            {product.badge}
          </span>
        )}

        {/* Action icons */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
            aria-label={`Wishlist ${product.title}`}
            className="p-2 rounded-full bg-[#0B0B0B]/80 text-[#E5D7B5] hover:text-[#D4AF37] border border-[#D4AF37]/20 shadow-xs hover:scale-110 transition-transform cursor-pointer"
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                isWishlisted ? 'fill-rose-500 text-rose-500' : ''
              }`}
            />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView();
            }}
            aria-label={`Quick view ${product.title}`}
            className="p-2 rounded-full bg-[#0B0B0B]/80 text-[#E5D7B5] hover:text-[#D4AF37] border border-[#D4AF37]/20 shadow-xs hover:scale-110 transition-transform cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider mb-0.5">
            {product.category}
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-[#D4AF37] transition-colors">
            {product.title}
          </h3>
        </div>

        <div className="mt-3 pt-2 border-t border-[#D4AF37]/15 flex items-center justify-between gap-1">
          {/* Dual Currency Price (BDT prominent gold, USD smaller) */}
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-extrabold text-[#D4AF37] leading-tight">
              {formatBDT(product.price)}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {formatUSD(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-[9px] line-through text-slate-500 mt-0.5">
                {formatUSD(product.originalPrice)} · {formatBDT(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <div className="flex items-center text-[11px] text-[#D4AF37] font-bold mr-0.5">
              <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37] mr-0.5" />
              {product.rating}
            </div>
            <button
              type="button"
              onClick={onAddToCart}
              aria-label={`Add ${product.title} to cart`}
              className="p-2 rounded-xl bg-[#D4AF37] hover:bg-[#E5BF42] text-black transition-colors cursor-pointer shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-black" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
