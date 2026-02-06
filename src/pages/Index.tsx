import { useEffect, useState } from 'react';
import AnimatedBackground from '@/components/AnimatedBackground';
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
    <div className={`relative min-h-screen overflow-x-hidden bg-background transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <AnimatedBackground />
      
      <div className="relative z-10">
        <Navbar />
        <main>
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
