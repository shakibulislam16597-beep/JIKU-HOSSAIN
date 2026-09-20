import React, { useState } from 'react';
import { formatBDT } from '../utils/currency';
import { X, ShoppingBag, Share2, Check, Star, ShieldCheck } from 'lucide-react';

/**
 * QuickViewModal Component - Extrovat Lifestyle
 */
export default function QuickViewModal({ product, onClose, onAddToCart, onBuyNow }) {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : '12ml'
  );
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: `Check out ${product.title} at Extrovat Lifestyle!`,
          url: window.location.href,
        });
      } catch (err) {
        console.warn('Share cancelled or failed:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0E1330]/50 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-[#FFFFFF] rounded-[24px] max-w-lg w-full p-5 sm:p-6 border-2 border-[#0E1330] shadow-[4px_4px_0px_#0E1330] relative text-[#0E1330] my-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-1.5 rounded-xl border-2 border-[#0E1330] bg-[#FFFFFF] text-[#0E1330] hover:bg-[#F7F8FC] transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          {/* Image */}
          <div className="relative aspect-square rounded-[16px] overflow-hidden bg-[#F7F8FC] border-2 border-[#0E1330]">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-[8px] bg-[#FFC933] text-[#0E1330] border border-[#0E1330] text-[10px] font-heading font-extrabold -rotate-3">
                {product.badge}
              </span>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-heading font-bold text-[#2436F5] uppercase tracking-wider block mb-0.5">
                {product.category}
              </span>
              <h2 className="text-base sm:text-lg font-heading font-extrabold text-[#0E1330] leading-snug">
                {product.title}
              </h2>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 text-xs font-sans">
              <div className="flex items-center text-[#FFC933]">
                <Star className="w-3.5 h-3.5 fill-[#FFC933] text-[#0E1330]" />
              </div>
              <span className="font-extrabold text-[#0E1330]">{product.rating || 4.9}</span>
              <span className="text-[#5B6079]">({product.reviewsCount || 120} reviews)</span>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-2 font-sans">
              <span className="text-xl font-extrabold text-[#0E1330]">
                {formatBDT(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-xs font-medium text-[#5B6079] line-through">
                  {formatBDT(product.oldPrice)}
                </span>
              )}
            </div>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-1">
                <label className="text-[11px] font-heading font-bold text-[#0E1330] block">
                  Bottle size:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`px-2.5 py-1 rounded-xl border-2 text-xs font-heading font-extrabold transition-all cursor-pointer ${
                        selectedSize === sz
                          ? 'bg-[#0E1330] text-[#FFFFFF] border-[#0E1330]'
                          : 'bg-[#FFFFFF] text-[#0E1330] border-[#0E1330] hover:bg-[#FFC933]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <p className="text-xs font-sans text-[#5B6079] line-clamp-2">
              {product.description || 'Premium long-lasting concentrated fragrance oil crafted with fine ingredients.'}
            </p>

            {/* Actions */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => {
                  if (onBuyNow) onBuyNow(product, selectedSize);
                  onClose();
                }}
                className="w-full py-2.5 px-4 bg-[#2436F5] text-[#FFFFFF] border-2 border-[#0E1330] shadow-[2px_2px_0px_#0E1330] font-heading font-extrabold text-xs uppercase rounded-full transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ShoppingBag className="w-4 h-4 text-[#FFFFFF]" />
                <span>Buy now</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="w-full py-2 px-4 bg-[#FFFFFF] text-[#0E1330] border-2 border-[#0E1330] font-heading font-bold text-xs rounded-full transition-all hover:bg-[#F7F8FC] cursor-pointer flex items-center justify-center gap-1.5"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#0F9D6B]" />
                    <span>Link copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share product</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
