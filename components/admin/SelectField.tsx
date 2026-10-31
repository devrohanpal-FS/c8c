'use client';

import React from 'react';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  options,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-2 text-left w-full">
      {label && (
        <label className="font-mono text-xs font-bold uppercase tracking-widest text-white">
          {label}
        </label>
      )}
      <select
        className={`w-full bg-[#161616] text-white px-4 py-3 rounded-2xl font-sans text-xs outline-none border border-white/15 focus:border-[#ffd700] transition-colors appearance-none cursor-pointer ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#121212] text-white">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="font-sans text-[11px] text-red-400">{error}</p>}
    </div>
  );
};

export default SelectField;