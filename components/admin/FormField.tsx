'use client';

import React from 'react';

export interface FormFieldProps {
  label: string;
  error?: string;
  description?: string;
  required?: boolean;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  description,
  required,
  children,
}) => {
  return (
    <div className="flex flex-col gap-2 text-left w-full">
      <label className="font-mono text-xs font-bold uppercase tracking-widest text-white flex items-center justify-between">
        <span>
          {label} {required && <span className="text-[#ffd700]">*</span>}
        </span>
      </label>

      {children}

      {description && <p className="font-sans text-[11px] text-gray-400 leading-normal">{description}</p>}
      {error && <p className="font-sans text-[11px] text-red-400 font-medium leading-normal">{error}</p>}
    </div>
  );
};

export default FormField;