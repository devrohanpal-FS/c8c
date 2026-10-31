'use client';

import React from 'react';

export const LoadingState: React.FC<{ label?: string }> = ({ label = 'Loading CMS Data...' }) => {
  return (
    <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-white/10" />
        <div className="absolute inset-0 rounded-full border-2 border-[#ffd700] border-t-transparent animate-spin" />
      </div>
      <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">{label}</span>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full space-y-3 p-4 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 bg-white/5 rounded-xl border border-white/5 w-full" />
      ))}
    </div>
  );
};

export default LoadingState;