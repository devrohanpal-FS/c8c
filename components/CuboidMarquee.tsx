'use client';

import React from 'react';
import Link from 'next/link';

interface CuboidMarqueeProps {
  text?: string;
  href?: string;
  bgColor?: string;
  textColor?: string;
}

export default function CuboidMarquee({
  text = 'SEE MORE WORK • CRE8TIVECOVE • LEAN MEAN STORYTELLING MACHINE •',
  href = '/work',
  bgColor = 'bg-[#ffd700]',
  textColor = 'text-[#0a0a0a]',
}: CuboidMarqueeProps) {
  return (
    <div className="w-full overflow-hidden py-4 border-t border-b border-white/10">
      <Link href={href} className="group block relative cursor-pointer" aria-label={text}>
        <div className={`w-full flex justify-center items-center py-4 sm:py-5 ${bgColor} ${textColor} font-condensed font-extrabold uppercase text-xl sm:text-2xl md:text-3xl tracking-wider transition-all duration-300 group-hover:scale-[1.01] group-hover:bg-[#f5f0e6]`}>
          <div className="flex gap-8 animate-marquee whitespace-nowrap">
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
            <span>{text}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
