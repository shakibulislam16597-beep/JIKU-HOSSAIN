import React, { useState, useEffect } from 'react';
import { FLASH_SALE_DATA } from '../data/banners';
import { Timer, Zap, Sparkles } from 'lucide-react';

/**
 * FlashSaleStrip Component
 *
 * Requirements:
 * - Positioned below category badges
 * - Live countdown timer (hours:minutes:seconds)
 * - Headline text "Limited time offers"
 * - Gradient black to dark gold background
 */
export default function FlashSaleStrip({ onExploreSale }) {
  // Initial 8 hours countdown in seconds
  const [timeLeft, setTimeLeft] = useState(
    (FLASH_SALE_DATA.durationHours || 8) * 3600
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const formatDigit = (num) => String(num).padStart(2, '0');

  return (
    <section
      aria-label="Flash Sale Countdown Strip"
      className="w-full bg-gradient-to-r from-[#0B0B0B] via-[#1F190B] to-[#2B220B] rounded-2xl p-4 sm:p-5 border border-[#D4AF37]/30 shadow-lg my-3 flex flex-col sm:flex-row items-center justify-between gap-4"
    >
      {/* Left: Headline & Icon */}
      <div className="flex items-center gap-3 text-center sm:text-left">
        <div className="p-2.5 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] shrink-0 animate-pulse">
          <Zap className="w-5 h-5 fill-[#D4AF37]" />
        </div>
        <div>
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#D4AF37] text-black uppercase tracking-wider">
              {FLASH_SALE_DATA.badge}
            </span>
            <span className="text-xs text-[#D4AF37] font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Special Deals
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold font-serif text-white mt-0.5">
            {FLASH_SALE_DATA.title}
          </h3>
          <p className="text-xs text-slate-300 hidden sm:block">
            {FLASH_SALE_DATA.subtext}
          </p>
        </div>
      </div>

      {/* Right: Live Countdown Timer & CTA */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-1 text-xs font-mono font-bold">
          <div className="flex flex-col items-center">
            <div className="bg-[#14120C] text-[#F5E8C7] border border-[#D4AF37]/30 rounded-lg px-2.5 py-1.5 text-sm sm:text-base font-extrabold shadow-inner min-w-[36px] text-center">
              {formatDigit(hours)}
            </div>
            <span className="text-[9px] text-[#D4AF37] uppercase tracking-wider mt-0.5">HRS</span>
          </div>
          <span className="text-[#D4AF37] font-extrabold text-base mb-3">:</span>
          <div className="flex flex-col items-center">
            <div className="bg-[#14120C] text-[#F5E8C7] border border-[#D4AF37]/30 rounded-lg px-2.5 py-1.5 text-sm sm:text-base font-extrabold shadow-inner min-w-[36px] text-center">
              {formatDigit(minutes)}
            </div>
            <span className="text-[9px] text-[#D4AF37] uppercase tracking-wider mt-0.5">MIN</span>
          </div>
          <span className="text-[#D4AF37] font-extrabold text-base mb-3">:</span>
          <div className="flex flex-col items-center">
            <div className="bg-[#14120C] text-[#D4AF37] border border-[#D4AF37]/50 rounded-lg px-2.5 py-1.5 text-sm sm:text-base font-extrabold shadow-inner min-w-[36px] text-center">
              {formatDigit(seconds)}
            </div>
            <span className="text-[9px] text-[#D4AF37] uppercase tracking-wider mt-0.5">SEC</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onExploreSale}
          className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#E5BF42] text-black font-extrabold text-xs rounded-full uppercase tracking-wider transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer shrink-0"
        >
          View Offers
        </button>
      </div>
    </section>
  );
}
