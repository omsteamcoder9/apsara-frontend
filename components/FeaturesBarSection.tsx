import { Lock, Truck, ShieldCheck, Headphones } from 'lucide-react';

export default function FeaturesBarSection() {
  const features = [
    {
      icon: <Lock className="w-3.5 h-3.5 xs:w-4 sm:w-5 text-orange-500" />,
      title: "Secure Payments",
      description: "100% secure",
    },
    {
      icon: <Truck className="w-3.5 h-3.5 xs:w-4 sm:w-5 text-orange-500" />,
      title: "Fast Delivery",
      description: "Quick & reliable",
    },
    {
      icon: <ShieldCheck className="w-3.5 h-3.5 xs:w-4 sm:w-5 text-orange-500" />,
      title: "Genuine Products",
      description: "Original items",
    },
    {
      icon: <Headphones className="w-3.5 h-3.5 xs:w-4 sm:w-5 text-orange-500" />,
      title: "24/7 Support",
      description: "Here to help",
    },
  ];

  return (
    <section className="w-full bg-[#0d0d0d] py-4 xs:py-5 sm:py-6 md:py-7 lg:py-8 px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 flex justify-center items-center">
      <div className="max-w-7xl w-full bg-[#121212] border border-neutral-800 rounded-lg xs:rounded-xl sm:rounded-2xl p-2 xs:p-2.5 sm:p-3 md:p-4 lg:p-6 shadow-xl">
        <div className="grid grid-cols-4 gap-1 xs:gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 items-center">
          {features.map((item, index) => (
            <div 
              key={index}
              className="flex flex-col items-center text-center space-y-0.5 xs:space-y-1 sm:space-y-1.5"
            >
              <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-lg xs:rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
                {item.icon}
              </div>
              <div className="flex flex-col items-center">
                <h4 className="text-white font-semibold text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm leading-tight truncate max-w-full">
                  {item.title}
                </h4>
                <p className="text-neutral-400 text-[5px] xs:text-[6px] sm:text-[7px] md:text-[8px] lg:text-[9px] xl:text-[10px] leading-tight truncate max-w-full">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}