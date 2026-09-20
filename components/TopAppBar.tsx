'use client';

import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, Check, Shield, FileText } from 'lucide-react';
import { Language, ActiveScreen } from '@/lib/types';
import { Logo } from './Logo';

interface TopAppBarProps {
  currentScreen: ActiveScreen;
  title?: string;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onBack?: () => void;
  showBack?: boolean;
}

export function TopAppBar({
  currentScreen,
  title,
  language,
  onLanguageChange,
  onBack,
  showBack = false,
}: TopAppBarProps) {
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const languages: Array<{ code: Language; label: string; full: string }> = [
    { code: 'en', label: 'EN', full: 'English' },
    { code: 'te', label: 'తెలుగు', full: 'తెలుగు (Telugu)' },
    { code: 'hi', label: 'हिंदी', full: 'हिंदी (Hindi)' },
  ];

  const currentLangLabel = languages.find((l) => l.code === language)?.label || 'EN';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] px-4 h-14 sm:h-16 flex items-center justify-between safe-top">
      <div className="max-w-2xl w-full mx-auto flex items-center justify-between gap-3">
        {/* Left Side: Back button OR Logo */}
        {showBack ? (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-[#FAFBFC] hover:bg-[#EAF1FF] text-[#1A1F2B] hover:text-[#1958E8] flex items-center justify-center transition-colors border border-[#E2E8F0] min-h-[40px]"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
            </button>
            <h1 className="text-[17px] sm:text-[18px] font-bold text-[#1A1F2B] truncate max-w-[220px] sm:max-w-sm">
              {title}
            </h1>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <Logo size="md" />
            <span className="hidden sm:inline-block text-[12px] text-[#595959] font-medium border-l border-[#E2E8F0] pl-2.5">
              Health Insurance Policy Explainer
            </span>
          </div>
        )}

        {/* Right Side: Language Switcher Pill */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="flex items-center gap-1.5 text-[12px] font-bold text-[#1958E8] bg-[#EAF1FF] hover:bg-[#D7E5FF] px-3 py-1.5 rounded-full border border-[#1958E8]/20 transition-all min-h-[36px]"
          >
            <span>{currentLangLabel}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {/* Language Selector Dropdown */}
          {langMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setLangMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl border border-[#E2E8F0] p-1.5 z-50 animate-fadeIn text-left">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      onLanguageChange(l.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-[13px] flex items-center justify-between transition-colors ${
                      language === l.code
                        ? 'font-bold text-[#1958E8] bg-[#EAF1FF]'
                        : 'text-[#1A1F2B] hover:bg-[#FAFBFC]'
                    }`}
                  >
                    <span>{l.full}</span>
                    {language === l.code && <Check className="w-4 h-4 text-[#1958E8] stroke-[2.5]" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
