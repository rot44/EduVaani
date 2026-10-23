# 🎙️ EduVaani (एजुवाणी) — AI English Voice & Sign Tutor for India

> **A voice-first, culturally-grounded AI English & Indian Sign Language (ISL) tutor built for learners across India. Practice conversational English naturally with real-time speech, instant translation into 8 Indian regional languages, an authentic Indian Sign Language studio, and culturally-grounded real-world scenarios.**

EduVaani bridges the linguistic and accessibility divide across Bharat by unifying spoken voice, text, and Indian Sign Language (ISL) into one seamless, accessible learning companion.

---

## 🌟 Key Highlights

### 🗣️ Voice-First Learning & Multimodal Hub
- **Interactive AI Voice Orb**: Speak into the glowing AI Orb with real-time speech recognition and lifelike responses.
- **Multimodal Communication Hub**: Effortlessly switch between **Voice**, **Text**, and **Sign Language** input and output modes at any point during conversations.
- **8 Indian Regional Languages**: Real-time vernacular translations in Hindi (हिंदी), Marathi (मराठी), Gujarati (ગુજરાતી), Tamil (தமிழ்), Telugu (తెలుగు), Kannada (ಕನ್ನಡ), Bengali (বাংলা), and Indian English.
- **Cultural Roleplay Scenarios**:
  - 🛒 **भारतीय बाज़ार (Indian Bazaar)** — Shopping, negotiating prices, and market conversations.
  - 🏫 **स्कूल में (School Life)** — Speaking with teachers, classmates, and questions in class.
  - 🏥 **डॉक्टर के पास (At the Doctor)** — Describing symptoms, discussing prescriptions, and clinical consultations.
  - ✈️ **हवाई अड्डा (Airport & Travel)** — Check-in, boarding gates, and security inquiries.
  - 🍛 **रेस्टोरेंट (Restaurant & Dining)** — Ordering dishes, dietary preferences, and bills.
  - 💼 **नौकरी इंटरव्यू (Job Interview)** — Practicing self-introductions, career questions, and interview answers.
- **Real-Time Fluency & Grammar Coaching**: Constructive, encouraging feedback on every phrase with grammatical tips and celebratory confetti for milestones.
- **Adaptive Speech Controls**: Switch between `0.85x` (Slow/Clear) and `1.0x` (Normal) playback speed with instant replay.

---

### 🤟 Indian Sign Language (ISL) Studio
- **Two-Way Sign Language Companion**:
  - **Camera Sign Practice**: Real-time hand landmark detection using MediaPipe with rule-based heuristics and optional Gemini Vision inference.
  - **Text-to-Sign Generation**: Converts English words into authentic Indian Sign Language hand animations and fingerspelling sequences.
- **Consent-First Media Handling**: Webcam and microphone are strictly permission-based; camera tracks are immediately stopped and released when deactivated or unmounted.
- **Honest AI & Model Limitations**:
  > ⚠️ **ISL Model Notice**: *Currently supports ISL alphabet (A-Z) and 24 common words. Full ISL sentence translation is not yet available.* EduVaani strictly avoids claiming full ISL linguistic translation, adhering to genuine ISL linguistic structures and fingerspelling standards.

---

### 📊 Progress Analytics & Learning Insights
- **Weekly Practice Chart**: Daily speaking minutes with 15-minute goal tracking.
- **Fluency Progression Trend**: Historical tracking of fluency scores across practice sessions.
- **Scenario Breakdown**: Donut visualization of scenario practice distribution.
- **Activity Heatmap & Streak Calendar**: Visual habit tracking for learner consistency.
- **Curriculum & Vocab Progress**: Mastery tracking of daily vocabulary and conversational terms.

---

## 🚀 Tech Stack

- **Frontend Core**: React 19, TypeScript, Vite 8
- **Styling**: Tailwind CSS v4 with bespoke Indian aesthetic tokens (Terracotta `#C85A32`, Peacock Teal `#1F6F78`, Turmeric `#D97706`, Warm Sand `#E7D8C9`, Cream White `#FFFDF9`, Deep Brown `#2D2327`)
- **Animation**: Framer Motion 12 (smooth page transitions, spring docks, pulse effects, 3D card flips) & Canvas Confetti
- **Computer Vision & Gesture Recognition**:
  - `@mediapipe/tasks-vision` (Hand landmark detection with 21 3D keypoints)
  - Custom ISL geometric classifier & multi-stage heuristic engine
- **AI Core**: Google Gemini Generative AI (`gemini-2.5-flash` / `gemini-flash-latest`)
- **Indian Voice & Regional Translation**:
  - **Sarvam AI (Bulbul TTS, Mayura Translation, Saaras STT)**: High-fidelity natural Indian voices and regional translations
  - **Web Speech API**: Zero-dependency browser-native speech recognition & speech synthesis fallback
- **Accessibility & Compliance**: WCAG AAA high-contrast focus rings, skip-to-content links, aria-live announcements, and reduced-motion support

