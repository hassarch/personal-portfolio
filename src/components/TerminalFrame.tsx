import React from 'react';

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
  return (
    <div 
      className={`terminal-frame ${className}`}
      role="region"
      aria-label={`${title} - terminal window`}
    >
      <div className="terminal-title-bar">
        <div className="terminal-controls">
          <span className="terminal-btn terminal-btn-close" aria-hidden="true">●</span>
          <span className="terminal-btn terminal-btn-minimize" aria-hidden="true">●</span>
          <span className="terminal-btn terminal-btn-maximize" aria-hidden="true">●</span>
        </div>
        <div className="terminal-title">{title}</div>
      </div>
      <div className="terminal-content">
        {children}
      </div>
    </div>
  );
};

export default TerminalFrame;
