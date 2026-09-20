import React from 'react';
import { CheckCircle2, ShoppingBag } from 'lucide-react';

/**
 * OrderSuccessModal Component - Extrovat Lifestyle
 */
export default function OrderSuccessModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E1330]/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] rounded-[24px] max-w-md w-full p-6 sm:p-8 border-2 border-[#0E1330] shadow-[4px_4px_0px_#0E1330] relative text-center text-[#0E1330] space-y-5 animate-in zoom-in-95 duration-200">
        {/* Checkmark Icon Badge */}
        <div className="w-16 h-16 bg-[#FFC933] text-[#0E1330] rounded-full flex items-center justify-center mx-auto border-2 border-[#0E1330] shadow-[2px_2px_0px_#0E1330]">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        {/* Text */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#0F9D6B] text-[10px] font-heading font-extrabold text-[#FFFFFF] border border-[#0E1330] uppercase tracking-wider">
            Order received
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-[#0E1330] tracking-tight">
            Thank you, your order is received
          </h2>
          <p className="text-xs sm:text-sm font-sans text-[#5B6079] leading-relaxed max-w-sm mx-auto">
            Your order details have been forwarded to our WhatsApp team. We will contact you shortly to confirm delivery.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 bg-[#2436F5] text-[#FFFFFF] border-2 border-[#0E1330] shadow-[2px_2px_0px_#0E1330] font-heading font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-full transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-[#FFFFFF]" />
            <span>Continue shopping</span>
          </button>
        </div>
      </div>
    </div>
  );
}
