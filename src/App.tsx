import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { UserProvider, useUser } from './contexts/UserContext';
import { PageLoader } from './components/layout/PageLoader';
import { ErrorBoundary } from './components/layout/ErrorBoundary';
import { ToastContainer } from './components/ui/toast';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const SignLanguageTutor = lazy(() => import('./pages/SignLanguageTutor'));
const Analytics = lazy(() => import('./pages/Analytics'));

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full flex-1"
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition>
              <Login />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <PageTransition>
                <Dashboard />
              </PageTransition>
            </RequireAuth>
          }
        />
        <Route
          path="/sign-tutor"
          element={
            <PageTransition>
              <SignLanguageTutor />
            </PageTransition>
          }
        />
        <Route
          path="/analytics"
          element={
            <RequireAuth>
              <PageTransition>
                <Analytics />
              </PageTransition>
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <UserProvider>
          <ToastContainer />
          <Suspense fallback={<PageLoader />}>
            <AnimatedRoutes />
          </Suspense>
        </UserProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
