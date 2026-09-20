'use client';

import React from 'react';
import { usePolicyContext } from '@/lib/store/policy-context';
import { Language, MainTab } from '@/lib/types';
import { Logo } from './Logo';
import { ChevronDown, Check } from 'lucide-react';

interface NavbarProps {
  currentTab?: MainTab;
  onTabChange?: (tab: MainTab) => void;
}

export function Navbar({ currentTab = 'home', onTabChange }: NavbarProps) {
  const { language, setLanguage, activePolicy } = usePolicyContext();
  const [langMenuOpen, setLangMenuOpen] = React.useState(false);

  const languages: Array<{ code: Language; label: string; full: string }> = [
    { code: 'en', label: 'EN', full: 'English' },
    { code: 'te', label: 'తెలుగు', full: 'తెలుగు (Telugu)' },
    { code: 'hi', label: 'हिंदी', full: 'हिंदी (Hindi)' },
  ];

  const currentLabel = languages.find((l) => l.code === language)?.label || 'EN';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] px-4 h-14 sm:h-16 flex items-center justify-between safe-top">
      <div className="max-w-2xl w-full mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Logo size="md" />
          <span className="hidden sm:inline-block text-[12px] text-[#595959] font-medium border-l border-[#E2E8F0] pl-2.5">
            Health Insurance Policy Explainer
          </span>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="flex items-center gap-1.5 text-[12px] font-bold text-[#1958E8] bg-[#EAF1FF] hover:bg-[#D7E5FF] px-3 py-1.5 rounded-full border border-[#1958E8]/20 transition-all min-h-[36px]"
          >
            <span>{currentLabel}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {langMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setLangMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl border border-[#E2E8F0] p-1.5 z-50 animate-fadeIn text-left">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      setLanguage(l.code);
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

export default Navbar;
