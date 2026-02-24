'use client';

import Link from 'next/link';
import { Zap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[#1a1a1a] bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FFD600] rounded flex items-center justify-center">
              <Zap className="w-5 h-5 text-black font-bold" />
            </div>
            <span className="text-lg font-bold text-white">CeloFlow</span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/features" className="text-[#cccccc] hover:text-[#FFD600] transition-colors text-sm font-medium">
              Features
            </Link>
            <Link href="/pricing" className="text-[#cccccc] hover:text-[#FFD600] transition-colors text-sm font-medium">
              Pricing
            </Link>
            <Link href="/faq" className="text-[#cccccc] hover:text-[#FFD600] transition-colors text-sm font-medium">
              FAQ
            </Link>
            <Link href="/blog" className="text-[#cccccc] hover:text-[#FFD600] transition-colors text-sm font-medium">
              Blog
            </Link>
            <Link href="/whitepaper" className="text-[#cccccc] hover:text-[#FFD600] transition-colors text-sm font-medium">
              Whitepaper
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-[#666666] text-xs">
            © 2024 CeloFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
