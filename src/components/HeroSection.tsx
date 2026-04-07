import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import { Button } from './ui/button';
import BlurText from './BlurText';
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

  return (
    <section className="relative flex items-center justify-center min-h-screen px-6 border-b-4 border-foreground">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-foreground font-bold text-xs mb-5 tracking-[0.2em] uppercase animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          Hello.
        </p>

        <BlurText
          text="I'm Hassan."
          delay={250}
          animateBy="characters"
          stepDuration={0.6}
          className="text-5xl md:text-6xl font-bold mb-5 text-foreground tracking-tight leading-tight"
        />

        <p className="text-foreground text-sm max-w-lg mx-auto mb-8 leading-relaxed font-mono animate-fade-in-up opacity-0" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
          Computer Science student & developer. I build clean, user centric web apps using modern frontend tech.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8 animate-fade-in-up opacity-0" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
          <Button className="retro-button-filled text-sm" asChild>
            <a href="#contact">Get In Touch</a>
          </Button>
          <Button className="retro-button text-sm" asChild>
            <a href="https://drive.google.com/file/d/1-IKwqW_e3AOs8S9IX7M4E1I7cAagKeZP/view?usp=drive_link" target="_blank" rel="noopener noreferrer">
              View Resume
            </a>
          </Button>
        </div>

        <div className="flex gap-2 justify-center animate-fade-in-up opacity-0" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
          <SocialLink href="https://github.com/hassarch" icon={<Github size={16} />} label="GitHub" />
          <SocialLink
            href="https://x.com/sanxshade"
            icon={
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            }
            label="X"
          />
          <SocialLink href="https://www.linkedin.com/in/hassan0777/" icon={<Linkedin size={16} />} label="LinkedIn" />
          <SocialLink href="mailto:hassanrj245@gmail.com" icon={<Mail size={16} />} label="Email" />
        </div>

        <div className="mt-10 flex justify-center animate-fade-in-up opacity-0" style={{ animationDelay: '1.3s', animationFillMode: 'forwards' }}>
          <SpotifyPlayer />
        </div>
      </div>

      <button
        onClick={scrollToAbout}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce-slow opacity-0 animate-fade-in-up"
        style={{ animationDelay: '1.4s', animationFillMode: 'forwards' }}
        aria-label="Scroll to about section"
      >
        <ArrowDown className="text-foreground" size={20} />
      </button>
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
    className="flex items-center justify-center w-9 h-9 border-2 border-foreground text-foreground hover:bg-foreground hover:text-background transition-all duration-200"
  >
    {icon}
  </a>
);

export default HeroSection;
