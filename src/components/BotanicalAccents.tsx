import React from 'react';

export const BotanicalBranch: React.FC<{ className?: string }> = ({ className = 'w-6 h-6 text-emerald-700/60' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <path d="M50 90 C 50 60, 48 40, 50 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M50 70 C 35 65, 30 50, 35 40 C 42 45, 48 55, 50 70" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.8" />
    <path d="M50 55 C 65 50, 70 35, 65 25 C 58 30, 52 40, 50 55" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.8" />
    <path d="M50 40 C 35 35, 32 22, 38 15 C 44 20, 48 28, 50 40" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.8" />
    <path d="M50 25 C 62 20, 65 10, 60 5 C 55 8, 52 16, 50 25" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="50" cy="10" r="3" fill="#C5A059" />
  </svg>
);

export const BotanicalLeafBadge: React.FC<{ text: string }> = ({ text }) => (
  <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-800 bg-emerald-50/80 px-3 py-1 rounded-full border border-emerald-100">
    <BotanicalBranch className="w-3.5 h-3.5 text-emerald-700" />
    <span>{text}</span>
  </div>
);

export const GoldStripeDivider: React.FC<{ className?: string }> = ({ className = 'my-6' }) => (
  <div className={`flex items-center justify-center gap-2 ${className}`}>
    <div className="h-px bg-gradient-to-r from-transparent via-[#C5A059]/40 to-transparent w-24"></div>
    <div className="w-1.5 h-1.5 rotate-45 bg-[#C5A059]"></div>
    <div className="h-px bg-gradient-to-r from-transparent via-[#C5A059]/40 to-transparent w-24"></div>
  </div>
);
