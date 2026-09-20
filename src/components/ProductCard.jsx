import React from 'react';
import { ShoppingBag, Eye } from 'lucide-react';
import { formatBDT } from '../utils/currency';

/**
 * ProductCard Component - ATOR ALI (Clean Light Theme)
 */
export default function ProductCard({ product, onBuyNow, onAddToCart, onQuickView }) {
  if (!product) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-3 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow duration-200 group relative">
      {/* Product Image Box */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-50 mb-3 border border-gray-100">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Top-Left Dark-Navy Discount Badge */}
        {product.badge && (
          <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md bg-[#0F172A] text-white text-[10px] font-bold tracking-tight shadow-xs">
            {product.badge}
          </div>
        )}

        {/* Low Stock Urgency Badge */}
        {product.stockCount && product.stockCount <= 3 && (
          <div className="absolute bottom-2 left-2 z-10 px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-extrabold shadow-xs">
            Only {product.stockCount} left
          </div>
        )}

        {/* Quick View Eye Icon Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onQuickView) onQuickView(product);
          }}
          aria-label={`Quick view ${product.title}`}
          className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/90 text-gray-700 hover:text-black hover:bg-white shadow-xs transition-transform hover:scale-110 cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Product Info */}
      <div className="flex flex-col items-center text-center flex-1 justify-between gap-2">
        <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2 leading-tight">
          {product.title}
        </h3>

        {/* Price Row */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="text-sm sm:text-base font-extrabold text-black">
            {formatBDT(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-xs font-medium text-gray-400 line-through">
              {formatBDT(product.oldPrice)}
            </span>
          )}
        </div>

        {/* Buy Now Action */}
        <button
          type="button"
          onClick={() => onBuyNow && onBuyNow(product)}
          aria-label={`Buy ${product.title} now for ${formatBDT(product.price)}`}
          className="w-full mt-1 py-2 px-3 rounded-xl bg-black hover:bg-gray-800 text-white font-bold text-xs tracking-wide uppercase transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-98"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Buy Now</span>
        </button>
      </div>
    </div>
  );
}
