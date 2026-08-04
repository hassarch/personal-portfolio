import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, ChevronUp, ChevronDown } from 'lucide-react';
import CommandInput from './CommandInput';
import CommandHistory, { type CommandHistoryEntry } from './CommandHistory';
import { interpretCommand } from '@/lib/commandInterpreter';
import { navigateToSection } from '@/hooks/useScrollNavigation';
import { useTerminal } from '@/contexts/TerminalContext';

/**
 * CommandTerminal Component
 * 
 * Collapsible fixed terminal panel at the bottom of the viewport.
 * Integrates CommandInput and CommandHistory with the command interpreter.
 * Handles navigation and state management via TerminalContext.
 */
const CommandTerminal: React.FC = () => {
  const { state, dispatch } = useTerminal();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [entries, setEntries] = useState<CommandHistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [inputHistory, setInputHistory] = useState<string[]>([]);

  // Add welcome message on mount
  useEffect(() => {
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
  }, []);

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
      // Dispatch to theme context
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
      // Small delay so user can see the output
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

  const toggleTerminal = () => setIsOpen(prev => !prev);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9998]" id="command-terminal">
      {/* Toggle bar */}
      <motion.button
        onClick={toggleTerminal}
        className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-background border-t-2 border-foreground text-foreground font-mono text-xs uppercase tracking-widest hover:bg-foreground/5 transition-colors"
        aria-label={isOpen ? 'Close terminal' : 'Open terminal'}
        aria-expanded={isOpen}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <Terminal size={14} />
        <span>Terminal</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronUp size={14} />
        </motion.div>
      </motion.button>

      {/* Terminal panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="bg-background border-t border-foreground/20 overflow-hidden shadow-brutal-md"
          >
            <motion.div 
              className="p-4 max-w-6xl mx-auto"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommandTerminal;
