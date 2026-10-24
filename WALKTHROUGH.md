# EduVaani System Walkthrough, Features and API Specifications

This document outlines the architecture, end-to-end user workflows, feature specifications, and exact API data contracts powering EduVaani (एजुवाणी).

---

## 1. Executive Summary

EduVaani is an accessible multimodal AI English and Indian Sign Language (ISL) tutor designed specifically for learners across India. It addresses two widespread educational bottlenecks:
1. The lack of safe, judgment-free conversational English practice grounded in everyday Indian contexts.
2. The lack of accessible, standardized digital learning tools for the Deaf and Hard-of-Hearing community practicing Indian Sign Language.

EduVaani unifies spoken voice, text input, vernacular translations across eight Indian regional languages, and an on-device computer vision gesture studio into a single synchronized learning environment.

---

## 2. End-to-End User Journey (How to Use EduVaani)

```
[1. Onboarding] ---> [2. Dashboard Hub] ---> [3. Voice Practice]
                             |                       |
                             v                       v
                    [4. ISL Studio]        [5. Analytics & Habits]
```

### Step 1: Onboarding and Linguistic Preferences
1. Navigate to the login screen.
2. Enter your name, target daily practice duration (default: 15 minutes), and mother tongue from the supported list:
   - Hindi (हिंदी)
   - Marathi (मराठी)
   - Gujarati (ગુજરાતી)
   - Tamil (தமிழ்)
   - Telugu (తెలుగు)
   - Kannada (ಕನ್ನಡ)
   - Bengali (বাংলা)
   - Indian English
3. Indicate whether you use Indian Sign Language. If enabled, the dashboard highlights the sign studio by default.
4. Preferences are persisted locally in browser storage and sync seamlessly across sessions.

### Step 2: The Dashboard Hub
The dashboard serves as the central command center:
- **Daily Streak & Goal Tracker**: Visual counter tracking daily practice consistency and progress toward the 15-minute goal.
- **Quick-Start Conversation**: Single-click launcher into an open, free-flow English chat with Vaani.
- **Scenario Grid**: Eight cultural practice simulations grouped under Daily Life, Travel, Career, and Creative filters.
- **3D Vocabulary Flashcards**: Daily curated Indian English terms with interactive flip animations and native audio pronunciation.
- **Past Sessions Archive**: Complete conversation transcripts, date records, and fluency scores.

### Step 3: Interactive Voice Tutor Session
1. Select a roleplay scenario (e.g., Indian Bazaar or Job Interview) or tap **Free-Flow English**.
2. The Voice Tutor opens in a focused, high-contrast practice stage:
   - **Glowing AI Voice Orb**: Provides clear visual states (Idle, Listening, Processing, Speaking).
   - **Adaptive Speech Rate**: Switch between 0.85x (Slow and Clear for beginners) and 1.0x (Natural conversational tempo).
   - **Engine Selector**: Switch between Sarvam AI (natural Indian accent) and browser native voices.
   - **Output Mode Dock**: Choose whether the AI tutor responds through Voice, Text, Sign Animations, or All three simultaneously.
   - **Real-Time Coaching**: After each sentence spoken by the user, the AI provides an improved sentence structure, the grammar rule involved, a fluency rating (0-100), and an explanation in the learner native language.
   - **Microphone Diagnostic Suite**: Accessible from the top bar to inspect mic permissions, input gain, and background noise floor.

### Step 4: Indian Sign Language (ISL) Studio
1. Open the Sign Language Tutor from the navigation bar or dashboard card.
2. **Webcam Practice**: Click **Start Camera** to activate the local video feed.
   - A dotted guide box helps learners position their hands. The guide message automatically fades after 10 seconds to keep the camera view clean.
   - As hands are detected, 21 skeletal landmarks per hand are rendered over the video at 30+ FPS.
   - The geometric classifier compares landmark coordinates against the active target sign and calculates a match percentage.
3. **Dual AI Classification**:
   - **MediaPipe Local**: 100% on-device WebAssembly heuristic engine with zero network latency.
   - **Gemini Vision**: Cloud multimodal analysis for complex gestures and edge cases.
4. **Text-to-Sign Generation**: Type any English word or sentence into the prompt panel. The system parses the text against 324 vocabulary signs and 26 alphabetic fingerspelling signs, playing back smooth keyframe animations in sequence.

### Step 5: Analytics and Progress Review
1. Open the Analytics dashboard to inspect long-term learning habits:
   - **Weekly Practice Chart**: Bar graph comparing daily speaking minutes against the 15-minute target.
   - **Fluency Progression**: Trend line showing overall grammatical accuracy and vocabulary scores over time.
   - **Scenario Breakdown**: Donut chart tracking which scenarios receive the most practice.
   - **Activity Heatmap**: Calendar matrix celebrating unbroken learning streaks.

