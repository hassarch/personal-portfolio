import { useState, useCallback } from 'react';
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

  const handleSubmit = useCallback((command: string) => {
    // Execute command
    const result = interpretCommand(command, state.currentSection);

    // Handle clear command
    if (result.output === '__CLEAR__') {
      setEntries([]);
      setInput('');
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
  }, [state.currentSection, dispatch]);

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
      <button
        onClick={toggleTerminal}
        className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-background border-t-2 border-foreground text-foreground font-mono text-xs uppercase tracking-widest hover:bg-foreground/5 transition-colors"
        aria-label={isOpen ? 'Close terminal' : 'Open terminal'}
        aria-expanded={isOpen}
      >
        <Terminal size={14} />
        <span>Terminal</span>
        {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
      </button>

      {/* Terminal panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-background border-t border-foreground/20 overflow-hidden"
          >
            <div className="p-4 max-w-6xl mx-auto">
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommandTerminal;
