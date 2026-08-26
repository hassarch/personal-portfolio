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

  const toggleTerminal = () => dispatch({ type: 'TOGGLE_WINDOW' });

  return (
    // Wrapper is click-through so the gutter around the floating island
    // doesn't swallow clicks on the page beneath it.
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      {/* min-w keeps the bar and its dropdown the same width, open or closed */}
      <div className="pointer-events-auto min-w-[220px] md:min-w-0">
        <motion.nav
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`nav-island ${
            isScrolled ? 'bg-background/90 shadow-brutal-md' : 'bg-background/60 shadow-brutal-sm'
          }`}
        >
          {/* Desktop links */}
          <div className="hidden items-center gap-0.5 md:flex">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <button
                  key={link.name}
                  onClick={() => goToSection(link.href)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`relative rounded-[6px] px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-widest transition-colors ${
                    isActive ? 'text-background' : 'text-foreground hover:opacity-60'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-[6px] border-2 border-foreground bg-foreground"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {link.name}
                </button>
              );
            })}
          </div>

          <span className="nav-divider hidden md:block" aria-hidden="true" />

          {/* Utility controls */}
          <div className="flex shrink-0 items-center gap-0.5">
            <motion.button
              onClick={toggleTheme}
              className="nav-icon-btn"
              aria-label="Toggle theme"
              whileHover={{ rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </motion.button>

            <motion.button
              onClick={toggleTerminal}
              className="nav-icon-btn"
              aria-label="Toggle terminal"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Terminal size={16} />
            </motion.button>

            {RESUME_URL && (
              <motion.a
                href={RESUME_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 hidden items-center gap-1.5 rounded-[6px] border-2 border-foreground bg-foreground px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-background md:flex"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
              >
                <FileText size={12} />
                Resume
              </motion.a>
            )}

            <motion.button
              onClick={() => setIsMobileOpen((open) => !open)}
              className="nav-icon-btn md:hidden"
              aria-label="Toggle menu"
              aria-expanded={isMobileOpen}
              whileTap={{ scale: 0.9 }}
            >
              {isMobileOpen ? <X size={16} /> : <Menu size={16} />}
            </motion.button>
          </div>
        </motion.nav>

        {/* Mobile menu — a second island docked under the bar */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              className="nav-island mt-2 flex-col items-stretch gap-1 bg-background/90 shadow-brutal-md md:hidden"
            >
              {navLinks.map((link, index) => {
                const isActive = activeSection === link.href.substring(1);
                return (
                  <motion.button
                    key={link.name}
                    onClick={() => goToSection(link.href)}
                    aria-current={isActive ? 'true' : undefined}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * index }}
                    className={`flex items-center gap-2 rounded-[6px] border-2 px-3 py-2.5 text-left font-mono text-xs font-bold uppercase tracking-widest transition-colors ${
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
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * navLinks.length }}
                  className="flex items-center gap-2 rounded-[6px] border-2 border-foreground bg-foreground px-3 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-background"
                >
                  <FileText size={14} />
                  Resume
                </motion.a>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Navbar;
