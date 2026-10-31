'use client';

import React from 'react';
import { Search as SearchIcon, X } from 'lucide-react';

export interface SearchProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const Search: React.FC<SearchProps> = ({
  value,
  onChange,
  placeholder = 'Search items...',
}) => {
  return (
    <div className="relative w-full max-w-xs sm:max-w-sm">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
        <SearchIcon className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#161616] text-white pl-10 pr-9 py-2 rounded-full font-sans text-xs border border-white/15 outline-none placeholder:text-gray-500 focus:border-[#ffd700] transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default Search;