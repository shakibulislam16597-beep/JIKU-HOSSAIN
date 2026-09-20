import React, { useState, useEffect, useRef } from 'react';
import { HERO_SLIDES } from '../data/banners';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

/**
 * HeroBanner Component - Auto-sliding Carousel for Light Theme
 */
export default function HeroBanner({ onShopNowClick }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  const totalSlides = HERO_SLIDES.length;
  const slideTimerRef = useRef(null);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

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
    if (distance > 40) {
      handleNextSlide();
    } else if (distance < -40) {
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
      className="w-full max-w-7xl mx-auto my-2 px-1"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="relative w-full overflow-hidden rounded-2xl shadow-sm bg-gray-900 group select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9]">
          <img
            key={slide.id}
            src={slide.image}
            alt={slide.alt}
            loading="eager"
            className="w-full h-full object-cover object-center transition-all duration-700"
          />

          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 pointer-events-none" />

          {/* Autoplay Pause / Play Control */}
          <div className="absolute top-3 right-3 z-20">
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              aria-label={isPaused ? 'Play carousel autoplay' : 'Pause carousel autoplay'}
              className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/70 backdrop-blur-xs transition-colors cursor-pointer"
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Text Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 flex flex-col items-start z-10">
            <div className="inline-flex items-center px-2.5 py-0.5 mb-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[10px] font-bold text-white uppercase tracking-wider">
              {slide.badge}
            </div>

            <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight max-w-xl font-sans">
              {slide.headline}
            </h1>

            <p className="mt-1 text-xs sm:text-sm text-gray-200 max-w-md line-clamp-2">
              {slide.subtext}
            </p>

            <div className="mt-3">
              <button
                type="button"
                onClick={onShopNowClick}
                aria-label={`${slide.buttonText} for ${slide.headline}`}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-black hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-wide transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <span>{slide.buttonText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Semi-transparent Circular Left/Right Arrows */}
          <button
            type="button"
            onClick={handlePrevSlide}
            aria-label="Previous Slide"
            className="flex absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleNextSlide}
            aria-label="Next Slide"
            className="flex absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="flex items-center justify-center gap-1.5 mt-2.5">
        {HERO_SLIDES.map((s, idx) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              currentSlide === idx ? 'w-6 bg-[#D4AF37]' : 'w-2 bg-gray-300'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
