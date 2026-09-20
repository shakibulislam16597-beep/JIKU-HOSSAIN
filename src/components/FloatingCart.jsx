import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { formatBDT } from '../utils/currency';

/**
 * FloatingCart Component - ATOR ALI (Clean Light Theme)
 *
 * Requirements:
 * - Floating cart widget on the right edge of the screen
 * - Black top part with cart icon and item count (e.g., "2 items")
 * - White bottom part with total price in BDT (e.g., "৳ 3,800")
 * - Tapping opens cart drawer
 */
export default function FloatingCart({ itemCount = 0, totalAmount = 0, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Floating Cart with ${itemCount} items totaling ${formatBDT(totalAmount)}`}
      className="fixed right-0 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center rounded-l-2xl shadow-xl overflow-hidden cursor-pointer border-l border-t border-b border-gray-200 transition-transform active:scale-95 focus:outline-hidden focus:ring-2 focus:ring-black"
    >
      {/* Top Black Segment */}
      <div className="bg-black text-white px-3 py-2 flex flex-col items-center w-full min-w-[64px]">
        <ShoppingBag className="w-5 h-5 text-white mb-0.5" />
        <span className="text-[10px] font-bold whitespace-nowrap">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Bottom White Segment */}
      <div className="bg-white text-gray-900 px-3 py-1.5 flex items-center justify-center w-full border-t border-gray-100">
        <span className="text-xs font-extrabold text-black whitespace-nowrap">
          {formatBDT(totalAmount)}
        </span>
      </div>
    </button>
  );
}
