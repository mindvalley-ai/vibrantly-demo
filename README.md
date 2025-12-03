# Vibrantly - Medical Lab Report Analysis Platform

A beautiful, premium web application that uses AI to analyze medical lab reports and provide actionable insights into biomarkers that matter most for men's health and longevity.

![Vibrantly Screenshot](https://via.placeholder.com/1200x600/1E40AF/FFFFFF?text=Vibrantly+-+Understand+Your+Health+In+Minutes)

## Features

- **AI-Powered Analysis**: Upload medical lab reports (PDF, JPEG, PNG) and get instant AI analysis using Claude
- **Educational Biomarker Cards**: Comprehensive explanations for 23 scientifically-validated biomarkers
- **Lifestyle Interventions**: Science-backed recommendations for optimizing each biomarker
- **Beautiful UI**: Apple-level aesthetics with Mindvalley branding (white backgrounds, off-black text, premium design)
- **Hybrid User Model**: Start anonymous, optionally create account to save history
- **Mobile-Responsive**: Optimized for all devices
- **Accessible**: WCAG 2.2 AA compliant

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI**: React 19 Server Components
- **Styling**: Tailwind CSS 4.0 with custom design tokens
- **Animations**: Framer Motion v12
- **AI**: Anthropic Claude API (Claude Sonnet 4)
- **Database**: Airtable (biomarker reference data)
- **Type Safety**: TypeScript 5.3+ (strict mode)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Anthropic API key ([Get one here](https://console.anthropic.com/))
- Airtable API key ([Get one here](https://airtable.com/create/tokens))

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**

   Copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` and add your API keys:
   ```env
   # Anthropic Claude API
   ANTHROPIC_API_KEY=your_anthropic_api_key_here

   # Airtable API
   AIRTABLE_API_KEY=your_airtable_api_key_here
   AIRTABLE_BASE_ID=appPTWTOOt1hfGmFk
   AIRTABLE_TABLE_ID=tbl2Y0CYIee7BYqau
   AIRTABLE_VIEW_ID=viwEUUA5WOTyxArN0
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
vibrantly/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts      # Claude API integration
│   │   └── biomarkers/route.ts   # Airtable integration
│   ├── components/
│   │   ├── BiomarkerCard.tsx    # Educational cards
│   │   ├── FileUploader.tsx     # Upload component
│   │   └── Icons.tsx            # SVG icons
│   ├── results/page.tsx         # Results page
│   ├── upload/page.tsx          # Upload page
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   └── globals.css              # Design system
├── lib/
│   └── utils.ts                 # Utilities
└── public/                      # Static assets
```

## Key Features

### Landing Page
- Hero section with clear value proposition
- "How It Works" with 3-step process
- Biomarkers preview across 8 health domains
- Trust indicators (Secure, Science-Backed, Instant)

### Upload Flow
- Drag-and-drop file upload
- File validation (PDF, JPEG, PNG, HEIC up to 10MB)
- Progress indicator
- Privacy notice

### AI Analysis
- Claude Sonnet 4 vision model
- Extracts biomarker data from medical reports
- Handles mixed formats (PDFs, images, scans)

### Results Display
- Categorized biomarkers (Core, Popular, Other)
- Status indicators (Normal, High, Low)
- Educational cards with expand/collapse
- Print/download functionality

## Biomarkers Tracked (23 Total)

- **Cardiovascular**: ApoB, Life's Essential 8, Waist-to-height ratio, HbA1c
- **Physical Fitness**: Gait speed, VO₂ max, Grip strength
- **Sleep Quality**: PSQI, Sleep efficiency, Insomnia Index
- **Mental Health**: PHQ-9, GAD-7, Burnout Score
- **Nutrition**: MEDAS-14, Omega-3 Index
- **Hormonal**: Testosterone, Cortisol
- **Social**: Social Network Scale, Loneliness Scale
- **Lifestyle**: Steps, Calories, Supplements, Weight

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

Add environment variables in Vercel dashboard.

### Build for Production
```bash
npm run build
npm start
```

## Security & Privacy

- Files processed securely (not stored permanently)
- Encrypted during analysis
- Session-based storage (automatically deleted)
- HIPAA-aware data handling

---

**Note**: Always consult with healthcare professionals for medical advice. This tool is for educational purposes only.
