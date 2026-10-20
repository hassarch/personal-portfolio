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
import SpotifyPlayer from '@/components/SpotifyPlayer';
import GithubStatsTile from '@/components/bento/GithubStatsTile';
import LeetCodeStatsTile from '@/components/bento/LeetCodeStatsTile';
import AniListTile from '@/components/bento/AniListTile';

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
        <main id="main-content" className="pt-16 sm:pt-24 pb-12 sm:pb-16">
          {/*
            Bento cluster. Section ids stay on the grid items — Navbar's
            useCurrentSection and the terminal's navigation commands both
            resolve these by querySelector('#id').
          */}
          <div className="bento-grid">
            {/* Hero section - full width */}
            <section id="hero" className="col-span-full">
              <HeroSection />
            </section>

            {/* About - horizontal rectangle on the left */}
            <section id="about" className="col-span-full lg:col-span-6 lg:row-span-2">
              <AboutSection />
            </section>

            {/* Rectangle tiles - Spotify and Anime stacked on the right */}
            <div className="col-span-full sm:col-span-6 lg:col-span-6">
              <SpotifyPlayer />
            </div>

            <div className="col-span-full sm:col-span-6 lg:col-span-6">
              <AniListTile />
            </div>

            {/* Activity heatmap tiles - full width below */}
            <div className="col-span-full lg:col-span-6">
              <GithubStatsTile />
            </div>

            <div className="col-span-full lg:col-span-6">
              <LeetCodeStatsTile />
            </div>
          </div>

          {/* Full-width sections below the cluster */}
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
