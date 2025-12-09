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

// Gary Brecka's key protocols and recommendations
const garyProtocols = {
  cellular: {
    title: "84-Day Cellular Reset",
    description: "Your body replaces 300 billion cells daily. Complete cellular turnover occurs every 84 days.",
    keyInsight: "You're not stuck with any condition — you're building a new body constantly.",
  },
  neurotransmitters: {
    serotonin: {
      pathway: "Tryptophan → Serotonin",
      cofactors: ["B vitamins", "Zinc", "Magnesium"],
      deficiencySymptoms: ["Depression", "Low motivation", "Emotional flatness", "OCD"],
    },
    dopamine: {
      pathway: "Tyrosine → Dopamine",
      cofactors: ["B vitamins", "Iron", "Copper"],
      deficiencySymptoms: ["Addiction", "Lack of motivation", "Anhedonia"],
    },
  },
  protocols: [
    {
      id: "morning-hydration",
      name: "Morning Hydration",
      timing: "Upon Waking",
      description: "16-32oz of water with Baja Gold mineral salt",
      icon: "💧",
    },
    {
      id: "amino-acids",
      name: "Amino Acids",
      timing: "First 30 Minutes",
      description: "Tryptophan and Tyrosine on empty stomach",
      icon: "🧬",
    },
    {
      id: "methylated-b",
      name: "Methylated B Vitamins",
      timing: "With Breakfast",
      description: "If MTHFR variant detected",
      icon: "💊",
    },
    {
      id: "hydrogen-water",
      name: "Hydrogen Water",
      timing: "Throughout Day",
      description: "12 PPM in 6-8oz portions",
      icon: "🫧",
    },
    {
      id: "sunlight",
      name: "Morning Sunlight",
      timing: "First 30 Minutes",
      description: "10 minutes of morning sun for circadian rhythm",
      icon: "☀️",
    },
    {
      id: "breathwork",
      name: "Breathwork",
      timing: "Daily",
      description: "Boost oxygen, lower stress, activate nervous system",
      icon: "🌬️",
    },
    {
      id: "grounding",
      name: "Grounding",
      timing: "Daily",
      description: "Reconnect to Earth's natural charge",
      icon: "🌍",
    },
    {
      id: "cold-exposure",
      name: "Cold Water Exposure",
      timing: "Daily",
      description: "Reduce inflammation, sharpen focus, activate brown fat",
      icon: "🧊",
    },
  ],
};

