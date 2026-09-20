import React, { useState } from 'react';
import { Menu, Search, X, Package, Phone } from 'lucide-react';
import AnnouncementBar from './AnnouncementBar';

/**
 * Header Component - Extrovat Lifestyle
 */
export default function Header({
  cartCount = 0,
  onLogoClick,
  onCartClick,
  onToggleSearch,
  isSearchOpen,
  onOpenTrackOrder
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const categories = [
    'Attar',
    'Perfume',
    'Body Spray',
    'Oud & Agarwood',
    'Gift Sets',
    'Lifestyle',
    'Combo Offers',
    'Under ৳999',
    'Track Order',
    'Contact'
  ];

  return (
    <>
      {/* Announcement Bar */}
      <AnnouncementBar />

      <header className="sticky top-0 z-40 w-full bg-[#F7F8FC] border-b-2 border-[#0E1330] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Left: Hamburger Menu */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
            className="p-2 -ml-2 text-[#0E1330] hover:bg-[#FFFFFF] rounded-xl border-2 border-transparent hover:border-[#0E1330] transition-all active:scale-95 cursor-pointer"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Center: Brand Logo Wordmark */}
          <button
            type="button"
            onClick={onLogoClick}
            aria-label="Extrovat Lifestyle Home"
            className="flex flex-col items-center cursor-pointer focus:outline-none"
          >
            <div className="flex items-baseline gap-0.5">
              <span className="font-heading font-extrabold text-xl sm:text-2xl text-[#0E1330] tracking-tight">
                Extrovat
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFC933] border border-[#0E1330] inline-block" />
            </div>
            <span className="text-[10px] font-sans font-medium text-[#5B6079] -mt-1 tracking-wider">
              Lifestyle
            </span>
          </button>

          {/* Right: Search Icon Toggle */}
          <button
            type="button"
            onClick={onToggleSearch}
            aria-label="Search"
            aria-expanded={isSearchOpen}
            className={`p-2 -mr-2 rounded-xl border-2 transition-all cursor-pointer ${
              isSearchOpen
                ? 'bg-[#FFFFFF] text-[#0E1330] border-[#0E1330] shadow-[2px_2px_0px_#0E1330]'
                : 'border-transparent text-[#0E1330] hover:bg-[#FFFFFF] hover:border-[#0E1330]'
            }`}
          >
            <Search className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Side Menu Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#0E1330]/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-xs bg-[#F7F8FC] border-r-2 border-[#0E1330] h-full shadow-2xl flex flex-col justify-between z-10 overflow-y-auto text-[#0E1330]">
            <div>
              {/* Drawer Header */}
              <div className="p-4 border-b-2 border-[#0E1330] flex items-center justify-between bg-[#FFFFFF]">
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-0.5">
                    <span className="font-heading font-extrabold text-lg text-[#0E1330]">
                      Extrovat
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#FFC933] border border-[#0E1330] inline-block" />
                  </div>
                  <span className="text-[10px] font-sans text-[#5B6079]">
                    Lifestyle products & fragrances
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close menu"
                  className="p-1.5 rounded-xl border-2 border-[#0E1330] bg-[#FFFFFF] text-[#0E1330] hover:bg-[#F7F8FC] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Category List */}
              <nav className="p-4 space-y-1">
                {categories.map((cat, idx) => {
                  const targetId = cat.toLowerCase().replace(/\s+/g, '-').replace('&', 'and');
                  return (
                    <div key={idx}>
                      {cat === 'Track Order' ? (
                        <button
                          type="button"
                          onClick={() => {
                            setIsMenuOpen(false);
                            if (onOpenTrackOrder) onOpenTrackOrder();
                          }}
                          className="w-full flex items-center justify-between px-3 py-3 rounded-xl font-heading text-xl font-bold text-[#0E1330] hover:bg-[#FFFFFF] hover:border-2 hover:border-[#0E1330] transition-all text-left cursor-pointer"
                        >
                          <span>{cat}</span>
                          <Package className="w-4 h-4 text-[#2436F5]" />
                        </button>
                      ) : cat === 'Contact' ? (
                        <a
                          href="tel:+8809638316596"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center justify-between px-3 py-3 rounded-xl font-heading text-xl font-bold text-[#0E1330] hover:bg-[#FFFFFF] hover:border-2 hover:border-[#0E1330] transition-all"
                        >
                          <span>{cat}</span>
                          <Phone className="w-4 h-4 text-[#2436F5]" />
                        </a>
                      ) : (
                        <a
                          href={`#${targetId}`}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center justify-between px-3 py-3 rounded-xl font-heading text-xl font-bold text-[#0E1330] hover:bg-[#FFFFFF] hover:border-2 hover:border-[#0E1330] transition-all"
                        >
                          <span>{cat}</span>
                        </a>
                      )}
                      <div className="border-b border-[#0E1330]/10 my-0.5" />
                    </div>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Opacity Watermark */}
            <div className="p-6 relative overflow-hidden pointer-events-none select-none">
              <span className="font-heading font-extrabold text-5xl text-[#0E1330]/6 block tracking-tighter uppercase leading-none">
                Extrovat
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
