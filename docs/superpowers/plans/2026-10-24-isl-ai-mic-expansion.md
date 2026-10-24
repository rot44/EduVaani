# ISL Database, AI Prompts & Microphone Pipeline Expansion Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand EduVaani's Indian Sign Language (ISL) database to 200+ ISLRTC-aligned signs, refine Gemini AI prompts for ISL awareness, SOV grammar coaching and a 4-phase pedagogical workflow, and harden the microphone speech pipeline with adaptive noise gating, extended silence timeouts, and pre-flight diagnostics.

**Architecture:** 
1. Data & Linguistic Engine: Expand ISL dictionary (`isl-sign-animations.json` & `isl-signs.json`), broaden grammar reordering engine in `signGeneration.ts` to recognize extensive verbs, time-first markers, and inflection aliases, and expand geometric landmark gesture classifier in `signLanguage.ts`.
2. AI Intelligence Layer: Enrich `ai.ts` with dedicated ISL tutor workflow (Warm-up → Teach → Practice → Review), signable vocabulary constraints, and dual-track coaching (Spoken English + ISL SOV syntax).
3. Audio/Speech Pipeline: Upgrade `speech.ts` with adaptive noise floor calibration, 2.8s-3.2s silence detection, resilient 15s auto-restart retry loops, pre-flight permission checking, and upgrade `MicDiagnosticModal.tsx` with live signal-to-noise metrics and state badges.

**Tech Stack:** TypeScript, React, Vite, Web Speech API, Web Audio API (ScriptProcessor/AnalyserNode), MediaPipe Vision Tasks (Hand Landmarker), Google Generative AI (Gemini).

**Spec:** User request to complete the 3 areas:
1. Massively expanded ISL database (200+ words, ISLRTC standard, numbers 1-20, colors, family, body, food, emotions, time, transport, professions, weather, animals, actions, phrases).
2. Refined AI system prompts (Gemini ISL awareness, SOV order coaching, warm-up → teach → practice → review workflow, signable vocabulary output).
3. Robust microphone handling (extended silence window, adaptive noise-gate, retry on no-speech errors, pre-flight permission check, enhanced diagnostic modal).

---

## Tasks

- [ ] **Task 1: Verify & Enhance ISL Sign Generation & Linguistic Reordering (`src/lib/signGeneration.ts`)**
  - Verify `isl-sign-animations.json` covers 236 words + 26 alphabet signs across 18 categories.
  - Expand `convertEnglishToISLGrammar` with comprehensive verb dictionary (40+ verbs from the dataset), time-marker placement (Time + Subject + Object + Verb), and multi-word handling.
  - Expand `getWordSignData` alias dictionary with verb conjugations, plurals, and number word mappings (1-20).

- [ ] **Task 2: Expand Landmark Classifier & Gemini Vision Prompt (`src/lib/signLanguage.ts`)**
  - Add geometric landmark checks for additional gestures from `isl-signs.json` (Numbers 1-5, Book, School, Teacher, Mother, Father, Stop, Love, etc.).
  - Update Gemini Vision system prompt in `analyzeFrameWithGemini` to recognize the 60 signs from `isl-signs.json`.

- [ ] **Task 3: Refined AI System Prompts & ISL Pedagogical Workflow (`src/lib/ai.ts` & `src/lib/multimodal.ts`)**
  - Add ISL tutor mode to `aiService` with 4-phase pedagogical workflow (Warm-up → Teach → Practice → Review).
  - Add ISL-specific system prompt that incorporates the 200+ vocabulary dictionary, generates signable English sentences (simple, direct vocabulary), and outputs dual coaching tips (Spoken English + ISL SOV grammar & handshape notes).
  - Add specialized ISL roleplay scenarios / learning tracks.
  - Update `multimodal.ts` `getSuggestedSigns` to dynamically suggest words across categories from the expanded dictionary.

- [ ] **Task 4: Robust Microphone Handling & Adaptive Noise Gating (`src/lib/speech.ts`)**
  - Add pre-flight permission query method `checkMicrophonePermission()`.
  - Implement adaptive noise-gate logic in `AudioRecorder` with baseline ambient noise measurement instead of a brittle fixed threshold.
  - Extend speech recognition silence window to 2.8s - 3.2s with active speech detection.
  - Extend no-speech error recovery window to 15s with gentle restart backoff.
  - Expose mic status listener / callbacks (`'idle' | 'listening' | 'processing' | 'restarting' | 'error' | 'silence-warning'`).

- [ ] **Task 5: Upgrade Mic Diagnostic Modal (`src/components/MicDiagnosticModal.tsx`)**
  - Add pre-flight permission status display (Granted / Blocked / Prompt).
  - Display live ambient noise floor vs speech level with visual indicators.
  - Add responsive troubleshooting guide for common mic issues.

- [ ] **Task 6: Verification & End-to-End Build (`npm run build`)**
  - Run TypeScript compile & Vite build.
  - Verify sign generation, grammar translation, and AI prompt parser outputs with automated node script tests.