---

## 3. Feature Directory and Architectural Roles

| Feature | Primary Module | Technical Description |
| :--- | :--- | :--- |
| **Multimodal State Manager** | `src/lib/multimodal.ts` | Central state machine coordinating voice, text, and sign streams into unified chat history |
| **Conversational AI Engine** | `src/lib/ai.ts` | Gemini 2.5 Flash pipeline handling system prompts, Indian English nuance, and feedback parsing |
| **Indic Speech Service** | `src/lib/sarvam.ts` | Sarvam Bulbul v3 TTS, Mayura v1 translation, and Saaras v1 STT client |
| **Local Speech Service** | `src/lib/speech.ts` | Web Speech API speech synthesis and recognition with dynamic audio noise gating |
| **Landmark Detection** | `src/lib/signLanguageModels.ts` | MediaPipe HandLandmarker WebAssembly runtime running on-device inference |
| **ISL Gesture Classifier** | `src/lib/signLanguage.ts` | Multi-stage geometric classifier analyzing joint angles, Euclidean distances, and palm vectors |
| **Text-to-Sign Sequencer** | `src/lib/signGeneration.ts` | Natural language parser converting English sentences into ISL keyframe animation queues |
| **User & Streak Context** | `src/contexts/UserContext.tsx` | React Context managing learner profile, streak calculations, and milestone triggers |

---

## 4. API Endpoints, Payloads and Data Contracts

### 4.1 Google Gemini Generative AI (Dialogue & Grammar Engine)

- **Provider**: Google Cloud Generative AI
- **Model**: `gemini-2.5-flash` (with automatic fallback to `gemini-flash-latest`)
- **Protocol**: HTTPS POST via Google Generative AI SDK (`@google/generative-ai`)

#### System Prompt Structure
Every prompt sent to Gemini establishes the persona, cultural context, and an explicit JSON formatting schema:

```json
{
  "role": "user",
  "parts": [
    {
      "text": "You are EduVaani, a friendly English tutor for Indian learners.
Analyze the user response: 'I am go to market yesterday'
Return valid JSON matching:
{
  "reply": "Conversational reply under 40 words",
  "coaching": {
    "original": "I am go to market yesterday",
    "improved": "I went to the market yesterday.",
    "explanationHindi": "'Yesterday' बीते हुए कल की बात करता है, इसलिए 'go' की जगह 'went' का प्रयोग करें।",
    "fluencyScore": 65,
    "rule": "Simple Past Tense",
    "islGloss": "YESTERDAY I MARKET GO",
    "islGrammarTip": "Time marker YESTERDAY appears at the start of sentence.",
    "islHandshapeTip": "Open flat hand moved backward over shoulder."
  }
}"
    }
  ]
}
```

#### Structured Output Contract
```typescript
export interface CoachingTip {
  original: string;
  improved: string;
  explanationHindi: string;
  fluencyScore: number; // Integer between 0 and 100
  rule: string;
  islGloss?: string; // Subject-Object-Verb gloss
  islGrammarTip?: string;
  islHandshapeTip?: string;
}
```

---

### 4.2 Sarvam AI Indic Speech Services

- **Base URL**: `https://api.sarvam.ai`
- **Authentication**: Header `api-subscription-key: <VITE_SARVAM_API_KEY>`

#### Endpoint A: Text-to-Speech (Bulbul v3)
Converts text into lifelike speech with natural Indian regional accents.

- **Method**: `POST`
- **Path**: `/text-to-speech`
- **Request Headers**:
  - `Content-Type: application/json`
  - `api-subscription-key: <key>`

```json
{
  "inputs": ["Namaste! Welcome to your conversational English practice session."],
  "target_language_code": "en-IN",
  "speaker": "kavya",
  "pitch": 0,
  "pace": 0.95,
  "loudness": 1.2,
  "speech_sample_rate": 22050,
  "enable_preprocessing": true,
  "model": "bulbul:v3"
}
```

- **Success Response (200 OK)**:
```json
{
  "audios": [
    "UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA..."
  ]
}
```
The audio string is decoded directly into a base64 `audio/wav` data URI for immediate playback through the Web Audio API.

#### Endpoint B: Regional Translation (Mayura v1)
Translates dialogue between English and eight Indian languages.

- **Method**: `POST`
- **Path**: `/translate`
- **Request Headers**:
  - `Content-Type: application/json`
  - `api-subscription-key: <key>`

```json
{
  "input": "Practice speaking English fearlessly every day.",
  "source_language_code": "en-IN",
  "target_language_code": "hi-IN",
  "speaker_gender": "Female",
  "mode": "formal",
  "model": "mayura:v1"
}
```

