import React, { useState } from 'react';
import { Menu, ShoppingBag, Sun, Moon, X, Sparkles, User, Heart, Package, ChevronRight } from 'lucide-react';

/**
 * Header Component - ATOR ALI (Black & Gold Theme)
 *
 * Requirements:
 * - Brand: "ATOR ALI"
 * - Sticky header at top
 * - Menu icon (left)
 * - Logo centered ("ATOR ALI")
 * - Cart icon with item count badge (right)
 * - Dark mode toggle matching black & gold theme
 */
export default function Header({
  cartCount = 3,
  isDarkMode = false,
  onToggleDarkMode,
  onResetSplash,
  onLogoClick,
  onCartClick
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const categories = [
    { name: 'Pure Attar Oils', badge: 'Popular' },
    { name: 'Oud & Agarwood', badge: 'New' },
    { name: 'Luxury Spray Perfumes', badge: 'Hot' },
    { name: 'Royal Gift Boxes', badge: 'Exclusive' },
    { name: 'Travel Spray Atomizers', badge: null },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#0B0B0B]/90 dark:bg-[#0B0B0B]/90 backdrop-blur-md border-b border-[#D4AF37]/20 transition-colors duration-200 shadow-lg shadow-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          {/* Left: Navigation Menu Toggle & Dark/Light Mode */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open Navigation Menu"
              aria-expanded={isMenuOpen}
              className="p-2.5 rounded-full text-[#E5D7B5] hover:text-[#D4AF37] hover:bg-[#1A1812] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              type="button"
              onClick={onToggleDarkMode}
              aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2.5 rounded-full text-[#E5D7B5] hover:text-[#D4AF37] hover:bg-[#1A1812] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-colors cursor-pointer"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-[#D4AF37]" />
              ) : (
                <Moon className="w-5 h-5 text-[#D4AF37]" />
              )}
            </button>
          </div>

          {/* Center: Brand Logo - ATOR ALI */}
          <button
            type="button"
            onClick={onLogoClick}
            aria-label="ATOR ALI Home"
            className="flex items-center gap-2 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D4AF37] rounded-lg p-1"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#D4AF37] via-[#F5E8C7] to-[#8C6B08] p-0.5 shadow-md shadow-[#D4AF37]/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0B0B0B] rounded-[6px] flex items-center justify-center font-serif font-extrabold text-xs text-[#D4AF37]">
                AA
              </div>
            </div>
            <span className="text-lg sm:text-xl font-serif font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F5E8C7] to-[#D4AF37] uppercase">
              ATOR ALI
            </span>
          </button>

          {/* Right: Cart Icon with Badge */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onCartClick}
              aria-label={`Shopping Cart, ${cartCount} items`}
              className="relative p-2.5 rounded-full text-[#E5D7B5] hover:text-[#D4AF37] hover:bg-[#1A1812] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[20px] h-5 px-1.5 flex items-center justify-center bg-[#D4AF37] text-black text-[11px] font-extrabold rounded-full border-2 border-[#0B0B0B] shadow-md animate-in zoom-in-50">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Menu Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-xs bg-[#0B0B0B] border-r border-[#D4AF37]/30 h-full shadow-2xl flex flex-col justify-between z-10 overflow-y-auto animate-in slide-in-from-left duration-200 text-[#E5D7B5]">
            <div>
              {/* Drawer Header */}
              <div className="p-4 border-b border-[#D4AF37]/20 flex items-center justify-between bg-[#14120C]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#D4AF37] text-black font-serif font-extrabold text-sm flex items-center justify-center">
                    AA
                  </div>
                  <div>
                    <span className="font-serif font-extrabold text-white uppercase tracking-wider block leading-tight">
                      ATOR ALI
                    </span>
                    <span className="text-[10px] text-[#D4AF37] font-semibold tracking-wide">
                      LUXURY PERFUMERY
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close menu"
                  className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-[#252014] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories Navigation */}
              <div className="p-4 border-b border-[#D4AF37]/15">
                <div className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider mb-2">
                  Fragrance Collections
                </div>
                <nav className="space-y-1">
                  {categories.map((cat, idx) => (
                    <a
                      key={idx}
                      href={`#${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-[#1A1812] hover:text-[#D4AF37] transition-colors"
                    >
                      <span>{cat.name}</span>
                      {cat.badge ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                          {cat.badge}
                        </span>
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      )}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Quick Actions */}
              <div className="p-4">
                <div className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider mb-2">
                  Account Services
                </div>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-[#1A1812] hover:text-[#D4AF37] transition-colors text-left cursor-pointer"
                  >
                    <User className="w-4 h-4 text-[#D4AF37]" />
                    <span>My Account & Orders</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-[#1A1812] hover:text-[#D4AF37] transition-colors text-left cursor-pointer"
                  >
                    <Heart className="w-4 h-4 text-rose-400" />
                    <span>Saved Wishlist (4)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-[#1A1812] hover:text-[#D4AF37] transition-colors text-left cursor-pointer"
                  >
                    <Package className="w-4 h-4 text-emerald-400" />
                    <span>Track Order Delivery</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#D4AF37]/20 bg-[#14120C]">
              {onResetSplash && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onResetSplash();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-[#D4AF37]/40 text-xs font-semibold text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Replay Splash Opening</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
