// app/about/page.tsx
import Image from 'next/image';
import Link from 'next/link';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  image: string;
}

const AboutPage: React.FC = () => {
  const storeName = process.env.NEXT_PUBLIC_SITE_NAME || 'Ebaaz';

  // ✅ R2 Static URL for images
const STATIC_URL = `${process.env.NEXT_PUBLIC_STATIC_URL}`;

  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'Ebaaz Team',
      role: 'Founders',
      bio: `Our team has over 15 years of experience in the electronics and technology industry and founded ${storeName} with a vision to bring premium desktops, laptops, peripherals, printers, monitors, networking products, and mobile accessories to tech enthusiasts who demand quality and performance.`,
      image: `${STATIC_URL}/images/m1.webp`
    },
    {
      id: 2,
      name: 'Product Sourcing Experts',
      role: 'Sourcing Specialists',
      bio: `Our sourcing experts work directly with leading manufacturers and authorized distributors across the globe to bring you the finest electronics - from high-performance desktops and gaming laptops to mechanical keyboards, printers, monitors, networking equipment, and premium mobile accessories.`,
      image: `${STATIC_URL}/images/m1.webp`
    },
    {
      id: 3,
      name: 'Quality & Testing Team',
      role: 'Product Excellence',
      bio: 'Our quality team ensures every desktop, laptop, peripheral, printer, monitor, networking device, and mobile accessory meets the highest standards of performance, durability, and reliability. We rigorously test each product to guarantee you get the best value for your money with cutting-edge technology.',
      image: `${STATIC_URL}/images/m1.webp`
    }
  ];

  const stats = [
    { number: '15+', label: 'Years Experience' },
    { number: '500+', label: 'Product Varieties' },
    { number: '50k+', label: 'Happy Customers' },
    { number: '100%', label: 'Quality Assured' }
  ];

  return (
    <div className="min-h-screen bg-white text-stone-900 font-sans selection:bg-orange-500/30 overflow-x-hidden">
      {/* Hero Section */}
      <section className="bg-white py-20 lg:py-18 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Text Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                <span className="text-xs uppercase tracking-widest text-orange-600 font-bold">About {storeName}</span>
              </div>

              <h2 className="text-3xl md:text-5xl font-serif text-stone-900 leading-tight">
                Empowering your digital world with <span className="text-orange-600 italic">uncompromising quality.</span>
              </h2>

              <p className="text-stone-600 text-lg font-light leading-relaxed">
                At <strong className="font-semibold text-stone-800">{storeName}</strong>, we curate the pinnacle of modern technology. From high-performance rigs and sleek laptops to essential peripherals and robust networking gear, we bridge the gap between innovation and everyday performance.
              </p>

              {/* Feature Highlights Grid */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-100">
                <div>
                  <h4 className="font-semibold text-stone-900 text-base">Verified Tech</h4>
                  <p className="text-sm text-stone-500 font-light">Sourced directly from industry-leading brands.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-stone-900 text-base">Expert Support</h4>
                  <p className="text-sm text-stone-500 font-light">Tech enthusiasts ready to guide your setup.</p>
                </div>
              </div>
            </div>

            {/* Right Column: Visual / Highlight Card */}
            <div className="lg:col-span-5">
              <div className="relative lg:h-[300px] flex items-center">
                <div className="absolute -inset-4 bg-gradient-to-tr from-orange-100 to-stone-100 rounded-3xl transform -rotate-2 -z-10"></div>
                <div className="w-full bg-stone-900 text-white p-6 lg:p-8 rounded-2xl shadow-xl flex flex-col justify-between lg:h-full">
                  <div className="space-y-3">
                    <h3 className="text-lg font-serif text-orange-400">The {storeName} Standard</h3>
                    <p className="text-stone-300 text-xs lg:text-sm font-light leading-relaxed">
                      Whether you are upgrading your workstation or building a custom battle station, we deliver the hardware that keeps you ahead.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-[11px] tracking-wider uppercase text-stone-400">
                    <span>Desktops</span>
                    <span>•</span>
                    <span>Laptops</span>
                    <span>•</span>
                    <span>Peripherals</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" className="py-24 lg:py-30 bg-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-6 relative h-[450px] sm:h-[550px] rounded-[2rem] overflow-hidden shadow-xl bg-stone-200">
              <Image
                src={`${STATIC_URL}/images/laptop.webp`}
                alt="Philosophy"
                fill
                className="object-cover"
              />
            </div>

            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">Our Mission & Values</span>
                <h2 className="text-4xl sm:text-5xl font-serif text-stone-900 leading-tight">
                  Powering Your Digital Life with Excellence.
                </h2>
                <div className="w-16 h-1 bg-orange-500 rounded-full" />
              </div>

              <div className="space-y-6 text-stone-600 font-light text-base sm:text-lg leading-relaxed">
                <p>
                  Our mission is to make premium technology and electronics accessible to every individual. We believe in the power of innovation to enhance productivity, entertainment, and connectivity in everyday life.
                </p>
                <p>
                  We partner with leading brands and authorized distributors to bring you an extensive range of high-performance desktops, laptops, peripherals, printers, monitors, networking products, and mobile accessories - all tested for quality and reliability to ensure you get the best technology at competitive prices.
                </p>
              </div>

              <div className="p-6 bg-white border-l-4 border-orange-500 rounded-r-2xl shadow-sm border-stone-200">
                <p className="font-serif italic text-lg text-stone-800">
                  &ldquo;Innovation meets reliability - empowering your tech journey with premium electronics.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 lg:py-36 bg-white border-b border-stone-200" aria-label="Our Team">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-[0.3em] font-bold text-orange-500">The Experts</span>
              <h2 className="text-4xl sm:text-5xl font-serif text-stone-900">Meet The Team</h2>
            </div>
            <p className="text-stone-500 font-light max-w-sm">
              The passionate professionals behind {storeName} delivering uncompromising standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="group bg-stone-50 p-8 rounded-[2rem] border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-500 hover:border-orange-500/40 flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-stone-200 shadow-md">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em]">{member.role}</span>
                    <h3 className="text-2xl font-serif text-stone-900">{member.name}</h3>
                  </div>

                  <p className="text-sm text-stone-600 font-light leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-stone-200 flex justify-between items-center text-xs text-stone-400">
                  <span className="uppercase tracking-widest font-semibold">{storeName}</span>
                  <span className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs group-hover:bg-orange-600 transition-colors">✦</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-1">
                <p className="text-4xl font-serif text-stone-900">{stat.number}</p>
                <p className="text-sm text-stone-500 font-light uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-orange-500 text-center">
        <div className="max-w-3xl mx-auto px-6 space-y-6">
          <h2 className="text-3xl font-serif text-white">Ready to Upgrade Your Tech?</h2>
          <p className="text-orange-100 font-light">Discover our full range of premium desktops, laptops, peripherals, printers, monitors, networking products, and mobile accessories today.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="bg-white text-black px-8 py-3 rounded-full font-bold uppercase tracking-wider text-xs hover:bg-orange-50 transition-all shadow-md hover:shadow-white/30"
            >
              Shop Now
            </Link>
            <Link
              href="/contact"
              className="bg-white text-black px-8 py-3 rounded-full font-bold uppercase tracking-wider text-xs hover:bg-orange-50 transition-all shadow-md hover:shadow-white/30"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;