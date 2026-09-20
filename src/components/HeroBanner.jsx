import React, { useState, useEffect, useRef } from 'react';
import { HERO_SLIDES } from '../data/banners';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

/**
 * HeroBanner Component - Extrovat Lifestyle
 * Requirements: 24px radius, 2px ink border, hard shadow (4px 4px 0 ink), autoplay 4 seconds,
 * round white arrow buttons with ink border, dot indicators where active dot is wider ultramarine pill.
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
      aria-label="Hero marketing carousel"
      className="w-full max-w-7xl mx-auto my-3 px-1"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="relative w-full overflow-hidden rounded-[24px] border-2 border-[#0E1330] shadow-[4px_4px_0px_#0E1330] bg-[#0E1330] select-none"
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
            className="w-full h-full object-cover object-center transition-all duration-500"
          />

          {/* Dark Overlay for Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E1330]/90 via-[#0E1330]/40 to-transparent pointer-events-none" />

          {/* Play / Pause Control */}
          <div className="absolute top-3 right-3 z-20">
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              aria-label={isPaused ? 'Play carousel autoplay' : 'Pause carousel autoplay'}
              className="p-1.5 rounded-full bg-[#FFFFFF] border-2 border-[#0E1330] text-[#0E1330] hover:bg-[#FFC933] transition-colors cursor-pointer"
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Text Content */}
          <div className="absolute bottom-0 left-0 right-0 px-[56px] sm:px-[56px] md:px-[56px] pb-4 pt-4 sm:pb-6 md:pb-8 flex flex-col items-start z-10">
            <span className="inline-block px-3 py-1 mb-2 rounded-full bg-[#FFC933] border border-[#0E1330] text-[10px] font-extrabold text-[#0E1330] uppercase tracking-wider">
              {slide.badge}
            </span>

            <h1 className="text-xl sm:text-3xl md:text-4xl font-heading font-extrabold text-[#FFFFFF] tracking-tight leading-tight max-w-xl">
              {slide.headline}
            </h1>

            <p className="mt-1 text-xs sm:text-sm font-sans text-gray-200 max-w-md line-clamp-2">
              {slide.subtext}
            </p>

            <div className="mt-3">
              <button
                type="button"
                onClick={onShopNowClick}
                aria-label={`${slide.buttonText} for ${slide.headline}`}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#2436F5] text-[#FFFFFF] border-2 border-[#0E1330] shadow-[2px_2px_0px_#0E1330] font-heading font-extrabold text-xs uppercase tracking-wider transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer"
              >
                <span>{slide.buttonText}</span>
                <ArrowRight className="w-4 h-4 text-[#FFFFFF]" />
              </button>
            </div>
          </div>

          {/* Round White Navigation Arrow Buttons */}
          <button
            type="button"
            onClick={handlePrevSlide}
            aria-label="Previous slide"
            className="flex absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-[#FFFFFF] text-[#0E1330] border-2 border-[#0E1330] shadow-[2px_2px_0px_#0E1330] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleNextSlide}
            aria-label="Next slide"
            className="flex absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-[#FFFFFF] text-[#0E1330] border-2 border-[#0E1330] shadow-[2px_2px_0px_#0E1330] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Slide Indicators: Active dot is wider ultramarine pill */}
      <div className="flex items-center justify-center gap-2 mt-3">
        {HERO_SLIDES.map((s, idx) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2.5 rounded-full border border-[#0E1330] transition-all cursor-pointer ${
              currentSlide === idx ? 'w-7 bg-[#2436F5]' : 'w-2.5 bg-[#FFFFFF]'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
