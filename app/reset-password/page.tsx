// app/reset-password/page.tsx

import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

interface PageProps {
  searchParams: Promise<{
    token?: string;
  }>;
}

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const token = params?.token;

  console.log('Server token:', token);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5E9D3]/10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#D4AF37]">Invalid Reset Link</h1>
          <p className="mt-2 text-[#C9B08A]">The reset link is missing or invalid.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#D4AF37]/5 via-[#D4AF37]/5 to-[#D4AF37]/5 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-[#C9B08A]">
            Enter your new password below
          </p>
        </div>
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}