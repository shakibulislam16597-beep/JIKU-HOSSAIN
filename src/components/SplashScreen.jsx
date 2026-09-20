import React, { useEffect, useState } from 'react';

/**
 * SplashScreen Component - Extrovat Lifestyle
 *
 * Requirements:
 * - Paper background #F7F8FC
 * - "Extrovat" appears letter by letter sliding up with short stagger
 * - Sun-yellow dot pops in after letters
 * - "Lifestyle" fades in below
 * - Total duration ~1.8 seconds then auto-navigate to Home
 * - Supports prefers-reduced-motion (instant display)
 */
export default function SplashScreen({ onFinish }) {
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // Check prefers-reduced-motion media query
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setIsReducedMotion(true);
      const timer = setTimeout(() => {
        if (onFinish) onFinish();
      }, 500);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 1800);

    return () => clearTimeout(timer);
  }, [onFinish]);

  const brandLetters = 'Extrovat'.split('');

  return (
    <div
      role="region"
      aria-label="App opening splash screen"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F7F8FC] text-[#0E1330] p-6 selection:bg-[#2436F5] selection:text-white"
    >
      <div className="flex flex-col items-center text-center select-none">
        {/* Main Wordmark Container */}
        <div className="flex items-baseline justify-center overflow-hidden">
          {brandLetters.map((letter, idx) => (
            <span
              key={idx}
              style={{
                animationDelay: isReducedMotion ? '0s' : `${idx * 0.06}s`
              }}
              className={`font-heading text-5xl sm:text-6xl font-extrabold tracking-tight text-[#0E1330] inline-block ${
                isReducedMotion
                  ? 'opacity-100 transform-none'
                  : 'animate-[slideUp_0.5s_cubic-bezier(0.16,1,0.3,1)_both]'
              }`}
            >
              {letter}
            </span>
          ))}

          {/* Sun-yellow dot */}
          <span
            style={{
              animationDelay: isReducedMotion ? '0s' : '0.55s'
            }}
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#FFC933] border border-[#0E1330] ml-1 inline-block ${
              isReducedMotion
                ? 'opacity-100 transform-none'
                : 'animate-[popIn_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)_both]'
            }`}
          />
        </div>

        {/* Subtitle "Lifestyle" */}
        <p
          style={{
            animationDelay: isReducedMotion ? '0s' : '0.85s'
          }}
          className={`mt-2 text-sm sm:text-base font-medium tracking-widest text-[#5B6079] ${
            isReducedMotion
              ? 'opacity-100'
              : 'animate-[fadeIn_0.5s_ease-out_both]'
          }`}
        >
          Lifestyle
        </p>
      </div>

      <style>{`
        @keyframes slideUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
