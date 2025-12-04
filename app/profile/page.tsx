'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  age?: number;
  weight?: number;
  height?: number;
  gender?: 'male' | 'female' | 'other';
  onboardingComplete: boolean;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    weight: '',
    height: '',
    gender: '' as '' | 'male' | 'female' | 'other',
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();

      if (!response.ok) {
        router.push('/login');
        return;
      }

      setUser(data.user);
      setFormData({
        firstName: data.user.firstName || '',
        lastName: data.user.lastName || '',
        age: data.user.age?.toString() || '',
        weight: data.user.weight?.toString() || '',
        height: data.user.height?.toString() || '',
        gender: data.user.gender || '',
      });
    } catch {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          age: formData.age ? parseInt(formData.age) : undefined,
          weight: formData.weight ? parseFloat(formData.weight) : undefined,
          height: formData.height ? parseFloat(formData.height) : undefined,
          gender: formData.gender || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
        return;
      }

      setUser(data.user);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const calculateBMI = () => {
    if (formData.weight && formData.height) {
      const weightKg = parseFloat(formData.weight);
      const heightM = parseFloat(formData.height) / 100;
      return (weightKg / (heightM * heightM)).toFixed(1);
    }
    return null;
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-400' };
    if (bmi < 25) return { label: 'Normal', color: 'text-green-400' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-400' };
    return { label: 'Obese', color: 'text-red-400' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0f05] via-[#141e0a] to-[#1a2410] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#c4dd00]">
          <svg className="animate-spin h-8 w-8" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-xl font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  const bmi = calculateBMI();
  const bmiCategory = bmi ? getBMICategory(parseFloat(bmi)) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f05] via-[#141e0a] to-[#1a2410]">
      {/* Header */}
      <header className="border-b border-[#2a3441]/50 backdrop-blur-sm bg-[#0a0f05]/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#c4dd00] to-[#84cc16] rounded-xl flex items-center justify-center shadow-lg shadow-[#c4dd00]/20">
              <span className="text-xl">🌟</span>
            </div>
            <span className="font-bold text-xl text-white">Vibrantly</span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link href="/dashboard" className="text-[#9ca3af] hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/upload" className="text-[#9ca3af] hover:text-white transition-colors">
              Upload
            </Link>
            <Link href="/profile" className="text-white font-medium">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-[#c4dd00] border border-[#c4dd00]/30 rounded-lg hover:bg-[#c4dd00]/10 transition-colors"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Your Profile</h1>
          <p className="text-[#9ca3af]">
            Manage your personal information and health metrics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-[#181d26]/80 backdrop-blur-sm rounded-3xl p-6 border border-[#2a3441]">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#c4dd00] to-[#84cc16] rounded-3xl flex items-center justify-center text-4xl font-bold text-[#0a0f05] mb-4">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <h2 className="text-xl font-semibold text-white">{user?.firstName} {user?.lastName}</h2>
              <p className="text-[#9ca3af] text-sm mb-4">{user?.email}</p>
              
              <div className="pt-4 border-t border-[#2a3441]">
                <p className="text-[#6b7280] text-xs uppercase mb-1">Member Since</p>
                <p className="text-white">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '-'}</p>
              </div>

              {bmi && (
                <div className="mt-4 pt-4 border-t border-[#2a3441]">
                  <p className="text-[#6b7280] text-xs uppercase mb-1">BMI</p>
                  <p className="text-2xl font-bold text-white">{bmi}</p>
                  <p className={`text-sm ${bmiCategory?.color}`}>{bmiCategory?.label}</p>
                </div>
              )}
            </div>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-2 bg-[#181d26]/80 backdrop-blur-sm rounded-3xl p-8 border border-[#2a3441]">
            <h2 className="text-xl font-semibold text-white mb-6">Edit Profile</h2>

            {message && (
              <div className={`mb-6 p-4 rounded-xl ${
                message.type === 'success' 
                  ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
                  : 'bg-red-500/10 border border-red-500/30 text-red-400'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
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
                    required
                  />
                </div>
              </div>

              {/* Gender & Age */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="gender" className="block text-sm font-semibold text-[#e5e7eb] mb-2">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#232d14]/50 border-2 border-[#2a3441] rounded-xl focus:border-[#c4dd00] focus:outline-none transition-colors text-white"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="age" className="block text-sm font-semibold text-[#e5e7eb] mb-2">
                    Age
                  </label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    min="1"
                    max="120"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#232d14]/50 border-2 border-[#2a3441] rounded-xl focus:border-[#c4dd00] focus:outline-none transition-colors text-white placeholder-[#6b7280]"
                    placeholder="Years"
                  />
                </div>
              </div>

              {/* Weight & Height */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="weight" className="block text-sm font-semibold text-[#e5e7eb] mb-2">
                    Weight (kg)
                  </label>
                  <input
                    id="weight"
                    name="weight"
                    type="number"
                    min="1"
                    max="500"
                    step="0.1"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#232d14]/50 border-2 border-[#2a3441] rounded-xl focus:border-[#c4dd00] focus:outline-none transition-colors text-white placeholder-[#6b7280]"
                    placeholder="kg"
                  />
                </div>
                <div>
                  <label htmlFor="height" className="block text-sm font-semibold text-[#e5e7eb] mb-2">
                    Height (cm)
                  </label>
                  <input
                    id="height"
                    name="height"
                    type="number"
                    min="1"
                    max="300"
                    step="0.1"
                    value={formData.height}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#232d14]/50 border-2 border-[#2a3441] rounded-xl focus:border-[#c4dd00] focus:outline-none transition-colors text-white placeholder-[#6b7280]"
                    placeholder="cm"
                  />
                </div>
              </div>

              {/* Info Note */}
              <div className="bg-[#232d14]/30 rounded-xl p-4 border border-[#c4dd00]/20">
                <p className="text-sm text-[#9ca3af]">
                  <span className="text-[#c4dd00] font-semibold">💡 Why this matters:</span>{' '}
                  Your age, gender, and body metrics help us provide personalized biomarker recommendations and optimal reference ranges tailored to your profile.
                </p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-4 bg-gradient-to-r from-[#c4dd00] to-[#84cc16] text-[#0a0f05] font-bold rounded-full hover:shadow-lg hover:shadow-[#c4dd00]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Account Settings */}
        <div className="mt-6 bg-[#181d26]/80 backdrop-blur-sm rounded-3xl p-8 border border-[#2a3441]">
          <h2 className="text-xl font-semibold text-white mb-6">Account Settings</h2>
          
          <div className="flex items-center justify-between py-4 border-b border-[#2a3441]">
            <div>
              <p className="text-white font-medium">Email Address</p>
              <p className="text-[#9ca3af] text-sm">{user?.email}</p>
            </div>
            <span className="text-[#6b7280] text-sm">Contact support to change</span>
          </div>

          <div className="flex items-center justify-between py-4 border-b border-[#2a3441]">
            <div>
              <p className="text-white font-medium">Password</p>
              <p className="text-[#9ca3af] text-sm">••••••••</p>
            </div>
            <span className="text-[#6b7280] text-sm">Coming soon</span>
          </div>

          <div className="flex items-center justify-between py-4">
            <div>
              <p className="text-white font-medium">Delete Account</p>
              <p className="text-[#9ca3af] text-sm">Permanently delete your account and data</p>
            </div>
            <button className="px-4 py-2 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors text-sm">
              Delete
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

