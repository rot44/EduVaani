# 🎙️ EduVaani (एजुवाणी) — AI English Voice Tutor for India

> **A voice-first, culturally-grounded AI English tutor built for learners across India. Practice conversational English naturally with real-time speech, instant translation into 8 Indian regional languages, and authentic Indian real-world scenarios.**

Inspired by modern voice learning platforms and customized specifically for Indian contexts.

---

## 🌟 Key Highlights

- 🗣️ **Voice-First Learning**: Speak into the glowing AI Orb and converse back and forth in English in real-time.
- 🇮🇳 **8 Indian Regional Languages**: Switch dynamically between Hindi (हिंदी), Marathi (मराठी), Gujarati (ગુજરાતી), Tamil (தமிழ்), Telugu (తెలుగు), Kannada (ಕನ್ನಡ), Bengali (বাংলা), and English.
- 🎭 **Culturally Relevant Indian Scenarios**:
  - 🛒 **भारतीय बाज़ार (Indian Bazaar)** — Shopping, negotiating prices, and market conversations.
  - 🏫 **स्कूल में (School Life)** — Speaking with teachers, classmates, and questions in class.
  - 🏥 **डॉक्टर के पास (At the Doctor)** — Describing symptoms, taking prescriptions, and medical care.
  - ✈️ **हवाई अड्डा (Airport & Travel)** — Check-in, boarding gates, and security inquiries.
  - 🍛 **रेस्टोरेंट (Restaurant & Dining)** — Ordering food, asking about dishes, and bills.
  - 💼 **नौकरी इंटरव्यू (Job Interview)** — Practicing self-introductions, career questions, and interview answers.
- 🐢/⚡ **Adaptive Speech Speed Control**: Switch between `0.85x` (Slow/Clear) and `1.0x` (Normal) to hear pronunciation clearly.
- 🔊 **Message Replay**: Re-listen to any AI response with a single tap.
- ⌨️ **Dual Mode (Voice & Text)**: Use the microphone orb or type seamlessly in quiet settings.
- 📚 **Daily Vocabulary Builder**: Essential daily Indian English words with Hindi meanings, phonetic guide, and audio pronunciation.
- 🏆 **Gamified Progress Tracking**: Day streaks, speaking time in minutes, sessions completed, and unlockable achievement badges.

---

## 🚀 Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8
- **Styling**: Tailwind CSS v4 with custom glassmorphism design system & micro-animations
- **AI Core**: Google Gemini Generative AI (`gemini-flash-latest` powered by Gemini 3.8 Flash)
- **Indian Voice & Translation Engine**:
  - **Sarvam AI (Bulbul TTS & Mayura Translation)**: Ultra-realistic Indian regional accents and translation
  - **Web Speech API**: Zero-dependency browser-native speech recognition & synthesis fallback
- **Icons**: Lucide React
- **Local Storage Auth**: Zero-friction client authentication and progress persistence

---

## 📁 Project Structure

```
EduVaani/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx             # Navigation bar with user status & quick links
│   │   ├── Footer.tsx             # Footer with credits and language badges
│   │   ├── LanguageSelector.tsx   # Dropdown for 8 Indian regional languages
│   │   └── VoiceTutor.tsx         # Voice Orb, dual input, translation & audio engine
│   ├── lib/
│   │   ├── ai.ts                  # Gemini AI service & scenario prompts
│   │   ├── speech.ts              # Web Speech STT & TTS engine with speed controls
│   │   ├── translation.ts         # Multilingual translation service
│   │   ├── auth.ts                # Session state, streak & achievement metrics
│   │   └── utils.ts               # Tailwind class merger
│   ├── pages/
│   │   ├── Home.tsx               # High-impact landing page
│   │   ├── Login.tsx              # Quick user onboarding
│   │   └── Dashboard.tsx          # Practice hub, scenario picker & vocabulary bank
│   ├── App.tsx                    # React Router configuration
│   └── index.css                  # Modern glassmorphism & animation system
├── .env.example                   # Environment configuration template
├── package.json
└── vite.config.ts
```

---

## ⚙️ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Open `.env` and provide your Google Gemini API key:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```
> *(Get your free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).)*

### 3. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```

---

## 🌐 Browser Voice Support
EduVaani uses the native Web Speech API for zero-latency speech recognition and synthesis.
- **Recommended Browsers**: Google Chrome (desktop & mobile) or Microsoft Edge for full speech recognition & synthesis capabilities.
