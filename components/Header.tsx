'use client';

import React, { useState } from 'react';
import { Logo } from './Logo';
import { ChevronDown, Check, ShieldCheck, Lock } from 'lucide-react';
import { Language } from '@/lib/types';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onResetPolicy?: () => void;
  hasActivePolicy?: boolean;
}

export function Header({
  language,
  onLanguageChange,
  onResetPolicy,
  hasActivePolicy = false,
}: HeaderProps) {
  const [langOpen, setLangOpen] = useState(false);

  const languages: Array<{ code: Language; label: string; full: string }> = [
    { code: 'en', label: 'EN', full: 'English' },
    { code: 'te', label: 'తెలుగు', full: 'తెలుగు (Telugu)' },
    { code: 'hi', label: 'हिंदी', full: 'हिंदी (Hindi)' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#DDE2EA] px-4 py-3 sm:px-6 shadow-xs">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        {/* Logo & Position Tagline */}
        <div className="flex items-center gap-3">
          <div
            onClick={onResetPolicy}
            className={`flex items-center gap-2 ${hasActivePolicy ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`}
            title="ClaimReady Home"
          >
            <Logo size="md" />
          </div>

          <div className="hidden sm:block h-5 w-[1px] bg-[#DDE2EA]" />

          <span className="hidden sm:inline-block text-[12px] text-[#5A6272] font-medium">
            A free tool that explains your health insurance policy.
          </span>
        </div>

        {/* Right Actions: Zero Storage Badge & Language Switcher */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 text-[11px] font-semibold text-[#0E7A4A] bg-[#E6F7EE] px-2.5 py-1 rounded-full border border-[#22B573]/20">
            <Lock className="w-3 h-3 text-[#22B573]" />
            <span>Zero Document Storage</span>
          </div>

          {/* Language Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 text-[12px] font-bold text-[#1E4FA8] bg-[#E8EEF9] hover:bg-[#DDE8F8] px-3 py-1.5 rounded-full border border-[#1E4FA8]/20 transition-all shadow-xs"
            >
              <span>{languages.find((l) => l.code === language)?.label || 'EN'}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-[#DDE2EA] py-1.5 z-50 animate-fadeIn">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      onLanguageChange(l.code);
                      setLangOpen(false);
                    }}
                    className={`w-full px-3.5 py-2 text-[12px] text-left flex items-center justify-between hover:bg-[#F7F9FC] ${
                      language === l.code ? 'font-bold text-[#1E4FA8] bg-[#E8EEF9]/50' : 'text-[#1A1F2B]'
                    }`}
                  >
                    <span>{l.full}</span>
                    {language === l.code && <Check className="w-3.5 h-3.5 text-[#1E4FA8]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
