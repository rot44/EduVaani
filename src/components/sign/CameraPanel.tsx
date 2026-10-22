import { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, VideoOff, RefreshCw, AlertCircle, Shield, Cpu, Sparkles } from 'lucide-react';
import { PermissionPrompt } from './PermissionPrompt';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import {
  initializeRecognition,
  startRecognition,
  stopRecognition,
  isModelLoaded,
  getRecognitionEngine,
  setRecognitionEngine,
  type RecognitionResult,
  type RecognitionEngineType,
} from '../../lib/signLanguage';

export interface CameraPanelProps {
  isCameraActive: boolean;
  onCameraToggle: (active: boolean) => void;
  onLearnWithoutCamera: () => void;
  onRecognitionResult?: (result: RecognitionResult) => void;
}

export function CameraPanel({
  isCameraActive,
  onCameraToggle,
  onLearnWithoutCamera,
  onRecognitionResult,
}: CameraPanelProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Model Loading State
  const [modelProgress, setModelProgress] = useState<number>(isModelLoaded() ? 100 : 0);
  const [modelStatusMsg, setModelStatusMsg] = useState<string>('');
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [currentEngine, setCurrentEngine] = useState<RecognitionEngineType>(getRecognitionEngine());

  // Resize and orientation listener for mobile video & canvas
  useEffect(() => {
    const handleResize = () => {
      if (videoRef.current && canvasRef.current) {
        canvasRef.current.width = videoRef.current.videoWidth || 640;
        canvasRef.current.height = videoRef.current.videoHeight || 480;
      }
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Stop media tracks and recognition pipeline
  const stopMediaTracks = useCallback(() => {
    stopRecognition();

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, []);

  useEffect(() => {
    return () => {
      stopMediaTracks();
    };
  }, [stopMediaTracks]);

  // Start Recognition when video is ready
  const handleStartRecognitionPipeline = useCallback(() => {
    if (videoRef.current && onRecognitionResult) {
      startRecognition(
        videoRef.current,
        (res) => {
          onRecognitionResult(res);
        },
        canvasRef.current || undefined
      );
    }
  }, [onRecognitionResult]);

  const startCamera = async () => {
    try {
      setIsStarting(true);
      setErrorMessage(null);
      setPermissionDenied(false);

      // Preload or initialize model if needed
      if (!isModelLoaded() && currentEngine === 'mediapipe') {
        setIsModelLoading(true);
        await initializeRecognition((percent, msg) => {
          setModelProgress(percent);
          setModelStatusMsg(msg);
        });
        setIsModelLoading(false);
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      onCameraToggle(true);
      handleStartRecognitionPipeline();
    } catch (err: unknown) {
      console.warn('Camera access denied or failed:', err);
      const isDenied =
        err instanceof Error &&
        (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError');
      setPermissionDenied(isDenied);
      setErrorMessage(
        isDenied
          ? 'Camera permission was denied. Please allow camera permissions in your browser bar.'
          : 'Could not access your webcam. Check if another application is using it.'
      );
      onCameraToggle(false);
    } finally {
      setIsStarting(false);
      setIsModelLoading(false);
    }
  };

  const stopCamera = () => {
    stopMediaTracks();
    onCameraToggle(false);
  };

  const handleToggleEngine = (engine: RecognitionEngineType) => {
    setCurrentEngine(engine);
    setRecognitionEngine(engine);
    if (isCameraActive && videoRef.current) {
      handleStartRecognitionPipeline();
    }
  };

  return (
    <div className="rounded-3xl border border-warm-sand bg-warm-ivory p-5 sm:p-6 shadow-warm relative overflow-hidden flex flex-col justify-between space-y-4">
      {/* Top Header & Camera Status Controls */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-peacock-teal/15 text-peacock-teal flex items-center justify-center">
            <Camera className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold font-display text-deep-brown text-base">
                Webcam Gesture Feed
              </h3>
              <Badge variant="teal" className="text-[10px] font-bold">
                ISL Pipeline
              </Badge>
            </div>
            <span className="text-xs text-deep-brown/65">
              Live hand posture detection &amp; kinematic tracking
            </span>
          </div>
        </div>

        {/* Camera Indicator & Toggle Buttons */}
        <div className="flex items-center gap-2.5">
          {isCameraActive ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream-white border border-warm-sand text-xs font-semibold shadow-warm-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-soft-coral animate-ping" />
              <span className="text-deep-brown font-medium">Camera active</span>
            </div>
          ) : (
            <span className="text-xs text-deep-brown/50 font-medium hidden sm:inline">
              Camera standby
            </span>
          )}

          {isCameraActive ? (
            <Button
              onClick={stopCamera}
              variant="outline"
              size="sm"
              aria-label="Stop webcam camera"
              className="border-soft-coral/40 text-soft-coral hover:bg-soft-coral/10 hover:border-soft-coral rounded-xl text-xs min-h-[44px] px-3.5"
            >
              <VideoOff className="h-4 w-4 mr-1.5" aria-hidden="true" />
              Stop Camera
            </Button>
          ) : (
            <Button
              onClick={startCamera}
              variant="secondary"
              size="sm"
              disabled={isStarting}
              aria-label="Start webcam camera for ISL gesture detection"
              className="rounded-xl text-xs min-h-[44px] px-4 shadow-warm-sm"
            >
              {isStarting ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" aria-hidden="true" />
                  Connecting...
                </>
              ) : (
                <>
                  <Camera className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                  Start Camera
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Screen Reader Live Region for Camera Status */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {isCameraActive ? 'Webcam is active and tracking hands.' : 'Webcam is inactive.'}
        {errorMessage && `Camera notice: ${errorMessage}`}
      </div>

      {/* Model Loading Progress Bar */}
      {isModelLoading && (
        <div className="bg-cream-white border border-warm-sand rounded-2xl p-3.5 space-y-2 animate-slide-up shadow-warm-sm">
          <div className="flex items-center justify-between text-xs text-deep-brown font-medium">
            <span className="flex items-center gap-1.5">
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-terracotta" />
              <span>{modelStatusMsg || 'Loading AI recognition model...'}</span>
            </span>
            <span className="font-mono font-bold text-peacock-teal">{modelProgress}%</span>
          </div>
          <Progress value={modelProgress} className="h-2 bg-warm-sand" />
        </div>
      )}

      {/* Main Viewport Area (Video + Canvas Overlay + Guidelines) */}
      <div className="relative w-full aspect-video min-h-[260px] sm:min-h-[340px] rounded-2xl bg-warm-sand/35 border border-warm-sand overflow-hidden flex items-center justify-center shadow-inner">
        
        {/* Live Webcam Video Feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover scale-x-[-1] transition-opacity duration-300 ${
            isCameraActive ? 'opacity-100 block' : 'opacity-0 hidden'
          }`}
        />

        {/* Landmark Tracking Canvas Overlay */}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-300 z-10 ${
            isCameraActive ? 'opacity-100 block' : 'opacity-0 hidden'
          }`}
        />

        {/* Hand Placement Guide Overlay when camera is active */}
        {isCameraActive && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-4 z-20">
            <div className="self-end px-2.5 py-1 rounded-lg bg-deep-brown/70 backdrop-blur-sm text-[10px] text-cream-white font-mono flex items-center gap-1.5 shadow-sm">
              <Shield className="h-3 w-3 text-turmeric" />
              <span>30 FPS • Local Kinematic Feed</span>
            </div>

            {/* Dotted Hand Framing Box */}
            <div className="w-3/4 max-w-xs h-44 rounded-2xl border-2 border-dashed border-turmeric/85 bg-turmeric/5 flex items-center justify-center text-center p-3">
              <span className="text-[11px] font-semibold text-deep-brown bg-cream-white/95 px-3 py-1 rounded-full shadow-warm-sm border border-warm-sand">
                Keep hands inside this guide frame
              </span>
            </div>

            <div className="text-[11px] text-deep-brown bg-cream-white/90 backdrop-blur-sm px-3 py-0.5 rounded-full shadow-sm font-medium border border-warm-sand">
              Visible joints show landmark tracking (Visual feedback only)
            </div>
          </div>
        )}

        {/* Standby / Permission Prompt State */}
        {!isCameraActive && (
          <div className="w-full h-full flex items-center justify-center p-4">
            {permissionDenied || errorMessage ? (
              <div className="text-center space-y-3 max-w-sm p-4 bg-cream-white/95 rounded-2xl border border-soft-coral/40 shadow-warm-sm">
                <div className="w-12 h-12 rounded-2xl bg-soft-coral/15 text-soft-coral flex items-center justify-center mx-auto">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-sm text-deep-brown font-display">
                  Camera Permission Required
                </h4>
                <p className="text-xs text-deep-brown/70 leading-relaxed font-sans">
                  {errorMessage}
                </p>
                <div className="pt-2 flex justify-center gap-2">
                  <Button onClick={startCamera} variant="primary" size="sm" className="text-xs">
                    Retry Permission
                  </Button>
                  <Button onClick={onLearnWithoutCamera} variant="outline" size="sm" className="text-xs">
                    Continue Without
                  </Button>
                </div>
              </div>
            ) : (
              <PermissionPrompt
                onAllowCamera={startCamera}
                onLearnWithoutCamera={onLearnWithoutCamera}
                isRequesting={isStarting}
              />
            )}
          </div>
        )}
      </div>

      {/* Engine Selector & Bottom Status Bar */}
      <div className="flex items-center justify-between text-xs text-deep-brown/70 gap-2 flex-wrap pt-1 font-sans">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-deep-brown text-[11px]">AI Engine:</span>
          <button
            type="button"
            onClick={() => handleToggleEngine('mediapipe')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
              currentEngine === 'mediapipe'
                ? 'bg-peacock-teal text-cream-white shadow-xs'
                : 'bg-cream-white border border-warm-sand text-deep-brown/70 hover:text-deep-brown'
            }`}
          >
            <Cpu className="h-3 w-3 inline mr-1" />
            MediaPipe Local (30 FPS)
          </button>
          <button
            type="button"
            onClick={() => handleToggleEngine('gemini')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
              currentEngine === 'gemini'
                ? 'bg-terracotta text-cream-white shadow-xs'
                : 'bg-cream-white border border-warm-sand text-deep-brown/70 hover:text-deep-brown'
            }`}
          >
            <Sparkles className="h-3 w-3 inline mr-1" />
            Gemini Vision
          </button>
        </div>

        <span className="text-[11px] text-deep-brown/55">
          Consent-based • Video processed in memory only
        </span>
      </div>
    </div>
  );
}
