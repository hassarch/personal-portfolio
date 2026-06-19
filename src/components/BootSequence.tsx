import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PORTFOLIO_LOGO, PORTFOLIO_LOGO_COMPACT, BOOT_MESSAGES, SUCCESS_ICON } from '@/constants/asciiArt';

interface BootSequenceProps {
  onComplete: () => void;
}

/**
 * BootSequence Component
 * 
 * Displays a terminal-style boot animation on first page load.
 * Shows ASCII art logo and sequential system initialization messages.
 * Completes within ~3 seconds and fades out.
 * Only runs once per session (checked via sessionStorage).
 */
const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    setIsSmallScreen(window.innerWidth < 768);
  }, []);

  const logo = isSmallScreen ? PORTFOLIO_LOGO_COMPACT : PORTFOLIO_LOGO;

  // Progress through boot messages with delays
  useEffect(() => {
    if (currentMessageIndex >= BOOT_MESSAGES.length) {
      // All messages displayed, start fade out
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, 400);
      return () => clearTimeout(fadeTimer);
    }

    const delay = currentMessageIndex === 0 ? 300 : 400;
    const timer = setTimeout(() => {
      setCurrentMessageIndex(prev => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [currentMessageIndex]);

  // Handle fade out completion
  const handleFadeComplete = useCallback(() => {
    if (isFadingOut) {
      setIsComplete(true);
      onComplete();
    }
  }, [isFadingOut, onComplete]);

  if (isComplete) return null;

  return (
    <AnimatePresence onExitComplete={handleFadeComplete}>
      {!isFadingOut && (
        <motion.div
          key="boot-sequence"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[10000] bg-background flex flex-col items-center justify-center p-4 overflow-hidden"
        >
          {/* ASCII Logo */}
          <motion.pre
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-foreground font-mono text-[8px] sm:text-[10px] md:text-xs leading-tight mb-8 text-center select-none whitespace-pre"
          >
            {logo}
          </motion.pre>

          {/* Boot messages */}
          <div className="w-full max-w-md space-y-2 font-mono text-xs sm:text-sm">
            {BOOT_MESSAGES.slice(0, currentMessageIndex).map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2 text-foreground"
              >
                <span className="text-foreground opacity-60">{SUCCESS_ICON}</span>
                <span>{message}</span>
              </motion.div>
            ))}
            
            {/* Blinking cursor on current line */}
            {currentMessageIndex < BOOT_MESSAGES.length && (
              <div className="flex items-center gap-2 text-foreground">
                <span className="animate-blink">█</span>
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-md mt-8">
            <div className="w-full h-1 border border-foreground/30 bg-background overflow-hidden">
              <motion.div
                className="h-full bg-foreground"
                initial={{ width: '0%' }}
                animate={{ width: `${(currentMessageIndex / BOOT_MESSAGES.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BootSequence;
