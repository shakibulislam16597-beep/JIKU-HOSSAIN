import React, { useState } from 'react';
import { formatBDT } from '../utils/currency';
import { validateCoupon } from '../data/coupons';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Check, AlertCircle } from 'lucide-react';

/**
 * CartDrawer Component - Extrovat Lifestyle
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
        className="fixed inset-0 bg-[#0E1330]/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[#F7F8FC] border-l-2 border-[#0E1330] h-full shadow-2xl flex flex-col justify-between z-10 text-[#0E1330] animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b-2 border-[#0E1330] flex items-center justify-between bg-[#FFFFFF]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#0E1330] text-[#FFFFFF]">
              <ShoppingBag className="w-5 h-5 text-[#FFFFFF]" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-base sm:text-lg text-[#0E1330]">
                Shopping cart
              </h2>
              <p className="text-xs font-sans text-[#5B6079]">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} selected
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="p-1.5 rounded-xl border-2 border-[#0E1330] bg-[#FFFFFF] text-[#0E1330] hover:bg-[#F7F8FC] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div
                key={`${item.id}-${item.selectedSize}`}
                className="flex items-center gap-3 bg-[#FFFFFF] p-3 rounded-[16px] border-2 border-[#0E1330] shadow-[2px_2px_0px_#0E1330] relative"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#F7F8FC] shrink-0 border border-[#0E1330]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="text-xs sm:text-sm font-heading font-bold text-[#0E1330] truncate">
                    {item.title}
                  </h3>

                  <div className="flex items-baseline gap-2 font-sans">
                    <span className="text-xs sm:text-sm font-extrabold text-[#0E1330]">
                      {formatBDT(item.price)}
                    </span>
                    {item.selectedSize && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#FFC933] text-[#0E1330] border border-[#0E1330]">
                        {item.selectedSize}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <div className="inline-flex items-center rounded-lg bg-[#F7F8FC] border border-[#0E1330] p-0.5">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        aria-label={`Decrease quantity of ${item.title}`}
                        className="p-1 text-[#0E1330] hover:bg-[#FFFFFF] rounded-md transition-colors cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-heading font-extrabold text-[#0E1330]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        aria-label={`Increase quantity of ${item.title}`}
                        className="p-1 text-[#0E1330] hover:bg-[#FFFFFF] rounded-md transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      aria-label={`Remove ${item.title} from cart`}
                      className="p-1.5 text-[#5B6079] hover:text-rose-600 transition-colors cursor-pointer ml-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 bg-[#FFFFFF] rounded-full flex items-center justify-center text-[#0E1330] mx-auto border-2 border-[#0E1330] shadow-[2px_2px_0px_#0E1330]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-sm font-heading font-extrabold text-[#0E1330]">Your cart is currently empty</p>
              <p className="text-xs text-[#5B6079]">Explore our fragrances and lifestyle products to add items.</p>
            </div>
          )}
        </div>

        {/* Drawer Footer & Checkout Action */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t-2 border-[#0E1330] bg-[#FFFFFF] space-y-3">
            {/* Coupon Code Section */}
            <div className="space-y-1.5 bg-[#F7F8FC] p-3 rounded-[16px] border-2 border-[#0E1330]">
              <label className="block text-[11px] font-heading font-bold text-[#0E1330] uppercase flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-[#2436F5]" /> Coupon discount
              </label>

              {!appliedCoupon ? (
                <form onSubmit={handleApplyCoupon} className="flex gap-1.5">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="EID20 or WELCOME10"
                    className="flex-1 px-3 py-1.5 bg-[#FFFFFF] border border-[#0E1330] rounded-xl text-xs font-sans font-bold text-[#0E1330] focus:outline-none focus:border-[#2436F5]"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-[#0E1330] hover:bg-[#2436F5] text-[#FFFFFF] font-heading font-extrabold text-xs uppercase rounded-xl transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-between bg-[#0F9D6B]/10 p-2 rounded-xl border border-[#0F9D6B]">
                  <div className="flex items-center gap-1.5 text-xs font-sans font-bold text-[#0F9D6B]">
                    <Check className="w-4 h-4" />
                    <span>{appliedCoupon.code} ({appliedCoupon.discountPercent}% off)</span>
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
            <div className="space-y-1.5 font-sans">
              <div className="flex justify-between items-center text-xs text-[#5B6079]">
                <span>Items subtotal</span>
                <span className="font-extrabold text-[#0E1330]">
                  {formatBDT(itemsSubtotalBDT)}
                </span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between items-center text-xs text-[#0F9D6B] font-bold">
                  <span>Coupon discount ({appliedCoupon.discountPercent}%)</span>
                  <span>- {formatBDT(discountAmountBDT)}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-xs text-[#5B6079]">
                <span>Estimated shipping</span>
                <span className="font-bold text-[#0F9D6B]">Calculated at checkout</span>
              </div>

              <div className="border-t border-[#0E1330]/20 pt-2 flex justify-between items-baseline">
                <span className="text-sm font-heading font-extrabold text-[#0E1330]">Total amount</span>
                <span className="text-xl font-sans font-extrabold text-[#0E1330]">
                  {formatBDT(finalTotalBDT)}
                </span>
              </div>
            </div>

            {/* Checkout Primary Button */}
            <button
              type="button"
              onClick={onOpenCheckout}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-[#2436F5] text-[#FFFFFF] border-2 border-[#0E1330] shadow-[3px_3px_0px_#0E1330] font-heading font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-full transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer"
            >
              <span>Proceed to checkout</span>
              <ArrowRight className="w-4 h-4 text-[#FFFFFF]" />
            </button>

            <button
              type="button"
              onClick={onClearCart}
              className="w-full text-center text-xs font-sans font-semibold text-[#5B6079] hover:text-rose-600 transition-colors cursor-pointer"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
