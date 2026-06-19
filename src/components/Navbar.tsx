import { useState, useEffect } from 'react';
import { Moon, Sun, Terminal } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { navigateToSection } from '@/hooks/useScrollNavigation';

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    // Extract section ID from href (remove the # prefix)
    const sectionId = href.substring(1);
    navigateToSection(sectionId);
  };

  const handleTerminalClick = () => {
    // Find and click the terminal toggle button
    const terminalButton = document.querySelector('#command-terminal button');
    if (terminalButton instanceof HTMLElement) {
      terminalButton.click();
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`nav-bar ${isScrolled ? 'bg-background/90 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}
    >
      <div className="nav-container">
        <div className="nav-header">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="nav-theme-btn"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={handleTerminalClick}
              className="nav-theme-btn"
              aria-label="Toggle terminal"
            >
              <Terminal size={18} />
            </button>
          </div>

          <div className="nav-links">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="nav-link"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