- **Success Response (200 OK)**:
```json
{
  "translated_text": "हर दिन बिना किसी डर के अंग्रेजी बोलने का अभ्यास करें।"
}
```

#### Endpoint C: Speech-to-Text (Saaras v1)
Transcribes captured audio into English or native regional text.

- **Method**: `POST`
- **Path**: `/speech-to-text`
- **Request Format**: `multipart/form-data`
  - `file`: Audio Blob (WAV, 16 kHz sample rate, single channel)
  - `model`: `saaras:v1`
  - `language_code`: `en-IN`

- **Success Response (200 OK)**:
```json
{
  "transcript": "I would like to order two plates of idli sambar please.",
  "language_code": "en-IN"
}
```

---

### 4.3 MediaPipe Vision Tasks (Local Kinematic Engine)

- **Runtime**: WebAssembly via `@mediapipe/tasks-vision`
- **Model Asset**: `hand_landmarker.task` (served from local `/public` directory or official CDN)
- **Execution Target**: Browser client Web Worker or main thread animation loop

#### Data Contract: Normalized Landmarks
For each detected hand, the vision pipeline outputs 21 three-dimensional coordinate vectors normalized between 0.0 and 1.0:

```typescript
interface NormalizedLandmark {
  x: number; // Horizontal axis (0.0 left to 1.0 right)
  y: number; // Vertical axis (0.0 top to 1.0 bottom)
  z: number; // Depth relative to wrist joint
}

interface HandLandmarkerResult {
  landmarks: NormalizedLandmark[][]; // Array of 21 keypoints per hand
  worldLandmarks: NormalizedLandmark[][];
  handedness: Array<{ index: number; score: number; categoryName: 'Left' | 'Right' }>;
}
```

#### Keypoint Indices Map
```
Wrist: 0
Thumb:  1 (CMC),  2 (MCP),  3 (IP),   4 (TIP)
Index:  5 (MCP),  6 (PIP),  7 (DIP),  8 (TIP)
Middle: 9 (MCP), 10 (PIP), 11 (DIP), 12 (TIP)
Ring:  13 (MCP), 14 (PIP), 15 (DIP), 16 (TIP)
Pinky: 17 (MCP), 18 (PIP), 19 (DIP), 20 (TIP)
```

#### Geometric Heuristic Classifications
The classifier calculates:
1. **Finger Extension State**: Comparing distance from fingertip to wrist against PIP joint to wrist.
2. **Inter-Hand Midline Proximity**: Distance between left wrist (landmark 0) and right wrist (landmark 0) to verify two-handed signs such as Namaste.
3. **Palm Orientation Vectors**: Cross product of vector(0->5) and vector(0->17) determining whether palms face inward, upward, or toward the camera.

---

### 4.4 Local Storage Data Contracts

EduVaani preserves state entirely on the client, ensuring offline resilience and privacy:

#### 1. User Profile (`eduvaani_user_profile`)
```typescript
interface UserProfile {
  id: string;
  name: string;
  preferredLanguage: string; // 'hi', 'mr', 'gu', 'ta', 'te', 'kn', 'bn', 'en'
  dailyGoalMinutes: number;
  streakDays: number;
  lastActiveDate: string; // ISO date string YYYY-MM-DD
  sessionsCompleted: number;
  usesSignLanguage: boolean;
}
```

#### 2. Saved Sessions Archive (`eduvaani_past_sessions`)
```typescript
interface SavedSession {
  id: string; // UUID or timestamp identifier
  date: string; // Formatted date string
  durationMinutes: number;
  primaryMode: 'voice' | 'text' | 'sign' | 'mixed';
  scenarioTitle: string;
  scenarioId?: string;
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    source: 'voice' | 'text' | 'sign';
    timestamp: string;
    translatedContent?: string;
    coachingTip?: CoachingTip;
  }>;
}
```

#### 3. Mastered Vocabulary (`eduvaani_mastered_words`)
```typescript
type MasteredWords = string[]; // Array of mastered word IDs, e.g. ['jugaad', 'prepone']
```

---

## 5. Security, Media Lifecycle and Privacy Guarantees

1. **Hardware Track Termination**:
   Both microphone and camera feeds utilize strict cleanup lifecycles. Calling `stream.getTracks().forEach(t => t.stop())` guarantees that camera indicator lights extinguish immediately when the user navigates away or toggles off the video panel.
2. **Ephemeral Image Data**:
   Video frames analyzed by MediaPipe are processed entirely within WebAssembly memory. Raw video streams are never transmitted to external logging or cloud databases.
3. **Decoupled API Keys**:
   All third-party services operate using `VITE_` prefixed environment variables. If credentials are omitted, the application degrades gracefully to local heuristic rules without crashing or locking the UI.
