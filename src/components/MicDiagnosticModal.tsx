import { useState, useRef, useEffect } from "react";
import { Mic, Volume2, CheckCircle2, AlertCircle, RefreshCw, ShieldCheck, ShieldAlert, Waves } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { speechService, type SpeechInputState } from "../lib/speech";

interface MicDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MicDiagnosticModal({ isOpen, onClose }: MicDiagnosticModalProps) {
  const [testing, setTesting] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [noiseFloorLevel, setNoiseFloorLevel] = useState(0);
  const [micState, setMicState] = useState<'idle' | 'listening' | 'success' | 'denied'>('idle');
  const [serviceState, setServiceState] = useState<SpeechInputState>('idle');
  const [permissionStatus, setPermissionStatus] = useState<'checking' | 'granted' | 'prompt' | 'denied' | 'unsupported'>('checking');
  const [heardText, setHeardText] = useState<string>('');
  const [isSpeakerTesting, setIsSpeakerTesting] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  // Pre-flight permission check on modal open
  useEffect(() => {
    if (isOpen) {
      triggerElementRef.current = document.activeElement as HTMLElement;
      setPermissionStatus('checking');
      speechService.checkMicrophonePermission().then((status) => {
        setPermissionStatus(status);
        if (status === 'denied') {
          setMicState('denied');
        }
      });
    }
  }, [isOpen]);

  // Subscribe to speech service states during test
  useEffect(() => {
    if (!isOpen) return;
    const unsubscribe = speechService.subscribeState((st) => {
      setServiceState(st);
    });
    return unsubscribe;
  }, [isOpen]);

