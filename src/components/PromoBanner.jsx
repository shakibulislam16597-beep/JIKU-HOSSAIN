import React from 'react';
import { PROMO_BANNER_DATA } from '../data/banners';
import { Gift, ArrowRight, Sparkles } from 'lucide-react';

/**
 * PromoBanner Component
 *
 * Requirements:
 * - Positioned between 2nd and 3rd product rows
 * - Banner text: "Buy 2 Attars, Get 1 Free"
 * - Black to dark gold gradient
 */
export default function PromoBanner({ onPromoClick }) {
  return (
    <section
      aria-label="Promotional Offer Banner"
      className="w-full my-6 bg-gradient-to-r from-[#0B0B0B] via-[#241D0B] to-[#120F08] rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/40 shadow-xl relative overflow-hidden group"
    >
      {/* Decorative Gold Glow Circles */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left Content */}
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] shrink-0">
            <Gift className="w-7 h-7 text-[#D4AF37]" />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[10px] font-extrabold text-[#D4AF37] uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>{PROMO_BANNER_DATA.badge}</span>
            </div>
            <h3 className="text-xl sm:text-3xl font-extrabold font-serif text-white tracking-tight leading-snug">
              {PROMO_BANNER_DATA.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
              {PROMO_BANNER_DATA.subtext}
            </p>
          </div>
        </div>

        {/* Right CTA */}
        <div className="shrink-0 w-full sm:w-auto">
          <button
            type="button"
            onClick={onPromoClick}
            aria-label={`Claim promo: ${PROMO_BANNER_DATA.title}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#D4AF37] hover:bg-[#E5BF42] text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-full shadow-lg shadow-[#D4AF37]/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <span>{PROMO_BANNER_DATA.buttonText}</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </div>
      </div>
    </section>
  );
}
