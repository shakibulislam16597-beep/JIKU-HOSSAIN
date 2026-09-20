import React, { useState } from 'react';
import { Menu, ShoppingBag, Sun, Moon, X, Sparkles, User, Heart, Package, ChevronRight } from 'lucide-react';

/**
 * Header Component
 *
 * Requirements:
 * - Sticky header at the top
 * - Menu icon on the left (opens drawer/sidebar)
 * - Logo centered ("ATOR ALI")
 * - Cart icon with item-count badge on the right
 * - Dark mode toggle button & accessibility options
 */
export default function Header({
  cartCount = 3,
  isDarkMode = false,
  onToggleDarkMode,
  onResetSplash,
  onLogoClick
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const categories = [
    { name: 'All Perfumes', badge: 'Hot' },
    { name: 'Pure Ator Oils', badge: 'Popular' },
    { name: 'Oud & Incense', badge: 'New' },
    { name: 'Gift Sets & Boxes', badge: 'Exclusive' },
    { name: 'Travel Spray Atomizers', badge: null },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          {/* Left: Menu Toggle & Dark Mode */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open Navigation Menu"
              aria-expanded={isMenuOpen}
              className="p-2.5 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              type="button"
              onClick={onToggleDarkMode}
              aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2.5 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600" />
              )}
            </button>
          </div>

          {/* Center: Brand Logo */}
          <button
            type="button"
            onClick={onLogoClick}
            aria-label="Ator Ali Home"
            className="flex items-center gap-2 group cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-indigo-500 rounded-lg p-1"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white font-serif font-bold text-sm shadow-xs group-hover:scale-105 transition-transform">
              AA
            </div>
            <span className="text-lg sm:text-xl font-serif font-bold tracking-wider text-slate-900 dark:text-white uppercase">
              ATOR ALI
            </span>
          </button>

          {/* Right: Cart Icon with item-count badge */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label={`Shopping Cart, ${cartCount} items`}
              className="relative p-2.5 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[20px] h-5 px-1.5 flex items-center justify-center bg-indigo-600 text-white text-[11px] font-bold rounded-full border-2 border-white dark:border-slate-900 shadow-xs animate-in zoom-in-50">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Navigation Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-xs bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col justify-between z-10 overflow-y-auto animate-in slide-in-from-left duration-200">
            <div>
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white font-serif font-bold text-sm">
                    AA
                  </div>
                  <div>
                    <span className="font-serif font-bold text-slate-900 dark:text-white uppercase tracking-wider block leading-tight">
                      ATOR ALI
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                      LUXURY STORE
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close menu"
                  className="p-2 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Links */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  Categories
                </div>
                <nav className="space-y-1">
                  {categories.map((cat, idx) => (
                    <a
                      key={idx}
                      href={`#${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      <span>{cat.name}</span>
                      {cat.badge ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                          {cat.badge}
                        </span>
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </a>
                  ))}
                </nav>
              </div>

              {/* User Account Quick Links */}
              <div className="p-4">
                <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  My Account
                </div>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    <User className="w-4 h-4 text-indigo-500" />
                    <span>Profile & Orders</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>Wishlist (4)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    <Package className="w-4 h-4 text-emerald-500" />
                    <span>Track Order</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
              {onResetSplash && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onResetSplash();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-indigo-200 dark:border-indigo-800 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Replay Splash Screen</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
