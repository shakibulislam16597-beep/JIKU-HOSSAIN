import React, { useState, useEffect, useRef } from 'react';
import { Search, Camera, X, History, Trash2, ArrowRight, Tag, Star, Sparkles, AlertCircle } from 'lucide-react';
import { MOCK_PRODUCTS, INITIAL_RECENT_SEARCHES } from '../data/products';

/**
 * SearchBar Component
 *
 * Requirements:
 * - Large rounded search bar with:
 *   - Search icon on the left
 *   - Placeholder: "Search for products, brands and more"
 *   - Camera icon on the right (for image search)
 *   - Clear (X) button when text is typed
 * - Live suggestions dropdown while typing (mock data of 8 products)
 * - "Recent searches" list with delete option when bar is focused
 * - Debounce the input by 300ms
 * - Pressing Enter shows search results page placeholder
 * - Keyboard navigation & ARIA compliance
 */
export default function SearchBar({ onSearchSubmit, onSelectProduct }) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState(INITIAL_RECENT_SEARCHES);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Debounce input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [debouncedQuery]);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter live product suggestions
  const suggestions = debouncedQuery.length > 0
    ? MOCK_PRODUCTS.filter((prod) =>
        prod.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        prod.category.toLowerCase().includes(debouncedQuery.toLowerCase())
      )
    : [];

  const showRecentSearches = isFocused && query.trim().length === 0;
  const showSuggestions = isFocused && query.trim().length > 0;

  // Total list items for keyboard navigation index calculation
  const totalItems = showRecentSearches
    ? recentSearches.length
    : showSuggestions
    ? suggestions.length
    : 0;

  const handleClear = () => {
    setQuery('');
    setDebouncedQuery('');
    setSelectedIndex(-1);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleRemoveRecent = (e, indexToRemove) => {
    e.stopPropagation();
    setRecentSearches((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleClearAllRecent = (e) => {
    e.stopPropagation();
    setRecentSearches([]);
  };

  const executeSearch = (searchTerm) => {
    if (!searchTerm || !searchTerm.trim()) return;
    const cleanTerm = searchTerm.trim();

    // Add to recent searches if not already present
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== cleanTerm.toLowerCase());
      return [cleanTerm, ...filtered].slice(0, 6);
    });

    setIsFocused(false);
    if (onSearchSubmit) {
      onSearchSubmit(cleanTerm);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (totalItems > 0) {
        setSelectedIndex((prev) => (prev + 1) % totalItems);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (totalItems > 0) {
        setSelectedIndex((prev) => (prev - 1 + totalItems) % totalItems);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < totalItems) {
        if (showRecentSearches) {
          const selectedTerm = recentSearches[selectedIndex];
          setQuery(selectedTerm);
          executeSearch(selectedTerm);
        } else if (showSuggestions) {
          const selectedProd = suggestions[selectedIndex];
          if (onSelectProduct) {
            onSelectProduct(selectedProd);
            setIsFocused(false);
          } else {
            executeSearch(selectedProd.title);
          }
        }
      } else {
        executeSearch(query);
      }
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto my-3 px-1 sm:px-0">
      {/* Search Input Container */}
      <div
        className={`relative flex items-center w-full bg-slate-100 dark:bg-slate-800/80 rounded-2xl border transition-all duration-200 shadow-xs ${
          isFocused
            ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-white dark:bg-slate-800 shadow-md'
            : 'border-slate-200 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600'
        }`}
      >
        {/* Search Icon (Left) */}
        <div className="pl-4 text-slate-400 dark:text-slate-500 flex items-center justify-center">
          <Search className="w-5 h-5" />
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search for products, brands and more"
          aria-label="Search for products, brands and more"
          aria-expanded={showRecentSearches || showSuggestions}
          aria-autocomplete="list"
          role="combobox"
          className="w-full py-3.5 pl-3 pr-2 text-sm sm:text-base text-slate-900 dark:text-slate-100 bg-transparent placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden font-normal"
        />

        {/* Right Actions: Clear (X) button & Camera Icon */}
        <div className="pr-3 flex items-center gap-1.5">
          {query.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search input"
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setCameraModalOpen(true)}
            aria-label="Search by image camera"
            title="Search by image"
            className="p-2 rounded-xl text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors cursor-pointer"
          >
            <Camera className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Dropdown Menu (Live Suggestions or Recent Searches) */}
      {isFocused && (
        <div
          role="listbox"
          aria-label="Search suggestions"
          className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden z-50 animate-in fade-in-50 slide-in-from-top-2 duration-150"
        >
          {/* RECENT SEARCHES STATE */}
          {showRecentSearches && (
            <div className="p-3">
              <div className="flex items-center justify-between px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <span className="flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" /> Recent Searches
                </span>
                {recentSearches.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllRecent}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {recentSearches.length > 0 ? (
                <div className="mt-1 space-y-0.5">
                  {recentSearches.map((item, idx) => {
                    const isSelected = selectedIndex === idx;
                    return (
                      <div
                        key={idx}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          setQuery(item);
                          executeSearch(item);
                        }}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-medium'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate pr-2">
                          <History className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleRemoveRecent(e, idx)}
                          aria-label={`Remove ${item} from recent searches`}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500">
                  No recent searches
                </div>
              )}
            </div>
          )}

          {/* LIVE SUGGESTIONS STATE */}
          {showSuggestions && (
            <div className="p-3">
              <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
                <span>Products ({suggestions.length})</span>
                {debouncedQuery.length > 0 && query !== debouncedQuery && (
                  <span className="text-[10px] text-indigo-500 animate-pulse">Searching...</span>
                )}
              </div>

              {suggestions.length > 0 ? (
                <div className="mt-1 space-y-1">
                  {suggestions.map((prod, idx) => {
                    const isSelected = selectedIndex === idx;
                    return (
                      <div
                        key={prod.id}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          if (onSelectProduct) {
                            onSelectProduct(prod);
                            setIsFocused(false);
                          } else {
                            executeSearch(prod.title);
                          }
                        }}
                        className={`flex items-center gap-3 p-2 rounded-xl transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 ring-1 ring-indigo-500/30'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800/80'
                        }`}
                      >
                        {/* Product Thumbnail */}
                        <div className="relative w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200/50 dark:border-slate-700">
                          <img
                            src={prod.image}
                            alt={prod.title}
                            className="w-full h-full object-cover object-center"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            <span>{prod.category}</span>
                          </div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {prod.title}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            <span className="font-bold text-slate-900 dark:text-slate-100">
                              ${prod.price.toFixed(2)}
                            </span>
                            <span>•</span>
                            <span className="flex items-center text-amber-500 font-medium">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
                              {prod.rating}
                            </span>
                          </div>
                        </div>

                        <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 pr-1" />
                      </div>
                    );
                  })}

                  {/* Press Enter trigger prompt */}
                  <button
                    type="button"
                    onClick={() => executeSearch(query)}
                    className="w-full mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <span>View all search results for "{query}"</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="py-8 text-center px-4">
                  <AlertCircle className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    No matching products found
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    Try searching for "Oud", "Musk", or "Perfume"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Camera Modal (Mock Image Search UI) */}
      {cameraModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 text-center border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setCameraModalOpen(false)}
              className="absolute top-3 right-3 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-950 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-4">
              <Camera className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Visual Product Search
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Take or upload a picture of any perfume bottle or scent accessory to find matching items in ATOR ALI store.
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setCameraModalOpen(false);
                  setQuery('Oud');
                  executeSearch('Oud');
                }}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer"
              >
                Upload Photo Sample
              </button>
              <button
                type="button"
                onClick={() => setCameraModalOpen(false)}
                className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
