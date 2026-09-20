import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { formatBDT } from '../utils/currency';

/**
 * FloatingCart Component - Extrovat Lifestyle
 * Requirements:
 * - Floating cart on the right edge
 * - Ink top with sun-yellow cart icon and "X items"
 * - White bottom with ৳ total price
 * - 2px ink border and hard offset shadow
 */
export default function FloatingCart({ itemCount = 0, totalAmount = 0, onClick }) {
  if (itemCount === 0) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Floating Cart with ${itemCount} items totaling ${formatBDT(totalAmount)}`}
      className="fixed bottom-20 right-4 z-40 flex items-center gap-2 px-3.5 py-2 bg-[#0E1330] text-[#FFFFFF] border-2 border-[#0E1330] rounded-full shadow-[3px_3px_0px_#FFC933] hover:bg-[#2436F5] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer focus:outline-none"
    >
      <div className="relative flex items-center justify-center">
        <ShoppingBag className="w-4 h-4 text-[#FFC933]" />
        <span className="absolute -top-1.5 -right-2 bg-[#FFC933] text-[#0E1330] border border-[#0E1330] text-[9px] font-heading font-extrabold rounded-full px-1 min-w-[15px] h-[15px] flex items-center justify-center leading-none">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      </div>
      <span className="text-xs font-sans font-extrabold text-[#FFFFFF] pl-1">
        {formatBDT(totalAmount)}
      </span>
    </button>
  );
}
