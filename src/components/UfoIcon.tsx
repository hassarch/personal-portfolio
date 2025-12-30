import React from 'react';

export default function UfoIcon({ size = 32, className = '' }: { size?: number; className?: string }) {
  const primary = 'hsl(var(--primary))';
  const accent = 'hsl(var(--accent))';
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
      <path d="M8.5 11c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke={primary} strokeWidth="1.6" fill={primary.replace(')', ' / 0.15)')} />
      {/* Saucer */}
      <ellipse cx="12" cy="13" rx="7.5" ry="3.5" stroke={accent} strokeWidth="1.6" fill={accent.replace(')', ' / 0.10)')} />
      {/* Windows */}
      <circle cx="9.5" cy="13" r="0.7" fill={accent} />
      <circle cx="12" cy="13" r="0.7" fill={accent} />
      <circle cx="14.5" cy="13" r="0.7" fill={accent} />
      {/* Little legs */}
      <path d="M6 14.5l-2 3" stroke={primary} strokeWidth="1.6" />
      <path d="M18 14.5l2 3" stroke={primary} strokeWidth="1.6" />
    </svg>
  );
}
