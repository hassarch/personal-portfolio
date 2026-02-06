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
    } catch {}
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-sm border-b border-border shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handleUfoClick}
            className="group relative text-xl font-bold hover:opacity-80 transition-all duration-300"
            aria-label="Toggle theme"
          >
            <UfoIcon className="text-foreground transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" size={40} />
          </button>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-muted-foreground hover:text-foreground hover:scale-105 transition-all duration-300 text-sm font-medium"
              >
                {link.name}
              </a>
            ))}
            <Button variant="outline" size="sm" className="hover:scale-105 transition-transform duration-300" asChild>
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
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300 py-2 text-sm font-medium"
                >
                  {link.name}
                </a>
              ))}
              <Button variant="outline" size="sm" className="w-fit hover:scale-105 transition-transform duration-300" asChild>
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
