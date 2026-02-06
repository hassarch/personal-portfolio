import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import { Button } from './ui/button';

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
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-muted-foreground font-mono text-sm md:text-base mb-8 tracking-widest uppercase animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          Hi, I'm
        </p>

        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 text-foreground tracking-tight animate-scale-in opacity-0 leading-tight" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
          Hassan
        </h1>

        <h2 className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-10 font-light animate-fade-in-up opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
          Computer Science Student & Developer
        </h2>

        <p className="text-muted-foreground text-base md:text-lg max-w-3xl mx-auto mb-14 leading-relaxed animate-fade-in-up opacity-0" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
          A Computer Science undergraduate, passionate about building clean, user-centric web apps. 
          I enjoy turning ideas into real products using modern frontend tech and solving meaningful problems.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-20 animate-fade-in-up opacity-0" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
          <Button variant="default" size="lg" className="min-w-[180px]" asChild>
            <a href="#contact">Get In Touch</a>
          </Button>
          <Button variant="outline" size="lg" className="min-w-[180px]" asChild>
            <a href="https://drive.google.com/file/d/1-IKwqW_e3AOs8S9IX7M4E1I7cAagKeZP/view?usp=drive_link" target="_blank" rel="noopener noreferrer">
              View Resume
            </a>
          </Button>
        </div>

        <div className="flex justify-center gap-5 mb-20 animate-fade-in-up opacity-0" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
          <SocialLink href="https://github.com/hassarch" icon={<Github size={20} />} label="GitHub" />
          <SocialLink
            href="https://x.com/sanxshade"
            icon={
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            }
            label="X"
          />
          <SocialLink
            href="https://leetcode.com/u/has_san/"
            icon={
              <span
                aria-hidden
                className="inline-block h-5 w-5"
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
          <SocialLink href="https://www.linkedin.com/in/hassan0777/" icon={<Linkedin size={20} />} label="LinkedIn" />
          <SocialLink href="mailto:hassanrj245@gmail.com" icon={<Mail size={20} />} label="Email" />
        </div>

        <button
          onClick={scrollToAbout}
          className="animate-bounce-slow opacity-0 animate-fade-in-up"
          style={{ animationDelay: '1.4s', animationFillMode: 'forwards' }}
          aria-label="Scroll to about section"
        >
          <ArrowDown className="text-muted-foreground hover:text-foreground transition-colors duration-300" size={28} />
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
    className="p-3 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground hover:scale-110 hover:shadow-lg transition-all duration-300"
  >
    {icon}
  </a>
);

export default HeroSection;
