import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mic, User, Mail, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { login } from '../lib/auth';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

export default function Login() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setLoading(true);
    setTimeout(() => {
      login(name.trim(), email.trim());
      navigate('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950/30 p-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-gentle-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 rounded-3xl shadow-2xl shadow-orange-500/30 mb-4 animate-breathe">
            <Mic className="h-10 w-10 text-white" />
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">EduVaani</h1>
          <p className="text-orange-300 font-medium text-sm mt-1">आपकी आवाज़, आपकी पहचान</p>
          <p className="text-white/40 text-xs mt-1">AI Voice English Tutor for India 🇮🇳</p>
        </div>

        {/* Form card */}
        <div className="glass border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-orange-400" />
              <h2 className="text-lg font-bold text-white font-display">Instant Access</h2>
            </div>
            <Badge variant="saffron" className="text-[10px]">
              No Password Needed
            </Badge>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-2">Your Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  required
                  className="w-full pl-11 pr-4 py-3 glass border border-white/15 hover:border-orange-400/50 focus:border-orange-400 rounded-2xl text-white placeholder-white/30 outline-none transition-all text-sm shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. priya@example.com"
                  required
                  className="w-full pl-11 pr-4 py-3 glass border border-white/15 hover:border-orange-400/50 focus:border-orange-400 rounded-2xl text-white placeholder-white/30 outline-none transition-all text-sm shadow-inner"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              variant="glow"
              size="lg"
              className="w-full text-base font-bold mt-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Entering Classroom...
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-2" />
                  Start Learning Free
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10">
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                ['🎤', 'Voice-First'],
                ['🇮🇳', '8 Languages'],
                ['💎', '100% Free']
              ].map(([icon, label]) => (
                <div key={label} className="glass border border-white/5 rounded-xl p-2 text-center">
                  <div className="text-xl mb-0.5">{icon}</div>
                  <div className="text-[10px] text-white/50 font-medium">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-white/40 text-xs mt-6">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Zero passwords, zero credit cards • Stored safely on your device</span>
        </div>
      </div>
    </div>
  );
}
