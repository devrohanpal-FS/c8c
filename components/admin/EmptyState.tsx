'use client';

import React from 'react';
import { FolderOpen, Plus } from 'lucide-react';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon = <FolderOpen className="w-8 h-8 text-[#ffd700]" />,
}) => {
  return (
    <div className="py-16 px-6 text-center flex flex-col items-center justify-center border border-dashed border-white/15 rounded-3xl bg-[#0e0e0e]/50 max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10 shadow-inner">
        {icon}
      </div>
      <h3 className="font-condensed text-2xl font-bold uppercase text-white tracking-wide">{title}</h3>
      <p className="font-sans text-xs text-gray-400 mt-2 max-w-xs leading-relaxed">{description}</p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#ffd700] text-[#0a0a0a] font-sans font-bold text-xs uppercase tracking-widest hover:bg-white transition-all shadow-lg hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;