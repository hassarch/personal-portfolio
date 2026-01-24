import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToAbout = () => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center px-6 pt-20"
      style={{ transform: `translateY(${scrollY * 0.3}px)` }}
    >
      <div className="max-w-4xl mx-auto text-center z-10">
        <p
          className="text-white font-mono font-bold text-base md:text-lg mb-4 opacity-0 animate-scale-in-strong"
          style={{ animationDelay: '0.2s' }}
        >
          Hi, I'm
        </p>

        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-display font-semibold mb-4 opacity-0 animate-scale-in-strong"
          style={{ animationDelay: '0.4s' }}
        >
          <span className="gradient-text text-glow">Mohammed Hassan</span>
        </h1>

        <h2
          className="text-2xl md:text-4xl lg:text-5xl font-semibold text-muted-foreground mb-6 opacity-0 animate-scale-in-strong"
          style={{ animationDelay: '0.6s' }}
        >
          <span className="gradient-text"></span>
        </h2>

        <p
          className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed opacity-0 animate-scale-in-strong"
          style={{ animationDelay: '0.8s' }}
        >
          A Computer Science undergraduate, passionate about building clean, user-centric web apps. I enjoy turning ideas into real products using modern frontend tech and solving meaningful problems.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 opacity-0 animate-fade-in"
          style={{ animationDelay: '1s' }}
        >
          <Button variant="hero" size="xl" asChild>
            <a href="#contact">Get In Touch</a>
          </Button>
          <Button variant="glass" size="xl" asChild>
            <a href="https://drive.google.com/file/d/1d1mhEUlHwBxUA0SH9Y-KpibNxHNchOWF/view?usp=drive_link" target="_blank" rel="noopener noreferrer">
              View Resume
            </a>
          </Button>
        </div>

        <div
          className="flex justify-center gap-6 mb-16 opacity-0 animate-fade-in"
          style={{ animationDelay: '1.2s' }}
        >
          <SocialLink href="https://github.com/hassarch" icon={<Github size={22} />} label="GitHub" />
          <SocialLink
            href="https://leetcode.com/u/has_san/"
            icon={
              <span
                aria-hidden
                className="inline-block h-[22px] w-[22px]"
                style={{
                  backgroundColor: 'currentColor',
                  WebkitMaskImage: 'url(https://cdn.simpleicons.org/leetcode/000000)',
                  maskImage: 'url(https://cdn.simpleicons.org/leetcode/000000)',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center',
                }}
              />
            }
            label="LeetCode"
          />
          <SocialLink href="https://www.linkedin.com/in/hassan0777/" icon={<Linkedin size={22} />} label="LinkedIn" />
          <SocialLink href="mailto:hassanrj245@gmail.com" icon={<Mail size={22} />} label="Email" />
        </div>

        <button
          onClick={scrollToAbout}
          className="opacity-0 animate-fade-in animate-float"
          style={{ animationDelay: '1.4s' }}
          aria-label="Scroll to about section"
        >
          <ArrowDown className="text-muted-foreground hover:text-primary transition-colors duration-300" size={28} />
        </button>
      </div>
    </section>
  );
};

const SocialLink = ({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="p-3 rounded-full glass-card text-muted-foreground hover:text-primary hover:border-primary/50 hover:scale-110 hover-glow transition-all duration-300"
  >
    {icon}
  </a>
);

export default HeroSection;
