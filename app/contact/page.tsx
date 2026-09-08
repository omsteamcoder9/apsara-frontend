import ContactForm from '@/components/ContactForm';
import ContactInfo from '@/components/ContactInfo';
import { Sparkles, Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  const storeName = process.env.NEXT_PUBLIC_SITE_NAME || 'Apsara'; // Changed from 'Ebaaz' to 'Apsara'
  
  return (
    <div className="min-h-screen bg-white text-[#0F172A] font-sans selection:bg-[#D4AF37] selection:text-white">
      {/* Hero Section with Gradient */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FBF7F1] via-white to-[#FBF7F1] border-b border-[#D4AF37]/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#B8860B]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="container mx-auto px-4 py-16 lg:py-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2.5 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-[#D4AF37]/30 shadow-sm mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-ping"></span>
              <span className="text-xs uppercase tracking-widest text-[#B8860B] font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Get in Touch
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-[#0F172A] mb-4 leading-tight tracking-tight">
              Let's <span className="text-black">Connect</span>
            </h1>
            
            <p className="text-lg text-[#64748B] font-medium max-w-2xl mx-auto leading-relaxed">
              Have questions about our beauty products including skincare, haircare, makeup, nails, and beauty essentials? We'd love to hear from you.
            </p>
            
            {/* Quick Contact Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-3xl mx-auto">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-[#D4AF37]/20 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-2 text-[#B8860B]">
                  <Mail className="w-5 h-5" />
                </div>
                <p className="text-xs font-medium text-[#64748B]">Email Support</p>
                <p className="text-xs font-bold text-[#0F172A] truncate">24/7 Response</p>
              </div>
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-[#D4AF37]/20 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-2 text-[#B8860B]">
                  <Phone className="w-5 h-5" />
                </div>
                <p className="text-xs font-medium text-[#64748B]">Phone Support</p>
                <p className="text-xs font-bold text-[#0F172A]">Mon-Sat, 9AM-7PM</p>
              </div>
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-[#D4AF37]/20 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-2 text-[#B8860B]">
                  <MapPin className="w-5 h-5" />
                </div>
                <p className="text-xs font-medium text-[#64748B]">Store Location</p>
                <p className="text-xs font-bold text-[#0F172A] truncate">Find Us</p>
              </div>
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-[#D4AF37]/20 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-2 text-[#B8860B]">
                  <Clock className="w-5 h-5" />
                </div>
                <p className="text-xs font-medium text-[#64748B]">Response Time</p>
                <p className="text-xs font-bold text-[#0F172A]">Within 24 Hours</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Contact Info - Left Side */}
            <div className="lg:col-span-1">
              <div className="bg-[#FBF7F1] rounded-3xl border border-[#D4AF37]/20 shadow-xl p-6 lg:p-8 sticky top-8">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#D4AF37]/20">
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#B8860B]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold text-[#0F172A]">Contact Information</h2>
                </div>
                <ContactInfo />
              </div>
            </div>

            {/* Contact Form - Right Side */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl border border-[#D4AF37]/20 shadow-xl p-6 lg:p-10">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#D4AF37]/20">
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#B8860B]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#0F172A]">Send us a Message</h2>
                    <p className="text-xs text-[#64748B]">We'll respond within 24 hours</p>
                  </div>
                </div>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}