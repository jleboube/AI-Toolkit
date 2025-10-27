import React from 'react';

export const MaleIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4 text-white' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="13" r="4" />
    <path d="m19 5-8.8 8.8" />
    <path d="M19 5h-6" />
    <path d="M19 5v6" />
  </svg>
);
