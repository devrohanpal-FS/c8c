'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  isDestructive = true,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#121212] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-left">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="absolute top-6 right-6 text-gray-400 hover:text-white p-1 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
            isDestructive ? 'bg-red-500/15 text-red-400 border border-red-500/30' : 'bg-[#ffd700]/15 text-[#ffd700] border border-[#ffd700]/30'
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="font-condensed text-2xl font-bold uppercase text-white tracking-wide">{title}</h3>
        </div>

        <p className="font-sans text-xs text-gray-300 leading-relaxed mb-8">{message}</p>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-full border border-white/20 text-gray-300 font-sans text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2.5 rounded-full font-sans text-xs font-bold uppercase tracking-wider transition-all ${
              isDestructive
                ? 'bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-900/30'
                : 'bg-[#ffd700] text-[#0a0a0a] hover:bg-white shadow-lg'
            }`}
          >
            {isLoading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;