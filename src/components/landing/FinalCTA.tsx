import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, Zap, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import type { User } from '../../lib/auth';

interface FinalCTAProps {
  user: User | null;
}

export function FinalCTA({ user }: FinalCTAProps) {
  const navigate = useNavigate();

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-cream-white to-warm-ivory/60 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-terracotta/40 bg-gradient-to-br from-terracotta via-terracotta-dark to-terracotta-hover text-cream-white p-10 sm:p-16 text-center relative overflow-hidden shadow-warm-lg"
        >
          {/* Subtle warm decorative light rings */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-turmeric/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cream-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="text-5xl inline-block mb-1">🇮🇳</span>

            <h2 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight leading-tight text-cream-white">
              Your Spoken English Journey{' '}
              <span className="text-turmeric-light underline decoration-turmeric/40 decoration-wavy">
                Begins Today
              </span>
            </h2>

            <p className="text-cream-white/85 text-base sm:text-lg leading-relaxed font-sans">
              Join thousands of learners building fluency and confidence, one natural conversation at a time. Free forever, no credit cards required.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <Button
                  onClick={() => navigate('/dashboard')}
                  size="lg"
                  variant="accent"
                  className="w-full sm:w-auto text-base group text-deep-brown font-bold"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Back to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              ) : (
                <Button
                  asChild
                  size="lg"
                  variant="accent"
                  className="w-full sm:w-auto text-base group text-deep-brown font-bold"
                >
                  <Link to="/login">
                    <Mic className="mr-2 h-5 w-5" />
                    Start Speaking Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              )}
            </div>

            <div className="pt-4 flex items-center justify-center gap-6 text-xs text-cream-white/75 font-medium flex-wrap">
              <span>✓ 100% Free Forever</span>
              <span>•</span>
              <span>✓ 8 Regional Indian Languages</span>
              <span>•</span>
              <span>✓ Zero Installation Needed</span>
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
