import ContactForm from '@/components/ContactForm';
import ContactInfo from '@/components/ContactInfo';

export default function ContactPage() {
  const storeName = process.env.NEXT_PUBLIC_SITE_NAME || 'Ebaaz';
  
  return (
    <div className="min-h-screen bg-white text-stone-900 font-sans selection:bg-orange-500/30">
      <div className="container mx-auto px-4 py-20 lg:py-16">
        {/* Header */}
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-orange-50 px-3 py-1 rounded-full border border-orange-100 mb-4">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-xs uppercase tracking-widest text-orange-600 font-bold">Get in Touch</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-4 leading-tight">
            Let's Connect
          </h1>
          <p className="text-lg text-stone-500 font-light max-w-2xl mx-auto leading-relaxed">
            Have questions about our premium desktops, laptops, peripherals, printers, monitors, networking products, and mobile accessories? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-1">
            <ContactInfo />
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>

     
      </div>
    </div>
  );
}