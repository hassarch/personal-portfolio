import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import UfoIcon from './UfoIcon';
import { Button } from './ui/button';

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a
            href="#"
            className="group relative text-xl font-bold hover:opacity-80 transition-opacity"
            aria-label="Home"
            onClick={(e) => {
              // Keep link behavior (scroll to top) but also trigger music
              try {
                import('@/lib/ufoMusic').then(m => m.toggleUfoMusic());
              } catch {}
            }}
          >
            <UfoIcon className="relative z-10 text-primary animate-float transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-105 drop-shadow-[0_0_12px_hsl(var(--primary))]" size={54} />
            <div
              className="pointer-events-none absolute left-1/2 top-full -translate-x-1/2 -mt-1 h-24 w-24 opacity-0 group-hover:opacity-100 transition-all duration-300"
              style={{
                background: 'linear-gradient(to bottom, hsl(var(--primary) / 0.6), hsl(var(--primary) / 0.15), transparent)',
                clipPath: 'polygon(50% 0%, 10% 100%, 90% 100%)',
                filter: 'blur(1px) drop-shadow(0 0 8px hsl(var(--primary) / 0.4))',
              }}
            />
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-muted-foreground hover:text-foreground transition-all duration-300 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300 rounded-full" />
              </a>
            ))}
            <Button variant="glass" size="sm" asChild>
              <a href="https://drive.google.com/file/d/1-IKwqW_e3AOs8S9IX7M4E1I7cAagKeZP/view?usp=drive_link" target="_blank" rel="noopener noreferrer">
                Resume
              </a>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300 py-2"
                >
                  {link.name}
                </a>
              ))}
              <Button variant="glass" size="sm" className="w-fit" asChild>
                <a href="https://drive.google.com/file/d/1d1mhEUlHwBxUA0SH9Y-KpibNxHNchOWF/view?usp=drive_link" target="_blank" rel="noopener noreferrer">
                  Resume
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
