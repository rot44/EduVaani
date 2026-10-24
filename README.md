# EduVaani (एजुवाणी)

An accessible multimodal AI English and Indian Sign Language tutor engineered for learners across India. EduVaani integrates conversational voice practice, real-time vernacular translation across eight Indian regional languages, and an Indian Sign Language studio powered by on-device computer vision.

---

## System Architecture

EduVaani is structured around a centralized multimodal orchestration layer that synchronizes voice, text, and sign language streams into a unified conversational context.

```
                                  +-----------------------------+
                                  |     Learner Interaction     |
                                  |    (Voice / Sign / Text)    |
                                  +--------------+--------------+
                                                 |
                                                 v
                       +-------------------------------------------------+
                       |         Multimodal Communication Manager        |
                       |       (Unified Context & State Machine)         |
                       +-------+-----------------+-----------------+-----+
                               |                 |                 |
             +-----------------+                 |                 +-----------------+
             v                                   v                                   v
+--------------------------+    +--------------------------------+    +-----------------------------+
|    Spoken Voice Stream   |    |       Gemini 2.5 Pipeline      |    |     Sign Language Studio    |
|                          |    |                                |    |                             |
|  * Primary: Sarvam AI    |    |  * Conversational Dialogue     |    |  * MediaPipe Vision Tasks   |
|    - Bulbul v3 TTS       |--->|  * Indian English Grammar      |--->|    - 21 3D Hand Landmarks   |
|    - Mayura v1 Translate |    |  * Fluency Scoring (0-100)     |    |  * ISL Geometric Heuristics |
|    - Saaras STT          |    |  * Native Language Explanations|    |  * 324 Word Vocabulary      |
|  * Fallback: Web Speech  |    |  * Gemini Vision Heuristics    |    |  * 26 A-Z Fingerspelling    |
|    - WebKit Speech Rec   |    +--------------------------------+    |  * ISL Sequence Animator    |
|    - SpeechSynthesis     |                                          +-----------------------------+
+--------------------------+
```

---

## Core Capabilities

### 1. Conversational Voice Engine with Resilient Fallback
- **Sarvam AI Indic Speech Stack**: High-fidelity Indian English and regional voice generation using Sarvam Bulbul v3 alongside Mayura v1 neural translation.
- **Client-Side Speech Fallback**: Zero-dependency Web Speech API engine running speech recognition and local speech synthesis if network latency spikes or API limits are reached.
- **Adaptive Cadence Control**: Toggle between 0.85x slow speed for beginners and 1.0x natural conversational pace with instant replay.
- **Microphone Diagnostic Suite**: Integrated Web Audio API diagnostic testing noise floor, frequency distribution, and input permissions before starting sessions.

### 2. Indian Sign Language (ISL) Studio
- **On-Device Landmark Tracking**: Powered by MediaPipe Vision Tasks WebAssembly runtime, processing 21 three-dimensional keypoints per hand directly in the browser at 30+ FPS.
- **ISLRTC Standards Alignment**: Follows structural conventions from the Indian Sign Language Research and Training Centre, including two-handed signs and Subject-Object-Verb (SOV) sentence order.
- **Curated ISL Dataset**: 324 verified word signs across 18 real-world categories alongside 26 alphabetic manual fingerspelling configurations.
- **Two-Way Sign Animator**: Converts typed or spoken English text into synchronized ISL hand animation sequences.
- **Privacy-Preserving Vision**: Camera frames remain inside local browser memory. Hardware video tracks are immediately stopped upon closing the studio or changing tabs.

### 3. Culturally Grounded Conversational Scenarios
Learners practice English in familiar Indian environments rather than abstract western settings:
- **भारतीय बाज़ार (Indian Bazaar)**: Negotiating prices, asking for fresh produce, and polite market bargaining.
- **स्कूल में (At School)**: Interacting with teachers, clarifying doubts in class, and discussing exams.
- **डॉक्टर के पास (At the Clinic)**: Articulating symptoms, asking about dosage schedules, and clinical guidance.
- **हवाई अड्डा (Airport & Travel)**: Managing check-in counters, luggage drops, and boarding announcements.
- **रेस्टोरेंट (Restaurant Dining)**: Navigating menus, specifying dietary preferences, and requesting invoices.
- **नौकरी इंटरव्यू (Job Interview)**: Introducing professional backgrounds, discussing strengths, and answering interview prompts.
- **कहानी मंच (Story Kingdom)**: Folk stories and creative narrative development.
- **गली क्रिकेट (Street Cricket)**: High-energy casual chat, match rules, and sports banter.

### 4. Vernacular Explanations & Grammar Coaching
- **Eight Regional Languages Supported**: Hindi, Marathi, Gujarati, Tamil, Telugu, Kannada, Bengali, and Indian English.
- **Contextual Corrections**: Provides side-by-side comparisons of the original phrase, the refined sentence, the grammar principle applied, and an explanation written in the user native tongue.
- **Milestone Rewards**: Built-in streak trackers and celebratory visual confetti upon mastering vocabulary terms.

---

## Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | React 19 | Declarative UI rendering and concurrent state handling |
| **Language** | TypeScript 6.0 | Strict end-to-end type safety and interface definitions |
| **Build Tool** | Vite 8 | Near-instant HMR and optimized production rollup bundling |
| **Styling** | Tailwind CSS v4 & PostCSS | Utility-first CSS architecture with custom Indian color tokens |
| **Animations** | Framer Motion 14 | Fluid layout transitions, spring physics docks, and 3D card flips |
| **Computer Vision** | @mediapipe/tasks-vision | On-device WebAssembly hand landmark detection with 21 3D coordinates |
| **Primary AI** | Google Gemini 2.5 Flash | Conversational simulation, grammar analysis, and vision fallback |
| **Indic Voice AI** | Sarvam AI (Bulbul, Mayura, Saaras) | Indian accent text-to-speech, regional translation, and audio processing |
| **Local Speech** | Web Speech API | Client-side zero-latency speech recognition and speech synthesis |
| **Accessible Primitives** | Radix UI | Headless accessible UI components adhering to WCAG standards |
| **Visual Effects** | Canvas Confetti | Celebratory particle bursts for streak achievements and milestones |
| **Linter** | Oxlint | Fast Rust-based linter ensuring strict code hygiene |
| **Routing** | React Router v7 | Client-side routing with route guards |

---

## Directory Structure

```
EduVaani/
├── src/
│   ├── components/
│   │   ├── analytics/             # Weekly practice chart, fluency trends, heatmap
│   │   ├── dashboard/             # Scenario grid, 3D flashcards, past sessions, quick start
│   │   ├── landing/               # Hero section, interactive demo, features, testimonials
│   │   ├── layout/                # Responsive navigation, footer, error boundaries
│   │   ├── sign/                  # Camera panel, sign visualizer, gesture recognition output
│   │   ├── tutor/                 # Voice orb, control dock, transcript viewer, message bubble
│   │   └── ui/                    # Button, badge, modal dialogs, skeleton loaders
│   ├── contexts/
│   │   └── UserContext.tsx        # User profile, learning preferences, streak tracking
│   ├── data/
│   │   ├── isl-signs.json         # ISLRTC gesture definitions and landmark coordinates
│   │   └── isl-sign-animations.json # 324 vocabulary signs and 26 alphabetic keyframes
│   ├── lib/
│   │   ├── ai.ts                  # Google Gemini 2.5 client, prompt templates, rule engine
│   │   ├── auth.ts                # Session state, streak logic, achievement milestones
│   │   ├── multimodal.ts          # Central state orchestrator for voice, text, and sign
│   │   ├── sarvam.ts              # Sarvam AI Bulbul TTS and Mayura translation client
│   │   ├── signGeneration.ts      # Text-to-sign sequencing and animation coordinator
│   │   ├── signLanguage.ts        # Hand landmark geometric analysis and gesture matcher
│   │   ├── signLanguageModels.ts  # MediaPipe HandLandmarker lifecycle and vision fallback
│   │   ├── speech.ts              # Hybrid Web Speech and Sarvam audio service
│   │   └── translation.ts         # Regional translation coordinator
│   ├── pages/
│   │   ├── Home.tsx               # Landing page with live audio preview
│   │   ├── Login.tsx              # Onboarding flow with vernacular and accessibility selection
│   │   ├── Dashboard.tsx          # Main practice hub with scenario filters and flashcards
│   │   ├── SignLanguageTutor.tsx  # Dedicated Indian Sign Language studio
│   │   └── Analytics.tsx          # Practice analytics, fluency history, and milestone badges
│   ├── App.tsx                    # Route definitions and page transition transitions
│   └── index.css                  # Design tokens, accessibility focus rings, custom animations
├── public/                        # Static assets and MediaPipe model binaries
├── vercel.json                    # Single-page application routing and API rewrite rules
├── package.json                   # Project dependencies and script declarations
├── tsconfig.json                  # TypeScript compiler configuration
└── vite.config.ts                 # Vite bundler plugins and server options
```

---

## Local Development Setup

### Prerequisites
- Node.js version 18.0.0 or higher (v20+ recommended)
- A working microphone and webcam for voice and sign language features

### 1. Clone the Repository
```bash
git clone https://github.com/rot44/EduVaani.git
cd EduVaani
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory by copying the template:
```bash
cp .env.example .env
```

Populate the keys in `.env`:
```env
# Google Gemini API key (https://aistudio.google.com/app/apikey)
VITE_GEMINI_API_KEY=your_gemini_api_key

# Sarvam AI API key (https://dashboard.sarvam.ai)
VITE_SARVAM_API_KEY=your_sarvam_api_key
```

> **Autonomous Fallback System**: If external API keys are not supplied, EduVaani automatically engages its internal offline heuristic engines. Gemini falls back to deterministic coaching rules, and Sarvam AI falls back to the native Web Speech API.

### 4. Launch Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:5173`.

### 5. Verify Build and Types
```bash
# Run Rust-based linter
npm run lint

# TypeScript compilation check
npx tsc --noEmit

# Production bundle build
npm run build
```

---

## Browser and Hardware Compatibility

### Audio and Voice Recognition
- Supported on Google Chrome, Microsoft Edge, Brave, and Safari.
- Audio capture utilizes 16 kHz single-channel input with automatic gain control, acoustic echo cancellation, and background noise suppression.
- The built-in Microphone Diagnostic modal allows testing input levels and troubleshooting browser permissions.

### Computer Vision and Camera
- Supported on all modern WebRTC-compliant browsers (Chrome, Edge, Firefox, Safari).
- Media streams are isolated to the active session. When turning off the camera or unmounting the sign studio, all media tracks are stopped and released immediately to protect privacy and battery life.

---

## Standards and Attribution

- Indian Sign Language gesture definitions are curated in alignment with [ISLRTC](https://islrtc.nic.in/) (Indian Sign Language Research and Training Centre) educational resources.
- Color palette and aesthetic tokens are inspired by classical Indian materials including terracotta, turmeric, and peacock teal, maintaining WCAG AAA contrast ratios for accessibility.
