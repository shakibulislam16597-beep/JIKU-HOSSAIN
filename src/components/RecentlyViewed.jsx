import React from 'react';
import { History, Eye } from 'lucide-react';
import { formatBDT } from '../utils/currency';

/**
 * RecentlyViewed Component - Displays horizontal scroll list of last 8 viewed items
 */
export default function RecentlyViewed({ items = [], onSelectProduct }) {
  if (!items || items.length === 0) return null;

  return (
    <section aria-label="Recently Viewed Products" className="space-y-3 pt-2">
      <div className="flex items-center justify-between pb-1 border-b border-gray-100">
        <div className="relative">
          <h2 className="text-base sm:text-lg font-extrabold text-black uppercase tracking-wider font-sans flex items-center gap-1.5">
            <History className="w-4 h-4 text-black" /> RECENTLY VIEWED
          </h2>
          <span className="absolute -bottom-[5px] left-0 w-12 h-[3px] bg-[#D4AF37] rounded-full" />
        </div>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        {items.map((prod) => (
          <div
            key={prod.id}
            onClick={() => onSelectProduct && onSelectProduct(prod)}
            className="shrink-0 w-36 bg-white border border-gray-200 rounded-2xl p-2.5 shadow-xs hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-50 mb-2 border border-gray-100">
              <img
                src={prod.image}
                alt={prod.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Eye className="w-5 h-5 text-white drop-shadow-md" />
              </div>
            </div>

            <h4 className="text-[11px] font-bold text-gray-900 truncate">
              {prod.title}
            </h4>
            <div className="text-xs font-extrabold text-black mt-0.5">
              {formatBDT(prod.price)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