export default function GarysAdvicePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'protocols' | 'personalized'>('overview');
  const [dayOfReset, setDayOfReset] = useState(1);

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

  // Generate personalized recommendations based on health data
  const getPersonalizedRecommendations = () => {
    const recommendations = [];

    // Based on sample health scores from dashboard
    const scores = {
      sleep: 8.2,
      cardio: 7.8,
      mental: 7.0,
      nutrition: 5.8,
      social: 7.2,
      hormonal: 8.1,
      mobility: 8.2,
    };

    // Nutrition is low - recommend serotonin pathway support
    if (scores.nutrition < 7) {
      recommendations.push({
        priority: "high",
        category: "Neurotransmitter Support",
        title: "Optimize Your Serotonin Pathway",
        description: "Your nutrition score suggests you may benefit from serotonin precursor support. Gary recommends supplementing with Tryptophan on an empty stomach.",
        actions: [
          "Take L-Tryptophan (500-1000mg) first thing in the morning",
          "Ensure adequate B6, Zinc, and Magnesium intake",
          "Eat tryptophan-rich foods: turkey, eggs, cheese, nuts",
        ],
        garyQuote: "Depression isn't a Prozac deficiency — it's a serotonin deficiency caused by missing raw materials.",
        icon: "🧠",
      });
    }

    // Mental health could be improved
    if (scores.mental < 8) {
      recommendations.push({
        priority: "medium",
        category: "Anxiety & Stress Management",
        title: "Balance Your Catecholamines",
        description: "Your mental health score indicates room for optimization. Gary's approach focuses on balancing norepinephrine, epinephrine, and dopamine naturally.",
        actions: [
          "Practice morning breathwork (box breathing: 4-4-4-4)",
          "Get 10 minutes of morning sunlight within 30 min of waking",
          "Consider L-Tyrosine supplementation for dopamine support",
          "Ground yourself barefoot on earth for 10 minutes daily",
        ],
        garyQuote: "Anxiety isn't a disorder; it's your catecholamines climbing the ladder.",
        icon: "🧘",
      });
    }

    // Cardio is good but can be optimized
    if (scores.cardio < 9) {
      recommendations.push({
        priority: "medium",
        category: "Cardiovascular Optimization",
        title: "Address Homocysteine Levels",
        description: "70% of your circulation is microvascular, controlled by neurotransmitters. Gary recommends checking homocysteine levels and supporting methylation.",
        actions: [
          "Get your homocysteine levels tested",
          "If MTHFR variant present, use methylated B vitamins",
          "Support methylation with folate, B12, and B6",
          "Consider hydrogen therapy for vascular health",
        ],
        garyQuote: "70% of your circulation is microvascular. High homocysteine constricts these tiny vessels — that's your hypertension.",
        icon: "❤️",
      });
    }

    // Sleep is good - reinforce
    if (scores.sleep >= 8) {
      recommendations.push({
        priority: "maintain",
        category: "Sleep Optimization",
        title: "Maintain Your Excellent Sleep",
        description: "Your sleep score is strong! Gary emphasizes that deep sleep drains your brain while REM saves your memories. Keep up these habits.",
        actions: [
          "Maintain bedroom temperature at 65-68°F",
          "Keep consistent sleep/wake times",
          "Avoid blue light 2 hours before bed",
          "Consider magnesium glycinate before bed",
        ],
        garyQuote: "Deep sleep drains your brain. REM sleep saves your memories.",
        icon: "😴",
      });
    }

    // Hydrogen therapy recommendation for everyone
    recommendations.push({
      priority: "enhancement",
      category: "Advanced Protocol",
      title: "Implement Hydrogen Therapy",
      description: "Gary considers hydrogen therapy one of the biggest discoveries of our millennium. It's a selective antioxidant that works through the NRF2 pathway.",
      actions: [
        "Start with hydrogen water (12 PPM in 6-8oz portions)",
        "Consider hydrogen bathing for recovery",
        "If using hyperbaric oxygen, ALWAYS use hydrogen before/after",
      ],
      garyQuote: "Hydrogen is the ONLY selective antioxidant. It doesn't suppress oxidative stress — it balances it through redox homeostasis.",
      icon: "🫧",
    });

    return recommendations;
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
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

  const recommendations = getPersonalizedRecommendations();

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
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#b8c4a8] hover:bg-[#4a5a38]/50 transition-colors mb-1">
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

          <Link href="/garys-advice" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#4a5a38] text-white mb-1">
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

        {/* Page Content */}
        <div className="p-8">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-[#3d4a2c] to-[#5a6b47] rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#8fa876]/20 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#c4d98e]/10 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 flex items-start gap-6">
              <img
                src="https://cdn.prod.website-files.com/67e2dec19214c77719a54adb/687000b7c6bae5fc0475247f_Gary-Brecka-Biography.avif"
                alt="Gary Brecka"
                className="w-24 h-24 rounded-2xl object-cover border-2 border-[#8fa876]"
              />
              <div className="flex-1">
                <p className="text-[#c4d98e] text-sm font-medium mb-1">EXPERT PROTOCOLS</p>
                <h1 className="text-3xl font-bold mb-2">Gary Brecka&apos;s 84-Day Cellular Reset</h1>
                <p className="text-[#b8c4a8] max-w-2xl">
                  Personalized recommendations based on your health data, powered by Gary&apos;s root cause philosophy and neurotransmitter optimization protocols.
                </p>
              </div>

              {/* 84-Day Counter */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <p className="text-[#c4d98e] text-xs mb-1">YOUR RESET</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">Day {dayOfReset}</span>
                  <span className="text-[#b8c4a8]">/84</span>
                </div>
                <button
                  onClick={() => setDayOfReset(1)}
                  className="mt-2 text-xs text-[#c4d98e] hover:underline"
                >
                  Reset Counter
                </button>
              </div>
            </div>

            {/* Key Stats */}
            <div className="relative z-10 grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20">
              <div>
                <p className="text-3xl font-bold">300B</p>
                <p className="text-[#b8c4a8] text-sm">Cells die daily</p>
              </div>
              <div>
                <p className="text-3xl font-bold">84</p>
                <p className="text-[#b8c4a8] text-sm">Days to regenerate</p>
              </div>
              <div>
                <p className="text-3xl font-bold">70%</p>
                <p className="text-[#b8c4a8] text-sm">Microvascular</p>
              </div>
              <div>
                <p className="text-3xl font-bold">1</p>
                <p className="text-[#b8c4a8] text-sm">Root cause</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { id: 'overview', label: 'Core Philosophy' },
              { id: 'protocols', label: 'Daily Protocols' },
              { id: 'personalized', label: 'Your Recommendations' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-6 py-3 rounded-full font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#3d4a2c] text-white'
                    : 'bg-white text-[#6b7280] hover:bg-[#f0ebe4]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Root Cause Philosophy */}
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#fef3c7] rounded-2xl flex items-center justify-center">
                    <span className="text-2xl">🌳</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#1f2937] mb-2">Root Cause Philosophy</h3>
                    <p className="text-[#6b7280] mb-4">
                      &quot;One thing causes everything. It&apos;s not an explosion — it&apos;s a domino effect. You don&apos;t have 17 things wrong with you; you have ONE thing causing 17 symptoms.&quot;
                    </p>
                    <div className="bg-[#f5f3ef] rounded-xl p-4">
                      <p className="text-sm font-medium text-[#3d4a2c] mb-2">The Tree Analogy</p>
                      <p className="text-[#6b7280] text-sm">
                        If you had a leaf rotting on a tree, a true arborist wouldn&apos;t touch the leaf. They&apos;d test the soil. Find nitrogen is missing → add nitrogen → leaf heals.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Neurotransmitter Pathways */}
              <div className="grid grid-cols-2 gap-6">
                {/* Serotonin */}
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#dbeafe] rounded-xl flex items-center justify-center">
                      <span className="text-xl">😊</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1f2937]">Serotonin Pathway</h4>
                      <p className="text-sm text-[#6b7280]">Foundation of mood & emotion</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-[#f0fdf4] px-3 py-1 rounded-full text-sm font-medium text-[#166534]">Tryptophan</div>
                    <span className="text-[#9ca3af]">→</span>
                    <div className="bg-[#f0fdf4] px-3 py-1 rounded-full text-sm font-medium text-[#166534]">Serotonin</div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-[#9ca3af] mb-2">COFACTORS NEEDED</p>
                    <div className="flex flex-wrap gap-2">
                      {['B vitamins', 'Zinc', 'Magnesium'].map((cf) => (
                        <span key={cf} className="bg-[#f5f3ef] px-2 py-1 rounded text-xs text-[#6b7280]">{cf}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-[#9ca3af] mb-2">WHEN DEFICIENT</p>
                    <div className="flex flex-wrap gap-2">
                      {['Depression', 'Low motivation', 'OCD'].map((s) => (
                        <span key={s} className="bg-[#fef2f2] px-2 py-1 rounded text-xs text-[#dc2626]">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Dopamine */}
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#fef3c7] rounded-xl flex items-center justify-center">
                      <span className="text-xl">🚀</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1f2937]">Dopamine Pathway</h4>
                      <p className="text-sm text-[#6b7280]">Driver of behavior & reward</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-[#fefce8] px-3 py-1 rounded-full text-sm font-medium text-[#854d0e]">Tyrosine</div>
                    <span className="text-[#9ca3af]">→</span>
                    <div className="bg-[#fefce8] px-3 py-1 rounded-full text-sm font-medium text-[#854d0e]">Dopamine</div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-[#9ca3af] mb-2">COFACTORS NEEDED</p>
                    <div className="flex flex-wrap gap-2">
                      {['B vitamins', 'Iron', 'Copper'].map((cf) => (
                        <span key={cf} className="bg-[#f5f3ef] px-2 py-1 rounded text-xs text-[#6b7280]">{cf}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-[#9ca3af] mb-2">WHEN DEFICIENT</p>
                    <div className="flex flex-wrap gap-2">
                      {['Addiction', 'Lack of motivation', 'Anhedonia'].map((s) => (
                        <span key={s} className="bg-[#fef2f2] px-2 py-1 rounded text-xs text-[#dc2626]">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Gary Quote */}
              <div className="bg-[#3d4a2c] rounded-3xl p-6 text-white">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">&ldquo;</span>
                  <div>
                    <p className="text-lg mb-4">
                      The absence of dopamine is the presence of addiction. No addict ever woke up and said &apos;I want to get high.&apos; They woke up saying &apos;I want to feel normal.&apos; It was the search for normalcy that developed the addiction.
                    </p>
                    <p className="text-[#c4d98e] font-medium">— Gary Brecka</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'protocols' && (
            <div className="space-y-6">
              {/* Morning Routine */}
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-[#1f2937] mb-6">Gary&apos;s Daily Protocols</h3>

                <div className="grid grid-cols-2 gap-4">
                  {garyProtocols.protocols.map((protocol) => (
                    <div
                      key={protocol.id}
                      className="bg-[#f5f3ef] rounded-2xl p-4 hover:bg-[#f0ebe4] transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                          <span className="text-2xl">{protocol.icon}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-[#8fa876] font-medium mb-1">{protocol.timing}</p>
                          <h4 className="font-bold text-[#1f2937] mb-1">{protocol.name}</h4>
                          <p className="text-sm text-[#6b7280]">{protocol.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 84-Day Checklist Preview */}
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#1f2937]">84-Day Implementation Checklist</h3>
                  <a
                    href="https://vishenl.github.io/workspace/gary-brecka-guide.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#3d4a2c] font-medium hover:underline flex items-center gap-1"
                  >
                    View Full Guide
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  {[
                    { week: "Week 1-2", title: "Testing & Baseline", items: ["MTHFR testing", "Homocysteine levels", "Micronutrient panel"] },
                    { week: "Week 3-4", title: "Foundation Building", items: ["Morning hydration", "Amino acids", "Methylated B vitamins"] },
                    { week: "Week 5-8", title: "Optimization", items: ["Hydrogen therapy", "Sleep optimization", "Daily protocols"] },
                    { week: "Week 9-12", title: "Advanced & Reassess", items: ["Hyperbaric oxygen", "Red light therapy", "Re-test markers"] },
                  ].map((phase, i) => (
                    <div key={i} className="bg-[#f5f3ef] rounded-2xl p-4">
                      <p className="text-xs text-[#8fa876] font-medium mb-1">{phase.week}</p>
                      <h4 className="font-bold text-[#1f2937] mb-3">{phase.title}</h4>
                      <ul className="space-y-2">
                        {phase.items.map((item, j) => (
                          <li key={j} className="flex items-center gap-2 text-sm text-[#6b7280]">
                            <div className="w-4 h-4 rounded border-2 border-[#d1d5db]" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'personalized' && (
            <div className="space-y-6">
              {/* Personalized Header */}
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#8fa876] to-[#3d4a2c] rounded-2xl flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1f2937]">Your Personalized Recommendations</h3>
                    <p className="text-[#6b7280]">Based on your health data and Gary&apos;s protocols</p>
                  </div>
                </div>
                <p className="text-[#6b7280] bg-[#f5f3ef] rounded-xl p-4">
                  We&apos;ve analyzed your Vibrantly health scores and cross-referenced them with Gary Brecka&apos;s root cause protocols. Here are your priority recommendations for the next 84 days.
                </p>
              </div>

              {/* Recommendations */}
              {recommendations.map((rec, index) => (
                <div key={index} className="bg-white rounded-3xl p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      rec.priority === 'high' ? 'bg-[#fef2f2]' :
                      rec.priority === 'medium' ? 'bg-[#fefce8]' :
                      rec.priority === 'maintain' ? 'bg-[#f0fdf4]' :
                      'bg-[#f0f9ff]'
                    }`}>
                      <span className="text-2xl">{rec.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          rec.priority === 'high' ? 'bg-[#fef2f2] text-[#dc2626]' :
                          rec.priority === 'medium' ? 'bg-[#fefce8] text-[#ca8a04]' :
                          rec.priority === 'maintain' ? 'bg-[#f0fdf4] text-[#16a34a]' :
                          'bg-[#f0f9ff] text-[#0284c7]'
                        }`}>
                          {rec.priority === 'high' ? 'High Priority' :
                           rec.priority === 'medium' ? 'Medium Priority' :
                           rec.priority === 'maintain' ? 'Maintain' :
                           'Enhancement'}
                        </span>
                        <span className="text-[#9ca3af] text-sm">{rec.category}</span>
                      </div>
                      <h4 className="text-lg font-bold text-[#1f2937] mb-2">{rec.title}</h4>
                      <p className="text-[#6b7280] mb-4">{rec.description}</p>

                      <div className="bg-[#f5f3ef] rounded-xl p-4 mb-4">
                        <p className="text-sm font-medium text-[#3d4a2c] mb-2">Action Steps:</p>
                        <ul className="space-y-2">
                          {rec.actions.map((action, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-[#6b7280]">
                              <span className="text-[#8fa876] mt-0.5">✓</span>
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-start gap-2 text-sm italic text-[#6b7280]">
                        <span className="text-lg">&ldquo;</span>
                        <p>{rec.garyQuote}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* CTA */}
              <div className="bg-gradient-to-r from-[#3d4a2c] to-[#5a6b47] rounded-3xl p-6 text-white text-center">
                <h3 className="text-xl font-bold mb-2">Ready to Start Your 84-Day Reset?</h3>
                <p className="text-[#b8c4a8] mb-4">Track your progress and get daily reminders</p>
                <button
                  onClick={() => setDayOfReset(1)}
                  className="bg-white text-[#3d4a2c] px-6 py-3 rounded-full font-bold hover:bg-[#f5f3ef] transition-colors"
                >
                  Begin My Reset Journey
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