---

## 📁 Project Structure

```
EduVaani/
├── src/
│   ├── components/
│   │   ├── analytics/             # Practice chart, fluency trend, scenario donut, heatmap
│   │   ├── dashboard/             # Stats, welcome banner, scenario cards, vocab flashcards, past sessions
│   │   ├── landing/               # Hero, language demo, scenario grid, testimonials
│   │   ├── layout/                # PageLoader, ErrorBoundary
│   │   ├── sign/                  # CameraPanel, RecognitionOutput, SignGenerationOutput, TextInputPanel
│   │   ├── tutor/                 # VoiceOrb, ControlDock, MessageBubble, CoachingTipCard
│   │   ├── ui/                    # Button, Badge, Skeleton, Toast, AnimatedCounter
│   │   ├── Navbar.tsx             # Responsive navigation with goal progress ring & mobile drawer
│   │   └── Footer.tsx             # Footer with credits and cultural badges
│   ├── contexts/
│   │   └── UserContext.tsx        # User profile, preferences, streak, and auth context
│   ├── data/
│   │   ├── isl-signs.json         # Supported ISL signs dictionary & landmark definitions
│   │   └── isl-sign-animations.json # ISL animation keyframes and fingerspelling mappings
│   ├── lib/
│   │   ├── ai.ts                  # Gemini AI service, scenarios & smart fallback engine
│   │   ├── auth.ts                # Session management, streak calculations & achievement metrics
│   │   ├── multimodal.ts          # Central Multimodal Communication Manager
│   │   ├── sarvam.ts              # Sarvam AI Bulbul TTS, translation & STT client
│   │   ├── signGeneration.ts      # Text-to-ISL animation sequencer
│   │   ├── signLanguage.ts        # Hand gesture detection & ISL classification engine
│   │   ├── signLanguageModels.ts  # MediaPipe HandLandmarker lifecycle & Gemini Vision fallback
│   │   ├── speech.ts              # Web Speech API + Sarvam TTS hybrid audio service
│   │   └── translation.ts         # Multilingual translation service
│   ├── pages/
│   │   ├── Home.tsx               # Cultural landing page with interactive voice demo
│   │   ├── Login.tsx              # 2-step onboarding (Identity + Language & Accessibility Preferences)
│   │   ├── Dashboard.tsx          # Main practice hub with 3D flashcards & session transcripts
│   │   ├── SignLanguageTutor.tsx  # Dedicated Indian Sign Language studio
│   │   └── Analytics.tsx          # Learning metrics, charts & progress insights
│   ├── App.tsx                    # Routing with Framer Motion page transitions & RequireAuth guards
│   └── index.css                  # Design tokens, keyframe animations & accessibility styles
├── .env.example                   # Environment configuration template
├── package.json
└── vite.config.ts
```

---

## ⚙️ Quick Start

### 1. Prerequisites
- **Node.js**: v18.0.0 or later (v20+ recommended)
- **Webcam & Microphone**: Required for voice practice and sign language gesture recognition.

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to create your local `.env` file:
```bash
cp .env.example .env
```

Open `.env` and fill in your API credentials:
```env
# Google Gemini API Key (from https://aistudio.google.com/app/apikey)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Sarvam AI API Key (from https://dashboard.sarvam.ai)
VITE_SARVAM_API_KEY=your_sarvam_api_key_here
```

> **Note on Resilient Fallbacks**:
> - If `VITE_GEMINI_API_KEY` is not provided, EduVaani automatically engages its built-in rule-based coaching engine and conversational fallback generator so the app remains fully functional.
> - If `VITE_SARVAM_API_KEY` is not provided, EduVaani gracefully falls back to the native browser Web Speech API for voice synthesis and recognition.

### 4. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 5. Run Quality Checks
```bash
# Linter check (oxlint)
npm run lint

# TypeScript type check
npx tsc --noEmit

# Production build
npm run build
```

---

## 🌐 Browser & Hardware Compatibility

### 🎙️ Microphone & Voice Features
- **Desktop**: Google Chrome, Microsoft Edge, Brave, and Safari.
- **Mobile**: Google Chrome for Android and Safari for iOS.
- **Permissions**: Requires user permission to access the microphone. A built-in microphone diagnostic modal (`MicDiagnosticModal`) is accessible from the dashboard to troubleshoot permissions and audio volume.

### 📹 Camera & Sign Language Studio
- **Desktop**: Google Chrome, Microsoft Edge, Safari, and Firefox.
- **Mobile**: Modern mobile browsers supporting WebRTC `getUserMedia`.
- **Media Release**: Camera streams and hardware tracks are strictly terminated upon closing the camera or navigating away from the page to preserve device battery and respect privacy.

---

## 📄 License & Attribution

- Built with ❤️ for Bharat's learners.
- Indian Sign Language gesture definitions are curated in alignment with [ISLRTC](https://islrtc.nic.in/) (Indian Sign Language Research and Training Centre) educational resources.
