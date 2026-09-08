// app/categories/page.tsx
import { fetchActiveCategories } from '@/lib/categoryService';
import Link from 'next/link';

// Define Category type
interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const categories = await fetchActiveCategories() as Category[];
  const storeName = process.env.NEXT_PUBLIC_SITE_NAME || 'FarmTools Pro';

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section - UPDATED GRADIENT */}
      <section className="bg-gradient-to-r from-[#D4AF37]/10 via-[#B8860B]/10 to-[#D4AF37]/5 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4">
              Tool Categories
            </h1>
            <p className="text-xl text-[#64748B] mb-6">
              Browse our premium collection of farm tool categories. 
              Find the perfect hand sickles, harvesting knives, and coconut scrapers for your needs.
            </p>
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-[#D4AF37]/30">
              <span className="text-sm font-medium text-[#0F172A]">
                {categories.length}+ Categories
              </span>
              <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full"></span>
              <span className="text-sm font-medium text-[#0F172A]">
                100% Durable & Reliable
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid Section */}
      <section className="py-12" aria-label="Tool Categories Grid">
        <div className="container mx-auto px-3">
          {categories.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categories.map((category) => (
                  <Link
                    key={category._id}
                    href={`/products?category=${category.slug || category._id}`}
                    className="group bg-white backdrop-blur-sm rounded-3xl border border-[#D4AF37]/20 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden p-6 text-center hover:border-[#D4AF37]/60"
                    aria-label={`Browse ${category.name} tools`}
                  >
                    <div 
                      className="w-16 h-16 bg-gradient-to-br from-[#D4AF37]/10 via-[#B8860B]/10 to-[#D4AF37]/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                      aria-hidden="true"
                    >
                      <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-[#0F172A] mb-2">
                      {category.name}
                    </h3>
                    <p className="text-[#64748B] text-sm leading-relaxed">
                      {category.description || `Premium quality ${category.name.toLowerCase()} for efficient farming and kitchen use`}
                    </p>
                  </Link>
                ))}
              </div>

              {/* Category Benefits Section - UPDATED */}
              <div className="mt-16 max-w-4xl mx-auto">
                <div className="bg-gradient-to-r from-[#D4AF37]/5 via-[#B8860B]/5 to-[#D4AF37]/5 rounded-2xl p-8 border border-[#D4AF37]/20">
                  <h2 className="text-2xl font-bold text-[#0F172A] mb-6 text-center">
                    Why Shop by Category?
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37]/10 via-[#B8860B]/10 to-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-[#0F172A] mb-2">Premium Selection</h3>
                      <p className="text-sm text-[#64748B]">Find hand-forged tools sourced from the finest craftsmen for exceptional quality</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37]/10 via-[#B8860B]/10 to-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-[#0F172A] mb-2">Easy Navigation</h3>
                      <p className="text-sm text-[#64748B]">Quickly find your favorite farm tools with our organized categories</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37]/10 via-[#B8860B]/10 to-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-[#0F172A] mb-2">100% Durable</h3>
                      <p className="text-sm text-[#64748B]">Every category features tools that are hand-forged with rust-resistant steel</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-[#FBF7F1] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#D4AF37]/20">
                <svg className="w-12 h-12 text-[#D4AF37]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-[#64748B] text-lg">No categories found.</p>
              <Link 
                href="/products" 
                className="inline-block mt-4 gold-gradient text-white px-6 py-2 rounded-lg hover:gold-gradient-hover transition-all duration-200"
              >
                Browse All Products
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}