'use client';

import React from 'react';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FiltersProps {
  options: FilterOption[];
  activeValue: string;
  onChange: (value: string) => void;
}

export const Filters: React.FC<FiltersProps> = ({ options, activeValue, onChange }) => {
  return (
    <div className="flex items-center flex-nowrap shrink-0 gap-1 p-1 rounded-full bg-[#161616] border border-white/10 overflow-x-auto">
      {options.map((opt) => {
        const isActive = activeValue === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-3.5 py-1.5 rounded-full font-mono text-[11px] font-bold uppercase tracking-wider whitespace-nowrap shrink-0 transition-all ${
              isActive
                ? 'bg-[#ffd700] text-[#0a0a0a] shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};

export default Filters;