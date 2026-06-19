import { useEffect, useState } from 'react';

interface TypingEffectProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  showCursor?: boolean;
}

/**
 * TypingEffect component displays text character-by-character with a typing animation
 * 
 * @param text - The text to display with typing effect
 * @param speed - Milliseconds per character (default: 30)
 * @param onComplete - Callback fired when typing completes
 * @param showCursor - Whether to show blinking cursor (default: true)
 */
const TypingEffect: React.FC<TypingEffectProps> = ({ 
  text, 
  speed = 30,
  onComplete,
  showCursor = true
}) => {
  const [displayed, setDisplayed] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    // Reset state when text changes
    setDisplayed('');
    setIsComplete(false);
    
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayed(text.substring(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
        setIsComplete(true);
        onComplete?.();
      }
    }, speed);
    
    return () => clearInterval(timer);
  }, [text, speed, onComplete]);
  
  return (
    <span className="typing-text">
      {displayed}
      {showCursor && <span className="terminal-cursor animate-blink">_</span>}
    </span>
  );
};

export default TypingEffect;
