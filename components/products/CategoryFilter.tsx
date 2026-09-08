// components/products/CategoryFilter.tsx
'use client';

import { Category } from '@/types/category';
import Link from 'next/link';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory?: string;
}

export default function CategoryFilter({ categories, selectedCategory }: CategoryFilterProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-6 bg-[#D4AF37] rounded-full"></div>
        <h3 className="text-sm font-semibold text-[#0F172A] uppercase tracking-wider">
          Filter by Category
        </h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Link
          href="/products"
          className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 cursor-pointer ${
            !selectedCategory
              ? 'gold-gradient text-white shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/30 transform hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-white text-[#0F172A] hover:bg-[#FBF7F1] hover:text-[#B8860B] border border-[#D4AF37]/30 hover:border-[#D4AF37] shadow-sm hover:shadow-md'
          }`}
        >
          All Products
        </Link>
        
        {categories.map((category) => (
          <Link
            key={category._id}
            href={`/products?category=${category._id}`}
            className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 cursor-pointer ${
              selectedCategory === category._id
                ? 'gold-gradient text-white shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/30 transform hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-white text-[#0F172A] hover:bg-[#FBF7F1] hover:text-[#B8860B] border border-[#D4AF37]/30 hover:border-[#D4AF37] shadow-sm hover:shadow-md'
            }`}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
}