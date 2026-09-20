import React from 'react';
import { X, Filter, RotateCcw, Check } from 'lucide-react';
import { formatBDT } from '../utils/currency';

/**
 * FilterSheet Component - Extrovat Lifestyle
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
        className="fixed inset-0 bg-[#0E1330]/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet Container */}
      <div className="relative w-full max-w-lg bg-[#FFFFFF] rounded-t-[24px] sm:rounded-[24px] p-5 border-2 border-[#0E1330] shadow-[4px_4px_0px_#0E1330] z-10 text-[#0E1330] animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#0E1330] mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#2436F5]" />
            <h3 className="text-base sm:text-lg font-heading font-extrabold text-[#0E1330]">
              Filter & sort products
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onClearAllFilters}
                className="inline-flex items-center gap-1 text-xs font-heading font-bold text-rose-600 hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Clear all
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close filter sheet"
              className="p-1.5 rounded-xl border-2 border-[#0E1330] bg-[#FFFFFF] text-[#0E1330] hover:bg-[#F7F8FC] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-5 font-sans">
          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-1.5 bg-[#F7F8FC] p-2.5 rounded-xl border-2 border-[#0E1330]">
              <span className="text-[10px] font-heading font-bold text-[#5B6079] uppercase">Active:</span>
              {selectedCategories.map((cat) => (
                <span
                  key={cat}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0E1330] text-[#FFFFFF] text-[10px] font-heading font-bold"
                >
                  {cat}
                  <button
                    type="button"
                    onClick={() => onToggleCategory(cat)}
                    className="hover:text-[#FFC933] cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
              {priceRange < maxPrice && (
                <span className="px-2 py-0.5 rounded-full bg-[#0E1330] text-[#FFFFFF] text-[10px] font-heading font-bold">
                  Max: {formatBDT(priceRange)}
                </span>
              )}
              {sortBy !== 'popular' && (
                <span className="px-2 py-0.5 rounded-full bg-[#0E1330] text-[#FFFFFF] text-[10px] font-heading font-bold">
                  Sort: {sortOptions.find((s) => s.id === sortBy)?.label}
                </span>
              )}
            </div>
          )}

          {/* Price Range Slider */}
          <div className="space-y-2 bg-[#F7F8FC] p-4 rounded-2xl border-2 border-[#0E1330]">
            <div className="flex justify-between items-center text-xs font-heading font-bold text-[#0E1330]">
              <span>Price range</span>
              <span className="text-[#0E1330] font-extrabold">{formatBDT(priceRange)}</span>
            </div>

            <input
              type="range"
              min={0}
              max={maxPrice}
              step={250}
              value={priceRange}
              onChange={(e) => onChangePriceRange(Number(e.target.value))}
              className="w-full accent-[#2436F5] cursor-pointer"
            />

            <div className="flex justify-between items-center text-[10px] text-[#5B6079] font-semibold">
              <span>৳0</span>
              <span>{formatBDT(maxPrice)}</span>
            </div>
          </div>

          {/* Categories Checkboxes */}
          <div className="space-y-2">
            <h4 className="text-xs font-heading font-bold text-[#0E1330] uppercase tracking-wider">
              Categories
            </h4>
            <div className="grid grid-cols-2 gap-1.5">
              {categories.map((cat) => {
                const isSelected = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => onToggleCategory(cat)}
                    className={`flex items-center justify-between py-2 px-3 rounded-xl border-2 text-xs font-heading font-bold transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#0E1330] text-[#FFFFFF] border-[#0E1330]'
                        : 'bg-[#FFFFFF] text-[#0E1330] border-[#0E1330] hover:bg-[#F7F8FC]'
                    }`}
                  >
                    <span>{cat}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#FFC933]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort Options */}
          <div className="space-y-2">
            <h4 className="text-xs font-heading font-bold text-[#0E1330] uppercase tracking-wider">
              Sort by
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {sortOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onChangeSortBy(opt.id)}
                  className={`py-2 px-3 rounded-xl border-2 text-xs font-heading font-bold transition-colors text-center cursor-pointer ${
                    sortBy === opt.id
                      ? 'bg-[#2436F5] text-[#FFFFFF] border-[#0E1330]'
                      : 'bg-[#FFFFFF] text-[#0E1330] border-[#0E1330] hover:bg-[#F7F8FC]'
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
            className="w-full py-3 bg-[#0E1330] text-[#FFFFFF] font-heading font-extrabold text-xs uppercase tracking-wider rounded-full border-2 border-[#0E1330] shadow-[2px_2px_0px_#0E1330] transition-colors cursor-pointer"
          >
            Apply filters
          </button>
        </div>
      </div>
    </div>
  );
}
