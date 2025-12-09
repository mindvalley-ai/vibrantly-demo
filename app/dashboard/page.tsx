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

  const calculateHealthScore = () => {
    // Placeholder scoring based on profile completeness and health data
    let score = 0;
    if (user?.age) score += 10;
    if (user?.weight) score += 10;
    if (user?.height) score += 10;
    if (user?.gender) score += 10;
    if (healthData?.bloodWork) score += 30;
    if (healthData?.healthKit) score += 30;
    return score || 74; // Default to 74 for demo
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f3ef] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#3d4a2c]">
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

  // Sample data for charts
  const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const cardioData = [65, 72, 68, 75, 78, 82];
  const sleepData = [7.5, 8.2, 7.8, 8.5, 8.0, 8.2];

  return (
    <div className="min-h-screen bg-[#f5f3ef] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#3d4a2c] text-white flex flex-col min-h-screen fixed left-0 top-0">
        {/* Logo */}
        <div className="p-6">
          <div className="flex items-center gap-2">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 4C12 4 8 8 8 12C8 16 12 20 16 28C20 20 24 16 24 12C24 8 20 4 16 4Z" fill="#8fa876"/>
              <path d="M12 8C10 10 10 14 14 18" stroke="#c4d98e" strokeWidth="2" strokeLinecap="round"/>
              <path d="M20 8C22 10 22 14 18 18" stroke="#c4d98e" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="font-semibold text-lg">Vibrantly</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#4a5a38] text-white mb-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Dashboard
          </Link>

          <Link href="/results" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#b8c4a8] hover:bg-[#4a5a38]/50 transition-colors mb-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            My Data
          </Link>

          <Link href="/timeline" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#b8c4a8] hover:bg-[#4a5a38]/50 transition-colors mb-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Health Timeline
          </Link>

          <Link href="/ask" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#b8c4a8] hover:bg-[#4a5a38]/50 transition-colors mb-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Ask Eliza
          </Link>

          {/* Expert Advice Section */}
          <div className="mt-6 mb-2">
            <p className="px-4 text-xs uppercase tracking-wider text-[#8a9a78]">Expert Advice</p>
          </div>

          <Link href="/garys-advice" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#b8c4a8] hover:bg-[#4a5a38]/50 transition-colors mb-1">
            <span className="text-lg">🧬</span>
            Gary&apos;s Advice
          </Link>

          {/* Companion Apps Section */}
          <div className="mt-6 mb-2">
            <p className="px-4 text-xs uppercase tracking-wider text-[#8a9a78]">Companion Apps</p>
          </div>

          <Link href="/food" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#b8c4a8] hover:bg-[#4a5a38]/50 transition-colors mb-1">
            <span className="text-lg">🥗</span>
            Food & Supplements
          </Link>

          <Link href="/exercise" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#b8c4a8] hover:bg-[#4a5a38]/50 transition-colors mb-1">
            <span className="text-lg">🏃</span>
            Exercise
          </Link>

          <Link href="/rejuvenation" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#b8c4a8] hover:bg-[#4a5a38]/50 transition-colors mb-1">
            <span className="text-lg">✨</span>
            Rejuvenation
          </Link>

          <Link href="/mindfulness" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#b8c4a8] hover:bg-[#4a5a38]/50 transition-colors mb-1">
            <span className="text-lg">🧘</span>
            Mindfulness
          </Link>

          <Link href="/diagnostics" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#b8c4a8] hover:bg-[#4a5a38]/50 transition-colors mb-1">
            <span className="text-lg">🔬</span>
            Diagnostics
          </Link>
        </nav>

        {/* Settings */}
        <div className="p-3 border-t border-[#4a5a38]">
          <Link href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#b8c4a8] hover:bg-[#4a5a38]/50 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Top Bar */}
        <header className="bg-[#f5f3ef] px-8 py-4 flex items-center justify-between sticky top-0 z-40">
          {/* Search Bar */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]">✨</span>
              <input
                type="text"
                placeholder="Ask Eliza anything.."
                className="w-full pl-12 pr-12 py-3 bg-white rounded-full border border-[#e5e7eb] text-[#374151] placeholder-[#9ca3af] focus:outline-none focus:border-[#8fa876] transition-colors"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#3d4a2c]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4 ml-6">
            <button className="relative p-2 text-[#6b7280] hover:text-[#3d4a2c] transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#ef4444] text-white text-xs rounded-full flex items-center justify-center">3</span>
            </button>
            <button className="p-2 text-[#6b7280] hover:text-[#3d4a2c] transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button onClick={handleLogout} className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#8fa876]">
              <div className="w-full h-full bg-gradient-to-br from-[#f59e0b] to-[#ea580c] flex items-center justify-center text-white font-semibold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8">
          {/* Health Score Cards Grid */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            {/* Vibrantly Score - Large Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h3 className="text-[#6b7280] text-sm font-medium mb-1">Vibrantly Score</h3>
              <p className="text-[#9ca3af] text-xs mb-4">You&apos;re doing awesome on your journey! Keep up the great habits.</p>

              {/* Gauge */}
              <div className="relative w-32 h-20 mx-auto mb-2">
                <svg viewBox="0 0 100 60" className="w-full h-full">
                  {/* Background arc */}
                  <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  {/* Progress arc */}
                  <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="url(#gaugeGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(healthScore / 100) * 126} 126`}
                  />
                  <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="50%" stopColor="#eab308" />
                      <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="text-center">
                <span className="text-4xl font-bold text-[#1f2937]">{healthScore}</span>
                <span className="text-[#9ca3af] text-lg">/100</span>
              </div>
            </div>

            {/* Cardiometabolic Health */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h3 className="text-[#6b7280] text-sm font-medium mb-1">Cardiometabolic Health</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl font-bold text-[#1f2937]">7.8</span>
                <span className="text-[#9ca3af]">/10</span>
              </div>
              <p className="text-[#9ca3af] text-xs mb-4">Your energy level is great this week</p>

              {/* Mini Chart */}
              <div className="flex items-end gap-1 h-16">
                {cardioData.map((value, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-[#86efac] rounded-t"
                      style={{ height: `${(value / 100) * 64}px` }}
                    />
                    <span className="text-[8px] text-[#9ca3af]">{weekDays[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sleep Health */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h3 className="text-[#6b7280] text-sm font-medium mb-1">Sleep Health</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl font-bold text-[#1f2937]">8.2</span>
                <span className="text-[#9ca3af]">/10</span>
              </div>
              <p className="text-[#9ca3af] text-xs mb-4">Your sleep quality is consistently high. Keep it up</p>

              {/* Line Chart */}
              <div className="h-16 relative">
                <svg className="w-full h-full" viewBox="0 0 120 40">
                  <path
                    d={`M 0 ${40 - sleepData[0] * 4} ${sleepData.map((v, i) => `L ${i * 24} ${40 - v * 4}`).join(' ')}`}
                    fill="none"
                    stroke="#86efac"
                    strokeWidth="2"
                  />
                </svg>
                <div className="flex justify-between mt-1">
                  {weekDays.map((day, i) => (
                    <span key={i} className="text-[8px] text-[#9ca3af]">{day}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Mental Health */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h3 className="text-[#6b7280] text-sm font-medium mb-1">Mental health</h3>
              <p className="text-[#9ca3af] text-xs mb-4">You&apos;re finding your balance. Stay kind to yourself.</p>

              {/* Mood Icons */}
              <div className="flex justify-center gap-2 mb-4">
                {['😢', '😕', '😐', '🙂', '😊'].map((emoji, i) => (
                  <span key={i} className={`text-2xl ${i === 3 ? 'opacity-100' : 'opacity-30'}`}>{emoji}</span>
                ))}
              </div>

              {/* Mini bars */}
              <div className="flex items-end gap-1 h-8">
                {[40, 60, 50, 70, 55, 65].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-[#fde68a] rounded-t"
                      style={{ height: `${(h / 100) * 32}px` }}
                    />
                    <span className="text-[8px] text-[#9ca3af]">{weekDays[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            {/* Mobility */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h3 className="text-[#6b7280] text-sm font-medium mb-1">Mobility</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl font-bold text-[#1f2937]">8.2</span>
                <span className="text-[#9ca3af]">/10</span>
              </div>
              <p className="text-[#9ca3af] text-xs mb-4">Maintain this to keep a improving</p>

              {/* Sparkline */}
              <div className="h-20">
                <svg className="w-full h-full" viewBox="0 0 200 60">
                  <path
                    d="M 0 40 Q 30 35, 50 30 T 100 25 T 150 20 T 200 15"
                    fill="none"
                    stroke="#d1d5db"
                    strokeWidth="2"
                  />
                </svg>
                <div className="flex justify-between text-[8px] text-[#9ca3af] -mt-2">
                  <span>MAY</span>
                  <span>JUN</span>
                  <span>JUL</span>
                  <span>AUG</span>
                  <span>SEP</span>
                  <span>OCT</span>
                </div>
              </div>
            </div>

            {/* Nutrition Quality */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h3 className="text-[#6b7280] text-sm font-medium mb-1">Nutrition quality</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl font-bold text-[#1f2937]">5.8</span>
                <span className="text-[#9ca3af]">/10</span>
              </div>

              {/* Status dots */}
              <div className="flex gap-1 mb-2">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className={`w-3 h-3 rounded-full ${i <= 6 ? 'bg-[#ef4444]' : 'bg-[#e5e7eb]'}`} />
                ))}
              </div>

              <p className="text-[#9ca3af] text-xs">Lets work on improving your Mood, Memory & Focus.</p>
            </div>

            {/* Social Connection */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h3 className="text-[#6b7280] text-sm font-medium mb-1">Social Connection</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl font-bold text-[#1f2937]">7.2</span>
                <span className="text-[#9ca3af]">/10</span>
              </div>

              {/* Status dots */}
              <div className="flex gap-1 mb-2">
                {[1,2,3,4,5,6,7,8].map(i => (
                  <div key={i} className={`w-3 h-3 rounded-full ${i <= 7 ? 'bg-[#22c55e]' : 'bg-[#e5e7eb]'}`} />
                ))}
              </div>

              <p className="text-[#9ca3af] text-xs">Keep this up to maintain a healthy heart.</p>
            </div>

            {/* Hormonal */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h3 className="text-[#6b7280] text-sm font-medium mb-1">Hormonal</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl font-bold text-[#1f2937]">8.1</span>
                <span className="text-[#9ca3af]">/10</span>
              </div>

              {/* Status dots */}
              <div className="flex gap-1 mb-2">
                {[1,2,3,4,5,6,7,8,9].map(i => (
                  <div key={i} className={`w-3 h-3 rounded-full ${i <= 8 ? 'bg-[#22c55e]' : 'bg-[#e5e7eb]'}`} />
                ))}
              </div>

              <p className="text-[#9ca3af] text-xs">Keep this up to maintain a healthy heart.</p>
            </div>
          </div>

          {/* Insight Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#fef3c7] rounded-full flex items-center justify-center">
                <span className="text-xl">💡</span>
              </div>
              <div className="flex-1">
                <p className="text-[#374151] mb-2">
                  You tend to perform at your best when your evenings wind down calmly, your sleep stays above 7 hours, and your meals are balanced. Try scheduling light movement or stretching before bed and keeping dinner earlier - small shifts like these can lift your overall wellness index by up to 8% next week.
                </p>
                <button className="text-[#ef4444] font-medium hover:underline">
                  Explore Supplements
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
