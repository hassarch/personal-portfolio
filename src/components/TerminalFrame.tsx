import React, { useState } from 'react';
import { motion } from 'motion/react';

interface TerminalFrameProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const TerminalFrame: React.FC<TerminalFrameProps> = ({ 
  title, 
  children, 
  className = '' 
}) => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  return (
    <div 
      className={`terminal-frame ${className}`}
      role="region"
      aria-label={`${title} - terminal window`}
    >
      <div className="terminal-title-bar">
        <div className="terminal-controls">
          <motion.button
            className="macos-btn macos-btn-close"
            aria-label="Close window"
            onMouseEnter={() => setHoveredButton('close')}
            onMouseLeave={() => setHoveredButton(null)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {hoveredButton === 'close' && (
              <svg width="6" height="6" viewBox="0 0 6 6" className="macos-btn-icon">
                <path d="M0 0 L6 6 M6 0 L0 6" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            )}
          </motion.button>
          <motion.button
            className="macos-btn macos-btn-minimize"
            aria-label="Minimize window"
            onMouseEnter={() => setHoveredButton('minimize')}
            onMouseLeave={() => setHoveredButton(null)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {hoveredButton === 'minimize' && (
              <svg width="8" height="2" viewBox="0 0 8 2" className="macos-btn-icon">
                <path d="M0 1 L8 1" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            )}
          </motion.button>
          <motion.button
            className="macos-btn macos-btn-maximize"
            aria-label="Maximize window"
            onMouseEnter={() => setHoveredButton('maximize')}
            onMouseLeave={() => setHoveredButton(null)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {hoveredButton === 'maximize' && (
              <svg width="6" height="6" viewBox="0 0 6 6" className="macos-btn-icon">
                <path d="M0.5 3 L3 0.5 L5.5 3 M3 0.5 L3 5.5" stroke="currentColor" strokeWidth="1" fill="none" />
              </svg>
            )}
          </motion.button>
        </div>
        <div className="terminal-title">{title}</div>
        <div className="terminal-controls-spacer"></div>
      </div>
      <div className="terminal-content">
        {children}
      </div>
    </div>
  );
};

export default TerminalFrame;
