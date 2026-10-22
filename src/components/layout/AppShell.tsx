import React from 'react';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';

interface AppShellProps {
  children: React.ReactNode;
  className?: string;
  hideFooter?: boolean;
}

export function AppShell({ children, className = '', hideFooter = false }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-cream-white text-deep-brown selection:bg-terracotta selection:text-cream-white font-sans overflow-x-hidden">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1} className={`flex-grow focus:outline-none ${className}`}>
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}
