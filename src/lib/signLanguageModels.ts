import { GoogleGenerativeAI } from '@google/generative-ai';

// Types for MediaPipe Hand Landmarker (loaded dynamically)
export interface HandLandmarkerResult {
  landmarks: Array<Array<{ x: number; y: number; z: number }>>;
  worldLandmarks: Array<Array<{ x: number; y: number; z: number }>>;
  handedness: Array<Array<{ index: number; score: number; categoryName: string; displayName: string }>>;
}

export interface HandLandmarkerInstance {
  detectForVideo(videoElement: HTMLVideoElement, timestamp: number): HandLandmarkerResult;
  close(): void;
}

let handLandmarkerInstance: HandLandmarkerInstance | null = null;
let isLandmarkerLoading = false;
let landmarkerLoadError: string | null = null;

let geminiVisionModel: any = null;

/**
 * Dynamically load MediaPipe Tasks Vision HandLandmarker.
 * Uses CDN for Wasm and pre-trained hand landmarker task model bundle.
 */
export async function loadHandLandmarker(
  onProgress?: (progressPercent: number, statusMessage: string) => void
): Promise<HandLandmarkerInstance | null> {
  if (handLandmarkerInstance) {
    return handLandmarkerInstance;
  }

  if (isLandmarkerLoading) {
    // Wait for in-flight load
    while (isLandmarkerLoading) {
      await new Promise((r) => setTimeout(r, 100));
    }
    return handLandmarkerInstance;
  }

  isLandmarkerLoading = true;
  landmarkerLoadError = null;

  try {
    if (onProgress) onProgress(15, 'Loading MediaPipe Tasks Vision module...');
    
    // Dynamic import to prevent heavy upfront bundle blocking
    const { FilesetResolver, HandLandmarker } = await import('@mediapipe/tasks-vision');

    if (onProgress) onProgress(45, 'Initializing WebAssembly vision engine...');
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
    );

    if (onProgress) onProgress(75, 'Downloading hand landmark model (float16)...');
    const landmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
        delegate: 'GPU',
      },
      runningMode: 'VIDEO',
      numHands: 2, // Crucial for two-handed Indian Sign Language (ISL)
      minHandDetectionConfidence: 0.6,
      minHandPresenceConfidence: 0.6,
      minTrackingConfidence: 0.6,
    });

    handLandmarkerInstance = landmarker as unknown as HandLandmarkerInstance;
    if (onProgress) onProgress(100, 'Hand tracking model ready!');
    return handLandmarkerInstance;
  } catch (err: unknown) {
    console.warn('MediaPipe HandLandmarker initialization warning:', err);
    landmarkerLoadError = err instanceof Error ? err.message : String(err);
    return null;
  } finally {
    isLandmarkerLoading = false;
  }
}

export function getHandLandmarker(): HandLandmarkerInstance | null {
  return handLandmarkerInstance;
}

export function isMediaPipeAvailable(): boolean {
  return Boolean(handLandmarkerInstance);
}

export function getMediaPipeError(): string | null {
  return landmarkerLoadError;
}

export function releaseHandLandmarker(): void {
  if (handLandmarkerInstance) {
    try {
      handLandmarkerInstance.close();
    } catch {
      // ignore teardown errors
    }
    handLandmarkerInstance = null;
  }
}

/**
 * Initialize Gemini Vision Multimodal Model for secondary verification
 */
export function getGeminiVisionModel() {
  if (geminiVisionModel) return geminiVisionModel;

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return null;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-flash for real-time low-latency vision inference
    geminiVisionModel = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.2,
        topP: 0.8,
        maxOutputTokens: 256,
      },
    });
    return geminiVisionModel;
  } catch (err) {
    console.warn('Failed to initialize Gemini Vision Model:', err);
    return null;
  }
}

export function isGeminiVisionAvailable(): boolean {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  return Boolean(apiKey && apiKey !== 'your_gemini_api_key_here');
}
