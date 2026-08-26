import { useState, useEffect } from 'react';
import { Moon, Sun, Terminal, Menu, X, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '@/contexts/ThemeContext';
import { useTerminal } from '@/contexts/TerminalContext';
import { navigateToSection, useCurrentSection } from '@/hooks/useScrollNavigation';
import { RESUME_URL } from '@/constants/profile';

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

const sectionIds = navLinks.map((link) => link.href.substring(1));

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { dispatch } = useTerminal();
  const activeSection = useCurrentSection(sectionIds, 0.4);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const goToSection = (href: string) => {
    navigateToSection(href.substring(1));
    setIsMobileOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileOpen(false);
  };

  const toggleTerminal = () => dispatch({ type: 'TOGGLE_WINDOW' });

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30, duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/90 backdrop-blur-md border-b-2 border-foreground'
          : 'bg-transparent border-b-2 border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand */}
          <motion.button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="group flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-widest"
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.96 }}
          >
            <span className="flex h-8 w-8 items-center justify-center border-2 border-foreground bg-foreground text-background shadow-brutal-sm transition-shadow group-hover:shadow-brutal-md">
              H
            </span>
            <span className="hidden sm:inline">
              <span className="opacity-50">~/</span>hassan
              <span className="animate-blink font-light opacity-70">_</span>
            </span>
          </motion.button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <button
                  key={link.name}
                  onClick={() => goToSection(link.href)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`relative rounded-[4px] px-3 py-2 font-mono text-xs font-bold uppercase tracking-widest transition-colors ${
                    isActive ? 'text-background' : 'text-foreground hover:text-foreground/60'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-[4px] border-2 border-foreground bg-foreground"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {link.name}
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {RESUME_URL && (
              <motion.a
                href={RESUME_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden items-center gap-1.5 rounded-[6px] border-2 border-foreground bg-foreground px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-background shadow-brutal-sm transition-shadow hover:shadow-brutal-md sm:flex"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
              >
                <FileText size={12} />
                Resume
              </motion.a>
            )}

            <motion.button
              onClick={toggleTheme}
              className="nav-theme-btn"
              aria-label="Toggle theme"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>

            <motion.button
              onClick={toggleTerminal}
              className="nav-theme-btn"
              aria-label="Toggle terminal"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Terminal size={18} />
            </motion.button>

            <motion.button
              onClick={() => setIsMobileOpen((open) => !open)}
              className="nav-theme-btn md:hidden"
              aria-label="Toggle menu"
              aria-expanded={isMobileOpen}
              whileTap={{ scale: 0.95 }}
            >
              {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="md:hidden overflow-hidden border-b-2 border-foreground bg-background/95 backdrop-blur-md"
          >
            <div className="max-w-6xl mx-auto flex flex-col gap-1 px-4 py-4">
              {navLinks.map((link, index) => {
                const isActive = activeSection === link.href.substring(1);
                return (
                  <motion.button
                    key={link.name}
                    onClick={() => goToSection(link.href)}
                    aria-current={isActive ? 'true' : undefined}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className={`flex items-center gap-2 rounded-[4px] border-2 px-3 py-3 text-left font-mono text-sm font-bold uppercase tracking-widest transition-colors ${
                      isActive
                        ? 'border-foreground bg-foreground text-background'
                        : 'border-transparent text-foreground hover:border-foreground'
                    }`}
                  >
                    <span className="opacity-50">{String(index + 1).padStart(2, '0')}</span>
                    {link.name}
                  </motion.button>
                );
              })}

              {RESUME_URL && (
                <motion.a
                  href={RESUME_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * navLinks.length }}
                  className="mt-1 flex items-center gap-2 rounded-[4px] border-2 border-foreground bg-foreground px-3 py-3 font-mono text-sm font-bold uppercase tracking-widest text-background"
                >
                  <FileText size={14} />
                  Resume
                </motion.a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
