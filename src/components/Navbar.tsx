import { Link, useNavigate } from 'react-router-dom';
import { Mic, User, LogOut, LayoutDashboard } from 'lucide-react';
import { getUser, logout } from '../lib/auth';
import { Button } from './ui/button';

export function Navbar() {
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-cream-white/95 backdrop-blur-md border-b border-warm-sand shadow-warm-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-terracotta to-turmeric rounded-2xl flex items-center justify-center text-cream-white shadow-warm-sm group-hover:scale-105 transition-all duration-300">
                <Mic className="h-5 w-5" />
              </div>
            </div>
            <div>
              <span className="text-xl font-extrabold font-display text-deep-brown tracking-tight">
                EduVaani
              </span>
              <span className="text-xs font-semibold text-terracotta block -mt-1 hidden sm:block">
                आपकी आवाज़, आपकी पहचान
              </span>
            </div>
          </Link>

          {/* Right Navigation Controls */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-deep-brown hover:text-terracotta bg-warm-ivory rounded-full border border-warm-sand hover:border-terracotta/40 transition-all duration-200 shadow-warm-sm"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>

                <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 bg-warm-ivory rounded-full border border-warm-sand text-xs font-medium text-deep-brown">
                  <span className="w-2 h-2 bg-peacock-teal rounded-full animate-pulse" />
                  <span>Namaste, {user.name.split(' ')[0]}!</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-9 h-9 bg-warm-ivory border border-warm-sand rounded-full flex items-center justify-center text-deep-brown/70 hover:text-soft-coral hover:border-soft-coral/40 transition-all duration-200 cursor-pointer shadow-warm-sm"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <Button asChild size="sm" variant="primary" className="rounded-full shadow-terracotta px-5">
                <Link to="/login">
                  <User className="h-4 w-4 mr-1.5" />
                  Start Speaking Free
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
