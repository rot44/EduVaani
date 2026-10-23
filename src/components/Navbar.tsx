import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  User,
  LogOut,
  LayoutDashboard,
  Home,
  Menu,
  X,
  BarChart3
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { Button } from './ui/button';

export function Navbar() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(location.pathname);
  const [isScrolled, setIsScrolled] = useState(false);

  // Close mobile drawer when pathname changes
  if (prevPathname !== location.pathname) {
    setPrevPathname(location.pathname);
    setMobileMenuOpen(false);
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on Escape key
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // 15-minute daily practice goal calculation for circular progress ring
  const minutes = user?.minutesPracticed || 0;
  const goalMinutes = 15;
  const progressPercent = Math.min(100, Math.round((minutes / goalMinutes) * 100));
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Sign Language', href: '/sign-tutor', icon: null, badge: '🤟' },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav
      aria-label="Main navigation"
      className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${
        isScrolled
          ? 'bg-cream-white/95 backdrop-blur-md border-warm-sand shadow-warm-md'
          : 'bg-cream-white/90 backdrop-blur-sm border-warm-sand/80 shadow-warm-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-18 items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" aria-label="EduVaani - Go to home" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-terracotta to-turmeric rounded-2xl flex items-center justify-center text-cream-white shadow-warm-sm group-hover:scale-105 transition-all duration-300">
                <Mic className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>
            <div>
              <span className="text-xl font-extrabold font-display text-deep-brown tracking-tight block">
                EduVaani
              </span>
              <span className="text-xs font-semibold text-terracotta block -mt-1 hidden sm:block">
                आपकी आवाज़, आपकी पहचान
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5" role="menubar">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  aria-current={active ? 'page' : undefined}
                  role="menuitem"
                  className={`px-3.5 py-2.5 min-h-[44px] rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                    active
                      ? 'bg-warm-sand/70 text-terracotta font-bold shadow-warm-sm'
                      : 'text-deep-brown/80 hover:text-deep-brown hover:bg-warm-sand/40'
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
                  {link.badge && <span className="text-sm" aria-hidden="true">{link.badge}</span>}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Action & User Controls */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {/* User Avatar with Circular Goal Progress Ring */}
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2.5 p-1 rounded-full hover:bg-warm-sand/40 transition-colors group min-h-[44px]"
                  title={`Daily Goal: ${minutes}m / 15m (${progressPercent}%)`}
                  aria-label={`Profile and daily goal: ${minutes} of 15 minutes practiced (${progressPercent}%)`}
                >
                  <div className="relative w-11 h-11 flex items-center justify-center">
                    {/* SVG Circular Progress Ring */}
                    <svg className="w-11 h-11 -rotate-90" viewBox="0 0 48 48" aria-hidden="true">
                      <circle
                        cx="24"
                        cy="24"
                        r={radius}
                        className="stroke-warm-sand"
                        strokeWidth="3.5"
                        fill="transparent"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r={radius}
                        className="stroke-terracotta transition-all duration-500 ease-out"
                        strokeWidth="3.5"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>

                    {/* Center Avatar Image */}
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`}
                      alt={`${user.name}'s avatar`}
                      className="absolute w-8 h-8 rounded-full object-cover"
                    />
                  </div>

                  <div className="hidden lg:block text-left">
                    <span className="text-xs font-bold text-deep-brown block leading-tight">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-peacock-teal font-medium block">
                      {progressPercent}% Goal
                    </span>
                  </div>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="min-w-[44px] min-h-[44px] bg-warm-ivory border border-warm-sand hover:border-terracotta/40 rounded-full flex items-center justify-center text-deep-brown/80 hover:text-terracotta transition-colors shadow-warm-sm cursor-pointer"
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <Button asChild size="sm" variant="primary" className="rounded-full shadow-terracotta px-5 min-h-[44px] hidden sm:inline-flex">
                <Link to="/login">
                  <User className="h-4 w-4 mr-1.5" aria-hidden="true" />
                  Start Speaking Free
                </Link>
              </Button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-menu"
              className="md:hidden min-w-[44px] min-h-[44px] rounded-2xl bg-warm-ivory border border-warm-sand flex items-center justify-center text-deep-brown hover:bg-warm-sand/60 transition-colors shadow-warm-sm cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer (AnimatePresence) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-navigation-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden border-t border-warm-sand bg-warm-ivory/98 backdrop-blur-xl px-4 py-5 shadow-warm-lg overflow-hidden"
          >
            <div className="space-y-2" role="menu">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    role="menuitem"
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-2xl text-sm font-semibold transition-colors ${
                      active
                        ? 'bg-warm-sand text-terracotta font-bold'
                        : 'text-deep-brown hover:bg-warm-sand/50'
                    }`}
                  >
                    {Icon && <Icon className="h-4 w-4 text-terracotta" aria-hidden="true" />}
                    {link.badge && <span className="text-base" aria-hidden="true">{link.badge}</span>}
                    <span>{link.name}</span>
                  </Link>
                );
              })}

              <div className="pt-3 border-t border-warm-sand/80">
                {user ? (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-cream-white border border-warm-sand">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`}
                        alt={`${user.name}'s avatar`}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="font-bold text-sm text-deep-brown">{user.name}</div>
                        <div className="text-xs text-peacock-teal font-medium">
                          {user.minutesPracticed || 0}m practiced today • {user.streak || 1} day streak
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="min-w-[44px] min-h-[44px] flex items-center justify-center text-terracotta hover:bg-terracotta/10 rounded-xl transition-colors cursor-pointer"
                      title="Log Out"
                      aria-label="Log Out"
                    >
                      <LogOut className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                ) : (
                  <Button asChild size="lg" variant="primary" className="w-full min-h-[44px] justify-center">
                    <Link to="/login">
                      <User className="h-4 w-4 mr-2" aria-hidden="true" />
                      Start Speaking Free
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
