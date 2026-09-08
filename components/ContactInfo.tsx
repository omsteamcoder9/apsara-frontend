'use client';
import { useEffect, useState } from 'react';
import { settingsAPI } from '@/lib/settings-api';

export default function ContactInfo() {
  const [contactInfo, setContactInfo] = useState({
    contactNumber: '+91 7200074221',
    whatsappNumber: '+91 7200074221',
    callNumber: '+91 7200074221',
    contactEmail: 'support@soap.com',
    companyAddress: '123 soap Street'
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        setLoading(true);
        const data = await settingsAPI.getContactInfo();
        setContactInfo(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch contact info:', err);
        setError('Failed to load contact information. Using default values.');
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  const contactMethods = [
    {
      title: 'Email',
      details: contactInfo.contactEmail,
      description: 'Send us an email anytime'
    },
    {
      title: 'Phone',
      details: contactInfo.contactNumber,
      description: 'Mon-Fri from 9am to 6pm'
    },
    {
      title: 'Address',
      details: contactInfo.companyAddress,
      description: ''
    }
  ];

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 md:p-8 border border-[#D4AF37]/20">
      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0F172A] mb-4 sm:mb-5 md:mb-6 text-center sm:text-left">
        Contact Information
      </h3>
      
      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        {contactMethods.map((method, index) => (
          <div 
            key={index} 
            className="flex flex-col p-3 sm:p-4 bg-[#FBF7F1] rounded-lg border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 transition-colors duration-200"
          >
            <h4 className="font-semibold text-[#0F172A] text-sm sm:text-base text-left">
              {method.title}
            </h4>
            <p className="text-[#0F172A] font-medium text-xs sm:text-sm text-left break-all sm:break-normal mt-1">
              {method.details}
            </p>
            {method.description && (
              <p className="text-[#64748B] text-[10px] sm:text-xs text-left mt-1">
                {method.description}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 sm:mt-7 md:mt-8 pt-6 sm:pt-7 md:pt-8 border-t border-[#D4AF37]/20">
        <h4 className="font-semibold text-[#0F172A] text-sm sm:text-base md:text-lg mb-3 sm:mb-4 text-center sm:text-left">
          Business Hours
        </h4>
        <div className="space-y-2 sm:space-y-3">
          <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-1 xs:gap-0 p-2 hover:bg-[#FBF7F1] rounded-lg transition-colors">
            <span className="text-xs sm:text-sm text-[#0F172A] text-left xs:text-left">Monday - Friday</span>
            <span className="font-medium text-[#D4AF37] text-xs sm:text-sm text-left xs:text-right">9:00 AM - 6:00 PM</span>
          </div>
          <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-1 xs:gap-0 p-2 hover:bg-[#FBF7F1] rounded-lg transition-colors">
            <span className="text-xs sm:text-sm text-[#0F172A] text-left xs:text-left">Saturday</span>
            <span className="font-medium text-[#D4AF37] text-xs sm:text-sm text-left xs:text-right">10:00 AM - 4:00 PM</span>
          </div>
          <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-1 xs:gap-0 p-2 hover:bg-[#FBF7F1] rounded-lg transition-colors">
            <span className="text-xs sm:text-sm text-[#0F172A] text-left xs:text-left">Sunday</span>
            <span className="font-medium text-red-500 text-xs sm:text-sm text-left xs:text-right">Closed</span>
          </div>
        </div>
      </div>
    </div>
  );
}