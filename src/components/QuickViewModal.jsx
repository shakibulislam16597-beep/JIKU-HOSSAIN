import React, { useState } from 'react';
import { X, ShoppingBag, Share2, Plus, Minus, Check, Star } from 'lucide-react';
import { formatBDT } from '../utils/currency';

/**
 * QuickViewModal Component - Modal for product quick view
 */
export default function QuickViewModal({ product, isOpen, onClose, onAddToCart }) {
  if (!isOpen || !product) return null;

  const [selectedSize, setSelectedSize] = useState(
    product.sizes ? product.sizes[0] : '6ml'
  );
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  const sizes = product.sizes || ['6ml', '12ml', '50ml'];

  const handleShare = async () => {
    const shareData = {
      title: product.title,
      text: `Check out ${product.title} at ATOR ALI: ${formatBDT(product.price)}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: Copy link
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      } catch (err) {
        console.error('Clipboard copy failed:', err);
      }
    }
  };

  const handleAdd = () => {
    onAddToCart({
      ...product,
      size: selectedSize,
      quantity
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 border border-gray-200 shadow-2xl relative text-gray-900 animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4">
          {/* Product Image */}
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#0F172A] text-white text-[10px] font-bold">
                {product.badge}
              </span>
            )}
            {product.stockCount && product.stockCount <= 3 && (
              <span className="absolute top-3 right-12 px-2.5 py-1 rounded-md bg-rose-600 text-white text-[10px] font-bold">
                Only {product.stockCount} left
              </span>
            )}
          </div>

          {/* Product Details */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {product.category}
              </span>
              <div className="flex items-center text-xs font-bold text-black">
                <Star className="w-3.5 h-3.5 fill-black text-black mr-1" />
                <span>{product.rating || '4.9'}</span>
              </div>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-black mt-0.5">
              {product.title}
            </h3>

            {/* Price */}
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-extrabold text-black">
                {formatBDT(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-xs text-gray-400 line-through">
                  {formatBDT(product.oldPrice)}
                </span>
              )}
            </div>

            <p className="text-xs text-gray-600 mt-2 line-clamp-2">
              {product.description}
            </p>
          </div>

          {/* Bottle Size Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700">
              Select Size
            </label>
            <div className="flex items-center gap-2">
              {sizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`py-1.5 px-3 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                    selectedSize === sz
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Controls & Share */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="inline-flex items-center rounded-xl bg-gray-100 border border-gray-200 p-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="p-1 text-gray-600 hover:text-black"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-3 text-xs font-bold text-black">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
                className="p-1 text-gray-600 hover:text-black"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-gray-700" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAdd}
            className="w-full py-3.5 bg-black hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-white" />
            <span>Add to Cart ({formatBDT(product.price * quantity)})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
