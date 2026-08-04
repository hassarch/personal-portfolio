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
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.5 }}
      className={`nav-bar ${isScrolled ? 'bg-background/95 backdrop-blur-md shadow-brutal-sm' : 'bg-transparent'}`}
    >
      <div className="nav-container">
        <div className="nav-header">
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.button
              onClick={toggleTheme}
              className="nav-theme-btn"
              aria-label="Toggle theme"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>

            <motion.button
              onClick={handleTerminalClick}
              className="nav-theme-btn"
              aria-label="Toggle terminal"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Terminal size={18} />
            </motion.button>
          </motion.div>

          <motion.div 
            className="nav-links"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {navLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="nav-link"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.4 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {link.name}
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
