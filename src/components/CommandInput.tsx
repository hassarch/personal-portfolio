import { useRef, useEffect } from 'react';

interface CommandInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (command: string) => void;
  onHistoryUp: () => void;
  onHistoryDown: () => void;
  currentSection: string;
  disabled?: boolean;
}

/**
 * CommandInput Component
 * 
 * Terminal-style input with prompt display and keyboard handling.
 * Supports command history navigation via arrow keys.
 */
const CommandInput: React.FC<CommandInputProps> = ({
  value,
  onChange,
  onSubmit,
  onHistoryUp,
  onHistoryDown,
  currentSection,
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      e.preventDefault();
      onSubmit(value.trim());
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      onHistoryUp();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      onHistoryDown();
    }
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const prompt = `user@portfolio:~/${currentSection}$`;

  return (
    <div
      className="flex items-center gap-2 font-mono text-xs sm:text-sm cursor-text"
      onClick={handleContainerClick}
      role="textbox"
      aria-label="Terminal command input"
    >
      <span className="text-foreground opacity-70 whitespace-nowrap select-none flex-shrink-0">
        {prompt}
      </span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="flex-1 bg-transparent border-none outline-none text-foreground font-mono text-xs sm:text-sm caret-foreground min-w-0"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        aria-label="Type a command"
      />
      <span className="animate-blink text-foreground select-none">█</span>
    </div>
  );
};

export default CommandInput;
