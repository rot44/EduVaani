import React from 'react';
import { Type, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';

export interface TextInputPanelProps {
  text: string;
  onTextChange: (text: string) => void;
  onConvertToSigns: (text: string) => void;
  onAskAi?: (text: string) => void;
  isAiLoading?: boolean;
  disabled?: boolean;
}

const PRESET_PHRASES = [
  'Namaste good morning',
  'Thank you friend',
  'Help me learn English',
  'What is your name',
];

export function TextInputPanel({
  text,
  onTextChange,
  onConvertToSigns,
  onAskAi,
  isAiLoading = false,
  disabled = false,
}: TextInputPanelProps) {
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onConvertToSigns(text);
  };

  return (
    <div className="rounded-3xl border border-warm-sand bg-warm-ivory p-5 sm:p-6 shadow-warm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-terracotta/15 text-terracotta flex items-center justify-center">
            <Type className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-deep-brown font-display">
              Text to Sign Language
            </h4>
            <span className="text-[11px] text-deep-brown/60">
              Convert written words into ISL hand signs
            </span>
          </div>
        </div>

        {/* Word and Character Count Indicator */}
        <div className="text-xs font-mono text-deep-brown/60">
          <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
          <span className="mx-1.5">•</span>
          <span>{charCount} chars</span>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <textarea
            id="isl-text-input"
            aria-label="Text to convert into Indian Sign Language"
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="Type a word or sentence in English (e.g. 'Namaste, thank you friend')..."
            rows={3}
            disabled={disabled}
            className="w-full rounded-2xl bg-cream-white border border-warm-sand focus:border-terracotta p-3.5 text-sm text-deep-brown placeholder-deep-brown/40 focus:outline-none transition-colors resize-none shadow-inner font-sans"
          />
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            <span className="text-[11px] font-semibold text-terracotta flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Quick:
            </span>
            {PRESET_PHRASES.map((phrase, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onTextChange(phrase);
                  onConvertToSigns(phrase);
                }}
                className="text-[11px] px-2.5 py-1 rounded-xl bg-cream-white border border-warm-sand hover:border-terracotta/50 text-deep-brown hover:text-terracotta transition-colors shadow-xs flex-shrink-0 cursor-pointer font-medium"
              >
                &quot;{phrase}&quot;
              </button>
            ))}
          </div>

          {/* Action Buttons: Ask AI Partner + Direct Convert to Signs */}
          <div className="flex items-center gap-2 ml-auto">
            {onAskAi && (
              <Button
                type="button"
                onClick={() => onAskAi(text)}
                disabled={!text.trim() || disabled || isAiLoading}
                variant="outline"
                size="sm"
                className="shadow-xs px-3.5 border-peacock-teal/40 text-peacock-teal hover:bg-peacock-teal/10"
                title="Send query to Gemini AI and display its response in ISL signs"
              >
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                <span>{isAiLoading ? 'AI Thinking...' : 'Ask AI Tutor'}</span>
              </Button>
            )}

            <Button
              type="submit"
              disabled={!text.trim() || disabled || isAiLoading}
              variant="primary"
              size="sm"
              className="shadow-warm-sm px-4"
            >
              <span>Convert to Signs</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
