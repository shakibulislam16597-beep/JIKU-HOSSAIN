import React, { useState } from 'react';
import { formatBDT } from '../utils/currency';
import { validateCoupon } from '../data/coupons';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Check, AlertCircle } from 'lucide-react';

/**
 * CartDrawer Component - ATOR ALI Store
 */
export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenCheckout
}) {
  if (!isOpen) return null;

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  const itemsSubtotalBDT = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const discountAmountBDT = appliedCoupon
    ? Math.round((itemsSubtotalBDT * appliedCoupon.discountPercent) / 100)
    : 0;

  const finalTotalBDT = itemsSubtotalBDT - discountAmountBDT;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');

    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    const matched = validateCoupon(couponCode);
    if (matched) {
      setAppliedCoupon(matched);
      setCouponError('');
    } else {
      setAppliedCoupon(null);
      setCouponError('Invalid coupon code. Try EID20 or WELCOME10');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white border-l border-gray-200 h-full shadow-2xl flex flex-col justify-between z-10 text-gray-900 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-black text-white">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg text-black">
                Shopping Cart
              </h2>
              <p className="text-[11px] text-gray-500 font-medium">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} selected
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="p-2 rounded-full text-gray-400 hover:text-black hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-200 shadow-xs relative"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                    {item.title}
                  </h3>

                  <div className="flex items-baseline gap-2">
                    <span className="text-xs sm:text-sm font-extrabold text-black">
                      {formatBDT(item.price)}
                    </span>
                    {item.oldPrice && (
                      <span className="text-[11px] text-gray-400 line-through">
                        {formatBDT(item.oldPrice)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <div className="inline-flex items-center rounded-lg bg-gray-100 border border-gray-200 p-0.5">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        aria-label={`Decrease quantity of ${item.title}`}
                        className="p-1 text-gray-600 hover:text-black transition-colors cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-black">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        aria-label={`Increase quantity of ${item.title}`}
                        className="p-1 text-gray-600 hover:text-black transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      aria-label={`Remove ${item.title} from cart`}
                      className="p-1 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer ml-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mx-auto border border-gray-200">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-sm font-bold text-gray-900">Your cart is currently empty</p>
              <p className="text-xs text-gray-500">Explore our signature attars and perfumes to add items.</p>
            </div>
          )}
        </div>

        {/* Drawer Footer & Checkout Action */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50 space-y-3">
            {/* Coupon Code Section */}
            <div className="space-y-1.5 bg-white p-3 rounded-2xl border border-gray-200">
              <label className="block text-[11px] font-bold text-gray-700 uppercase flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-black" /> Coupon Discount
              </label>

              {!appliedCoupon ? (
                <form onSubmit={handleApplyCoupon} className="flex gap-1.5">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter EID20 or WELCOME10"
                    className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs uppercase font-bold text-gray-900 focus:outline-hidden focus:border-black"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-black hover:bg-gray-800 text-white font-bold text-xs uppercase rounded-xl transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-between bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{appliedCoupon.code} Applied ({appliedCoupon.discountPercent}% Off)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-xs font-bold text-rose-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}

              {couponError && (
                <p className="text-[10px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {couponError}
                </p>
              )}
            </div>

            {/* Order Totals Display */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs text-gray-600">
                <span>Items Subtotal</span>
                <span className="font-bold text-gray-900">
                  {formatBDT(itemsSubtotalBDT)}
                </span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between items-center text-xs text-emerald-700 font-bold">
                  <span>Coupon Discount ({appliedCoupon.discountPercent}%)</span>
                  <span>- {formatBDT(discountAmountBDT)}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-xs text-gray-600">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-emerald-600">Calculated at Checkout</span>
              </div>

              <div className="border-t border-gray-200 pt-2 flex justify-between items-baseline">
                <span className="text-sm font-bold text-black">Total Amount</span>
                <span className="text-xl font-extrabold text-black">
                  {formatBDT(finalTotalBDT)}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              type="button"
              onClick={onOpenCheckout}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-black hover:bg-gray-800 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-98 cursor-pointer text-center"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>

            <button
              type="button"
              onClick={onClearCart}
              className="w-full text-center text-[11px] font-semibold text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
