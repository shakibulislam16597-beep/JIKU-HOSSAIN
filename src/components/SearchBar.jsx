import React, { useState, useEffect, useRef } from 'react';
import { Search, Camera, X, History, Trash2, ArrowRight, Tag, Star, AlertCircle } from 'lucide-react';
import { MOCK_PRODUCTS, INITIAL_RECENT_SEARCHES } from '../data/products';
import { formatBDT } from '../utils/currency';

/**
 * SearchBar Component - ATOR ALI (Clean White Modern Theme)
 */
export default function SearchBar({ onSearchSubmit, onSelectProduct, autoFocus = false }) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(autoFocus);
  const [recentSearches, setRecentSearches] = useState(INITIAL_RECENT_SEARCHES);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Debounce input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const suggestions = debouncedQuery.length > 0
    ? MOCK_PRODUCTS.filter((prod) =>
        prod.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        prod.category.toLowerCase().includes(debouncedQuery.toLowerCase())
      )
    : [];

  const showRecentSearches = isFocused && query.trim().length === 0;
  const showSuggestions = isFocused && query.trim().length > 0;

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

  const executeSearch = (searchTerm) => {
    if (!searchTerm || !searchTerm.trim()) return;
    const cleanTerm = searchTerm.trim();

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
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto my-2 px-1">
      {/* Search Bar Input Container */}
      <div
        className={`relative flex items-center w-full rounded-2xl border transition-all duration-200 bg-gray-50 ${
          isFocused
            ? 'border-black ring-2 ring-black/10 bg-white shadow-md'
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        {/* Left Search Icon */}
        <div className="pl-4 text-gray-500 flex items-center justify-center">
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
          className="w-full py-3 pl-3 pr-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-hidden font-medium bg-transparent"
        />

        {/* Right Actions */}
        <div className="pr-3 flex items-center gap-1">
          {query.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search input"
              className="p-1 rounded-full text-gray-400 hover:text-black hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setCameraModalOpen(true)}
            aria-label="Search by image camera"
            title="Search by image"
            className="p-1.5 rounded-xl text-gray-600 hover:text-black hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <Camera className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isFocused && (
        <div
          role="listbox"
          aria-label="Search suggestions"
          className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden z-50 animate-in fade-in duration-150 text-gray-900"
        >
          {/* RECENT SEARCHES */}
          {showRecentSearches && (
            <div className="p-3">
              <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                <span className="flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-gray-500" /> Recent Searches
                </span>
                {recentSearches.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setRecentSearches([])}
                    className="text-[11px] text-gray-500 hover:text-black hover:underline cursor-pointer"
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
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-black text-white font-semibold'
                            : 'text-gray-800 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate pr-2">
                          <History className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                          <span className="truncate">{item}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleRemoveRecent(e, idx)}
                          aria-label={`Remove ${item} from recent searches`}
                          className={`p-1 rounded-lg transition-colors ${
                            isSelected ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-200 text-gray-400'
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-4 text-center text-xs text-gray-400">
                  No recent searches
                </div>
              )}
            </div>
          )}

          {/* LIVE SUGGESTIONS */}
          {showSuggestions && (
            <div className="p-3">
              <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center justify-between">
                <span>Matching Products ({suggestions.length})</span>
                {debouncedQuery.length > 0 && query !== debouncedQuery && (
                  <span className="text-[10px] text-gray-500 animate-pulse">Searching...</span>
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
                            ? 'bg-gray-100 ring-1 ring-black'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="relative w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                          <img
                            src={prod.image}
                            alt={prod.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            <span>{prod.category}</span>
                          </div>
                          <div className="text-xs font-bold text-gray-900 truncate">
                            {prod.title}
                          </div>
                          <div className="flex items-center gap-2 text-xs mt-0.5">
                            <span className="font-extrabold text-black">
                              {formatBDT(prod.price)}
                            </span>
                            {prod.oldPrice && (
                              <span className="line-through text-gray-400 text-[11px]">
                                {formatBDT(prod.oldPrice)}
                              </span>
                            )}
                          </div>
                        </div>

                        <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-6 text-center px-4">
                  <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-800">
                    No matching products found
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Try searching for "Oud", "Musk", or "Attar"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Camera Search Modal */}
      {cameraModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center border border-gray-100 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setCameraModalOpen(false)}
              className="absolute top-3 right-3 p-1.5 rounded-full text-gray-400 hover:text-black hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-black mx-auto mb-4 border border-gray-200">
              <Camera className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Visual Scent Search
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Take or upload a photo of any perfume bottle to instantly find matching products in ATOR ALI store.
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setCameraModalOpen(false);
                  executeSearch('Oud');
                }}
                className="w-full py-2.5 px-4 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors cursor-pointer uppercase"
              >
                Upload Photo Sample
              </button>
              <button
                type="button"
                onClick={() => setCameraModalOpen(false)}
                className="w-full py-2.5 px-4 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
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
