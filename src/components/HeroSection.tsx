import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import { motion } from 'motion/react';

import { Button } from './ui/button';
import SpotifyPlayer from './SpotifyPlayer';

const HeroSection = () => {
  const scrollToAbout = () => {
    const element = document.querySelector('#about');
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - (window.innerHeight / 2) + (element.clientHeight / 2);

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <section className="hero-section">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="hero-content"
      >
        <motion.p variants={item} className="hero-sys-init">
          [ sys.init ]
        </motion.p>

        <motion.h1 variants={item} className="hero-title">
          I'm Hassan<span className="animate-blink font-light opacity-80">_</span>
        </motion.h1>

        <motion.p variants={item} className="hero-subtitle">
          Computer Science student & developer. I build clean, user-centric web apps using modern frontend tech.
        </motion.p>

        <motion.div variants={item} className="hero-actions">
          <Button className="retro-button bg-foreground text-background hover:bg-background hover:text-foreground hero-action-btn" asChild>
            <a href="#contact">Get In Touch</a>
          </Button>
          <Button className="retro-button hero-action-btn" asChild>
            <a href="https://drive.google.com/file/d/1-IKwqW_e3AOs8S9IX7M4E1I7cAagKeZP/view?usp=drive_link" target="_blank" rel="noopener noreferrer">
              View Resume
            </a>
          </Button>
        </motion.div>

        <motion.div variants={item} className="hero-socials">
          <SocialLink href="https://github.com/hassarch" icon={<Github size={18} />} label="GitHub" />
          <SocialLink
            href="https://x.com/sanxshade"
            icon={
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            }
            label="X"
          />
          <SocialLink href="https://www.linkedin.com/in/hassan0777/" icon={<Linkedin size={18} />} label="LinkedIn" />
          <SocialLink href="mailto:hassanrj245@gmail.com" icon={<Mail size={18} />} label="Email" />
        </motion.div>

        <motion.div 
          variants={item}
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="w-full max-w-sm mt-4 custom-float"
        >
          <SpotifyPlayer />
        </motion.div>
      </motion.div>


    </section>
  );
};

const SocialLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string; }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="hero-social-link"
  >
    {icon}
  </a>
);

export default HeroSection;
