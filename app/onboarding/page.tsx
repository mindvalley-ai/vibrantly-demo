'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

type Step = 'welcome' | 'profile' | 'goals' | 'complete';

const HEALTH_GOALS = [
  { id: 'energy', icon: '⚡', label: 'Energy & Vitality', description: 'Feel more energized throughout the day' },
  { id: 'longevity', icon: '🧬', label: 'Longevity & Aging', description: 'Optimize for a longer, healthier life' },
  { id: 'cognitive', icon: '🧠', label: 'Cognitive Performance', description: 'Improve focus, memory, and mental clarity' },
  { id: 'athletic', icon: '🏃', label: 'Athletic Performance', description: 'Enhance physical performance and recovery' },
  { id: 'sleep', icon: '😴', label: 'Sleep Quality', description: 'Get better, more restorative sleep' },
  { id: 'stress', icon: '🧘', label: 'Stress Management', description: 'Reduce stress and improve resilience' },
  { id: 'hormones', icon: '⚖️', label: 'Hormone Optimization', description: 'Balance hormones naturally' },
  { id: 'heart', icon: '❤️', label: 'Heart Health', description: 'Improve cardiovascular health markers' },
  { id: 'immune', icon: '🛡️', label: 'Immune Support', description: 'Strengthen your immune system' },
  { id: 'gut', icon: '🦠', label: 'Gut Health', description: 'Improve digestion and gut microbiome' },
  { id: 'skin', icon: '✨', label: 'Skin, Hair & Nails', description: 'Enhance appearance from within' },
  { id: 'weight', icon: '⚖️', label: 'Weight Management', description: 'Reach and maintain optimal weight' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  
  const [profileData, setProfileData] = useState({
    age: '',
    gender: '' as '' | 'male' | 'female' | 'other',
    weight: '',
    height: '',
  });
  
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

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
      
      // If already onboarded, redirect to dashboard
      if (data.user.onboardingComplete) {
        router.push('/dashboard');
        return;
      }
    } catch {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfileData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => {
      if (prev.includes(goalId)) {
        return prev.filter(id => id !== goalId);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), goalId]; // Replace oldest selection
      }
      return [...prev, goalId];
    });
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: profileData.age ? parseInt(profileData.age) : undefined,
          gender: profileData.gender || undefined,
          weight: profileData.weight ? parseFloat(profileData.weight) : undefined,
          height: profileData.height ? parseFloat(profileData.height) : undefined,
          onboardingComplete: true,
        }),
      });

      if (response.ok) {
        setCurrentStep('complete');
        // Redirect after showing completion
        setTimeout(() => router.push('/dashboard'), 2000);
      }
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    } finally {
      setSaving(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 'welcome') setCurrentStep('profile');
    else if (currentStep === 'profile') setCurrentStep('goals');
    else if (currentStep === 'goals') handleComplete();
  };

  const prevStep = () => {
    if (currentStep === 'profile') setCurrentStep('welcome');
    else if (currentStep === 'goals') setCurrentStep('profile');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f05] via-[#141e0a] to-[#1a2410] flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#c4dd00]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#84cc16]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Progress Steps */}
        {currentStep !== 'complete' && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {['welcome', 'profile', 'goals'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-3 h-3 rounded-full transition-colors ${
                  ['welcome', 'profile', 'goals'].indexOf(currentStep) >= index 
                    ? 'bg-[#c4dd00]' 
                    : 'bg-[#2a3441]'
                }`} />
                {index < 2 && (
                  <div className={`w-16 h-0.5 transition-colors ${
                    ['welcome', 'profile', 'goals'].indexOf(currentStep) > index 
                      ? 'bg-[#c4dd00]' 
                      : 'bg-[#2a3441]'
                  }`} />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="bg-[#181d26]/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-[#2a3441]">
          {/* Welcome Step */}
          {currentStep === 'welcome' && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#c4dd00] to-[#84cc16] rounded-3xl mb-6 shadow-lg shadow-[#c4dd00]/20">
                <span className="text-4xl">🌟</span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">
                Welcome to Vibrantly, {user?.firstName}!
              </h1>
              <p className="text-[#9ca3af] text-lg mb-8 max-w-md mx-auto">
                Let&apos;s personalize your health journey. We&apos;ll ask a few quick questions to tailor recommendations just for you.
              </p>
              
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-[#232d14]/50 rounded-2xl p-4 border border-[#2a3441]">
                  <span className="text-2xl mb-2 block">🎯</span>
                  <p className="text-sm text-[#9ca3af]">Personalized Insights</p>
                </div>
                <div className="bg-[#232d14]/50 rounded-2xl p-4 border border-[#2a3441]">
                  <span className="text-2xl mb-2 block">📊</span>
                  <p className="text-sm text-[#9ca3af]">AI Analysis</p>
                </div>
                <div className="bg-[#232d14]/50 rounded-2xl p-4 border border-[#2a3441]">
                  <span className="text-2xl mb-2 block">💪</span>
                  <p className="text-sm text-[#9ca3af]">Actionable Steps</p>
                </div>
              </div>

              <button
                onClick={nextStep}
                className="w-full py-4 bg-gradient-to-r from-[#c4dd00] to-[#84cc16] text-[#0a0f05] font-bold rounded-full hover:shadow-lg hover:shadow-[#c4dd00]/30 transition-all duration-300"
              >
                Let&apos;s Get Started →
              </button>
            </div>
          )}

          {/* Profile Step */}
          {currentStep === 'profile' && (
            <div>
              <div className="text-center mb-8">
                <span className="text-4xl mb-4 block">👤</span>
                <h2 className="text-2xl font-bold text-white mb-2">About You</h2>
                <p className="text-[#9ca3af]">Help us personalize your biomarker recommendations</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="gender" className="block text-sm font-semibold text-[#e5e7eb] mb-2">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={profileData.gender}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 bg-[#232d14]/50 border-2 border-[#2a3441] rounded-xl focus:border-[#c4dd00] focus:outline-none transition-colors text-white"
                    >
                      <option value="">Select</option>
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
                      value={profileData.age}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 bg-[#232d14]/50 border-2 border-[#2a3441] rounded-xl focus:border-[#c4dd00] focus:outline-none transition-colors text-white placeholder-[#6b7280]"
                      placeholder="Years"
                    />
                  </div>
                </div>

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
                      value={profileData.weight}
                      onChange={handleProfileChange}
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
                      value={profileData.height}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 bg-[#232d14]/50 border-2 border-[#2a3441] rounded-xl focus:border-[#c4dd00] focus:outline-none transition-colors text-white placeholder-[#6b7280]"
                      placeholder="cm"
                    />
                  </div>
                </div>

                <div className="bg-[#232d14]/30 rounded-xl p-4 border border-[#c4dd00]/20">
                  <p className="text-sm text-[#9ca3af]">
                    <span className="text-[#c4dd00] font-semibold">💡 Why this matters:</span>{' '}
                    Age and gender affect optimal biomarker ranges. For example, testosterone reference ranges differ significantly between men and women.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={prevStep}
                  className="flex-1 py-4 text-[#9ca3af] font-semibold rounded-full border border-[#2a3441] hover:border-[#c4dd00]/50 transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={nextStep}
                  className="flex-1 py-4 bg-gradient-to-r from-[#c4dd00] to-[#84cc16] text-[#0a0f05] font-bold rounded-full hover:shadow-lg hover:shadow-[#c4dd00]/30 transition-all duration-300"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* Goals Step */}
          {currentStep === 'goals' && (
            <div>
              <div className="text-center mb-8">
                <span className="text-4xl mb-4 block">🎯</span>
                <h2 className="text-2xl font-bold text-white mb-2">Your Health Goals</h2>
                <p className="text-[#9ca3af]">Select up to 3 goals that matter most to you</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {HEALTH_GOALS.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                      selectedGoals.includes(goal.id)
                        ? 'border-[#c4dd00] bg-[#c4dd00]/10'
                        : 'border-[#2a3441] hover:border-[#c4dd00]/50 bg-[#232d14]/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{goal.icon}</span>
                      <div>
                        <p className={`font-semibold ${selectedGoals.includes(goal.id) ? 'text-[#c4dd00]' : 'text-white'}`}>
                          {goal.label}
                        </p>
                        <p className="text-xs text-[#6b7280]">{goal.description}</p>
                      </div>
                    </div>
                    {selectedGoals.includes(goal.id) && (
                      <div className="mt-2 flex justify-end">
                        <span className="text-[#c4dd00] text-sm">✓ Selected</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <p className="text-center text-[#6b7280] text-sm mb-6">
                {selectedGoals.length}/3 goals selected
              </p>

              <div className="flex gap-4">
                <button
                  onClick={prevStep}
                  className="flex-1 py-4 text-[#9ca3af] font-semibold rounded-full border border-[#2a3441] hover:border-[#c4dd00]/50 transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={saving}
                  className="flex-1 py-4 bg-gradient-to-r from-[#c4dd00] to-[#84cc16] text-[#0a0f05] font-bold rounded-full hover:shadow-lg hover:shadow-[#c4dd00]/30 transition-all duration-300 disabled:opacity-50"
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
                    'Complete Setup →'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Complete Step */}
          {currentStep === 'complete' && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#c4dd00] to-[#84cc16] rounded-full mb-6 shadow-lg shadow-[#c4dd00]/30">
                <span className="text-5xl">🎉</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">You&apos;re All Set!</h2>
              <p className="text-[#9ca3af] text-lg mb-8">
                Your personalized health dashboard is ready. Let&apos;s start optimizing your health!
              </p>
              <div className="flex items-center justify-center gap-2 text-[#c4dd00]">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Taking you to your dashboard...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

