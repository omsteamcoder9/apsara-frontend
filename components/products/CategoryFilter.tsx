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
        <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wider">
          Filter by Category
        </h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Link
          href="/products"
          className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 cursor-pointer ${
            !selectedCategory
              ? 'bg-orange-500 text-white shadow-lg hover:shadow-orange-500/30 hover:bg-orange-600 transform hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-white text-stone-700 hover:bg-orange-50 hover:text-orange-600 border border-stone-200 hover:border-orange-300 shadow-sm hover:shadow-md'
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
                ? 'bg-orange-500 text-white shadow-lg hover:shadow-orange-500/30 hover:bg-orange-600 transform hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-white text-stone-700 hover:bg-orange-50 hover:text-orange-600 border border-stone-200 hover:border-orange-300 shadow-sm hover:shadow-md'
            }`}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
}