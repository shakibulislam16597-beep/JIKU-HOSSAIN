import React, { useState } from 'react';
import { Sparkles, ArrowRight, RotateCcw, ShoppingBag, Check } from 'lucide-react';
import { SCENT_QUIZ_QUESTIONS } from '../data/banners';
import { MOCK_PRODUCTS } from '../data/products';
import { formatBDT } from '../utils/currency';

/**
 * ScentFinderQuiz Component - Interactive quiz recommending 3 scents
 */
export default function ScentFinderQuiz({ onAddToCart }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSelectOption = (questionId, value) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);

    if (currentStep < SCENT_QUIZ_QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStep(0);
    setIsCompleted(false);
  };

  // Get recommendations based on selected note/strength
  const getRecommendedProducts = () => {
    const selectedNote = answers.note || 'woody';
    const selectedStrength = answers.strength || 'intense';

    let matched = MOCK_PRODUCTS.filter(
      (p) => p.note === selectedNote || p.strength === selectedStrength
    );

    if (matched.length < 3) {
      matched = MOCK_PRODUCTS.slice(0, 3);
    }

    return matched.slice(0, 3);
  };

  const recommendations = getRecommendedProducts();

  return (
    <div className="w-full my-6 bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-3xl p-5 sm:p-6 text-white border border-gray-800 shadow-xl relative overflow-hidden">
      <div className="relative z-10 space-y-4">
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37]">
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-sans uppercase tracking-wide">
                Scent Finder Quiz
              </h3>
              <p className="text-[11px] text-gray-300 font-medium">
                Find your perfect signature attar in 3 quick questions
              </p>
            </div>
          </div>

          {isCompleted && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs text-[#D4AF37] font-bold hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retake
            </button>
          )}
        </div>

        {/* Quiz Steps */}
        {!isCompleted ? (
          <div className="space-y-3 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#D4AF37]">
              <span>Step {currentStep + 1} of 3</span>
              <span>{Math.round(((currentStep + 1) / 3) * 100)}% Completed</span>
            </div>

            <h4 className="text-xs sm:text-sm font-bold text-white">
              {SCENT_QUIZ_QUESTIONS[currentStep].question}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {SCENT_QUIZ_QUESTIONS[currentStep].options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    handleSelectOption(
                      SCENT_QUIZ_QUESTIONS[currentStep].id,
                      opt.value
                    )
                  }
                  className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-[#D4AF37] hover:text-black font-bold text-xs text-left transition-colors cursor-pointer border border-white/10"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Recommended Products View */
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37]">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>We found 3 perfect fragrances for your preferences!</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {recommendations.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white text-gray-900 rounded-2xl p-3 border border-gray-200 shadow-sm flex flex-col justify-between"
                >
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-50 mb-2 border border-gray-100">
                    <img
                      src={prod.image}
                      alt={prod.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-gray-900 line-clamp-1">
                      {prod.title}
                    </h5>
                    <div className="text-xs font-extrabold text-black mt-0.5">
                      {formatBDT(prod.price)}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onAddToCart && onAddToCart(prod)}
                    className="w-full mt-2 py-1.5 px-2 bg-black hover:bg-gray-800 text-white font-bold text-[10px] uppercase rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <ShoppingBag className="w-3 h-3 text-white" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
