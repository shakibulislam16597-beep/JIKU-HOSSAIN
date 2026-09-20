import React, { useState } from 'react';
import Header from './Header';
import SearchBar from './SearchBar';
import { MOCK_PRODUCTS } from '../data/products';
import {
  Star,
  ShoppingBag,
  ArrowLeft,
  Filter,
  SlidersHorizontal,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  ChevronRight,
  Eye
} from 'lucide-react';

/**
 * Home Component
 *
 * Coordinates:
 * - Header (sticky top)
 * - SearchBar (with suggestions, recent searches, debouncing, camera search)
 * - Search Results Page Placeholder view when search query or product is submitted/selected
 * - Featured Catalog showcase & promotional banners
 * - Mobile-first design, dark mode support, clean soft shadows
 */
export default function Home({ isDarkMode, onToggleDarkMode, onResetSplash }) {
  const [activeSearchTerm, setActiveSearchTerm] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartCount, setCartCount] = useState(3);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

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
    e.stopPropagation();
    setCartCount((prev) => prev + 1);
  };

  // Filter products for the search result view if search term exists
  const searchResults = activeSearchTerm
    ? MOCK_PRODUCTS.filter(
        (p) =>
          p.title.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(activeSearchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-200 pb-16">
      {/* Sticky Header */}
      <Header
        cartCount={cartCount}
        isDarkMode={isDarkMode}
        onToggleDarkMode={onToggleDarkMode}
        onResetSplash={onResetSplash}
        onLogoClick={handleClearSearchResults}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        {/* Search Bar Section */}
        <section aria-label="Product Search" className="mb-4">
          <SearchBar
            onSearchSubmit={handleSearchSubmit}
            onSelectProduct={handleSelectProduct}
          />
        </section>

        {/* SEARCH RESULTS VIEW PLACEHOLDER */}
        {activeSearchTerm ? (
          <div className="animate-in fade-in duration-200 py-2">
            {/* Breadcrumb & Clear Action Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div>
                <button
                  type="button"
                  onClick={handleClearSearchResults}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mb-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Store Front
                </button>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Search Results for <span className="text-indigo-600 dark:text-indigo-400">"{activeSearchTerm}"</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Found {searchResults.length} {searchResults.length === 1 ? 'item' : 'items'} matching your query
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <Filter className="w-3.5 h-3.5" /> Filter
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" /> Sort
                </button>
              </div>
            </div>

            {/* If Single Selected Product Details Card */}
            {selectedProduct && (
              <div className="mb-8 bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden border border-indigo-500/20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-full md:w-1/3 aspect-square max-w-xs rounded-2xl overflow-hidden bg-slate-800 shadow-md">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="inline-block px-3 py-1 bg-indigo-500/30 text-indigo-200 rounded-full text-xs font-semibold uppercase tracking-wider">
                      Selected Highlight
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold font-serif">
                      {selectedProduct.title}
                    </h3>
                    <p className="text-sm text-indigo-100/80 leading-relaxed">
                      {selectedProduct.description}
                    </p>
                    <div className="flex items-center gap-4 pt-2">
                      <span className="text-2xl font-bold text-amber-400">
                        ${selectedProduct.price.toFixed(2)}
                      </span>
                      {selectedProduct.originalPrice && (
                        <span className="text-sm line-through text-slate-400">
                          ${selectedProduct.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="pt-3 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, selectedProduct)}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4" /> Add to Cart
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuickViewProduct(selectedProduct)}
                        className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-semibold transition-colors backdrop-blur-md"
                      >
                        Full Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Results Grid */}
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
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  No matching products found
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  We couldn't find any products matching "{activeSearchTerm}". Try searching for popular terms like "Oud", "Musk", or "Attar".
                </p>
                <button
                  type="button"
                  onClick={handleClearSearchResults}
                  className="mt-6 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer"
                >
                  Explore All Products
                </button>
              </div>
            )}
          </div>
        ) : (
          /* HOME STORE FRONT CONTENT */
          <div className="space-y-8">
            {/* Promotional Banner */}
            <section aria-label="Promotional Banner" className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-900 text-white p-6 sm:p-10 shadow-xl overflow-hidden border border-white/10">
              <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent pointer-events-none"></div>

              <div className="relative z-10 max-w-lg">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-amber-400/30">
                  <Sparkles className="w-3.5 h-3.5" /> Grand Festival Offer
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold font-serif tracking-tight leading-tight">
                  Authentic Arabian Perfume Oils & Ators
                </h1>
                <p className="mt-2 text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
                  Hand-extracted organic scents with long-lasting aromatic richness. Enjoy 20% off on premium collections today.
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <a
                    href="#catalog"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-amber-500/20"
                  >
                    Shop Collection <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </section>

            {/* Category Badges horizontal scroll */}
            <section aria-label="Product Categories" className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {['All Scents', 'Pure Oud', 'Royal Musk', 'Attars', 'Incense', 'Gift Sets', 'New Arrivals'].map((cat, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`shrink-0 px-4 py-2 rounded-2xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    idx === 0
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </section>

            {/* Trust Badges */}
            <section aria-label="Store Guarantees" className="grid grid-cols-3 gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs text-center text-xs">
              <div className="flex flex-col items-center gap-1.5 p-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span className="font-semibold text-slate-900 dark:text-slate-100">100% Pure & Alcohol-Free</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-2 border-x border-slate-100 dark:border-slate-800">
                <Truck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span className="font-semibold text-slate-900 dark:text-slate-100">Free Express Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-2">
                <RotateCcw className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span className="font-semibold text-slate-900 dark:text-slate-100">30-Day Easy Returns</span>
              </div>
            </section>

            {/* Featured Product Catalog */}
            <section id="catalog" aria-label="Featured Products" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold font-serif text-slate-900 dark:text-white">
                    Featured Luxury Ators
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Handpicked customer favorites & best-selling perfumes
                  </p>
                </div>
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  {MOCK_PRODUCTS.length} Items Available
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {MOCK_PRODUCTS.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={(e) => handleAddToCart(e, product)}
                    onQuickView={() => setQuickViewProduct(product)}
                  />
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden">
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-slate-800"
            >
              ✕
            </button>

            <div className="flex flex-col sm:flex-row gap-5 items-center">
              <div className="w-full sm:w-1/2 aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 space-y-2">
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  {quickViewProduct.category}
                </span>
                <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
                  {quickViewProduct.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {quickViewProduct.description}
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    ${quickViewProduct.price.toFixed(2)}
                  </span>
                  {quickViewProduct.originalPrice && (
                    <span className="text-xs line-through text-slate-400">
                      ${quickViewProduct.originalPrice.toFixed(2)}
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
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
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

/** Product Card Subcomponent */
function ProductCard({ product, onAddToCart, onQuickView }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Product Image Container */}
      <div className="relative aspect-square w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-amber-400 text-[10px] font-bold tracking-wider uppercase border border-amber-400/30">
            {product.badge}
          </span>
        )}

        {/* Action icons overlay */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
            aria-label={`Wishlist ${product.title}`}
            className="p-2 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 shadow-xs hover:scale-110 transition-transform cursor-pointer"
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
            className="p-2 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 shadow-xs hover:scale-110 transition-transform cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-0.5">
            {product.category}
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {product.title}
          </h3>
        </div>

        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              ${product.price.toFixed(2)}
            </div>
            {product.originalPrice && (
              <div className="text-[10px] line-through text-slate-400">
                ${product.originalPrice.toFixed(2)}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <div className="flex items-center text-[11px] text-amber-500 font-bold mr-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
              {product.rating}
            </div>
            <button
              type="button"
              onClick={onAddToCart}
              aria-label={`Add ${product.title} to cart`}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
