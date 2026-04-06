import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import UfoIcon from './UfoIcon';
import { Button } from './ui/button';
import { useTheme } from '@/contexts/ThemeContext';

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toggleTheme } = useTheme();

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
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - (window.innerHeight / 2) + (element.clientHeight / 2);
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsMobileMenuOpen(false);
    }
  };

  const handleUfoClick = () => {
    toggleTheme();
    try {
      import('@/lib/ufoMusic').then(m => m.toggleUfoMusic());
    } catch {
      // Dynamic import can fail in some environments; ignore
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b-4 border-foreground">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 border-2 border-foreground flex items-center justify-center">
              <div className="w-4 h-4 border border-foreground"></div>
            </div>
            <span className="font-bold text-sm hidden sm:inline">Portfolio</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-foreground hover:bg-foreground hover:text-background px-2 py-1 transition-all text-sm font-bold border border-transparent hover:border-foreground"
              >
                {link.name}
              </a>
            ))}
            <Button variant="outline" size="sm" className="retro-button text-xs" asChild>
              <a href="https://drive.google.com/file/d/1-IKwqW_e3AOs8S9IX7M4E1I7cAagKeZP/view?usp=drive_link" target="_blank" rel="noopener noreferrer">
                Resume
              </a>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden border-2 border-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t-2 border-foreground pt-4">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-foreground hover:bg-foreground hover:text-background px-2 py-2 transition-all text-sm font-bold border border-foreground"
                >
                  {link.name}
                </a>
              ))}
              <Button variant="outline" size="sm" className="retro-button text-xs w-full" asChild>
                <a href="https://drive.google.com/file/d/1-IKwqW_e3AOs8S9IX7M4E1I7cAagKeZP/view?usp=drive_link" target="_blank" rel="noopener noreferrer">
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
