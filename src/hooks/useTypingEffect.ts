import { useState, useEffect } from 'react';

export interface UseTypingEffectOptions {
  text: string;
  speed?: number;
  delay?: number;
}

/**
 * Custom hook for creating a typing animation effect
 * @param text - The text to animate
 * @param speed - Speed of typing in milliseconds per character (default: 50)
 * @param delay - Initial delay before starting the animation (default: 0)
 * @returns The current typed text
 */
export const useTypingEffect = ({ text, speed = 50, delay = 0 }: UseTypingEffectOptions): string => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Initial delay before starting
    if (delay > 0 && !hasStarted) {
      const delayTimeout = setTimeout(() => {
        setHasStarted(true);
      }, delay);

      return () => clearTimeout(delayTimeout);
    } else if (!hasStarted) {
      setHasStarted(true);
    }
  }, [delay, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed, hasStarted]);

  // Reset when text changes
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    setHasStarted(delay === 0);
  }, [text, delay]);

  return displayedText;
};

/**
 * Custom hook for multiple lines typing effect with sequential animation
 * @param lines - Array of text lines to animate
 * @param speed - Speed of typing in milliseconds per character (default: 50)
 * @param lineDelay - Delay between lines in milliseconds (default: 100)
 * @returns Array of typed text for each line
 */
export const useMultiLineTypingEffect = (
  lines: string[],
  speed: number = 50,
  lineDelay: number = 100
): string[] => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  useEffect(() => {
    if (currentLineIndex >= lines.length) return;

    const currentLine = lines[currentLineIndex];

    if (currentCharIndex < currentLine.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines(prev => {
          const newLines = [...prev];
          newLines[currentLineIndex] = currentLine.slice(0, currentCharIndex + 1);
          return newLines;
        });
        setCurrentCharIndex(currentCharIndex + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (currentCharIndex === currentLine.length && currentLineIndex < lines.length - 1) {
      // Move to next line after a delay
      const timeout = setTimeout(() => {
        setCurrentLineIndex(currentLineIndex + 1);
        setCurrentCharIndex(0);
      }, lineDelay);

      return () => clearTimeout(timeout);
    }
  }, [currentLineIndex, currentCharIndex, lines, speed, lineDelay]);

  // Initialize displayedLines array
  useEffect(() => {
    setDisplayedLines(new Array(lines.length).fill(''));
    setCurrentLineIndex(0);
    setCurrentCharIndex(0);
  }, [lines]);

  return displayedLines;
};
