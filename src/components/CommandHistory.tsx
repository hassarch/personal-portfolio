import { useRef, useEffect } from 'react';

interface CommandHistoryEntry {
  input: string;
  output: string;
  timestamp: Date;
}

interface CommandHistoryProps {
  entries: CommandHistoryEntry[];
  currentSection: string;
}

/**
 * CommandHistory Component
 * 
 * Renders the history of command inputs and their outputs.
 * Auto-scrolls to the latest entry.
 */
const CommandHistory: React.FC<CommandHistoryProps> = ({ entries, currentSection }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new entries are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries]);

  if (entries.length === 0) {
    return (
      <div className="font-mono text-xs text-foreground opacity-50 mb-4">
        Type 'help' for available commands.
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="max-h-48 overflow-y-auto mb-4 space-y-2 scrollbar-thin"
    >
      {entries.map((entry, index) => (
        <div key={index} className="font-mono text-xs sm:text-sm">
          {/* Command input line */}
          <div className="flex items-center gap-2 text-foreground">
            <span className="opacity-70 whitespace-nowrap select-none">
              user@portfolio:~/{currentSection}$
            </span>
            <span>{entry.input}</span>
          </div>
          {/* Command output */}
          {entry.output && (
            <pre className="text-foreground opacity-80 whitespace-pre-wrap mt-1 ml-0 leading-relaxed">
              {entry.output}
            </pre>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommandHistory;
export type { CommandHistoryEntry };
