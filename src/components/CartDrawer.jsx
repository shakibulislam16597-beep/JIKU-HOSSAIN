import React from 'react';
import { WHATSAPP_NUMBER } from '../data/banners';
import { formatBDT, formatUSD } from '../utils/currency';
import { X, Trash2, Plus, Minus, ShoppingBag, MessageCircle, ArrowRight } from 'lucide-react';

/**
 * CartDrawer Component - ATOR ALI Store
 *
 * Displays cart items, quantities, dual prices (৳ prominent, $ secondary),
 * and a Checkout button that opens WhatsApp with an itemized order message.
 */
export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) {
  if (!isOpen) return null;

  const totalUSD = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Construct itemized message for WhatsApp Checkout
  const buildWhatsAppOrderMessage = () => {
    let msg = "Assalamu alaikum, I want to order from ATOR ALI:\n\n";

    cartItems.forEach((item, index) => {
      const sizeStr = item.size ? ` (${item.size})` : '';
      const lineTotal = formatBDT(item.price * item.quantity);
      msg += `${index + 1}. ${item.title}${sizeStr} x ${item.quantity} - ${lineTotal}\n`;
    });

    msg += `\nTotal Amount: ${formatBDT(totalUSD)}\n\nPlease confirm my order details. Thank you!`;
    return msg;
  };

  const whatsappCheckoutUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=` + encodeURIComponent(buildWhatsAppOrderMessage());

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[#0B0B0B] border-l border-[#D4AF37]/30 h-full shadow-2xl flex flex-col justify-between z-10 text-white animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#D4AF37]/20 flex items-center justify-between bg-[#14120C]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37]">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="font-serif font-extrabold text-base sm:text-lg text-white">
                Your Luxury Cart
              </h2>
              <p className="text-[11px] text-[#D4AF37] font-medium">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} selected
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-[#1A1812] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 bg-[#14120C] p-3 rounded-2xl border border-[#D4AF37]/20 shadow-xs relative"
              >
                {/* Product Image */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#0B0B0B] shrink-0 border border-[#D4AF37]/20">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="text-xs sm:text-sm font-bold text-white truncate">
                    {item.title}
                  </h3>
                  <div className="text-[11px] text-slate-400 font-medium">
                    Size: {item.size || '6ml Attar Oil'}
                  </div>

                  {/* Dual Price per item */}
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs sm:text-sm font-extrabold text-[#D4AF37]">
                      {formatBDT(item.price)}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ({formatUSD(item.price)})
                    </span>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 pt-1">
                    <div className="inline-flex items-center rounded-lg bg-[#0B0B0B] border border-[#D4AF37]/30 p-0.5">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        aria-label={`Decrease quantity of ${item.title}`}
                        className="p-1 text-slate-300 hover:text-[#D4AF37] transition-colors cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        aria-label={`Increase quantity of ${item.title}`}
                        className="p-1 text-slate-300 hover:text-[#D4AF37] transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      aria-label={`Remove ${item.title} from cart`}
                      className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer ml-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 bg-[#14120C] rounded-full flex items-center justify-center text-[#D4AF37] mx-auto border border-[#D4AF37]/30">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-sm font-bold text-white">Your cart is currently empty</p>
              <p className="text-xs text-slate-400">Explore our signature attars and perfumes to add items.</p>
            </div>
          )}
        </div>

        {/* Drawer Footer & Checkout Action */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#D4AF37]/20 bg-[#14120C] space-y-4">
            {/* Order Totals Display */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span>Subtotal</span>
                <span className="font-semibold text-white">
                  {formatBDT(totalUSD)} ({formatUSD(totalUSD)})
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-emerald-400">Calculated on WhatsApp</span>
              </div>
              <div className="border-t border-[#D4AF37]/15 pt-2 flex justify-between items-baseline">
                <span className="text-sm font-bold text-white font-serif">Total Amount</span>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-[#D4AF37] block leading-tight">
                    {formatBDT(totalUSD)}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {formatUSD(totalUSD)}
                  </span>
                </div>
              </div>
            </div>

            {/* WhatsApp Checkout Button */}
            <a
              href={whatsappCheckoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-full shadow-lg shadow-emerald-900/30 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer text-center"
            >
              <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
              <span>Checkout on WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={onClearCart}
              className="w-full text-center text-[11px] font-semibold text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
