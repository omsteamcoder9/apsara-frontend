// components/products/SortDropdown.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { SORT_OPTIONS } from '@/lib/productService';

interface SortDropdownProps {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  compact?: boolean;
}

export default function SortDropdown({ sortBy, sortOrder, onSortChange, compact = false }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentSort = SORT_OPTIONS.find(option => {
    const [optionSortBy, optionSortOrder] = option.value.split('-');
    return optionSortBy === sortBy && optionSortOrder === sortOrder;
  }) || SORT_OPTIONS[0];

  const handleSortSelect = (value: string) => {
    const [newSortBy, newSortOrder] = value.split('-') as [string, 'asc' | 'desc'];
    onSortChange(newSortBy, newSortOrder);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 border rounded-xl bg-white text-[#0F172A] hover:border-[#D4AF37] hover:bg-[#FBF7F1] hover:text-[#B8860B] transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${
          compact ? 'text-sm px-3 py-1.5' : ''
        } ${isOpen ? 'border-[#D4AF37] bg-[#FBF7F1] text-[#B8860B]' : 'border-[#D4AF37]/30'}`}
      >
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
        </svg>
        <span className={compact ? 'text-xs' : ''}>
          {compact ? 'Sort' : `Sort by: ${currentSort.label}`}
        </span>
        <svg 
          className={`w-4 h-4 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 min-w-[200px] bg-white border border-[#D4AF37]/30 rounded-xl shadow-lg z-10 py-1">
          {SORT_OPTIONS.map((option) => {
            const isSelected = option.value === `${sortBy}-${sortOrder}`;
            return (
              <button
                key={option.value}
                onClick={() => handleSortSelect(option.value)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-200 cursor-pointer ${
                  isSelected 
                    ? 'gold-gradient text-white' 
                    : 'text-[#0F172A] hover:bg-[#FBF7F1] hover:text-[#B8860B]'
                } ${option.value === SORT_OPTIONS[0].value ? 'rounded-t-xl' : ''} ${option.value === SORT_OPTIONS[SORT_OPTIONS.length - 1].value ? 'rounded-b-xl' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span>{option.label}</span>
                  {isSelected && (
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}