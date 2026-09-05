// components/products/ProductFilters.tsx
'use client';

import { useState } from 'react';
import { Category } from '@/types/category';
import { PRICE_RANGES } from '@/lib/productService';

interface ProductFiltersProps {
  categories: Category[];
  filters: {
    category?: string;
    priceRange?: string;
    featured?: boolean;
    sortBy?: string;
    sortOrder?: string;
  };
  onFiltersChange: (filters: {
    category?: string;
    priceRange?: string;
    featured?: boolean;
    sortBy?: string;
    sortOrder?: string;
  }) => void;
}

export default function ProductFilters({ categories, filters, onFiltersChange }: ProductFiltersProps) {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const handleFilterChange = (key: keyof typeof filters, value: string | boolean) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      category: '',
      priceRange: '',
      featured: false,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  // Count active filters
  const activeFilterCount = [
    filters.category ? 1 : 0,
    filters.priceRange ? 1 : 0,
    filters.featured ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsMobileFiltersOpen(true)}
          className="w-full py-3 bg-orange-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-orange-500/30 hover:bg-orange-600 transition-all duration-200 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-white text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Filter Overlay */}
      {isMobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-stone-900">Filters</h2>
              </div>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-6">
              {/* Categories */}
              <div>
                <h3 className="font-semibold text-stone-900 mb-3 text-sm">Categories</h3>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      checked={!filters.category}
                      onChange={() => handleFilterChange('category', '')}
                      className="text-orange-500 focus:ring-orange-500 focus:ring-2 rounded-full"
                    />
                    <span className="ml-2 text-stone-600 group-hover:text-stone-900 transition-colors">All Categories</span>
                  </label>
                  {categories.map((category) => (
                    <label key={category._id} className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === category._id}
                        onChange={() => handleFilterChange('category', category._id)}
                        className="text-orange-500 focus:ring-orange-500 focus:ring-2 rounded-full"
                      />
                      <span className="ml-2 text-stone-600 group-hover:text-stone-900 transition-colors">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold text-stone-900 mb-3 text-sm">Price Range</h3>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={!filters.priceRange}
                      onChange={() => handleFilterChange('priceRange', '')}
                      className="text-orange-500 focus:ring-orange-500 focus:ring-2 rounded-full"
                    />
                    <span className="ml-2 text-stone-600 group-hover:text-stone-900 transition-colors">All Prices</span>
                  </label>
                  {PRICE_RANGES.map((range) => (
                    <label key={range.value} className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={filters.priceRange === range.value}
                        onChange={() => handleFilterChange('priceRange', range.value)}
                        className="text-orange-500 focus:ring-orange-500 focus:ring-2 rounded-full"
                      />
                      <span className="ml-2 text-stone-600 group-hover:text-stone-900 transition-colors">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Featured */}
              <div>
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.featured || false}
                    onChange={(e) => handleFilterChange('featured', e.target.checked)}
                    className="text-orange-500 focus:ring-orange-500 focus:ring-2 rounded"
                  />
                  <span className="ml-2 text-stone-700 font-medium group-hover:text-stone-900 transition-colors">Featured Products Only</span>
                </label>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearAllFilters}
                className="w-full py-2.5 text-sm text-stone-600 border border-stone-200 rounded-xl hover:bg-orange-500 hover:text-white hover:border-orange-500 hover:shadow-orange-500/30 transition-all duration-200 cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Filters */}
      <div className="hidden lg:block bg-white p-6 rounded-2xl border border-stone-200 sticky top-4 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-stone-900">Filters</h2>
            {activeFilterCount > 0 && (
              <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </div>
          <button
            onClick={clearAllFilters}
            className="text-sm text-stone-500 hover:text-orange-600 transition-colors duration-200 cursor-pointer"
          >
            Clear All
          </button>
        </div>
        <div className="space-y-6">
          {/* Categories */}
          <div>
            <h3 className="font-semibold text-stone-900 mb-3 text-sm">Categories</h3>
            <div className="space-y-2">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name="category"
                  checked={!filters.category}
                  onChange={() => handleFilterChange('category', '')}
                  className="text-orange-500 focus:ring-orange-500 focus:ring-2 rounded-full"
                />
                <span className="ml-2 text-stone-600 group-hover:text-stone-900 transition-colors">All Categories</span>
              </label>
              {categories.map((category) => (
                <label key={category._id} className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === category._id}
                    onChange={() => handleFilterChange('category', category._id)}
                    className="text-orange-500 focus:ring-orange-500 focus:ring-2 rounded-full"
                  />
                  <span className="ml-2 text-stone-600 group-hover:text-stone-900 transition-colors">{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-semibold text-stone-900 mb-3 text-sm">Price Range</h3>
            <div className="space-y-2">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name="priceRange"
                  checked={!filters.priceRange}
                  onChange={() => handleFilterChange('priceRange', '')}
                  className="text-orange-500 focus:ring-orange-500 focus:ring-2 rounded-full"
                />
                <span className="ml-2 text-stone-600 group-hover:text-stone-900 transition-colors">All Prices</span>
              </label>
              {PRICE_RANGES.map((range) => (
                <label key={range.value} className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={filters.priceRange === range.value}
                    onChange={() => handleFilterChange('priceRange', range.value)}
                    className="text-orange-500 focus:ring-orange-500 focus:ring-2 rounded-full"
                  />
                  <span className="ml-2 text-stone-600 group-hover:text-stone-900 transition-colors">{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Featured */}
          <div>
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.featured || false}
                onChange={(e) => handleFilterChange('featured', e.target.checked)}
                className="text-orange-500 focus:ring-orange-500 focus:ring-2 rounded"
              />
              <span className="ml-2 text-stone-700 font-medium group-hover:text-stone-900 transition-colors">Featured Products Only</span>
            </label>
          </div>

          {/* Clear Filters */}
          <button
            onClick={clearAllFilters}
            className="w-full py-2.5 text-sm text-stone-600 border border-stone-200 rounded-xl hover:bg-orange-500 hover:text-white hover:border-orange-500 hover:shadow-orange-500/30 transition-all duration-200 cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </>
  );
}