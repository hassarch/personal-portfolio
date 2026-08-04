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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ x: 0, y: 0 });

  // Center window on initial open
  useEffect(() => {
    if (state.isWindowOpen && position.x === 0 && position.y === 0) {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const terminalWidth = Math.min(900, windowWidth * 0.9);
      const terminalHeight = Math.min(600, windowHeight * 0.8);
      
      setPosition({
        x: (windowWidth - terminalWidth) / 2,
        y: (windowHeight - terminalHeight) / 2,
      });
    }
  }, [state.isWindowOpen, position.x, position.y]);

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

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
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
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="absolute"
          style={{
            left: position.x,
            top: position.y,
            width: 'min(900px, 90vw)',
            maxHeight: isMinimized ? 'auto' : 'min(600px, 80vh)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="terminal-frame overflow-hidden">
            {/* macOS Window Header */}
            <div
              ref={dragRef}
              onMouseDown={handleMouseDown}
              className="terminal-title-bar cursor-move"
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
              <div className="terminal-content h-[500px] overflow-y-auto scrollbar-thin">
                <CommandHistory
                  entries={entries}
                  currentSection={state.currentSection}
                />
                <CommandInput
                  value={input}
                  onChange={setInput}
                  onSubmit={handleSubmit}
                  onHistoryUp={handleHistoryUp}
                  onHistoryDown={handleHistoryDown}
                  currentSection={state.currentSection}
                />
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TerminalWindow;
