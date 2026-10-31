'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export type BgColorToken = 'obsidian' | 'cream' | 'lime' | 'orange' | string;
export type TextColorToken = 'cream' | 'obsidian' | 'muted' | string;

export interface SectionWrapperProps extends Omit<HTMLMotionProps<'section'>, 'children'> {
  id?: string;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  bgColor?: BgColorToken;
  textColor?: TextColorToken;
  fullWidth?: boolean;
  animateIn?: boolean;
  as?: React.ElementType;
}

const BG_COLOR_MAP: Record<string, string> = {
  obsidian: 'bg-[#0a0a0a]',
  cream: 'bg-[#f5f0e6]',
  lime: 'bg-[#ffd700]',
  orange: 'bg-[#e8813a]',
};

const TEXT_COLOR_MAP: Record<string, string> = {
  cream: 'text-[#f5f0e6]',
  obsidian: 'text-[#0a0a0a]',
  muted: 'text-gray-400',
};

export const SectionWrapper: React.FC<SectionWrapperProps> = ({
  id,
  children,
  className,
  containerClassName,
  bgColor = 'obsidian',
  textColor = 'cream',
  fullWidth = false,
  animateIn = true,
  ...props
}) => {
  const bgClass = BG_COLOR_MAP[bgColor] || bgColor;
  const textClass = TEXT_COLOR_MAP[textColor] || textColor;

  return (
    <motion.section
      id={id}
      data-color={bgColor}
      data-text-color={textColor}
      initial={animateIn ? { opacity: 0, y: 20 } : false}
      whileInView={animateIn ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
      className={cn(
        'relative w-full py-20 md:py-32 font-sans transition-colors duration-700 overflow-hidden',
        bgClass,
        textClass,
        className
      )}
      {...props}
    >
      {fullWidth ? (
        children
      ) : (
        <div className={cn('max-w-7xl mx-auto px-6 md:px-12 relative z-10', containerClassName)}>
          {children}
        </div>
      )}
    </motion.section>
  );
};

export default SectionWrapper;