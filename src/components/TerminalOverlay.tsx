/**
 * TerminalOverlay Component
 * 
 * Provides persistent CRT scanlines effect over the entire viewport.
 * This component creates the retro terminal aesthetic with animated scanlines.
 * 
 * Features:
 * - Fixed position overlay covering entire screen
 * - CRT-style horizontal scanlines effect
 * - Dark mode variant with adjusted opacity
 * - Pointer-events: none to avoid blocking interactions
 * - High z-index (9999) for proper layering
 */

import React from 'react';

const TerminalOverlay: React.FC = () => {
  return (
    <div 
      className="scanlines-overlay"
      aria-hidden="true"
    />
  );
};

export default TerminalOverlay;
