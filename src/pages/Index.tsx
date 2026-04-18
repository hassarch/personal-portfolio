import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import SkillsSection from '@/components/SkillsSection';
import ProjectsSection from '@/components/ProjectsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={`page-wrapper ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="fixed inset-0 z-0 bg-grid-pattern pointer-events-none" />
      
      <div className="main-container">
        <Navbar />
        <main className="pt-24 pb-16">
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <ProjectsSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
      
      <BackToTop />
    </div>
  );
};

export default Index;
