import React, { useState } from 'react';
import { ShoppingBag, Eye, Heart } from 'lucide-react';
import { formatBDT } from '../utils/currency';

/**
 * ProductCard Component - Extrovat Lifestyle
 * Requirements:
 * - 20px card radius, 2px ink border, 4px offset shadow
 * - Square image (14px inner radius)
 * - Sun-yellow sticker badge top-left rotated -3 degrees with ink border
 * - Wishlist heart top-right in white circle with 2px ink border
 * - Centered sentence case title (max 2 lines)
 * - Price row (bold BDT price in ink, old price muted crossed out)
 * - Buy Now button: primary ultramarine with white text, full width, rounded pill
 */
export default function ProductCard({ product, onBuyNow, onAddToCart, onQuickView }) {
  const [isLiked, setIsLiked] = useState(false);

  if (!product) return null;

  return (
    <div className="bg-[#FFFFFF] border-2 border-[#0E1330] rounded-[20px] p-3 flex flex-col justify-between shadow-[4px_4px_0px_#0E1330] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-150 group relative">
      {/* Product Image Box */}
      <div className="relative w-full aspect-square rounded-[14px] overflow-hidden bg-[#F7F8FC] mb-3 border-2 border-[#0E1330]">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Top-Left Sun-Yellow Sticker Badge Rotated -3deg */}
        {product.badge && (
          <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-[8px] bg-[#FFC933] text-[#0E1330] border border-[#0E1330] text-[10px] font-heading font-extrabold -rotate-3 shadow-[1px_1px_0px_#0E1330]">
            {product.badge}
          </div>
        )}

        {/* Low Stock Urgency Badge */}
        {product.stockCount && product.stockCount <= 3 && (
          <div className="absolute bottom-2 left-2 z-10 px-2 py-0.5 rounded-[8px] bg-[#0F9D6B] text-[#FFFFFF] border border-[#0E1330] text-[10px] font-heading font-extrabold shadow-[1px_1px_0px_#0E1330]">
            Only {product.stockCount} left
          </div>
        )}

        {/* Top-Right Action Controls: Heart & Quick View */}
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked((prev) => !prev);
            }}
            aria-label={`Add ${product.title} to wishlist`}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FFFFFF] border-2 border-[#0E1330] flex items-center justify-center transition-transform active:scale-90 cursor-pointer shadow-[1px_1px_0px_#0E1330] ${
              isLiked ? 'text-rose-600 fill-rose-600' : 'text-[#0E1330]'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isLiked ? 'fill-rose-600' : ''}`} />
          </button>

          {onQuickView && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              aria-label={`Quick view ${product.title}`}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FFFFFF] border-2 border-[#0E1330] text-[#0E1330] hover:bg-[#FFC933] flex items-center justify-center transition-transform active:scale-90 cursor-pointer shadow-[1px_1px_0px_#0E1330]"
            >
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col items-center text-center flex-1 justify-between gap-2">
        <h3 className="text-xs sm:text-sm font-heading font-bold text-[#0E1330] line-clamp-2 leading-tight">
          {product.title}
        </h3>

        {/* Price Row */}
        <div className="flex items-center justify-center gap-2 flex-wrap font-sans">
          <span className="text-sm sm:text-base font-extrabold text-[#0E1330]">
            {formatBDT(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-xs font-medium text-[#5B6079] line-through">
              {formatBDT(product.oldPrice)}
            </span>
          )}
        </div>

        {/* Buy Now Full-Width Pill Button */}
        <button
          type="button"
          onClick={() => onBuyNow && onBuyNow(product)}
          aria-label={`Buy ${product.title} now for ${formatBDT(product.price)}`}
          className="w-full mt-1 py-2.5 px-3 rounded-full bg-[#2436F5] text-[#FFFFFF] border-2 border-[#0E1330] shadow-[2px_2px_0px_#0E1330] font-heading font-extrabold text-xs tracking-wider transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4 text-[#FFFFFF]" />
          <span>Buy now</span>
        </button>
      </div>
    </div>
  );
}
