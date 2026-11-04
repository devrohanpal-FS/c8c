'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PrimaryButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  variant?: 'dark' | 'light' | 'lime' | 'orange';
  target?: string;
  rel?: string;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  href,
  onClick,
  children,
  className,
  variant = 'dark',
  target,
  rel,
}) => {
  const variantStyles = {
    dark: 'bg-[#0a0a0a] text-[#FFFEF2] hover:bg-[#1a1a1a]',
    light: 'bg-[#FFFEF2] text-[#0a0a0a] hover:bg-[#ffffff]',
    lime: 'bg-[#C0FF4A] text-[#0a0a0a] hover:bg-[#b0f038]',
    orange: 'bg-[#FF8400] text-[#ffffff] hover:bg-[#e07400]',
  };

  const content = (
    <div
      className={cn(
        'group relative inline-flex items-center justify-between gap-6 px-8 py-4 sm:px-10 sm:py-5 rounded-full text-sm sm:text-base font-bold tracking-wider uppercase shadow-xl overflow-hidden transition-all duration-300 hover:scale-105 select-none cursor-pointer',
        variantStyles[variant],
        className
      )}
    >
      <span className="relative z-10">{children}</span>

      {/* Elastic Dual-Arrow Icon Box */}
      <div className="relative w-6 h-6 overflow-hidden flex items-center justify-center">
        {/* Icon 1: Visible default, shifts right and rotates on hover */}
        <svg
          className="absolute inset-0 w-6 h-6 transition-all duration-700 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] group-hover:translate-x-10 group-hover:-translate-y-10 group-hover:rotate-[135deg] group-hover:opacity-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>

        {/* Icon 2: Hidden offscreen left (-translate-x-10, -rotate 135deg), slides in to center on hover */}
        <svg
          className="absolute inset-0 w-6 h-6 -translate-x-10 translate-y-10 -rotate-[135deg] opacity-0 transition-all duration-700 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] group-hover:translate-x-0 group-hover:translate-y-0 group-hover:rotate-0 group-hover:opacity-100"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} target={target} rel={rel}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} type="button">
      {content}
    </button>
  );
};

export default PrimaryButton;
