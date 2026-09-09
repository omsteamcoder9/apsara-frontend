'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerUser } from '@/lib/auth-api';

export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGuestUser, setIsGuestUser] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    // Get URL parameters using URLSearchParams
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    const guestParam = urlParams.get('guest');
    
    if (emailParam) {
      setFormData(prev => ({
        ...prev,
        email: decodeURIComponent(emailParam)
      }));
    }
    if (guestParam === 'true') {
      setIsGuestUser(true);
      setShowPasswordFields(true);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Please enter your full name');
      setIsLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError('Please enter your email address');
      setIsLoading(false);
      return;
    }

    if (!formData.password) {
      setError('Please enter a password');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const { name, email, password } = formData;
      const response = await registerUser({ name, email, password });

      if (response.success) {
        const successMessage = isGuestUser 
          ? 'Account created successfully! Please login to view your orders.'
          : 'Account created successfully! Please login.';
        
        router.push(`/login?email=${encodeURIComponent(formData.email)}&message=${encodeURIComponent(successMessage)}`);
      } else {
        setError(response.message || 'Registration failed. Please try again.');
      }
    } catch (err: unknown) {
      let errorMessage = 'Registration failed. Please try again.';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err && typeof err === 'object' && 'message' in err) {
        errorMessage = (err as { message: string }).message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestContinue = () => {
    if (!formData.name.trim()) {
      setError('Please enter your full name to continue');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email address to continue');
      return;
    }
    setShowPasswordFields(true);
  };

  // Show loading state during initial render
  if (!isClient) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-[#FBF7F1] rounded-2xl shadow-sm border border-[#D4AF37]/20 p-6 sm:p-8">
            <div className="text-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#D4AF37] border-t-transparent mx-auto"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-6 w-6 rounded-full bg-[#D4AF37]/20 animate-pulse"></div>
                </div>
              </div>
              <p className="mt-4 text-[#64748B] font-medium">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-[#FBF7F1] rounded-2xl shadow-sm border border-[#D4AF37]/20 p-6 sm:p-8 hover:shadow-md transition-shadow duration-200">
          {/* Header */}
          <div className="text-center mb-8">

            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
              {isGuestUser ? 'Complete Your Account' : 'Create Your Account'}
            </h2>
            <p className="mt-2 text-[#64748B] text-base">
              {isGuestUser ? (
                showPasswordFields 
                  ? 'Set your password to secure your account' 
                  : 'Create an account to view and manage your orders'
              ) : (
                <>
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="font-semibold text-[#B8860B] hover:text-[#0F172A] transition-colors duration-200"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </p>
          </div>
          
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-3 sm:px-4 sm:py-3 rounded-xl flex items-center text-sm sm:text-base">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}
            
            {isGuestUser && !showPasswordFields && (
              <div className="bg-[#FBF7F1] border border-[#D4AF37]/30 text-[#0F172A] px-3 py-3 rounded-xl text-xs sm:text-sm flex items-start">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0 mt-0.5 text-[#B8860B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[#0F172A]">We found your order! Please complete your account setup to view your orders and track future purchases.</p>
              </div>
            )}
            
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#0F172A] mb-2">
                  Full Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-sm sm:text-base border border-[#D4AF37]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all duration-200 bg-white hover:bg-white placeholder-[#64748B] text-[#0F172A]"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#0F172A] mb-2">
                  Email address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-sm sm:text-base border border-[#D4AF37]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all duration-200 bg-white hover:bg-white placeholder-[#64748B] text-[#0F172A] disabled:bg-[#FBF7F1] disabled:text-[#64748B]"
                  placeholder="Enter your email"
                  disabled={isGuestUser}
                />
              </div>
              
              {/* Show password fields only when needed */}
              {(showPasswordFields || !isGuestUser) && (
                <>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-[#0F172A] mb-2">
                      Password *
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-sm sm:text-base border border-[#D4AF37]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all duration-200 bg-white hover:bg-white placeholder-[#64748B] text-[#0F172A]"
                      placeholder="Enter your password (min. 6 characters)"
                      minLength={6}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#0F172A] mb-2">
                      Confirm Password *
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-sm sm:text-base border border-[#D4AF37]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all duration-200 bg-white hover:bg-white placeholder-[#64748B] text-[#0F172A]"
                      placeholder="Confirm your password"
                      minLength={6}
                    />
                  </div>
                </>
              )}
            </div>

            <div>
              {isGuestUser && !showPasswordFields ? (
                <button
                  type="button"
                  onClick={handleGuestContinue}
                  className="w-full gold-gradient gold-gradient-hover text-white py-3 sm:py-4 rounded-xl transition-all duration-200 font-medium shadow-lg shadow-[#D4AF37]/20 text-sm sm:text-base cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] hover:-translate-y-0.5"
                >
                  Continue to Set Password
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full gold-gradient gold-gradient-hover text-white py-3 sm:py-4 rounded-xl transition-all duration-200 font-medium shadow-lg shadow-[#D4AF37]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] hover:-translate-y-0.5"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    isGuestUser ? 'Complete Registration' : 'Create Account'
                  )}
                </button>
              )}
            </div>

            {isGuestUser && showPasswordFields && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowPasswordFields(false)}
                  className="text-xs sm:text-sm text-[#B8860B] hover:text-[#0F172A] font-medium transition-colors duration-200 cursor-pointer"
                >
                  ← Back to basic info
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}