import React, { useEffect, useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

/**
 * SplashScreen Component - ATOR ALI (Black & Gold Theme)
 *
 * Requirements:
 * - Brand: "ATOR ALI"
 * - Full-screen splash with centered logo
 * - Smooth fade-in + scale animation lasting 2 seconds
 * - Gradient background: Black (#0B0B0B) -> Dark Gold (#2B220B)
 * - Small gold loading spinner at bottom
 * - Auto-navigate to Home page after 2 seconds
 */
export default function SplashScreen({ onFinish }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      const finishTimer = setTimeout(() => {
        if (onFinish) onFinish();
      }, 300);
      return () => clearTimeout(finishTimer);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      role="region"
      aria-label="App Opening Splash Screen"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between py-12 px-6 bg-gradient-to-b from-[#0B0B0B] via-[#14120C] to-[#2B220B] text-white transition-opacity duration-300 ease-in-out ${
        exiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top ambient glow decoration */}
      <div className="w-full flex justify-center pt-4 opacity-80">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#E5D7B5] bg-white/5 backdrop-blur-md px-3.5 py-1 rounded-full border border-[#D4AF37]/30">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Ator Ali Luxury Store</span>
        </div>
      </div>

      {/* Centered Logo with smooth animation */}
      <div className="flex flex-col items-center text-center animate-splash select-none my-auto">
        <div className="relative mb-5 flex items-center justify-center">
          {/* Glowing gold backdrop blur */}
          <div className="absolute w-36 h-36 bg-[#D4AF37]/20 rounded-full blur-3xl animate-pulse"></div>

          <div className="relative w-22 h-22 rounded-2xl bg-gradient-to-tr from-[#D4AF37] via-[#F5E8C7] to-[#AA820A] p-0.5 shadow-2xl shadow-[#D4AF37]/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#0B0B0B] rounded-[14px] flex items-center justify-center border border-[#D4AF37]/30">
              <span className="font-serif text-3xl sm:text-4xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#F5E8C7] via-[#D4AF37] to-[#E5BF42]">
                AA
              </span>
            </div>
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-widest font-serif text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F5E8C7] to-[#D4AF37] drop-shadow-md uppercase">
          ATOR ALI
        </h1>
        <p className="mt-2 text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#D4AF37]/90">
          Exclusive Attars, Oud & Luxury Perfumes
        </p>
      </div>

      {/* Bottom gold loading spinner */}
      <div className="flex flex-col items-center gap-2 pb-4">
        <Loader2 className="w-5 h-5 text-[#D4AF37] animate-spin" />
        <span className="text-[11px] font-semibold tracking-wider text-[#E5D7B5]/60 uppercase">
          Opening Store...
        </span>
      </div>
    </div>
  );
}
