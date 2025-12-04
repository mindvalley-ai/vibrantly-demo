'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      router.push(data.redirectTo || '/onboarding');
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f05] via-[#141e0a] to-[#1a2410] flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#c4dd00]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#84cc16]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-[#181d26]/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-[#2a3441]">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#c4dd00] to-[#84cc16] rounded-2xl mb-4 shadow-lg shadow-[#c4dd00]/20">
                <span className="text-3xl">🌟</span>
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-white">Create Account</h1>
            <p className="text-[#9ca3af] mt-2">Start your health optimization journey</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          {/* Register form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-[#e5e7eb] mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#232d14]/50 border-2 border-[#2a3441] rounded-xl focus:border-[#c4dd00] focus:outline-none transition-colors text-white placeholder-[#6b7280]"
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-[#e5e7eb] mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#232d14]/50 border-2 border-[#2a3441] rounded-xl focus:border-[#c4dd00] focus:outline-none transition-colors text-white placeholder-[#6b7280]"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#e5e7eb] mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#232d14]/50 border-2 border-[#2a3441] rounded-xl focus:border-[#c4dd00] focus:outline-none transition-colors text-white placeholder-[#6b7280]"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[#e5e7eb] mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#232d14]/50 border-2 border-[#2a3441] rounded-xl focus:border-[#c4dd00] focus:outline-none transition-colors text-white placeholder-[#6b7280]"
                placeholder="Min. 8 characters"
                required
                minLength={8}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#e5e7eb] mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#232d14]/50 border-2 border-[#2a3441] rounded-xl focus:border-[#c4dd00] focus:outline-none transition-colors text-white placeholder-[#6b7280]"
                placeholder="Confirm your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#c4dd00] to-[#84cc16] text-[#0a0f05] font-bold rounded-full hover:shadow-lg hover:shadow-[#c4dd00]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Terms */}
          <p className="text-center text-[#6b7280] text-xs mt-6">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-[#c4dd00] hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-[#c4dd00] hover:underline">Privacy Policy</a>
          </p>
        </div>

        <p className="text-center text-[#9ca3af] text-sm mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[#c4dd00] font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

