import React from 'react';
import { Home, Grid, ShoppingBag, Phone, User } from 'lucide-react';

/**
 * BottomNav Component - ATOR ALI (Clean Light Theme)
 *
 * Requirements:
 * - Fixed, white, top border
 * - 5 items: Home, Category, Cart (black circular count badge), Call (opens tel:+8809638316596), Login
 * - Active item is black with a small gold dot (#D4AF37)
 * - Safe-area bottom padding
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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 pb-safe shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around h-14 px-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isExternal) {
            return (
              <a
                key={item.id}
                href={item.href}
                className="flex flex-col items-center justify-center flex-1 h-full py-1 text-gray-500 hover:text-black transition-colors"
                aria-label={item.label}
              >
                <Icon className="w-5 h-5 stroke-[1.75]" />
                <span className="text-[10px] font-medium mt-1">{item.label}</span>
              </a>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={item.action}
              aria-label={item.id === 'cart' ? `Shopping Cart, ${cartCount} items` : item.label}
              className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 cursor-pointer transition-colors ${
                isActive ? 'text-black font-bold' : 'text-gray-500 hover:text-black font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.25]' : 'stroke-[1.75]'}`} />
                {item.id === 'cart' && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-black text-white text-[10px] font-bold rounded-full border border-white">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </div>

              <span className="text-[10px] leading-none mt-1">{item.label}</span>

              {/* Gold dot accent under active item */}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
