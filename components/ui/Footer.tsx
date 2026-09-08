'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { settingsAPI } from '@/lib/settings-api';
import { PublicSettings } from '@/types/settings';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaYoutube, 
  FaLinkedinIn,
  FaPhone,
  FaEnvelope,
  FaClock
} from 'react-icons/fa';

export default function Footer() {
  const [settings, setSettings] = useState<PublicSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ R2 Static URL
  const STATIC_URL = `${process.env.NEXT_PUBLIC_STATIC_URL}`;

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await settingsAPI.getPublicSettings();
        if (response.success) {
          setSettings(response.data as PublicSettings);
        } else {
          setError(response.message || 'Failed to load settings');
        }
      } catch (err) {
        setError('An error occurred while fetching settings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  if (loading) {
    return (
      <footer className="bg-[#FBF7F1] border-t border-[#D4AF37]/30 py-12">
        <div className="container mx-auto px-4 text-center text-[#3F3A32]">
          Loading footer...
        </div>
      </footer>
    );
  }

  if (error || !settings) {
    return (
      <footer className="bg-[#FBF7F1] border-t border-[#D4AF37]/30 py-12">
        <div className="container mx-auto px-4 text-center text-[#3F3A32]">
          {error || 'Failed to load footer data'}
        </div>
      </footer>
    );
  }

  const defaultCustomerServiceLinks = [
    { name: 'Shipping Info', url: '/shipping' },
    { name: 'Returns', url: '/returns' },
    { name: 'Privacy Policy', url: '/privacy' },
    { name: 'Terms of Service', url: '/terms' }
  ];

  const customerServiceLinks = settings.footerLinks && settings.footerLinks.length > 0 
    ? settings.footerLinks 
    : defaultCustomerServiceLinks;

  const socialLinks = [
    { url: settings.facebookUrl, icon: FaFacebookF, label: 'Facebook' },
    { url: settings.twitterUrl, icon: FaTwitter, label: 'Twitter' },
    { url: settings.instagramUrl, icon: FaInstagram, label: 'Instagram' },
    { url: settings.youtubeUrl, icon: FaYoutube, label: 'YouTube' },
    { url: settings.linkedinUrl, icon: FaLinkedinIn, label: 'LinkedIn' }
  ].filter(social => social.url);

  return (
    <footer className="bg-[#FBF7F1] border-t border-[#D4AF37]/30 font-['Gelasio']">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          
          {/* Company Info */}
          <div>
            <Link href="/" className="group relative flex items-center gap-1.5 sm:gap-3 py-1 cursor-pointer mb-4">
              <div className="relative w-20 h-10 sm:w-12 sm:h-12 md:w-44 md:h-24 overflow-hidden transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={`${STATIC_URL}/logo.webp`}
                  alt={settings.siteName}
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </Link>
            
            <p className="text-[#3F3A32] mb-4 text-sm sm:text-base leading-relaxed">
              {settings.siteDescription || 'Your trusted shopping destination for quality products at competitive prices.'}
            </p>
            
            {settings.gstinNumber && (
              <div className="bg-white rounded-lg p-3 border border-[#D4AF37]/30">
                <div className="flex items-center">
                  <svg 
                    className="w-5 h-5 mr-2 text-[#B8860B] flex-shrink-0" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                    />
                  </svg>
                  <div>
                    <p className="text-xs font-medium text-[#64748B]">GSTIN</p>
                    <p className="text-sm font-mono tracking-wider text-[#0F172A]">
                      {settings.gstinNumber}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[#0F172A] border-b-2 border-[#B8860B] pb-2 inline-block">
              Quick Links
            </h3>
            <ul className="space-y-2 text-[#3F3A32]">
              {["Home", "Products", "About", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`}
                    className="hover:text-[#B8860B] transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full mr-2 group-hover:bg-[#B8860B] transition-colors"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[#0F172A] border-b-2 border-[#B8860B] pb-2 inline-block">
              Customer Service
            </h3>
            <ul className="space-y-2 text-[#3F3A32]">
              {customerServiceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.url}
                    className="hover:text-[#B8860B] transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full mr-2 group-hover:bg-[#B8860B] transition-colors"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[#0F172A] border-b-2 border-[#B8860B] pb-2 inline-block">
              Contact Us
            </h3>
            <ul className="space-y-3 text-[#3F3A32]">
              {settings.contactEmail && (
                <li className="flex items-start">
                  <FaEnvelope className="w-4 h-4 mr-3 text-[#B8860B] flex-shrink-0 mt-0.5" />
                  <span className="text-sm break-all">{settings.contactEmail}</span>
                </li>
              )}
              {settings.contactNumber && (
                <li className="flex items-center">
                  <FaPhone className="w-4 h-4 mr-3 text-[#B8860B] flex-shrink-0" />
                  <span className="text-sm">{settings.contactNumber}</span>
                </li>
              )}
              <li className="flex items-center">
                <FaClock className="w-4 h-4 mr-3 text-[#B8860B] flex-shrink-0" />
                <span className="text-sm">Mon–Sun · 9AM–7PM</span>
              </li>
            </ul>

            {socialLinks.length > 0 && (
              <div className="mt-6 flex space-x-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-white border border-[#D4AF37]/30 text-[#B8860B] hover:bg-[#B8860B] hover:text-white rounded-full flex items-center justify-center transition-all duration-300 hover:shadow-md hover:shadow-[#D4AF37]/20"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-[#D4AF37]/30 pt-1 sm:pt-4 pb-15 sm:pb-4"> 
          <div className="flex flex-col md:flex-row justify-center items-center text-center text-sm text-[#64748B]"> 
            <p className="text-xs sm:text-sm"> © {new Date().getFullYear()} {settings.siteName}. All rights reserved. </p> 
          </div> 
        </div>
      </div>
    </footer>
  );
}