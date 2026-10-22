import { Mic, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
            <Mic className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-white text-lg font-display">EduVaani</span>
        </div>
        <p className="text-white/40 text-sm mb-2">
          🎙️ आपकी आवाज़, आपकी पहचान — Your Voice, Your Identity
        </p>
        <p className="text-white/30 text-xs flex items-center justify-center gap-1">
          Made with <Heart className="h-3 w-3 text-red-400 fill-current" /> for India's learners
        </p>
        <div className="mt-4 flex justify-center gap-6 text-xs text-white/30">
          <span>🇮🇳 Bharat First</span>
          <span>•</span>
          <span>🎤 Voice-First Learning</span>
          <span>•</span>
          <span>🤖 AI-Powered</span>
        </div>
      </div>
    </footer>
  );
}
