import { useRef, useEffect, useState } from 'react';
import { Camera, VideoOff, RefreshCw, AlertCircle, Shield } from 'lucide-react';
import { PermissionPrompt } from './PermissionPrompt';
import { Button } from '../ui/button';

export interface CameraPanelProps {
  isCameraActive: boolean;
  onCameraToggle: (active: boolean) => void;
  onLearnWithoutCamera: () => void;
}

export function CameraPanel({
  isCameraActive,
  onCameraToggle,
  onLearnWithoutCamera,
}: CameraPanelProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Stop media tracks when camera is toggled off or component unmounts
  const stopMediaTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    return () => {
      stopMediaTracks();
    };
  }, []);

  const startCamera = async () => {
    try {
      setIsStarting(true);
      setErrorMessage(null);
      setPermissionDenied(false);

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
    }
  };

  const stopCamera = () => {
    stopMediaTracks();
    onCameraToggle(false);
  };

  return (
    <div className="rounded-3xl border border-warm-sand bg-warm-ivory p-5 sm:p-6 shadow-warm relative overflow-hidden flex flex-col justify-between">
      {/* Top Header & Camera Status Controls */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-peacock-teal/15 text-peacock-teal flex items-center justify-center">
            <Camera className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold font-display text-deep-brown text-base">
              Webcam Gesture View
            </h3>
            <span className="text-xs text-deep-brown/65">
              Indian Sign Language Recognition Stage
            </span>
          </div>
        </div>

        {/* Camera Indicator & Toggle Button (Peacock Teal) */}
        <div className="flex items-center gap-2.5">
          {isCameraActive ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream-white border border-warm-sand text-xs font-semibold shadow-warm-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-soft-coral animate-ping" />
              <span className="text-deep-brown font-medium">Camera active</span>
            </div>
          ) : (
            <span className="text-xs text-deep-brown/50 font-medium">
              Camera standby
            </span>
          )}

          {isCameraActive ? (
            <Button
              onClick={stopCamera}
              variant="outline"
              size="sm"
              className="border-soft-coral/40 text-soft-coral hover:bg-soft-coral/10 hover:border-soft-coral rounded-xl text-xs h-9 px-3.5"
            >
              <VideoOff className="h-4 w-4 mr-1.5" />
              Stop Camera
            </Button>
          ) : (
            <Button
              onClick={startCamera}
              variant="secondary"
              size="sm"
              disabled={isStarting}
              className="rounded-xl text-xs h-9 px-4 shadow-warm-sm"
            >
              {isStarting ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Camera className="h-3.5 w-3.5 mr-1.5" />
                  Start Camera
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Main View Area */}
      <div className="relative w-full aspect-video min-h-[260px] sm:min-h-[320px] rounded-2xl bg-warm-sand/35 border border-warm-sand overflow-hidden flex items-center justify-center shadow-inner">
        {/* Active Live Video Element */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover scale-x-[-1] transition-opacity duration-300 ${
            isCameraActive ? 'opacity-100 block' : 'opacity-0 hidden'
          }`}
        />

        {/* Hand Placement Guide Overlay when camera is active */}
        {isCameraActive && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-4">
            <div className="self-end px-2.5 py-1 rounded-lg bg-deep-brown/60 backdrop-blur-sm text-[10px] text-cream-white font-mono flex items-center gap-1.5">
              <Shield className="h-3 w-3 text-turmeric" />
              <span>ISL Frame: 30 FPS Local</span>
            </div>

            {/* Dotted Hand Framing Box */}
            <div className="w-3/4 max-w-xs h-44 rounded-2xl border-2 border-dashed border-turmeric/80 bg-turmeric/5 flex items-center justify-center text-center p-3">
              <span className="text-[11px] font-semibold text-deep-brown bg-cream-white/90 px-3 py-1 rounded-full shadow-warm-sm">
                Position your hands inside this frame
              </span>
            </div>

            <div className="text-[11px] text-deep-brown bg-cream-white/80 backdrop-blur-sm px-3 py-0.5 rounded-full shadow-sm font-medium">
              Keep two hands visible for Indian Sign Language
            </div>
          </div>
        )}

        {/* Inactive Standby / Permission Prompt State */}
        {!isCameraActive && (
          <div className="w-full h-full flex items-center justify-center p-4">
            {permissionDenied || errorMessage ? (
              <div className="text-center space-y-3 max-w-sm p-4 bg-cream-white/90 rounded-2xl border border-soft-coral/40 shadow-warm-sm">
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
                  <Button
                    onClick={startCamera}
                    variant="primary"
                    size="sm"
                    className="text-xs"
                  >
                    Retry Permission
                  </Button>
                  <Button
                    onClick={onLearnWithoutCamera}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
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

      {/* Footer Notes */}
      <div className="mt-3.5 flex items-center justify-between text-[11px] text-deep-brown/60 px-1 font-sans">
        <span>Mirror video enabled for natural hand positioning</span>
        <span>Consent-based • Auto-shuts on page exit</span>
      </div>
    </div>
  );
}
