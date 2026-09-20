import React from 'react';
import { Home, Grid, ShoppingBag, Phone, User } from 'lucide-react';

/**
 * BottomNav Component - Extrovat Lifestyle
 *
 * Requirements:
 * - Fixed white bottom bar with 2px ink top border
 * - Active item shows an ultramarine rounded pill behind its icon with a white icon
 * - Sentence case labels
 * - Safe-area padding
 */
export default function BottomNav({
  activeTab = 'home',
  onTabSelect,
  cartCount = 0,
  onOpenCart,
  onOpenCategory,
  onOpenLogin
}) {
  const items = [
    { id: 'home', label: 'Home', icon: Home, action: () => onTabSelect && onTabSelect('home') },
    { id: 'category', label: 'Category', icon: Grid, action: () => onOpenCategory && onOpenCategory() },
    {
      id: 'cart',
      label: 'Cart',
      icon: ShoppingBag,
      badge: cartCount,
      action: () => onOpenCart && onOpenCart()
    },
    {
      id: 'call',
      label: 'Call',
      icon: Phone,
      isExternal: true,
      href: 'tel:+8809638316596'
    },
    { id: 'login', label: 'Login', icon: User, action: () => onOpenLogin && onOpenLogin() },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF] border-t-2 border-[#0E1330] pb-safe shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around h-15 px-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isExternal) {
            return (
              <a
                key={item.id}
                href={item.href}
                aria-label={item.label}
                className="flex flex-col items-center justify-center flex-1 h-full py-1 text-[#0E1330] hover:text-[#2436F5] transition-colors"
              >
                <div className="p-1 rounded-full">
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-[10px] font-sans font-medium mt-0.5">{item.label}</span>
              </a>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={item.action}
              aria-label={item.id === 'cart' ? `Shopping cart, ${cartCount} items` : item.label}
              className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 cursor-pointer transition-colors ${
                isActive ? 'text-[#2436F5] font-bold' : 'text-[#0E1330] font-medium'
              }`}
            >
              <div className="relative">
                <div
                  className={`px-3 py-1 rounded-full transition-all ${
                    isActive ? 'bg-[#2436F5] text-[#FFFFFF]' : 'bg-transparent text-[#0E1330]'
                  }`}
                >
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-[#FFFFFF]' : 'text-[#0E1330]'}`} />
                </div>

                {item.id === 'cart' && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-[#FFC933] text-[#0E1330] border border-[#0E1330] text-[10px] font-heading font-extrabold rounded-full">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </div>

              <span className="text-[10px] font-sans leading-none mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
