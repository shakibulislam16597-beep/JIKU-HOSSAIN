import React, { useState } from 'react';
import heroBannerImg from '../assets/hero-banner.jpg';
import { ArrowRight, Sparkles } from 'lucide-react';

/**
 * HeroBanner Component
 *
 * Requirements:
 * - Rounded-2xl card, full width with small side margin
 * - Aspect ratio 4/5 on mobile, 16/9 on tablet/desktop
 * - object-cover with object-position "right center"
 * - Dark gradient overlay at the bottom (from black/90 to transparent)
 * - Overlay text at bottom-left:
 *   - Headline: "Discover Your Signature Scent"
 *   - Subtext: "Premium attars, oud and perfumes"
 *   - Gold button: "Shop Now" (rounded-full, gold #D4AF37 background, black text, hover scale effect, gold focus ring)
 * - Smooth fade-in when image loads with shimmer skeleton placeholder
 * - loading="eager", fetchpriority="high", alt="Perfume bottle with rose petals and oud wood"
 * - 3 dot indicators under the banner prepared for future slider
 */
export default function HeroBanner({ onShopNowClick }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <section aria-label="Featured Hero Banner" className="w-full max-w-7xl mx-auto my-3 px-1 sm:px-0">
      {/* Banner Card Container */}
      <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl bg-[#14120C] border border-[#D4AF37]/20 group">

        {/* Aspect Ratio Box: 4/5 on mobile, 16/9 on md+ */}
        <div className="relative w-full aspect-[4/5] md:aspect-[16/9]">

          {/* Shimmer Skeleton Placeholder */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-[#181610] via-[#2A2415] to-[#181610] bg-[length:200%_100%] animate-[shimmer_1.8s_infinite] flex items-center justify-center">
              <div className="flex items-center gap-2 text-[#D4AF37]/60 text-xs font-semibold tracking-wider uppercase">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Loading Exclusive Scent...</span>
              </div>
            </div>
          )}

          {/* Banner Image */}
          <img
            src={heroBannerImg}
            alt="Perfume bottle with rose petals and oud wood"
            loading="eager"
            // @ts-ignore
            fetchpriority="high"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover object-[right_center] transition-opacity duration-700 ease-in-out ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Dark Gradient Overlay (from black/90 at bottom to transparent at top) */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/95 via-[#0B0B0B]/60 to-transparent pointer-events-none" />

          {/* Overlay Text Content (bottom-left) */}
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 md:p-10 flex flex-col items-start z-10">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-2.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[11px] font-bold text-[#F5E8C7] uppercase tracking-widest">
                ATOR ALI EXCLUSIVE
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-serif text-white tracking-tight leading-tight drop-shadow-md">
              Discover Your Signature Scent
            </h1>

            {/* Subtext */}
            <p className="mt-1.5 sm:mt-2.5 text-xs sm:text-base font-medium text-[#E5D7B5]/90 max-w-md drop-shadow-sm">
              Premium attars, oud and perfumes
            </p>

            {/* Gold Action Button */}
            <div className="mt-4 sm:mt-6">
              <button
                type="button"
                onClick={onShopNowClick}
                aria-label="Shop Now for premium attars, oud and perfumes"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-full bg-[#D4AF37] hover:bg-[#E5BF42] text-black font-extrabold text-xs sm:text-sm tracking-wide uppercase shadow-lg shadow-[#D4AF37]/25 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 cursor-pointer"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Dot Indicators under the banner for future slider */}
      <div className="flex items-center justify-center gap-2 mt-3" aria-label="Banner slide indicators">
        {[0, 1, 2].map((idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              activeSlide === idx
                ? 'w-7 bg-[#D4AF37] shadow-xs shadow-[#D4AF37]/50'
                : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-[#D4AF37]/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
