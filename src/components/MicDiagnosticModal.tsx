import { useState, useRef, useEffect } from "react";
import { Mic, Volume2, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { speechService } from "../lib/speech";

interface MicDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MicDiagnosticModal({ isOpen, onClose }: MicDiagnosticModalProps) {
  const [testing, setTesting] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [micState, setMicState] = useState<'idle' | 'listening' | 'success' | 'denied'>('idle');
  const [heardText, setHeardText] = useState<string>('');
  const [isSpeakerTesting, setIsSpeakerTesting] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const teardownAudioHardware = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
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
    setMicState('idle');
    setHeardText('');
    onClose();
  };

  useEffect(() => {
    return () => {
      teardownAudioHardware();
    };
  }, []);

  const startMicTest = async () => {
    teardownAudioHardware();
    setAudioLevel(0);
    setHeardText('');
    setMicState('listening');
    setTesting(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioCtxRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const sample = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        setAudioLevel(normalized);

        if (normalized > 25) {
          setMicState('success');
        }

        animFrameRef.current = requestAnimationFrame(sample);
      };

      animFrameRef.current = requestAnimationFrame(sample);

      // Also test Web Speech API recognition if supported
      try {
        const result = await Promise.race([
          speechService.listen(),
          new Promise<string>((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
        ]);
        if (result) {
          setHeardText(result);
          setMicState('success');
        }
      } catch {
        // Voice recognition timeout is fine, volume meter already proves mic works
      }
    } catch (err: unknown) {
      console.warn("Microphone access denied or error:", err);
      setMicState('denied');
      setTesting(false);
    }
  };

  const testSpeaker = async () => {
    try {
      setIsSpeakerTesting(true);
      await speechService.speak("Hello! Your speaker and audio output are working perfectly.", 0.95);
    } finally {
      setIsSpeakerTesting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Mic className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>Audio & Mic Diagnostic</DialogTitle>
              <DialogDescription>
                Verify that your microphone and speakers work smoothly.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Live Mic Level Meter */}
          <div className="glass border border-white/10 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/70 font-medium">Microphone Input Level</span>
              <Badge
                variant={micState === 'success' ? 'saffron' : micState === 'denied' ? 'destructive' : 'outline'}
                className="text-[11px]"
              >
                {micState === 'listening' && 'Listening...'}
                {micState === 'success' && 'Mic Active & Working!'}
                {micState === 'denied' && 'Permission Denied'}
                {micState === 'idle' && 'Ready to Test'}
              </Badge>
            </div>

            {/* Level Bars */}
            <div className="h-4 bg-slate-950/80 rounded-full overflow-hidden p-0.5 border border-white/10 flex items-center">
              <div
                className={`h-full rounded-full transition-all duration-75 ${
                  audioLevel > 60
                    ? 'bg-gradient-to-r from-emerald-500 via-yellow-400 to-red-500'
                    : audioLevel > 20
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    : 'bg-emerald-500/40'
                }`}
                style={{ width: `${Math.max(4, audioLevel)}%` }}
              />
            </div>

            {/* Status explanation */}
            {micState === 'listening' && (
              <p className="text-xs text-orange-300/90 animate-pulse text-center">
                Speak into your mic: "Hello EduVaani"
              </p>
            )}

            {heardText && (
              <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-xl p-2.5 text-xs text-emerald-200">
                <span className="font-semibold">Recognized: </span>
                <span className="italic">"{heardText}"</span>
              </div>
            )}

            {micState === 'denied' && (
              <div className="bg-red-500/15 border border-red-500/30 rounded-xl p-3 text-xs text-red-200 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">Microphone blocked by browser</p>
                  <p className="text-[11px] text-white/70">
                    Click the lock or camera icon in your browser address bar and set Microphone to "Allow".
                  </p>
                </div>
              </div>
            )}

            {micState === 'success' && (
              <div className="flex items-center gap-2 text-xs text-emerald-300 font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Microphone is capturing loud and clear audio!</span>
              </div>
            )}
          </div>

          {/* Speaker Test */}
          <div className="glass border border-white/10 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white">Speaker / Audio Output</p>
              <p className="text-[11px] text-white/60">Test if you can hear the AI tutor's voice</p>
            </div>
            <Button
              onClick={testSpeaker}
              disabled={isSpeakerTesting}
              variant="outline"
              size="sm"
              className="text-xs border-orange-400/40 text-orange-200 hover:bg-orange-500/20"
            >
              <Volume2 className={`h-3.5 w-3.5 mr-1.5 ${isSpeakerTesting ? 'animate-bounce text-emerald-400' : ''}`} />
              {isSpeakerTesting ? 'Playing...' : 'Test Sound'}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10">
          <Button
            onClick={startMicTest}
            disabled={testing}
            variant="glow"
            size="sm"
            className="w-full text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${testing ? 'animate-spin' : ''}`} />
            {testing ? 'Testing Microphone...' : 'Start Mic Test'}
          </Button>

          <Button
            onClick={handleClose}
            variant="outline"
            size="sm"
            className="text-xs border-white/20 text-white/80"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
