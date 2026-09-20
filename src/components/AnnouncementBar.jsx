import React, { useState } from 'react';
import { ANNOUNCEMENT_MESSAGES } from '../data/banners';
import { X, Sparkles } from 'lucide-react';

/**
 * AnnouncementBar Component - Extrovat Lifestyle
 *
 * Requirements:
 * - Ink background #0E1330
 * - Sun-yellow text #FFC933
 * - Slow marquee ticker text
 */
export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-[#0E1330] text-[#FFC933] border-b border-[#0E1330] py-1.5 px-3 text-xs font-sans font-bold flex items-center justify-between overflow-hidden relative">
      <div className="flex-1 overflow-hidden whitespace-nowrap mr-2">
        <div className="inline-block animate-[marquee_20s_linear_infinite]">
          {ANNOUNCEMENT_MESSAGES.map((msg, idx) => (
            <span key={idx} className="inline-flex items-center gap-2 mx-6">
              <Sparkles className="w-3.5 h-3.5 fill-[#FFC933] shrink-0" />
              <span>{msg}</span>
            </span>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsVisible(false)}
        aria-label="Dismiss announcement"
        className="p-0.5 rounded-md hover:bg-[#FFC933]/20 text-[#FFC933] transition-colors shrink-0 cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
