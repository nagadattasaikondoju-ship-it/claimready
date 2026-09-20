'use client';

import React from 'react';
import { Language } from '@/lib/types';
import { IconTile } from '../IconTile';
import {
  Globe,
  Lock,
  FileText,
  Info,
  ShieldCheck,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

interface SettingsViewProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onResetData: () => void;
}

export function SettingsView({ language, onLanguageChange, onResetData }: SettingsViewProps) {
  const languages: Array<{ code: Language; label: string; full: string }> = [
    { code: 'en', label: 'EN', full: 'English' },
    { code: 'te', label: 'తెలుగు', full: 'తెలుగు (Telugu)' },
    { code: 'hi', label: 'हिंदी', full: 'हिंदी (Hindi)' },
  ];

  return (
    <div className="space-y-5 text-left max-w-lg mx-auto py-2 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-[20px] p-5 border border-[#E2E8F0] space-y-2">
        <div className="flex items-center gap-3">
          <IconTile icon={Globe} variant="blue" size="md" />
          <div>
            <span className="text-[11px] font-bold text-[#1958E8] uppercase tracking-wider">
              Preferences & Trust
            </span>
            <h2 className="text-[19px] font-bold text-[#1A1F2B]">
              Settings & Privacy
            </h2>
          </div>
        </div>
      </div>

      {/* 1. Language Parity Switcher */}
      <div className="bg-white rounded-[20px] p-5 border border-[#E2E8F0] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-bold text-[#1A1F2B]">
            App Language
          </span>
          <span className="text-[11px] text-[#595959]">Instant Switch</span>
        </div>

        {/* 3 Segmented buttons */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-[#FAFBFC] rounded-2xl border border-[#E2E8F0]">
          {languages.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => onLanguageChange(l.code)}
              className={`py-2.5 px-2 rounded-xl text-[13px] font-bold transition-all ${
                language === l.code
                  ? 'bg-[#1958E8] text-white'
                  : 'text-[#595959] hover:text-[#1A1F2B]'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Your Documents (Honest zero storage) */}
      <div className="bg-white rounded-[20px] p-5 border border-[#E2E8F0] space-y-3">
        <div className="flex items-center gap-2 text-[14px] font-bold text-[#1A1F2B]">
          <FileText className="w-4 h-4 text-[#1958E8]" />
          <span>Your Documents & Storage</span>
        </div>

        <div className="p-3.5 bg-[#FAFBFC] rounded-xl border border-[#E2E8F0] space-y-1.5 text-[13px]">
          <span className="font-bold text-[#1A1F2B]">Zero Saved Files on Server:</span>
          <p className="text-[#595959] leading-relaxed">
            ClaimReady has no user accounts, no login, and no server database. Documents are parsed strictly in memory and discarded when you close or reload the browser.
          </p>
        </div>

        <button
          type="button"
          onClick={onResetData}
          className="w-full py-2.5 px-4 bg-[#FAFBFC] hover:bg-[#FDE8E8] text-[#C0392B] font-bold text-[13px] rounded-xl border border-[#E2E8F0] flex items-center justify-center gap-2 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear Active Session Document</span>
        </button>
      </div>

      {/* 3. Privacy & Google Gemini Handling */}
      <div className="bg-white rounded-[20px] p-5 border border-[#E2E8F0] space-y-3">
        <div className="flex items-center gap-2 text-[14px] font-bold text-[#1A1F2B]">
          <Lock className="w-4 h-4 text-[#1FAA5C]" />
          <span>Privacy & Data Handling</span>
        </div>

        <p className="text-[13px] text-[#595959] leading-relaxed bg-[#FAFBFC] p-3.5 rounded-xl border border-[#E2E8F0]">
          "ClaimReady doesn't save your documents. To read your policy, we send it securely to Google's Gemini AI, which doesn't use it to train its models and may keep it for a limited time only to prevent misuse."
        </p>
      </div>

      {/* 4. About & Version */}
      <div className="bg-white rounded-[20px] p-5 border border-[#E2E8F0] space-y-2 text-[13px]">
        <div className="flex items-center justify-between">
          <span className="font-bold text-[#1A1F2B]">ClaimReady Web PWA</span>
          <span className="text-[11px] font-mono text-[#595959] bg-[#FAFBFC] px-2 py-0.5 rounded border border-[#E2E8F0]">v1.0 (RICE-Locked)</span>
        </div>
        <p className="text-[#595959]">
          An independent public interest tool for informed Indian families.
        </p>
      </div>

      {/* Footer & Mandatory Disclaimer */}
      <div className="pt-2 text-center space-y-1 text-[12px] text-[#595959]">
        <div className="font-semibold text-[#1A1F2B]">
          For informed families. Healthier tomorrows.
        </div>
        <div className="text-[11px]">
          ClaimReady gives educational information, not legal or medical advice.
        </div>
      </div>
    </div>
  );
}
