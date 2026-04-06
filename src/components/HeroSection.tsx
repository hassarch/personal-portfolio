import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import { Button } from './ui/button';
import BlurText from './BlurText';

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
    <section className="relative min-h-screen flex items-center justify-center px-6 py-32 md:py-40">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-foreground font-bold text-sm mb-6 tracking-widest uppercase animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          Hello.
        </p>

        <BlurText
          text="I'm Hassan."
          delay={250}
          animateBy="characters"
          stepDuration={0.6}
          className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-foreground tracking-tight leading-tight text-center"
        />

        <p className="text-foreground text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed font-mono animate-fade-in-up opacity-0" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
          Computer Science student & developer. I build clean, user-centric web apps using modern frontend tech.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10 animate-fade-in-up opacity-0" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
          <Button className="retro-button-filled text-sm" asChild>
            <a href="#contact">Get In Touch</a>
          </Button>
          <Button className="retro-button text-sm" asChild>
            <a href="https://drive.google.com/file/d/1-IKwqW_e3AOs8S9IX7M4E1I7cAagKeZP/view?usp=drive_link" target="_blank" rel="noopener noreferrer">
              View Resume
            </a>
          </Button>
        </div>

        <div className="flex gap-3 justify-center animate-fade-in-up opacity-0" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
          <SocialLink href="https://github.com/hassarch" icon={<Github size={18} />} label="GitHub" />
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
          <SocialLink href="https://www.linkedin.com/in/hassan0777/" icon={<Linkedin size={18} />} label="LinkedIn" />
          <SocialLink href="mailto:hassanrj245@gmail.com" icon={<Mail size={18} />} label="Email" />
        </div>

        <button
          onClick={scrollToAbout}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-slow opacity-0 animate-fade-in-up"
          style={{ animationDelay: '1.4s', animationFillMode: 'forwards' }}
          aria-label="Scroll to about section"
        >
          <ArrowDown className="text-foreground" size={24} />
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
    className="p-2 border-2 border-foreground text-foreground hover:bg-foreground hover:text-background transition-all duration-200"
  >
    {icon}
  </a>
);

export default HeroSection;
