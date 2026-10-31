'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  const pathname = usePathname();
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/public/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => {});
  }, []);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const phone = settings?.phone || '+91 9999-659-129';
  const address = settings?.address || 'Delhi, India';
  const linkedin = settings?.linkedin || 'https://www.linkedin.com/company/cre8tivecove/';
  const instagram = settings?.instagram || 'https://www.instagram.com/cre8tivecove.cc/';
  const youtube = settings?.youtube || 'https://www.youtube.com/@CRE8TIVECOVE';
  const footerText = settings?.footerContent || `© ${new Date().getFullYear()} ${settings?.siteName || 'CRE8TIVECOVE'}. ALL RIGHTS RESERVED.`;

  return (
    <footer className="footer-component relative bg-[#0a0a0a] text-[#f5f0e6] pt-24 pb-12 px-6 md:px-12 font-sans overflow-hidden">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-16 border-b border-white/10">
          {/* GET IN TOUCH */}
          <div className="flex flex-col gap-4">
            <span className="font-condensed text-xl font-bold uppercase tracking-wider text-[#ffd700]">
              GET IN TOUCH
            </span>
            <Link href="/contact" className="text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-1">
              Contact Us <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-1">
              Start a Project <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* MORE INFO */}
          <div className="flex flex-col gap-4">
            <span className="font-condensed text-xl font-bold uppercase tracking-wider text-[#ffd700]">
              MORE INFO
            </span>
            <Link href="/about" className="text-sm text-gray-300 hover:text-white transition-colors">
              About Us
            </Link>
            <Link href="/services" className="text-sm text-gray-300 hover:text-white transition-colors">
              Our Services
            </Link>
            <Link href="/work" className="text-sm text-gray-300 hover:text-white transition-colors">
              Portfolio
            </Link>
          </div>

          {/* FOLLOW */}
          <div className="flex flex-col gap-4">
            <span className="font-condensed text-xl font-bold uppercase tracking-wider text-[#ffd700]">
              FOLLOW
            </span>
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 hover:text-white transition-colors">LinkedIn</a>
            <a href={instagram} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 hover:text-white transition-colors">Instagram</a>
            <a href={youtube} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 hover:text-white transition-colors">YouTube</a>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-500">
          <div>
            Phone: {phone} , {address}
          </div>
          <div>
            {footerText}
          </div>
        </div>
      </div>
    </footer>
  );
}
