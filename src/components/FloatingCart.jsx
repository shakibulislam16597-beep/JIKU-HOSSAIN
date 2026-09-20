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
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Floating Cart with ${itemCount} items totaling ${formatBDT(totalAmount)}`}
      className="fixed right-0 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center rounded-l-2xl border-2 border-r-0 border-[#0E1330] shadow-[-3px_3px_0px_#0E1330] overflow-hidden cursor-pointer transition-transform active:translate-x-[2px] focus:outline-none"
    >
      {/* Top Ink Segment with Sun-Yellow Icon */}
      <div className="bg-[#0E1330] text-[#FFFFFF] px-3.5 py-2.5 flex flex-col items-center w-full min-w-[68px]">
        <ShoppingBag className="w-5 h-5 text-[#FFC933] mb-0.5" />
        <span className="text-[10px] font-heading font-extrabold whitespace-nowrap text-[#FFC933]">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Bottom White Segment */}
      <div className="bg-[#FFFFFF] text-[#0E1330] px-3 py-1.5 flex items-center justify-center w-full border-t-2 border-[#0E1330]">
        <span className="text-xs font-sans font-extrabold text-[#0E1330] whitespace-nowrap">
          {formatBDT(totalAmount)}
        </span>
      </div>
    </button>
  );
}
