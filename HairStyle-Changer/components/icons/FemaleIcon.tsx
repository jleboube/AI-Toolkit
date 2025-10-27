import React from 'react';

export const FemaleIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4 text-white' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="10" r="4" />
    <path d="M12 14v8" />
    <path d="M9 19h6" />
  </svg>
);
