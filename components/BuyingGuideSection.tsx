import { FileText, Scale, ShoppingCart, Headphones } from 'lucide-react';

export default function BuyingGuideSection() {
  const steps = [
    {
      step: "1",
      icon: <FileText className="w-5 h-5 xs:w-5 sm:w-6 text-orange-500" />,
      title: "Identify Your Need",
      description: "Know your purpose, usage volume, and must-have features before you start.",
    },
    {
      step: "2",
      icon: <Scale className="w-5 h-5 xs:w-5 sm:w-6 text-orange-500" />,
      title: "Compare & Shortlist",
      description: "Compare models, features, and prices to shortlist the best options.",
    },
    {
      step: "3",
      icon: <ShoppingCart className="w-5 h-5 xs:w-5 sm:w-6 text-orange-500" />,
      title: "Choose & Buy",
      description: "Pick the right product and place your order with confidence.",
    },
    {
      step: "4",
      icon: <Headphones className="w-5 h-5 xs:w-5 sm:w-6 text-orange-500" />,
      title: "Setup & Support",
      description: "Get fast delivery, easy setup, and expert support whenever you need.",
    },
  ];

  return (
    <section className="w-full bg-white py-6 xs:py-8 sm:py-8 md:py-10 lg:py-12 px-3 xs:px-4 sm:px-6 lg:px-8 flex justify-center items-center min-h-[300px]">
      <div className="max-w-7xl w-full flex flex-col items-center">
        
        {/* Section Header */}
        <div className="text-center mb-5 xs:mb-6 sm:mb-7 md:mb-8">
          <span className="text-orange-500 font-semibold tracking-widest text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs uppercase mb-1.5 xs:mb-2 block">
            — BUYING GUIDE —
          </span>
          <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 xs:mb-1.5 sm:mb-2">
            Find the <span className="text-orange-500">Right Product</span> for Your Needs
          </h2>
          <p className="text-gray-600 text-[10px] xs:text-[11px] sm:text-xs md:text-sm max-w-lg mx-auto leading-relaxed px-2">
            Not sure which product is right for you? Follow our simple guide to choose the perfect one.
          </p>
        </div>

        {/* Steps Grid - 2 columns on mobile, 2 on tablet, 4 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-2.5 sm:gap-3 md:gap-4 w-full">
          {steps.map((item, index) => (
            <div 
              key={index} 
              className="bg-gray-50 border border-gray-200 rounded-lg xs:rounded-xl p-3 xs:p-3.5 sm:p-4 md:p-5 flex flex-col items-center text-center relative group hover:border-orange-400 hover:shadow-md transition-all"
            >
              {/* Icon */}
              <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 rounded-lg xs:rounded-xl bg-white border border-gray-200 flex items-center justify-center mb-2 xs:mb-3 sm:mb-4 group-hover:border-orange-300 transition-colors">
                {item.icon}
              </div>

              {/* Title & Description */}
              <h3 className="text-gray-900 font-semibold text-[9px] xs:text-[10px] sm:text-xs md:text-sm mb-0.5 xs:mb-1">
                {item.title}
              </h3>
              <p className="text-gray-600 text-[7px] xs:text-[7.5px] sm:text-[8px] md:text-xs leading-relaxed line-clamp-2 xs:line-clamp-2 sm:line-clamp-3 md:line-clamp-none">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}