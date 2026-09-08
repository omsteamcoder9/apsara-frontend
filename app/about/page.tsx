// app/about/page.tsx
import Image from 'next/image';
import Link from 'next/link';

interface ValueCard {
  title: string;
  description: string;
  icon: string;
}

const AboutPage: React.FC = () => {
  const storeName = process.env.NEXT_PUBLIC_SITE_NAME || 'Apsara';
  const STATIC_URL = `${process.env.NEXT_PUBLIC_STATIC_URL}`;

  const values: ValueCard[] = [
    {
      title: 'Uncompromised Care',
      description: 'Every formulation is rigorously vetted to ensure clean, skin-loving ingredients free from harsh toxins.',
      icon: '✨'
    },
    {
      title: 'Mindful Sourcing',
      description: 'We partner with ethical growers and certified laboratories dedicated to sustainable, cruelty-free practices.',
      icon: '🌿'
    },
    {
      title: 'Sensory Care',
      description: 'Designed to elevate your everyday rituals into moments of intentional self-care and tactile delight.',
      icon: '💫'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-[#0F172A] font-sans selection:bg-[#D4AF37] selection:text-white overflow-x-hidden">

      {/* Editorial Hero Section */}
      <section className="bg-white py-20 lg:py-18 overflow-hidden border-b border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-[#FBF7F1] px-3 py-1 rounded-full border border-[#D4AF37]/30">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
                <span className="text-xs uppercase tracking-widest text-[#B8860B] font-bold">
                  About {storeName}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-serif text-[#0F172A] leading-tight">
                Where modern science meets{' '}
                <span className="text-[#B8860B] italic">timeless grace.</span>
              </h1>
              
              <p className="text-[#64748B] text-lg font-light leading-relaxed">
                Founded on the belief that beauty is an intimate dialogue with oneself, <strong className="font-semibold text-[#0F172A]">{storeName}</strong> curates uncompromising care for skin, hair, and spirit.
              </p>

              <div className="flex items-center gap-6 pt-4">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center bg-[#B8860B] text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#9A7008] transition-all duration-300 shadow-sm"
                >
                  Explore Collection
                </Link>
                <div className="hidden sm:flex items-center gap-3">
                  <div className="w-12 h-[1px] bg-[#D4AF37]"></div>
                  <span className="text-xs uppercase tracking-widest text-[#B8860B] font-semibold">Est. 2026</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] w-full rounded-[2rem] overflow-hidden shadow-xl bg-stone-200 border border-[#D4AF37]/30">
                <Image
                  src={`${STATIC_URL}/images/laptop.webp`}
                  alt={`${storeName} botanical aesthetic`}
                  fill
                  priority
                  className="object-cover scale-105 hover:scale-100 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Brand Ethos / Manifesto Ticker */}
      <section className="py-16 bg-[#FBF7F1] border-b border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x-0 md:divide-x divide-[#D4AF37]/20">
            <div className="space-y-1 px-4">
              <p className="text-3xl lg:text-4xl font-serif text-[#B8860B]">100%</p>
              <p className="text-xs uppercase tracking-[0.2em] text-[#64748B]">Cruelty Free</p>
            </div>
            <div className="space-y-1 px-4">
              <p className="text-3xl lg:text-4xl font-serif text-[#B8860B]">Pure</p>
              <p className="text-xs uppercase tracking-[0.2em] text-[#64748B]">Botanical Extracts</p>
            </div>
            <div className="space-y-1 px-4">
              <p className="text-3xl lg:text-4xl font-serif text-[#B8860B]">Clean</p>
              <p className="text-xs uppercase tracking-[0.2em] text-[#64748B]">Formulations</p>
            </div>
            <div className="space-y-1 px-4">
              <p className="text-3xl lg:text-4xl font-serif text-[#B8860B]">Global</p>
              <p className="text-xs uppercase tracking-[0.2em] text-[#64748B]">Standards</p>
            </div>
          </div>
        </div>
      </section>

    

      {/* Core Pillars Grid */}
      <section className="py-24 lg:py-30 bg-[#FBF7F1] border-t border-b border-[#D4AF37]/20 mt-5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#B8860B] block">
              The Pillars of Excellence
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#0F172A]">
              What Defines Our Care
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val, idx) => (
              <div 
                key={idx}
                className="bg-white p-10 rounded-[2rem] shadow-sm border border-[#D4AF37]/20 flex flex-col justify-between space-y-6 hover:shadow-xl transition-all duration-500 hover:border-[#D4AF37]/60"
              >
                <div className="space-y-4">
                  <span className="text-3xl block">{val.icon}</span>
                  <h3 className="text-2xl font-serif text-[#0F172A]">{val.title}</h3>
                  <p className="text-sm text-[#64748B] font-light leading-relaxed">
                    {val.description}
                  </p>
                </div>
                <div className="pt-6 border-t border-[#D4AF37]/20 text-[11px] uppercase tracking-widest text-[#B8860B] font-semibold">
                  Standard 0{idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

{/* Immersive CTA Footer Block */}
<section className="py-28 bg-white text-[#0F172A] text-center relative overflow-hidden border-t border-[#D4AF37]/20">
  <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]"></div>
  
  <div className="relative max-w-3xl mx-auto px-6 space-y-8">
    <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#B8860B] block">
      Begin Your Routine
    </span>
    
    <h2 className="text-3xl sm:text-5xl font-serif font-light text-[#0F172A] leading-tight">
      Ready to experience the {storeName} difference?
    </h2>

    <p className="text-[#64748B] font-light max-w-lg mx-auto text-sm lg:text-base">
      Explore our curated selection of skincare, hair care, and daily beauty essentials crafted with care for your unique journey.
    </p>

    <div className="flex flex-wrap justify-center gap-4 pt-4">
      <Link
        href="/products"
        className="bg-[#B8860B] text-white px-9 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#9A7008] transition-all duration-300 shadow-lg"
      >
        Shop All Products
      </Link>

      <Link
        href="/contact"
        className="bg-transparent text-[#0F172A] border border-[#D4AF37]/30 px-9 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:border-[#B8860B] hover:text-[#B8860B] transition-all duration-300"
      >
        Get In Touch
      </Link>
    </div>
  </div>
</section>

    </div>
  );
};

export default AboutPage;