import { useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { HeroSection } from '../components/landing/HeroSection';
import { StatsStrip } from '../components/landing/StatsStrip';
import { HowItWorks } from '../components/landing/HowItWorks';
import { LanguageShowcase } from '../components/landing/LanguageShowcase';
import { ScenarioGallery } from '../components/landing/ScenarioGallery';
import { ComparisonSection } from '../components/landing/ComparisonSection';
import { AccessibilityHighlight } from '../components/landing/AccessibilityHighlight';
import { TestimonialCarousel } from '../components/landing/TestimonialCarousel';
import { FAQSection } from '../components/landing/FAQSection';
import { FinalCTA } from '../components/landing/FinalCTA';
import { getUser } from '../lib/auth';

export default function Home() {
  const user = getUser();

  // Dynamic SEO & OpenGraph meta tag updates
  useEffect(() => {
    document.title = "EduVaani (एजुवाणी) — AI English Voice Tutor for India";

    const setMetaTag = (attrName: string, attrVal: string, content: string) => {
      let meta = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attrName, attrVal);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    setMetaTag(
      'name',
      'description',
      'EduVaani is India\'s voice-first regional AI English tutor. Practice real conversations in authentic Indian settings with instant guidance in Hindi, Marathi, Tamil, Bengali & 4 more languages.'
    );
    setMetaTag('property', 'og:title', 'EduVaani (एजुवाणी) — AI English Voice Tutor for India');
    setMetaTag(
      'property',
      'og:description',
      'Practice conversational English naturally with real-time speech, instant translation into 8 Indian regional languages, and authentic Indian real-world scenarios.'
    );
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:site_name', 'EduVaani');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-cream-white text-deep-brown selection:bg-terracotta selection:text-cream-white font-sans overflow-x-hidden">
      <Navbar />

      <main className="flex-grow">
        <HeroSection user={user} />
        <StatsStrip />
        <HowItWorks />
        <LanguageShowcase />
        <ScenarioGallery user={user} />
        <ComparisonSection />
        <AccessibilityHighlight userLoggedIn={!!user} />
        <TestimonialCarousel />
        <FAQSection />
        <FinalCTA user={user} />
      </main>

      <Footer />
    </div>
  );
}
