import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { ANNOUNCEMENT_MESSAGES } from '../data/banners';

/**
 * AnnouncementBar Component
 *
 * Requirements:
 * - Announcement bar above header
 * - Slowly scrolling message "Free delivery on orders above ৳2000 · Cash on Delivery available · bKash / Nagad accepted"
 * - Dismissible
 */
export default function AnnouncementBar() {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const tickerText = ANNOUNCEMENT_MESSAGES.join('  ·  ');

  return (
    <div className="bg-black text-white text-[11px] font-bold py-1.5 px-3 flex items-center justify-between overflow-hidden relative z-50 border-b border-gray-800">
      <div className="flex items-center gap-1.5 shrink-0 pr-2">
        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span className="bg-[#D4AF37] text-black text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase">
          Offer
        </span>
      </div>

      {/* Ticker Container */}
      <div className="flex-1 overflow-hidden whitespace-nowrap relative">
        <div className="inline-block animate-[marquee_20s_linear_infinite] whitespace-nowrap">
          <span className="mx-4">{tickerText}</span>
          <span className="mx-4">{tickerText}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsDismissed(true)}
        aria-label="Dismiss announcement bar"
        className="shrink-0 pl-2 p-0.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