  const teardownAudioHardware = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
  };

  const handleClose = () => {
    teardownAudioHardware();
    setTesting(false);
    setAudioLevel(0);
    setNoiseFloorLevel(0);
    setMicState('idle');
    setHeardText('');
    onClose();
    setTimeout(() => {
      triggerElementRef.current?.focus();
    }, 50);
  };

  useEffect(() => {
    return () => {
      teardownAudioHardware();
    };
  }, []);

  const startMicTest = async () => {
    teardownAudioHardware();
    setAudioLevel(0);
    setNoiseFloorLevel(0);
    setHeardText('');
    setMicState('listening');
    setTesting(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;
      setPermissionStatus('granted');

      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioCtxRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      let calibrationFrames = 0;
      let noiseAccumulator = 0;

      const sample = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        setAudioLevel(normalized);

        // Calibrate ambient noise floor over first 20 frames (~300ms)
        if (calibrationFrames < 20) {
          noiseAccumulator += normalized;
          calibrationFrames++;
          if (calibrationFrames === 20) {
            setNoiseFloorLevel(Math.round(noiseAccumulator / 20));
          }
        }

        // Voice activity detected above ambient noise floor
        if (normalized > Math.max(18, (noiseFloorLevel || 10) + 12)) {
          setMicState('success');
        }

        animFrameRef.current = requestAnimationFrame(sample);
      };

      animFrameRef.current = requestAnimationFrame(sample);

      // Concurrently run Web Speech recognition test with live interim
      try {
        const result = await Promise.race([
          speechService.listen((liveText) => {
            if (liveText) {
              setHeardText(liveText);
              setMicState('success');
            }
          }),
          new Promise<string>((_, reject) => setTimeout(() => reject(new Error('timeout')), 7000)),
        ]);
        if (result) {
          setHeardText(result);
          setMicState('success');
        }
      } catch {
        // Recognition timeout is fine if the volume meter confirmed signal
      }
    } catch (err: unknown) {
      console.warn("Microphone access denied or error:", err);
      setMicState('denied');
      setPermissionStatus('denied');
      setTesting(false);
    }
  };

  const testSpeaker = async () => {
    try {
      setIsSpeakerTesting(true);
      await speechService.speak(
        "Hello! Your speaker and audio output are working perfectly.",
        0.95
      );
    } finally {
      setIsSpeakerTesting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent className="max-w-md">
        {/* Screen Reader Live Region */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {micState === 'listening' && 'Microphone listening. Please speak into your microphone.'}
          {micState === 'success' && 'Microphone active and working successfully.'}
          {micState === 'denied' && 'Microphone access denied. Please allow microphone permissions in your browser.'}
          {heardText && `Microphone recognized: ${heardText}`}
          {isSpeakerTesting && 'Testing audio output now.'}
        </div>

        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-terracotta/10 border border-terracotta/30 flex items-center justify-center text-terracotta flex-shrink-0">
              <Mic className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <DialogTitle className="text-deep-brown font-display font-semibold text-lg">
                Audio & Mic Diagnostic
              </DialogTitle>
              <DialogDescription className="text-deep-brown/70 text-xs">
                Pre-flight permission check, noise gate calibration, and live speech verification.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3.5 py-1">
          {/* Pre-Flight Permission Card */}
          <div className="bg-cream-white border border-warm-sand rounded-xl p-3 flex items-center justify-between shadow-warm-sm">
            <div className="flex items-center gap-2.5">
              {permissionStatus === 'granted' ? (
                <ShieldCheck className="h-4 w-4 text-peacock-teal" />
              ) : permissionStatus === 'denied' ? (
                <ShieldAlert className="h-4 w-4 text-terracotta" />
              ) : (
                <Mic className="h-4 w-4 text-turmeric" />
              )}
              <div>
                <p className="text-xs font-semibold text-deep-brown">Browser Permission</p>
                <p className="text-[10.5px] text-deep-brown/70">
                  {permissionStatus === 'granted' && 'Microphone access is authorized'}
                  {permissionStatus === 'prompt' && 'Permission will prompt on test start'}
                  {permissionStatus === 'denied' && 'Microphone is currently blocked'}
                  {permissionStatus === 'checking' && 'Checking browser permissions...'}
                  {permissionStatus === 'unsupported' && 'Audio API not supported in browser'}
                </p>
              </div>
            </div>
            <Badge
              variant={
                permissionStatus === 'granted'
                  ? 'saffron'
                  : permissionStatus === 'denied'
                  ? 'destructive'
                  : 'outline'
              }
              className="text-[10px]"
            >
              {permissionStatus === 'granted' && 'Authorized'}
              {permissionStatus === 'prompt' && 'Needs Approval'}
              {permissionStatus === 'denied' && 'Blocked'}
              {permissionStatus === 'checking' && 'Checking...'}
              {permissionStatus === 'unsupported' && 'Unsupported'}
            </Badge>
          </div>

          {/* Live Mic Level & Adaptive Noise Meter */}
          <div className="bg-cream-white border border-warm-sand rounded-2xl p-4 space-y-3 shadow-warm-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="text-deep-brown font-medium">Microphone Input & Noise Gate</span>
              <Badge
                variant={micState === 'success' ? 'saffron' : micState === 'denied' ? 'destructive' : 'outline'}
                className="text-[11px]"
              >
                {micState === 'listening' && (serviceState === 'speech_detected' ? 'Speech Detected!' : 'Listening...')}
                {micState === 'success' && 'Mic Active & Working!'}
                {micState === 'denied' && 'Permission Denied'}
                {micState === 'idle' && 'Ready to Test'}
              </Badge>
            </div>

            {/* Level Bars with Adaptive Threshold */}
            <div className="space-y-1.5">
              <div 
                className="h-4 bg-warm-sand/80 rounded-full overflow-hidden p-0.5 border border-warm-sand flex items-center relative"
                role="progressbar"
                aria-valuenow={audioLevel}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Microphone input volume"
              >
                <div
                  className={`h-full rounded-full transition-all duration-75 ${
                    audioLevel > 60
                      ? 'bg-gradient-to-r from-peacock-teal via-turmeric to-terracotta'
                      : audioLevel > 20
                      ? 'bg-gradient-to-r from-peacock-teal to-turmeric'
                      : 'bg-peacock-teal/60'
                  }`}
                  style={{ width: `${Math.max(4, audioLevel)}%` }}
                />
              </div>

              {/* Noise floor details */}
              {noiseFloorLevel > 0 && (
                <div className="flex items-center justify-between text-[10px] text-deep-brown/65 pt-0.5">
                  <span className="flex items-center gap-1">
                    <Waves className="h-3 w-3 text-peacock-teal" />
                    Ambient Room Noise: {noiseFloorLevel < 15 ? 'Quiet (Optimal)' : noiseFloorLevel < 35 ? 'Moderate' : 'High Noise'}
                  </span>
                  <span>Gate: {Math.max(18, noiseFloorLevel + 12)}%</span>
                </div>
              )}
            </div>

            {/* Status explanation */}
            {micState === 'listening' && (
              <p className="text-xs text-terracotta font-medium animate-pulse text-center">
                Speak clearly: "Hello EduVaani, I am ready"
              </p>
            )}

            {heardText && (
              <div className="bg-peacock-teal/10 border border-peacock-teal/30 rounded-xl p-2.5 text-xs text-peacock-teal">
                <span className="font-semibold">Live Speech Recognized: </span>
                <span className="italic font-medium">"{heardText}"</span>
              </div>
            )}

            {micState === 'denied' && (
              <div className="bg-terracotta/10 border border-terracotta/30 rounded-xl p-3 text-xs text-terracotta flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-terracotta flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-semibold mb-1">Microphone blocked by browser</p>
                  <p className="text-[11px] text-deep-brown/80">
                    Click the camera/lock icon in your browser address bar, select "Allow" for Microphone, and refresh or click test again.
                  </p>
                </div>
              </div>
            )}

            {micState === 'success' && (
              <div className="flex items-center gap-2 text-xs text-peacock-teal font-medium">
                <CheckCircle2 className="h-4 w-4 text-peacock-teal flex-shrink-0" aria-hidden="true" />
                <span>Microphone is capturing loud, clear voice input!</span>
              </div>
            )}
          </div>

          {/* Speaker Test */}
          <div className="bg-cream-white border border-warm-sand rounded-2xl p-4 flex items-center justify-between shadow-warm-sm">
            <div>
              <p className="text-xs font-semibold text-deep-brown">Speaker / Audio Output</p>
              <p className="text-[11px] text-deep-brown/70">Test if you can hear EduVaani's AI voice</p>
            </div>
            <Button
              onClick={testSpeaker}
              disabled={isSpeakerTesting}
              variant="outline"
              size="sm"
              aria-label={isSpeakerTesting ? 'Playing speaker test sound' : 'Test speaker audio'}
              className="text-xs min-h-[44px] px-3.5 border-warm-sand text-deep-brown hover:bg-warm-sand/60 hover:text-deep-brown"
            >
              <Volume2
                className={`h-4 w-4 mr-1.5 ${
                  isSpeakerTesting ? 'animate-bounce text-peacock-teal' : 'text-terracotta'
                }`}
                aria-hidden="true"
              />
              {isSpeakerTesting ? 'Playing...' : 'Test Sound'}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2 border-t border-warm-sand">
          <Button
            onClick={startMicTest}
            disabled={testing}
            size="sm"
            aria-label={testing ? 'Microphone test running' : 'Start microphone test'}
            className="w-full text-xs min-h-[44px] bg-terracotta text-cream-white hover:bg-terracotta-hover shadow-warm-sm font-medium"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${testing ? 'animate-spin' : ''}`} aria-hidden="true" />
            {testing ? 'Testing Microphone...' : 'Start Mic Test'}
          </Button>

          <Button
            onClick={handleClose}
            variant="outline"
            size="sm"
            aria-label="Done with diagnostic test"
            className="text-xs min-h-[44px] px-5 border-warm-sand text-deep-brown hover:bg-warm-sand/60 font-medium"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
