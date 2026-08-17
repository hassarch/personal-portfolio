import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import SkillsSection from '@/components/SkillsSection';
import ProjectsSection from '@/components/ProjectsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import TerminalWindow from '@/components/TerminalWindow';
import Starfield from '@/components/Starfield';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={`page-wrapper ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Space backdrop: starfield in the void, grid texture layered on top */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <Starfield />
        <div className="absolute inset-0 bg-grid-pattern" />
      </div>
      
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[10001] focus:px-4 focus:py-2 focus:bg-foreground focus:text-background focus:font-mono focus:text-sm focus:border-2 focus:border-foreground"
      >
        Skip to main content
      </a>

      <div className="main-container">
        <Navbar />
        <main id="main-content" className="pt-24 pb-16">
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <ProjectsSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
      
      <BackToTop />
      <TerminalWindow />
    </div>
  );
};

export default Index;
