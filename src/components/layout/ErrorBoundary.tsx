import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';
import { Button } from '../ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[70vh] flex items-center justify-center p-6 bg-cream-white">
          <div className="w-full max-w-md rounded-3xl border-2 border-soft-coral/50 bg-warm-ivory p-8 text-center shadow-warm-lg space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-soft-coral/15 border border-soft-coral/30 text-soft-coral flex items-center justify-center mx-auto">
              <AlertCircle className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-display text-deep-brown">
                Something Went Wrong
              </h2>
              <p className="text-sm text-deep-brown/75 leading-relaxed font-sans">
                EduVaani encountered an unexpected hiccup. Don&apos;t worry, your practice progress is safe.
              </p>
              {this.state.error && (
                <div className="text-[11px] font-mono bg-cream-white/80 p-2.5 rounded-xl border border-warm-sand text-deep-brown/60 truncate mt-2">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                variant="primary"
                onClick={this.handleRetry}
                className="w-full sm:w-auto"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => { window.location.href = '/'; }}
                className="w-full sm:w-auto"
              >
                <Home className="mr-2 h-4 w-4" />
                Go to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
