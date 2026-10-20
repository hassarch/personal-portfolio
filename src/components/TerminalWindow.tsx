import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal as TerminalIcon } from 'lucide-react';
import CommandInput from './CommandInput';
import CommandHistory, { type CommandHistoryEntry } from './CommandHistory';
import { interpretCommand } from '@/lib/commandInterpreter';
import { navigateToSection } from '@/hooks/useScrollNavigation';
import { useTerminal } from '@/contexts/TerminalContext';

/**
 * TerminalWindow Component
 * 
 * A floating, draggable terminal window that opens as a modal overlay.
 * Features macOS-style window controls and terminal functionality.
 */
const TerminalWindow: React.FC = () => {
  const { state, dispatch } = useTerminal();
  const [input, setInput] = useState('');
  const [entries, setEntries] = useState<CommandHistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ x: 0, y: 0 });

  const recalculatePosition = useCallback(() => {
    if (typeof window === 'undefined') return;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const terminalWidth = Math.min(900, windowWidth * 0.94);
    const terminalHeight = Math.min(560, windowHeight * 0.85);

    setPosition({
      x: Math.max(8, (windowWidth - terminalWidth) / 2),
      y: Math.max(8, (windowHeight - terminalHeight) / 2),
    });
  }, []);

  // Center window on initial open or reopen
  useEffect(() => {
    if (state.isWindowOpen) {
      recalculatePosition();
    }
  }, [state.isWindowOpen, recalculatePosition]);

  // Recalculate position on window resize or phone orientation change
  useEffect(() => {
    window.addEventListener('resize', recalculatePosition);
    window.addEventListener('orientationchange', recalculatePosition);
    return () => {
      window.removeEventListener('resize', recalculatePosition);
      window.removeEventListener('orientationchange', recalculatePosition);
    };
  }, [recalculatePosition]);

  // Add welcome message on mount
  useEffect(() => {
    if (entries.length === 0) {
      const welcomeEntry: CommandHistoryEntry = {
        input: '',
        output: `Welcome to the interactive terminal! 🚀

Type 'help' to see available commands.
Try: cd projects, ls, whoami, or theme dark

Keyboard shortcuts:
  ↑/↓  - Navigate command history
  Tab  - Auto-complete (coming soon)`,
        timestamp: new Date(),
      };
      setEntries([welcomeEntry]);
    }
  }, [entries.length]);

  const handleSubmit = useCallback((command: string) => {
    // Execute command
    const result = interpretCommand(command, state.currentSection);

    // Handle clear command
    if (result.output === '__CLEAR__') {
      setEntries([]);
      setInput('');
      return;
    }

    // Handle theme toggle
    if (result.output === '__TOGGLE_THEME__') {
      const themeBtn = document.querySelector('[aria-label="Toggle theme"]') as HTMLButtonElement;
      if (themeBtn) themeBtn.click();
      
      const newEntry: CommandHistoryEntry = {
        input: command,
        output: 'Theme toggled',
        timestamp: new Date(),
      };
      setEntries(prev => [...prev, newEntry]);
      setInputHistory(prev => [...prev, command]);
      setHistoryIndex(-1);
      setInput('');
      dispatch({ type: 'ADD_COMMAND', payload: command });
      return;
    }

    // Handle set theme
    if (result.output === '__SET_THEME_DARK__' || result.output === '__SET_THEME_LIGHT__') {
      const isDark = result.output === '__SET_THEME_DARK__';
      const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      
      if ((isDark && currentTheme !== 'dark') || (!isDark && currentTheme !== 'light')) {
        const themeBtn = document.querySelector('[aria-label="Toggle theme"]') as HTMLButtonElement;
        if (themeBtn) themeBtn.click();
      }
      
      const newEntry: CommandHistoryEntry = {
        input: command,
        output: `Theme set to ${isDark ? 'dark' : 'light'} mode`,
        timestamp: new Date(),
      };
      setEntries(prev => [...prev, newEntry]);
      setInputHistory(prev => [...prev, command]);
      setHistoryIndex(-1);
      setInput('');
      dispatch({ type: 'ADD_COMMAND', payload: command });
      return;
    }

    // Handle show history
    if (result.output === '__SHOW_HISTORY__') {
      const historyOutput = inputHistory.length === 0 
        ? 'No command history yet.' 
        : inputHistory.map((cmd, idx) => `  ${idx + 1}  ${cmd}`).join('\n');
      
      const newEntry: CommandHistoryEntry = {
        input: command,
        output: historyOutput,
        timestamp: new Date(),
      };
      setEntries(prev => [...prev, newEntry]);
      setInputHistory(prev => [...prev, command]);
      setHistoryIndex(-1);
      setInput('');
      dispatch({ type: 'ADD_COMMAND', payload: command });
      return;
    }

    // Add to history
    const newEntry: CommandHistoryEntry = {
      input: command,
      output: typeof result.output === 'string' ? result.output : '',
      timestamp: new Date(),
    };

    setEntries(prev => [...prev, newEntry]);
    setInputHistory(prev => [...prev, command]);
    setHistoryIndex(-1);
    setInput('');

    // Dispatch to context
    dispatch({ type: 'ADD_COMMAND', payload: command });

    // Handle navigation
    if (result.navigate) {
      const sectionId = result.navigate === 'home' ? 'hero' : result.navigate;
      setTimeout(() => {
        navigateToSection(sectionId);
        dispatch({ type: 'SET_SECTION', payload: result.navigate! });
      }, 300);
    }
  }, [state.currentSection, dispatch, inputHistory]);

  const handleHistoryUp = useCallback(() => {
    if (inputHistory.length === 0) return;
    const newIndex = historyIndex === -1
      ? inputHistory.length - 1
      : Math.max(0, historyIndex - 1);
    setHistoryIndex(newIndex);
    setInput(inputHistory[newIndex]);
  }, [inputHistory, historyIndex]);

  const handleHistoryDown = useCallback(() => {
    if (historyIndex === -1) return;
    const newIndex = historyIndex + 1;
    if (newIndex >= inputHistory.length) {
      setHistoryIndex(-1);
      setInput('');
    } else {
      setHistoryIndex(newIndex);
      setInput(inputHistory[newIndex]);
    }
  }, [inputHistory, historyIndex]);

  const handleClose = () => {
    dispatch({ type: 'CLOSE_WINDOW' });
  };

  const handleMinimize = () => {
    setIsMinimized(prev => !prev);
  };

  const handleMaximize = () => {
    setIsMaximized(prev => !prev);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0 || isMaximized) return; // Only left click
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1 || isMaximized) return;
    setIsDragging(true);
    dragStart.current = {
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y,
    };
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || isMaximized || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const newX = touch.clientX - dragStart.current.x;
    const newY = touch.clientY - dragStart.current.y;
    const maxX = window.innerWidth - 120;
    const maxY = window.innerHeight - 50;
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newX = e.clientX - dragStart.current.x;
      const newY = e.clientY - dragStart.current.y;
      
      // Keep window within viewport bounds
      const maxX = window.innerWidth - 300; // min visible width
      const maxY = window.innerHeight - 50; // min visible height
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  if (!state.isWindowOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className={
            isMaximized
              ? 'fixed inset-2 sm:inset-4 z-10 flex flex-col'
              : 'relative w-full max-w-[900px]'
          }
          style={
            !isMaximized && position.x > 0 && typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerHeight >= 550
              ? {
                  position: 'absolute',
                  left: position.x,
                  top: position.y,
                  width: 'min(900px, 92vw)',
                  maxHeight: isMinimized ? 'auto' : 'min(600px, 85vh)',
                }
              : undefined
          }
          onClick={(e) => e.stopPropagation()}
        >
          <div className="terminal-frame overflow-hidden w-full flex flex-col shadow-2xl">
            {/* macOS Window Header */}
            <div
              ref={dragRef}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="terminal-title-bar cursor-move select-none shrink-0"
            >
              {/* macOS Traffic Light Buttons */}
              <div className="terminal-controls">
                <button
                  onClick={handleClose}
                  className="macos-btn macos-btn-close group"
                  aria-label="Close terminal"
                >
                  <svg 
                    className="macos-btn-icon w-2 h-2 opacity-0 group-hover:opacity-100 transition-opacity" 
                    viewBox="0 0 12 12" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M1 1L11 11M1 11L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
                <button
                  onClick={handleMinimize}
                  className="macos-btn macos-btn-minimize group"
                  aria-label="Minimize terminal"
                >
                  <svg 
                    className="macos-btn-icon w-2 h-2 opacity-0 group-hover:opacity-100 transition-opacity" 
                    viewBox="0 0 12 12" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M1 6H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
                <button
                  onClick={handleMaximize}
                  className="macos-btn macos-btn-maximize group"
                  aria-label="Maximize terminal"
                >
                  <svg 
                    className="macos-btn-icon w-2 h-2 opacity-0 group-hover:opacity-100 transition-opacity" 
                    viewBox="0 0 12 12" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M3 3L9 9M3 9L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              
              {/* Centered Title */}
              <div className="terminal-title flex items-center gap-2">
                <TerminalIcon size={14} />
                <span>Terminal</span>
              </div>
              
              {/* Spacer for symmetry */}
              <div className="terminal-controls-spacer" />
            </div>

            {/* Terminal content */}
            {!isMinimized && (
              <div
                className={`terminal-content flex flex-col overflow-y-auto scrollbar-thin p-3 sm:p-5 ${
                  isMaximized
                    ? 'flex-1 h-full'
                    : 'h-[42vh] sm:h-[420px] md:h-[480px] max-h-[calc(100dvh-6rem)] min-h-[180px]'
                }`}
              >
                <div className="flex-1 overflow-y-auto pr-1">
                  <CommandHistory
                    entries={entries}
                    currentSection={state.currentSection}
                  />
                </div>
                
                <div className="mt-auto pt-2 shrink-0">
                  <CommandInput
                    value={input}
                    onChange={setInput}
                    onSubmit={handleSubmit}
                    onHistoryUp={handleHistoryUp}
                    onHistoryDown={handleHistoryDown}
                    currentSection={state.currentSection}
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TerminalWindow;
