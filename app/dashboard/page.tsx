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
  gender?: string;
  onboardingComplete: boolean;
}

interface HealthData {
  bloodWork?: {
    uploadedAt: string;
    data: Record<string, unknown>;
  };
  healthKit?: {
    uploadedAt: string;
    stats: Record<string, unknown>;
    totalRecords: number;
    dateRange: string;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

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

      // Redirect to onboarding if not complete
      if (!data.user.onboardingComplete) {
        router.push('/onboarding');
        return;
      }

      // Fetch health data
      fetchHealthData();
    } catch {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchHealthData = async () => {
    try {
      const response = await fetch('/api/user/health-data');
      if (response.ok) {
        const data = await response.json();
        setHealthData(data.healthData);
      }
    } catch (error) {
      console.error('Failed to fetch health data:', error);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const calculateHealthScore = () => {
    // Placeholder scoring based on profile completeness and health data
    let score = 0;
    if (user?.age) score += 10;
    if (user?.weight) score += 10;
    if (user?.height) score += 10;
    if (user?.gender) score += 10;
    if (healthData?.bloodWork) score += 30;
    if (healthData?.healthKit) score += 30;
    return score;
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

  const healthScore = calculateHealthScore();

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
            <Link href="/upload" className="text-[#9ca3af] hover:text-white transition-colors">
              Upload
            </Link>
            <Link href="/results" className="text-[#9ca3af] hover:text-white transition-colors">
              Results
            </Link>
            <Link href="/profile" className="text-[#9ca3af] hover:text-white transition-colors">
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

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {getGreeting()}, {user?.firstName}! 👋
          </h1>
          <p className="text-[#9ca3af]">
            Here&apos;s your health optimization dashboard
          </p>
        </div>

        {/* Health Score Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-[#181d26]/80 backdrop-blur-sm rounded-3xl p-8 border border-[#2a3441]">
            <h2 className="text-lg font-semibold text-[#9ca3af] mb-4">YOUR HEALTH SCORE</h2>
            <div className="flex items-center gap-8">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    className="stroke-[#2a3441]"
                    strokeWidth="8"
                    fill="none"
                    r="42"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="stroke-[#c4dd00]"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                    r="42"
                    cx="50"
                    cy="50"
                    strokeDasharray={`${healthScore * 2.64} 264`}
                    style={{ transition: 'stroke-dasharray 1s ease-out' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-white">{healthScore}</span>
                  <span className="text-sm text-[#9ca3af]">/ 100</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-white text-lg mb-4">
                  {healthScore < 40 ? 'Let\'s get started on your health journey!' : 
                   healthScore < 70 ? 'Good progress! Keep optimizing.' : 
                   'Excellent! You\'re on track for optimal health.'}
                </p>
                <div className="space-y-2">
                  {!healthData?.bloodWork && (
                    <div className="flex items-center gap-2 text-[#9ca3af]">
                      <span className="w-2 h-2 bg-[#f59e0b] rounded-full"></span>
                      <span>Upload blood work for +30 points</span>
                    </div>
                  )}
                  {!user?.age && (
                    <div className="flex items-center gap-2 text-[#9ca3af]">
                      <span className="w-2 h-2 bg-[#f59e0b] rounded-full"></span>
                      <span>Complete your profile for +40 points</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-[#181d26]/80 backdrop-blur-sm rounded-3xl p-8 border border-[#2a3441]">
            <h2 className="text-lg font-semibold text-[#9ca3af] mb-4">PROFILE</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#c4dd00] to-[#84cc16] rounded-2xl flex items-center justify-center text-2xl font-bold text-[#0a0f05]">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <div>
                  <p className="text-white font-semibold">{user?.firstName} {user?.lastName}</p>
                  <p className="text-[#9ca3af] text-sm">{user?.email}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-[#2a3441] grid grid-cols-2 gap-4">
                {user?.age && (
                  <div>
                    <p className="text-[#6b7280] text-xs uppercase">Age</p>
                    <p className="text-white font-semibold">{user.age} years</p>
                  </div>
                )}
                {user?.gender && (
                  <div>
                    <p className="text-[#6b7280] text-xs uppercase">Gender</p>
                    <p className="text-white font-semibold capitalize">{user.gender}</p>
                  </div>
                )}
              </div>
              <Link
                href="/profile"
                className="block w-full py-3 text-center text-[#c4dd00] border border-[#c4dd00]/30 rounded-xl hover:bg-[#c4dd00]/10 transition-colors font-medium"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Upload Blood Work */}
          <Link href="/upload" className="group bg-[#181d26]/80 backdrop-blur-sm rounded-3xl p-6 border border-[#2a3441] hover:border-[#c4dd00]/50 transition-all duration-300">
            <div className="w-14 h-14 bg-[#232d14] rounded-2xl flex items-center justify-center mb-4 group-hover:bg-[#c4dd00]/20 transition-colors">
              <span className="text-3xl">🩸</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Blood Work Analysis</h3>
            <p className="text-[#9ca3af] mb-4">
              Upload your lab results and get AI-powered insights into your biomarkers.
            </p>
            {healthData?.bloodWork ? (
              <span className="inline-flex items-center gap-2 text-[#84cc16]">
                <span className="w-2 h-2 bg-[#84cc16] rounded-full"></span>
                Last uploaded {new Date(healthData.bloodWork.uploadedAt).toLocaleDateString()}
              </span>
            ) : (
              <span className="text-[#c4dd00] font-medium group-hover:underline">
                Upload Now →
              </span>
            )}
          </Link>

          {/* View Results */}
          <Link href="/results" className="group bg-[#181d26]/80 backdrop-blur-sm rounded-3xl p-6 border border-[#2a3441] hover:border-[#c4dd00]/50 transition-all duration-300">
            <div className="w-14 h-14 bg-[#232d14] rounded-2xl flex items-center justify-center mb-4 group-hover:bg-[#c4dd00]/20 transition-colors">
              <span className="text-3xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Biomarker Results</h3>
            <p className="text-[#9ca3af] mb-4">
              View detailed analysis and personalized recommendations for your health markers.
            </p>
            <span className="text-[#c4dd00] font-medium group-hover:underline">
              View Results →
            </span>
          </Link>

          {/* Health Insights */}
          <div className="bg-[#181d26]/80 backdrop-blur-sm rounded-3xl p-6 border border-[#2a3441]">
            <div className="w-14 h-14 bg-[#232d14] rounded-2xl flex items-center justify-center mb-4">
              <span className="text-3xl">💡</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Daily Insights</h3>
            <p className="text-[#9ca3af] mb-4">
              {healthData?.bloodWork 
                ? 'Based on your blood work, focus on optimizing your key biomarkers.'
                : 'Upload your blood work to receive personalized health insights.'}
            </p>
            <span className="text-[#6b7280]">
              Coming Soon
            </span>
          </div>
        </div>

        {/* Biomarker Categories Preview */}
        <div className="bg-[#181d26]/80 backdrop-blur-sm rounded-3xl p-8 border border-[#2a3441]">
          <h2 className="text-xl font-semibold text-white mb-6">Key Biomarker Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '❤️', name: 'Cardiovascular', markers: 'ApoB, HbA1c, Life\'s Essential 8' },
              { icon: '💪', name: 'Physical Fitness', markers: 'VO₂ max, Grip Strength, Gait Speed' },
              { icon: '😴', name: 'Sleep Quality', markers: 'PSQI, Sleep Efficiency' },
              { icon: '🧠', name: 'Mental Health', markers: 'PHQ-9, GAD-7, Burnout Score' },
              { icon: '🥗', name: 'Nutrition', markers: 'MEDAS-14, Omega-3 Index' },
              { icon: '⚡', name: 'Hormonal', markers: 'Testosterone, Cortisol' },
              { icon: '👥', name: 'Social', markers: 'Social Network Scale' },
              { icon: '🏃', name: 'Lifestyle', markers: 'Steps, Weight, Supplements' },
            ].map((category, index) => (
              <div
                key={index}
                className="bg-[#232d14]/50 rounded-2xl p-4 border border-[#2a3441] hover:border-[#c4dd00]/30 transition-colors"
              >
                <span className="text-2xl mb-2 block">{category.icon}</span>
                <h3 className="text-white font-medium mb-1">{category.name}</h3>
                <p className="text-[#6b7280] text-xs">{category.markers}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

