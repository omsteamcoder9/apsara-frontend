import { fetchActiveCategories } from '@/lib/categoryService';
import { getAllProducts } from '@/lib/productService';
import HeaderClient from './HeaderClient';

interface Category {
  _id: string;
  name: string;
  slug: string;
  createdAt: string;
}

// ✅ Cache categories globally to prevent refetch on every refresh
let cachedCategories: Category[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default async function HeaderWrapper() {
  let categoriesWithProducts: Category[] = [];
  
  // ✅ Check cache first
  const now = Date.now();
  if (cachedCategories && (now - cacheTimestamp) < CACHE_DURATION) {
    return <HeaderClient initialCategories={cachedCategories} />;
  }
  
  try {
    // Fetch all active categories
    const allCategories = await fetchActiveCategories();
    
    // Filter categories that have products (server-side)
    const categoriesWithProductsList: Category[] = [];
    
    for (const category of allCategories) {
      try {
        const response = await getAllProducts({ category: category._id });
        if (response.data && response.data.length > 0) {
          categoriesWithProductsList.push(category);
        }
      } catch (error) {
        console.error(`Error checking products for category ${category.name}:`, error);
        // Include category even if check fails to prevent empty header
        categoriesWithProductsList.push(category);
      }
    }
    
    categoriesWithProducts = categoriesWithProductsList;
    
    // ✅ Update cache
    cachedCategories = categoriesWithProducts;
    cacheTimestamp = now;
    
  } catch (error) {
    console.error('Error loading categories:', error);
  }
  
  return <HeaderClient initialCategories={categoriesWithProducts} />;
}