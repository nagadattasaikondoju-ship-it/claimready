'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Logo } from './Logo';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  subtitle?: string;
}

export function AppHeader({ title = 'ClaimReady', showBack = false, onBack, subtitle }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] px-4 h-14 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {showBack && onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-[#FAFBFC] hover:bg-[#EAF1FF] text-[#1A1F2B] flex items-center justify-center border border-[#E2E8F0] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.2]" />
          </button>
        ) : (
          <Logo size="sm" />
        )}

        <div>
          <h1 className="text-[16px] font-bold text-[#1A1F2B] leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[11px] text-[#595959]">{subtitle}</p>
          )}
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
