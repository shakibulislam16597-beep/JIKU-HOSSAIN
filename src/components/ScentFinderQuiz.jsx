import React, { useState } from 'react';
import { SCENT_QUIZ_QUESTIONS } from '../data/banners';
import { MOCK_PRODUCTS } from '../data/products';
import { formatBDT } from '../utils/currency';
import { Sparkles, RotateCcw, ShoppingBag, ArrowRight, Check } from 'lucide-react';

/**
 * ScentFinderQuiz Component - Extrovat Lifestyle
 */
export default function ScentFinderQuiz({ onAddToCart }) {
  const [answers, setAnswers] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleSelectOption = (questionId, value) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);

    if (currentStep < SCENT_QUIZ_QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStep(0);
    setShowResults(false);
  };

  // Recommendations based on quiz answers
  const recommendedProducts = MOCK_PRODUCTS.filter((p) => {
    if (answers.note && p.note === answers.note) return true;
    if (answers.strength && p.strength === answers.strength) return true;
    if (answers.occasion && p.occasion === answers.occasion) return true;
    return false;
  }).slice(0, 3);

  const activeQuestion = SCENT_QUIZ_QUESTIONS[currentStep];

  return (
    <section
      aria-label="Interactive fragrance quiz"
      className="w-full bg-[#FFFFFF] border-2 border-[#0E1330] rounded-[24px] p-5 shadow-[4px_4px_0px_#0E1330] my-4 text-[#0E1330]"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-[#0E1330] mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#FFC933] text-[#0E1330] border border-[#0E1330]">
            <Sparkles className="w-4 h-4 fill-[#0E1330]" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-heading font-extrabold text-[#0E1330]">
              Fragrance finder quiz
            </h3>
            <p className="text-xs font-sans text-[#5B6079]">
              Answer 3 quick questions to discover your signature scent
            </p>
          </div>
        </div>

        {showResults && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-xs font-heading font-bold text-[#2436F5] hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Retake
          </button>
        )}
      </div>

      {!showResults ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-heading font-bold text-[#5B6079]">
            <span>Question {currentStep + 1} of {SCENT_QUIZ_QUESTIONS.length}</span>
            <span className="text-[#2436F5]">
              {Math.round(((currentStep + 1) / SCENT_QUIZ_QUESTIONS.length) * 100)}% complete
            </span>
          </div>

          <h4 className="text-sm sm:text-base font-heading font-extrabold text-[#0E1330]">
            {activeQuestion.question}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {activeQuestion.options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelectOption(activeQuestion.id, opt.value)}
                className="py-3 px-4 rounded-xl border-2 border-[#0E1330] bg-[#FFFFFF] text-[#0E1330] hover:bg-[#FFC933] font-heading font-bold text-xs transition-all text-left flex items-center justify-between cursor-pointer active:translate-x-[2px] active:translate-y-[2px]"
              >
                <span>{opt.label}</span>
                <ArrowRight className="w-4 h-4 text-[#0E1330]" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-[#FFC933]/20 p-3 rounded-xl border-2 border-[#0E1330] flex items-center gap-2">
            <Check className="w-5 h-5 text-[#0F9D6B] shrink-0" />
            <p className="text-xs font-heading font-bold text-[#0E1330]">
              Based on your preferences, here are your top fragrance matches:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(recommendedProducts.length > 0 ? recommendedProducts : MOCK_PRODUCTS.slice(0, 3)).map((prod) => (
              <div
                key={prod.id}
                className="bg-[#F7F8FC] p-3 rounded-xl border-2 border-[#0E1330] flex flex-col justify-between"
              >
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={prod.image}
                    alt={prod.title}
                    className="w-12 h-12 rounded-lg object-cover border border-[#0E1330]"
                  />
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-heading font-bold text-[#0E1330] truncate">
                      {prod.title}
                    </h5>
                    <span className="text-xs font-sans font-extrabold text-[#0E1330]">
                      {formatBDT(prod.price)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onAddToCart && onAddToCart(prod)}
                  className="w-full py-2 bg-[#2436F5] text-[#FFFFFF] border-2 border-[#0E1330] font-heading font-bold text-[11px] uppercase rounded-full flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#FFFFFF]" />
                  <span>Add to cart</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
