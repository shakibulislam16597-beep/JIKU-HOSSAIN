import React, { useState } from 'react';
import { Menu, Search, X, User, Heart, Package, Phone, ChevronRight } from 'lucide-react';

/**
 * Header Component - ATOR ALI (Clean Light Theme)
 *
 * Requirements:
 * - White, simple, no heavy border.
 * - Hamburger icon on the left
 * - ATOR ALI logo centered
 * - Search icon on the right (toggles full-width search bar)
 */
export default function Header({
  cartCount = 0,
  onLogoClick,
  onCartClick,
  onToggleSearch,
  isSearchOpen
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const categories = [
    { name: 'NEW ARRIVALS', badge: 'Hot' },
    { name: 'PREMIUM PERFUME OIL', badge: 'Popular' },
    { name: 'ATTAR COLLECTION', badge: 'Top' },
    { name: 'COMBO OFFERS', badge: 'Saver' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 transition-colors duration-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Left: Hamburger Menu */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open Navigation Menu"
            className="p-2 -ml-2 text-gray-800 hover:text-black hover:bg-gray-100 rounded-full transition-colors cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-black"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Center: Brand Logo - ATOR ALI */}
          <button
            type="button"
            onClick={onLogoClick}
            aria-label="ATOR ALI Home"
            className="flex items-center gap-1.5 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-black rounded-lg py-1 px-2"
          >
            <div className="w-7 h-7 rounded-md bg-black text-white flex items-center justify-center font-bold text-xs tracking-tighter">
              AA
            </div>
            <span className="text-lg font-extrabold tracking-wider text-black uppercase font-sans">
              ATOR ALI
            </span>
          </button>

          {/* Right: Search Icon Toggle */}
          <button
            type="button"
            onClick={onToggleSearch}
            aria-label="Toggle Search Bar"
            aria-expanded={isSearchOpen}
            className={`p-2 -mr-2 rounded-full transition-colors cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-black ${
              isSearchOpen ? 'text-black bg-gray-100' : 'text-gray-800 hover:text-black hover:bg-gray-100'
            }`}
          >
            <Search className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Slide-out Menu Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between z-10 overflow-y-auto animate-in slide-in-from-left duration-200 text-gray-900">
            <div>
              {/* Drawer Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-black text-white font-extrabold text-sm flex items-center justify-center">
                    AA
                  </div>
                  <div>
                    <span className="font-extrabold text-black uppercase tracking-wider block leading-tight text-sm">
                      ATOR ALI
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium">
                      PREMIUM BANGLADESHI PERFUMERY
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close menu"
                  className="p-1.5 rounded-full text-gray-500 hover:text-black hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories Navigation */}
              <div className="p-4 border-b border-gray-100">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Categories
                </div>
                <nav className="space-y-1">
                  {categories.map((cat, idx) => (
                    <a
                      key={idx}
                      href={`#${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-800 hover:bg-gray-100 transition-colors"
                    >
                      <span>{cat.name}</span>
                      {cat.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black text-white">
                          {cat.badge}
                        </span>
                      )}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Quick Actions */}
              <div className="p-4">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Services
                </div>
                <div className="space-y-1">
                  <a
                    href="tel:+8809638316596"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-800 hover:bg-gray-100 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-black" />
                    <span>Call Hotline (09638316596)</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-800 hover:bg-gray-100 transition-colors text-left cursor-pointer"
                  >
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>My Wishlist</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-800 hover:bg-gray-100 transition-colors text-left cursor-pointer"
                  >
                    <Package className="w-4 h-4 text-gray-800" />
                    <span>Track Order</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
              <p className="text-xs text-gray-500 font-medium">
                © {new Date().getFullYear()} ATOR ALI. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
