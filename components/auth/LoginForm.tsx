'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth(); // Use AuthContext login

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Use AuthContext login method
      await login({ email, password });
      
      // If login successful, redirect to profile
      router.push('/profile');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-[#FBF7F1] rounded-2xl shadow-sm border border-[#D4AF37]/20 p-8 hover:shadow-md transition-shadow duration-200">
          {/* Header */}
          <div className="text-center mb-8">

            <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Welcome Back</h1>
            <p className="text-[#64748B]">Sign in to your account</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-[#0F172A] mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-[#D4AF37]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all duration-200 bg-white hover:bg-white text-[#0F172A] placeholder-[#64748B]"
                placeholder="Enter your email"
                required
                suppressHydrationWarning
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-[#0F172A] mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-[#D4AF37]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all duration-200 bg-white hover:bg-white text-[#0F172A] placeholder-[#64748B]"
                placeholder="Enter your password"
                required
                suppressHydrationWarning
              />
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full gold-gradient gold-gradient-hover text-white py-3 rounded-xl transition-all duration-200 font-medium shadow-lg shadow-[#D4AF37]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] hover:-translate-y-0.5"
              suppressHydrationWarning
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#64748B]">
              Don't have an account?{' '}
              <Link href="/signup" className="text-[#B8860B] hover:text-[#0F172A] font-semibold transition-colors duration-200">
                Create an account
              </Link>
            </p>
          </div>

          {/* Additional Links */}
          <div className="mt-6 pt-6 border-t border-[#D4AF37]/20">
            <div className="text-center">
              <Link 
                href="/forgot-password" 
                className="text-sm text-[#64748B] hover:text-[#B8860B] transition-colors duration-200"
              >
                Forgot your password?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}