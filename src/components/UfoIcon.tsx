import React from 'react';

export default function UfoIcon({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Dome */}
      <path 
        d="M8.5 11c0-2.2 1.8-4 4-4s4 1.8 4 4" 
        stroke="currentColor" 
        strokeWidth="1.6" 
        fill="currentColor" 
        fillOpacity="0.15"
      />
      {/* Saucer */}
      <ellipse 
        cx="12" 
        cy="13" 
        rx="7.5" 
        ry="3.5" 
        stroke="currentColor" 
        strokeWidth="1.6" 
        fill="currentColor" 
        fillOpacity="0.10"
      />
      {/* Windows */}
      <circle cx="9.5" cy="13" r="0.7" fill="currentColor" />
      <circle cx="12" cy="13" r="0.7" fill="currentColor" />
      <circle cx="14.5" cy="13" r="0.7" fill="currentColor" />
      {/* Little legs */}
      <path d="M6 14.5l-2 3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M18 14.5l2 3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
