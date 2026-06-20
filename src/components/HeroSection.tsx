import { Github, Linkedin, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import SpotifyPlayer from './SpotifyPlayer';
import TerminalFrame from './TerminalFrame';

const HeroSection = () => {
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
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <section id="hero" className="hero-section">
      <TerminalFrame title="~/welcome" className="w-full max-w-3xl">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center text-center"
        >
          {/* Terminal-style whoami */}
          <motion.div variants={item} className="w-full text-left mb-4">
            <p className="font-mono text-xs sm:text-sm text-foreground opacity-60 mb-1">
              $ whoami
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground uppercase tracking-tight">
              Hassan<span className="animate-blink font-light opacity-80">_</span>
            </h1>
          </motion.div>

          {/* Terminal-style bio */}
          <motion.div variants={item} className="w-full text-left mb-8">
            <p className="font-mono text-xs sm:text-sm text-foreground opacity-60 mb-1">
              $ cat info.txt
            </p>
            <p className="font-mono text-sm text-foreground leading-relaxed">
              &gt; Computer Science undergrad and  developer, I build cool and useful stuff.
            </p>
          </motion.div>

          {/* Action buttons */}
          <motion.div variants={item} className="flex justify-center mb-10 w-full">
            <Button className="retro-button bg-foreground text-background hover:bg-background hover:text-foreground text-sm py-6 px-8 w-full sm:w-auto" asChild>
              <a href="#contact">$ hit_me_up</a>
            </Button>
          </motion.div>

          {/* Social links */}
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

          {/* Spotify Player */}
          <motion.div 
            variants={item}
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="w-full max-w-sm mt-4 custom-float"
          >
            <SpotifyPlayer />
          </motion.div>
        </motion.div>
      </TerminalFrame>
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
