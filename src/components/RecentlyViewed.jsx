import React from 'react';
import { History, Eye, ShoppingBag, Trash2 } from 'lucide-react';
import { formatBDT } from '../utils/currency';

/**
 * RecentlyViewed Component - Displays horizontal scroll list of last 8 viewed items
 *
 * Supports props: products/items, onQuickView, onAddToCart, onClear
 */
export default function RecentlyViewed({
  products = [],
  items = [],
  onQuickView,
  onAddToCart,
  onClear,
  onSelectProduct
}) {
  const displayItems = products.length > 0 ? products : items;

  if (!displayItems || displayItems.length === 0) return null;

  return (
    <section aria-label="Recently viewed products" className="space-y-3 pt-2">
      <div className="flex items-center justify-between pb-1 border-b-2 border-[#0E1330]">
        <div className="relative">
          <h2 className="text-base sm:text-lg font-heading font-extrabold text-[#0E1330] tracking-tight flex items-center gap-1.5">
            <History className="w-4 h-4 text-[#2436F5]" /> Recently viewed
          </h2>
        </div>

        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 text-xs font-heading font-bold text-rose-600 hover:underline cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 scrollbar-none">
        {displayItems.map((prod) => (
          <div
            key={prod.id}
            onClick={() => {
              if (onQuickView) onQuickView(prod);
              else if (onSelectProduct) onSelectProduct(prod);
            }}
            className="shrink-0 w-36 bg-[#FFFFFF] border-2 border-[#0E1330] rounded-[16px] p-2.5 shadow-[2px_2px_0px_#0E1330] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer group"
          >
            <div className="relative w-full aspect-square rounded-[12px] overflow-hidden bg-[#F7F8FC] mb-2 border border-[#0E1330]">
              <img
                src={prod.image}
                alt={prod.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-[#0E1330]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Eye className="w-5 h-5 text-[#FFFFFF]" />
              </div>
            </div>

            <h4 className="text-[11px] font-heading font-bold text-[#0E1330] truncate">
              {prod.title}
            </h4>
            <div className="text-xs font-sans font-extrabold text-[#0E1330] mt-0.5">
              {formatBDT(prod.price)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
