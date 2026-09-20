import React from 'react';
import { CheckCircle2, ShoppingBag, Sparkles } from 'lucide-react';

/**
 * OrderSuccessModal Component
 *
 * Requirements:
 * - Displays "Thank you, your order is received" screen after order submission.
 * - Button to continue shopping and return to home page.
 */
export default function OrderSuccessModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#0B0B0B] rounded-3xl max-w-md w-full p-6 sm:p-8 border border-[#D4AF37]/50 shadow-2xl relative text-center text-white space-y-5 animate-in zoom-in-95 duration-200">
        {/* Checkmark Icon Badge */}
        <div className="w-20 h-20 bg-gradient-to-tr from-[#D4AF37]/20 via-[#D4AF37]/40 to-[#D4AF37]/10 rounded-full flex items-center justify-center text-[#D4AF37] mx-auto border border-[#D4AF37]/40 shadow-xl shadow-[#D4AF37]/20">
          <CheckCircle2 className="w-10 h-10 text-[#D4AF37]" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[10px] font-extrabold text-[#D4AF37] uppercase tracking-wider">
            <Sparkles className="w-3 h-3" /> ORDER CONFIRMED
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-white tracking-tight">
            Thank you, your order is received
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
            Your order details have been sent to our WhatsApp service team. We will process your delivery shortly.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#E5BF42] text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-full shadow-lg shadow-[#D4AF37]/25 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-black" />
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>
    </div>
  );
}
