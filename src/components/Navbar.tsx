import { Link, useNavigate } from 'react-router-dom';
import { Mic, User, LogOut, LayoutDashboard } from 'lucide-react';
import { getUser, logout } from '../lib/auth';

export function Navbar() {
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full blur opacity-60 group-hover:opacity-100 transition-all duration-300" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                <Mic className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold font-display text-white">EduVaani</span>
              <span className="text-xs text-orange-300 block -mt-0.5 hidden sm:block">आपकी आवाज़, आपकी पहचान</span>
            </div>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/80 hover:text-white glass rounded-full border border-white/10 hover:border-white/30 transition-all duration-300"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>

                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 glass rounded-full border border-white/10">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm text-white/70">Namaste, {user.name.split(' ')[0]}!</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-9 h-9 glass border border-white/10 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:border-red-400/50 transition-all duration-300"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-full shadow-lg hover:shadow-orange-500/25 transition-all duration-300 text-sm"
              >
                <User className="h-4 w-4" />
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
