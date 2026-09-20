import React from 'react';
import { CheckCircle2, ShoppingBag } from 'lucide-react';

/**
 * OrderSuccessModal Component - ATOR ALI (Clean Light Theme)
 */
export default function OrderSuccessModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-gray-200 shadow-2xl relative text-center text-gray-900 space-y-5 animate-in zoom-in-95 duration-200">
        {/* Checkmark Icon Badge */}
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200 shadow-xs">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        {/* Text */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
            ORDER RECEIVED
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-black tracking-tight">
            Thank you, your order is received
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
            Your order details have been forwarded to our WhatsApp team. We will contact you shortly to confirm delivery.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-black hover:bg-gray-800 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-white" />
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>
    </div>
  );
}
