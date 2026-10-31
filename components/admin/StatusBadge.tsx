'use client';

import React from 'react';

export interface StatusBadgeProps {
  status?: string | null;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = (status || 'UNKNOWN').toString().toUpperCase();

  const getStyle = () => {
    switch (normalized) {
      case 'PUBLISHED':
      case 'ACTIVE':
      case 'READ':
        return 'bg-[#ffd700]/15 text-[#ffd700] border-[#ffd700]/40';
      case 'DRAFT':
      case 'NEW':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/40';
      case 'ARCHIVED':
      case 'DEACTIVATED':
        return 'bg-gray-500/15 text-gray-400 border-gray-500/40';
      case 'SUPER_ADMIN':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/40';
      case 'ADMIN':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/40';
      case 'EDITOR':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40';
      default:
        return 'bg-white/10 text-gray-300 border-white/20';
    }
  };

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center font-mono font-bold uppercase tracking-wider rounded-full border ${sizeClass} ${getStyle()}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 shrink-0 animate-pulse" />
      {normalized}
    </span>
  );
};

export default StatusBadge;