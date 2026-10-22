import { Link } from 'react-router-dom';
import { Camera, Sparkles, ArrowLeft, HeartHandshake } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { SectionHeading } from '../components/ui/section-heading';

export default function SignLanguageTutor() {
  return (
    <AppShell className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-sm font-semibold text-deep-brown/70 hover:text-terracotta transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to Dashboard
          </Link>
        </div>

        <SectionHeading
          badge="Inclusive Bharat Initiative"
          badgeVariant="teal"
          title="Indian Sign Language Tutor 🤟"
          subtitle="AI-powered visual learning for deaf and hard-of-hearing learners to practice spoken and written English with hand signs."
          align="center"
        />

        <div className="rounded-3xl border border-warm-sand bg-warm-ivory p-8 sm:p-12 shadow-warm text-center space-y-6 mt-8">
          <div className="w-20 h-20 rounded-3xl bg-peacock-teal/15 text-peacock-teal border border-peacock-teal/30 flex items-center justify-center mx-auto text-4xl shadow-warm-sm">
            🤟
          </div>

          <div className="space-y-3 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-1.5">
              <Badge variant="turmeric" className="text-xs font-bold">
                Coming Soon
              </Badge>
              <Badge variant="teal" className="text-xs">
                Under Active Development
              </Badge>
            </div>
            
            <h3 className="text-2xl font-bold font-display text-deep-brown">
              Visual Sign Language Studio
            </h3>

            <p className="text-sm text-deep-brown/75 leading-relaxed font-sans">
              Our camera gesture recognition engine is being calibrated for Indian Sign Language (ISL) hand shapes, lip movement synchronization, and bilingual sign glosses.
            </p>
          </div>

          {/* Feature Teasers */}
          <div className="grid sm:grid-cols-3 gap-4 pt-4 text-left">
            <div className="p-4 rounded-2xl bg-cream-white border border-warm-sand">
              <Camera className="h-5 w-5 text-peacock-teal mb-2" />
              <h4 className="font-bold text-sm text-deep-brown">Hand Gesture AI</h4>
              <p className="text-xs text-deep-brown/70 mt-1">Real-time landmark tracking for ISL alphabets and daily words.</p>
            </div>

            <div className="p-4 rounded-2xl bg-cream-white border border-warm-sand">
              <Sparkles className="h-5 w-5 text-terracotta mb-2" />
              <h4 className="font-bold text-sm text-deep-brown">Visual Subtitles</h4>
              <p className="text-xs text-deep-brown/70 mt-1">Live animated visual prompts matching conversational rhythm.</p>
            </div>

            <div className="p-4 rounded-2xl bg-cream-white border border-warm-sand">
              <HeartHandshake className="h-5 w-5 text-turmeric-dark mb-2" />
              <h4 className="font-bold text-sm text-deep-brown">Accessible For All</h4>
              <p className="text-xs text-deep-brown/70 mt-1">Free for special educators, schools, and families across India.</p>
            </div>
          </div>

          <div className="pt-4">
            <Button asChild variant="primary" size="lg">
              <Link to="/dashboard">
                Practice Voice Conversations Meanwhile
              </Link>
            </Button>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
