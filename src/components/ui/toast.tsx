import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
}

type ToastListener = (toasts: ToastMessage[]) => void;

class ToastManager {
  private toasts: ToastMessage[] = [];
  private listeners: Set<ToastListener> = new Set();

  subscribe(listener: ToastListener): () => void {
    this.listeners.add(listener);
    listener(this.toasts);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener([...this.toasts]));
  }

  show(message: string, variant: ToastVariant = 'info', duration = 4000) {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newToast: ToastMessage = { id, message, variant, duration };
    this.toasts = [newToast, ...this.toasts.slice(0, 4)]; // Max 5 toasts
    this.notify();

    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }
    return id;
  }

  dismiss(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  success(message: string, duration = 4000) {
    return this.show(message, 'success', duration);
  }

  error(message: string, duration = 4000) {
    return this.show(message, 'error', duration);
  }

  info(message: string, duration = 4000) {
    return this.show(message, 'info', duration);
  }
}

export const toast = new ToastManager();

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    return toast.subscribe((updated) => {
      setToasts(updated);
    });
  }, []);

  const getVariantStyles = (variant: ToastVariant) => {
    switch (variant) {
      case 'success':
        return {
          bg: 'bg-peacock-teal text-cream-white border-peacock-teal/60',
          icon: <CheckCircle2 className="h-5 w-5 text-turmeric flex-shrink-0" aria-hidden="true" />,
        };
      case 'error':
        return {
          bg: 'bg-soft-coral text-cream-white border-soft-coral/80',
          icon: <AlertCircle className="h-5 w-5 text-white flex-shrink-0" aria-hidden="true" />,
        };
      case 'info':
      default:
        return {
          bg: 'bg-turmeric text-deep-brown border-turmeric-dark/30',
          icon: <Info className="h-5 w-5 text-deep-brown flex-shrink-0" aria-hidden="true" />,
        };
    }
  };

  return (
    <div
      role="region"
      aria-label="Notifications"
      className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      <AnimatePresence>
        {toasts.map((t) => {
          const { bg, icon } = getVariantStyles(t.variant);
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.9 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`pointer-events-auto rounded-2xl border p-4 shadow-warm-lg flex items-center justify-between gap-3 ${bg}`}
              role="alert"
            >
              <div className="flex items-center gap-3">
                {icon}
                <p className="text-xs sm:text-sm font-semibold leading-snug">
                  {t.message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => toast.dismiss(t.id)}
                className="p-1 rounded-lg hover:bg-black/10 transition-colors cursor-pointer flex-shrink-0"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
