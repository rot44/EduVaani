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
      <Navbar />
      <main className={`flex-grow ${className}`}>
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}
