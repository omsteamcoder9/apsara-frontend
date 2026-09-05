'use client';

import { useState, useEffect } from 'react';
import { PhoneCall } from 'lucide-react';
import { settingsAPI } from '@/lib/settings-api';

export default function CallUsBannerSection() {
  const [callNumber, setCallNumber] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const contactInfo = await settingsAPI.getContactInfo();
        setCallNumber(contactInfo.callNumber || '+1800123456');
      } catch (error) {
        console.error('Error fetching contact info:', error);
        // Fallback to default number
        setCallNumber('+1800123456');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  // Clean phone number for href (remove spaces, dashes, parentheses)
  const cleanPhoneNumber = (number: string) => {
    if (!number) return '+1800123456';
    // Remove all non-digit characters except '+'
    return number.replace(/[^\d+]/g, '');
  };

  const cleanNumber = cleanPhoneNumber(callNumber);

  return (
    <section className="w-full bg-[#0d0d0d] py-8 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      <div className="max-w-7xl w-full bg-[#121212] border border-neutral-800 rounded-2xl px-6 py-5 sm:px-8 sm:py-6 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl relative overflow-hidden">
        
        {/* Ambient Glow */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Left Side: Text Info */}
        <div className="flex flex-col space-y-1 text-center md:text-left relative z-10">
          <span className="text-orange-500 font-semibold tracking-widest text-[11px] uppercase">
            NEED ASSISTANCE?
          </span>
          <h3 className="text-white font-bold text-lg sm:text-xl">
            Have questions or need help? Call our support team
          </h3>
          <p className="text-neutral-400 text-xs">
            Our printing specialists are available 24/7 to assist you with your orders and queries.
          </p>
        </div>

        {/* Right Side: Call Button */}
        <div className="relative z-10 flex-shrink-0">
          <a
            href={`tel:${cleanNumber}`}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl text-xs sm:text-sm flex items-center space-x-2.5 shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-colors"
          >
            <PhoneCall className="w-4 h-4" />
            <span>
              {isLoading ? 'Loading...' : 'Contact Now'}
            </span>
          </a>
        </div>

      </div>
    </section>
  );
}