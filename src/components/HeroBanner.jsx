import React, { useState, useEffect, useRef } from 'react';
import { HERO_SLIDES } from '../data/banners';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

/**
 * HeroBanner Component - Auto-sliding 4-slide Carousel
 *
 * Requirements:
 * - Autoplay every 4 seconds
 * - Swipe support for touch devices
 * - Pause on touch/hover
 * - Respect prefers-reduced-motion
 * - Working interactive dot indicators
 * - Luxury Black & Gold styling
 */
export default function HeroBanner({ onShopNowClick }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  const totalSlides = HERO_SLIDES.length;
  const slideTimerRef = useRef(null);

  // Check user preference for reduced motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Next slide
  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  // Prev slide
  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Autoplay timer effect
  useEffect(() => {
    if (isPaused || prefersReducedMotion) {
      if (slideTimerRef.current) clearInterval(slideTimerRef.current);
      return;
    }

    slideTimerRef.current = setInterval(() => {
      handleNextSlide();
    }, 4000);

    return () => {
      if (slideTimerRef.current) clearInterval(slideTimerRef.current);
    };
  }, [currentSlide, isPaused, prefersReducedMotion]);

  // Touch Swipe Handlers
  const handleTouchStart = (e) => {
    setIsPaused(true);
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchEndX(null);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) {
      setIsPaused(false);
      return;
    }
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 40;
    const isRightSwipe = distance < -40;

    if (isLeftSwipe) {
      handleNextSlide();
    } else if (isRightSwipe) {
      handlePrevSlide();
    }

    setTouchStartX(null);
    setTouchEndX(null);
    setIsPaused(false);
  };

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section
      aria-label="Hero Marketing Carousel"
      className="w-full max-w-7xl mx-auto my-3 px-1 sm:px-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Banner Container */}
      <div
        className="relative w-full overflow-hidden rounded-2xl shadow-2xl bg-[#14120C] border border-[#D4AF37]/25 group select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Aspect Ratio Box: 4/5 on mobile, 16/9 on md+ */}
        <div className="relative w-full aspect-[4/5] md:aspect-[16/9]">

          {/* Skeleton Shimmer while current slide image is loading */}
          {!imagesLoaded[slide.id] && (
            <div className="absolute inset-0 bg-gradient-to-r from-[#181610] via-[#2A2415] to-[#181610] bg-[length:200%_100%] animate-[shimmer_1.8s_infinite] flex items-center justify-center z-0">
              <div className="flex items-center gap-2 text-[#D4AF37]/60 text-xs font-semibold tracking-wider uppercase">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Loading Fragrance...</span>
              </div>
            </div>
          )}

          {/* Slide Image */}
          <img
            key={slide.id}
            src={slide.image}
            alt={slide.alt}
            loading="eager"
            // @ts-ignore
            fetchpriority="high"
            onLoad={() => setImagesLoaded((prev) => ({ ...prev, [slide.id]: true }))}
            className={`w-full h-full object-cover object-[right_center] transition-all duration-700 ease-in-out ${
              prefersReducedMotion ? '' : 'transform transition-transform duration-1000 group-hover:scale-105'
            }`}
          />

          {/* Black & Gold Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/60 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B]/80 via-transparent to-transparent pointer-events-none" />

          {/* Autoplay status badge & controls (top right) */}
          <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              aria-label={isPaused ? 'Play carousel autoplay' : 'Pause carousel autoplay'}
              className="p-1.5 rounded-full bg-[#0B0B0B]/80 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors cursor-pointer"
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Slide Text Content */}
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 md:p-10 flex flex-col items-start z-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Tagline / Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-2.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[11px] font-bold text-[#F5E8C7] uppercase tracking-widest">
                {slide.badge}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-serif text-white tracking-tight leading-tight drop-shadow-md max-w-2xl">
              {slide.headline}
            </h1>

            {/* Subtext */}
            <p className="mt-1.5 sm:mt-2.5 text-xs sm:text-base font-medium text-[#E5D7B5]/90 max-w-lg drop-shadow-sm">
              {slide.subtext}
            </p>

            {/* Gold Action Button */}
            <div className="mt-4 sm:mt-6">
              <button
                type="button"
                onClick={onShopNowClick}
                aria-label={`${slide.buttonText} for ${slide.headline}`}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-full bg-[#D4AF37] hover:bg-[#E5BF42] text-black font-extrabold text-xs sm:text-sm tracking-wide uppercase shadow-lg shadow-[#D4AF37]/25 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 cursor-pointer"
              >
                <span>{slide.buttonText}</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>

          {/* Left/Right Navigation Arrows (desktop/hover) */}
          <button
            type="button"
            onClick={handlePrevSlide}
            aria-label="Previous Slide"
            className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-[#0B0B0B]/70 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleNextSlide}
            aria-label="Next Slide"
            className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-[#0B0B0B]/70 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Interactive Dot Indicators */}
      <div className="flex items-center justify-center gap-2 mt-3" aria-label="Carousel slide navigation">
        {HERO_SLIDES.map((s, idx) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}: ${s.headline}`}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              currentSlide === idx
                ? 'w-8 bg-[#D4AF37] shadow-xs shadow-[#D4AF37]/50'
                : 'w-2 bg-slate-700 hover:bg-[#D4AF37]/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
