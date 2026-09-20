'use client';

import React from 'react';
import { ShieldCheck, HeartHandshake, FileCheck, Languages, ArrowRight, Sparkles } from 'lucide-react';
import { IconTile } from '../IconTile';

interface OnboardingViewProps {
  onGetStarted: () => void;
}

export function OnboardingView({ onGetStarted }: OnboardingViewProps) {
  return (
    <div className="space-y-6 text-left max-w-lg mx-auto py-4 animate-fadeIn">
      {/* Warm Header & Illustration */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-[22px] bg-[#EAF1FF] text-[#1958E8] flex items-center justify-center mx-auto border border-[#1958E8]/20">
          <HeartHandshake className="w-8 h-8 stroke-[2.2]" />
        </div>

        <div className="space-y-1.5">
          <h1 className="text-[26px] sm:text-[30px] font-bold text-[#1A1F2B] tracking-tight leading-tight">
            Your health insurance, explained in simple language
          </h1>
          <p className="text-[15px] text-[#595959] leading-relaxed max-w-sm mx-auto">
            Clear policy facts for Indian families before a hospital stay — avoid claim deductions, delays, and surprise bills.
          </p>
        </div>
      </div>

      {/* 3 Feature Rows */}
      <div className="bg-white rounded-[20px] p-5 border border-[#E2E8F0] space-y-4">
        {/* Row 1 */}
        <div className="flex items-start gap-3.5">
          <IconTile icon={ShieldCheck} variant="blue" size="md" />
          <div className="space-y-0.5">
            <h3 className="text-[15px] font-bold text-[#1A1F2B]">
              Know what's covered
            </h3>
            <p className="text-[13px] text-[#595959] leading-snug">
              Room caps, ICU limits, waiting periods, and co-pays in plain everyday words.
            </p>
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex items-start gap-3.5">
          <IconTile icon={FileCheck} variant="amber" size="md" />
          <div className="space-y-0.5">
            <h3 className="text-[15px] font-bold text-[#1A1F2B]">
              Avoid surprises & deductions
            </h3>
            <p className="text-[13px] text-[#595959] leading-snug">
              Live calculator tests your hospital room rate against hidden proportionate deductions.
            </p>
          </div>
        </div>

        {/* Row 3 */}
        <div className="flex items-start gap-3.5">
          <IconTile icon={Languages} variant="green" size="md" />
          <div className="space-y-0.5">
            <h3 className="text-[15px] font-bold text-[#1A1F2B]">
              Free for Indian families
            </h3>
            <p className="text-[13px] text-[#595959] leading-snug">
              Available in English, తెలుగు, and हिंदी. 100% clause cited with exact contract references.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Button & Caption */}
      <div className="space-y-2.5 text-center">
        <button
          type="button"
          onClick={onGetStarted}
          className="w-full py-3.5 px-6 bg-[#1958E8] hover:bg-[#1447C0] text-white text-[16px] font-bold rounded-full transition-all flex items-center justify-center gap-2 min-h-[48px]"
        >
          <span>Get Started</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>

        <p className="text-[12px] text-[#595959]">
          No sign-up needed. Free for all.
        </p>
      </div>
    </div>
  );
}
