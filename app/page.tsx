import Link from "next/link";
import { UploadIcon, ChartBarIcon, HeartIcon, ShieldCheckIcon } from "./components/Icons";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />

        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-32 sm:px-8 lg:px-12 lg:pt-32 lg:pb-40">
          <div className="max-w-3xl mx-auto text-center">
            {/* Logo/Brand */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-primary tracking-tight">
                Vibrantly
              </h2>
            </div>

            {/* Main Headline */}
            <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-bold leading-[1.1] tracking-tight text-foreground mb-6">
              Understand Your Health
              <span className="block text-primary mt-2">In Minutes</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto mb-12">
              Upload your medical lab report and get instant AI-powered insights into the biomarkers that matter most for men's health and longevity.
            </p>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/upload"
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-primary rounded-full hover:bg-primary-dark transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
              >
                <UploadIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
                Upload Lab Report
              </Link>

              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-foreground bg-white rounded-full border-2 border-neutral-200 hover:border-primary hover:text-primary transition-all duration-300"
              >
                Learn How It Works
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-neutral-500">
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5 text-success" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartIcon className="w-5 h-5 text-error" />
                <span>Science-Backed</span>
              </div>
              <div className="flex items-center gap-2">
                <ChartBarIcon className="w-5 h-5 text-accent" />
                <span>Instant Results</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Three Steps to Better Health
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Our AI analyzes your lab results and highlights the biomarkers that matter most for your health.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                1
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Upload Your Report
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  Simply upload your lab report PDF or photo. We support all major lab formats including Quest, LabCorp, and more.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                2
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  AI Analysis
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  Our advanced AI extracts your biomarker data and compares it against 23 key health markers curated by medical experts.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                3
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Get Actionable Insights
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  Receive clear explanations of each biomarker, why it matters, and science-backed lifestyle interventions to optimize your health.
                </p>
              </div>
            </div>
          </div>

          {/* CTA in How It Works */}
          <div className="mt-16 text-center">
            <Link
              href="/upload"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-primary rounded-full hover:bg-primary-dark transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      {/* Biomarkers Preview Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Key Biomarkers We Track
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              23 scientifically-validated biomarkers across cardiovascular health, fitness, sleep, mental health, nutrition, and hormones.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { domain: "Cardiovascular", markers: "ApoB, HbA1c, Life's Essential 8" },
              { domain: "Physical Fitness", markers: "VO₂ max, Grip Strength, Gait Speed" },
              { domain: "Sleep Quality", markers: "PSQI, Sleep Efficiency, Insomnia Index" },
              { domain: "Mental Health", markers: "PHQ-9, GAD-7, Burnout Score" },
              { domain: "Nutrition", markers: "MEDAS-14, Omega-3 Index" },
              { domain: "Hormonal", markers: "Testosterone, Cortisol" },
              { domain: "Social", markers: "Social Network Scale, Loneliness" },
              { domain: "Lifestyle", markers: "Steps, Calories, Supplements" }
            ].map((category, index) => (
              <div
                key={index}
                className="bg-neutral-50 rounded-xl p-6 border border-neutral-200 hover:border-primary transition-colors duration-300"
              >
                <h3 className="font-semibold text-foreground mb-2">
                  {category.domain}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {category.markers}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center text-sm text-neutral-500">
            <p className="mb-2">Vibrantly - Understand Your Health</p>
            <p>Medical insights powered by AI. Always consult with healthcare professionals for medical advice.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
