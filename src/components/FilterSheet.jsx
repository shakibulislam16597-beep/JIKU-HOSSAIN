import React from 'react';
import { X, Filter, RotateCcw, Check } from 'lucide-react';
import { formatBDT } from '../utils/currency';

/**
 * FilterSheet Component - Bottom sheet modal for Filtering & Sorting
 */
export default function FilterSheet({
  isOpen,
  onClose,
  categories = [],
  selectedCategories = [],
  onToggleCategory,
  maxPrice = 20000,
  priceRange = 20000,
  onChangePriceRange,
  sortBy = 'popular',
  onChangeSortBy,
  onClearAllFilters
}) {
  if (!isOpen) return null;

  const sortOptions = [
    { id: 'popular', label: 'Popular' },
    { id: 'price-low-high', label: 'Price: Low to High' },
    { id: 'price-high-low', label: 'Price: High to Low' },
    { id: 'newest', label: 'Newest' }
  ];

  const hasActiveFilters =
    selectedCategories.length > 0 || priceRange < maxPrice || sortBy !== 'popular';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet Container */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl p-5 border border-gray-200 shadow-2xl z-10 text-gray-900 animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-black" />
            <h3 className="text-base sm:text-lg font-bold text-black">
              Filter & Sort Products
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onClearAllFilters}
                className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Clear All
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close filter sheet"
              className="p-1.5 rounded-full text-gray-400 hover:text-black hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-5">
          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-1.5 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
              <span className="text-[10px] font-bold text-gray-500 uppercase">Active:</span>
              {selectedCategories.map((cat) => (
                <span
                  key={cat}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black text-white text-[10px] font-bold"
                >
                  {cat}
                  <button
                    type="button"
                    onClick={() => onToggleCategory(cat)}
                    className="hover:text-gray-300"
                  >
                    ×
                  </button>
                </span>
              ))}
              {priceRange < maxPrice && (
                <span className="px-2 py-0.5 rounded-full bg-black text-white text-[10px] font-bold">
                  Max: {formatBDT(priceRange)}
                </span>
              )}
              {sortBy !== 'popular' && (
                <span className="px-2 py-0.5 rounded-full bg-black text-white text-[10px] font-bold">
                  Sort: {sortOptions.find((s) => s.id === sortBy)?.label}
                </span>
              )}
            </div>
          )}

          {/* Price Range Slider */}
          <div className="space-y-2 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div className="flex justify-between items-center text-xs font-bold text-gray-800">
              <span>Price Range</span>
              <span className="text-black font-extrabold">{formatBDT(priceRange)}</span>
            </div>

            <input
              type="range"
              min={0}
              max={maxPrice}
              step={250}
              value={priceRange}
              onChange={(e) => onChangePriceRange(Number(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />

            <div className="flex justify-between items-center text-[10px] text-gray-400 font-semibold">
              <span>৳ 0</span>
              <span>{formatBDT(maxPrice)}</span>
            </div>
          </div>

          {/* Categories Checkboxes */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Categories
            </h4>
            <div className="space-y-1.5">
              {categories.map((cat) => {
                const isSelected = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => onToggleCategory(cat)}
                    className={`w-full flex items-center justify-between py-2 px-3 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span>{cat}</span>
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort Options */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Sort By
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {sortOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onChangeSortBy(opt.id)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-colors text-center cursor-pointer ${
                    sortBy === opt.id
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-black hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
