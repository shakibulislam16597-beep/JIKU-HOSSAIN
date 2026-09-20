import React, { useEffect, useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

/**
 * SplashScreen Component
 *
 * Requirements:
 * - Full-screen splash with the logo ("ATOR ALI") centered
 * - Smooth fade-in + scale animation lasting 2 seconds
 * - Gradient background (deep blue to purple)
 * - Small loading spinner at the bottom
 * - Auto-navigate to Home page after 2 seconds
 */
export default function SplashScreen({ onFinish }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Trigger finish callback after 2 seconds (2000ms)
    const timer = setTimeout(() => {
      setExiting(true);
      // Allow a brief transition window before unmounting / triggering navigation
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
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between py-12 px-6 bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-900 text-white transition-opacity duration-300 ease-in-out ${
        exiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top ambient glow decoration */}
      <div className="w-full flex justify-center pt-4 opacity-70">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-indigo-300/80 bg-white/5 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Exclusive Collection</span>
        </div>
      </div>

      {/* Main Centered Content: Logo with fade-in + scale animation */}
      <div className="flex flex-col items-center text-center animate-splash select-none my-auto">
        <div className="relative mb-4 flex items-center justify-center">
          {/* Glowing backdrop circle */}
          <div className="absolute w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl animate-pulse"></div>

          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 p-0.5 shadow-2xl shadow-indigo-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <span className="font-serif text-3xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100">
                AA
              </span>
            </div>
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-widest font-serif text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200 drop-shadow-sm uppercase">
          ATOR ALI
        </h1>
        <p className="mt-2 text-xs sm:text-sm font-medium tracking-widest uppercase text-indigo-200/80">
          Luxury Fragrances & Perfume Oils
        </p>
      </div>

      {/* Bottom loading spinner */}
      <div className="flex flex-col items-center gap-2 pb-4">
        <Loader2 className="w-5 h-5 text-indigo-300 animate-spin" />
        <span className="text-[11px] font-medium tracking-wider text-indigo-200/60 uppercase">
          Loading Experience...
        </span>
      </div>
    </div>
  );
}
