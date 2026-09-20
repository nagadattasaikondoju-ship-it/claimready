'use client';

import React from 'react';
import { PolicyData } from '@/lib/types';
import { OptionCard } from '../OptionCard';
import { IconTile } from '../IconTile';
import {
  CheckCircle2,
  Shield,
  Hospital,
  AlertTriangle,
  MessageSquare,
  PhoneCall,
  ArrowRight,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface HomeViewProps {
  policy: PolicyData;
  onNavigateToCoverage: () => void;
  onNavigateToAdmission: () => void;
  onNavigateToAppeal: () => void;
  onNavigateToAsk: () => void;
  onNavigateToEmergencyCard: () => void;
  onResetPolicy: () => void;
}

export function HomeView({
  policy,
  onNavigateToCoverage,
  onNavigateToAdmission,
  onNavigateToAppeal,
  onNavigateToAsk,
  onNavigateToEmergencyCard,
  onResetPolicy,
}: HomeViewProps) {
  const greetingName = policy.userName ? `Hi, ${policy.userName} 👋` : 'Hi there 👋';

  return (
    <div className="space-y-5 text-left max-w-lg mx-auto py-2 animate-fadeIn">
      {/* 1. Warm Greeting & Switch Policy */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[22px] sm:text-[24px] font-bold text-[#1A1F2B]">
            {greetingName}
          </h2>
          <p className="text-[13px] text-[#595959]">
            Here is your health insurance overview.
          </p>
        </div>

        <button
          type="button"
          onClick={onResetPolicy}
          className="text-[12px] font-bold text-[#1958E8] hover:underline flex items-center gap-1 bg-[#EAF1FF] px-3 py-1.5 rounded-full border border-[#1958E8]/20"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Change policy</span>
        </button>
      </div>

      {/* 2. Success Banner */}
      <div className="p-3.5 bg-[#EAFBF1] rounded-[20px] border border-[#1FAA5C]/25 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-[#1FAA5C] flex-shrink-0 stroke-[2.5]" />
          <div>
            <div className="text-[13px] font-bold text-[#1FAA5C]">
              Policy analysed successfully
            </div>
            <div className="text-[11px] text-[#595959]">
              10 key coverages extracted • 100% clause cited
            </div>
          </div>
        </div>

        <span className="text-[11px] font-bold text-[#1FAA5C] bg-white px-2 py-0.5 rounded-full border border-[#1FAA5C]/30 whitespace-nowrap">
          10/10 Found
        </span>
      </div>

      {/* 3. Policy Summary Card */}
      <div className="bg-white rounded-[20px] p-5 border border-[#E2E8F0] space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[#E2E8F0] pb-3.5">
          <div className="space-y-0.5">
            <div className="text-[11px] font-bold text-[#1958E8] uppercase tracking-wider">
              {policy.insurerName}
            </div>
            <h3 className="text-[18px] sm:text-[20px] font-bold text-[#1A1F2B] leading-tight">
              {policy.policyName}
            </h3>
            <div className="text-[12px] text-[#595959] font-mono">
              Policy No: <span className="font-semibold text-[#1A1F2B]">{policy.policyNumber}</span>
            </div>
          </div>

          <div className="bg-[#EAF1FF] rounded-2xl p-3 border border-[#1958E8]/20 text-right min-w-[130px]">
            <span className="text-[10px] font-bold text-[#595959] uppercase block">Sum Insured</span>
            <div className="text-[17px] font-extrabold text-[#1958E8] mt-0.5">
              {policy.sumInsured}
            </div>
          </div>
        </div>

        {/* Metadata Details */}
        <div className="grid grid-cols-2 gap-2.5 text-[12px]">
          <div className="p-3 bg-[#FAFBFC] rounded-xl border border-[#E2E8F0]">
            <span className="text-[#595959] block text-[11px]">Policy Period</span>
            <span className="font-bold text-[#1A1F2B] block mt-0.5">{policy.policyPeriod}</span>
          </div>

          <div className="p-3 bg-[#FAFBFC] rounded-xl border border-[#E2E8F0]">
            <span className="text-[#595959] block text-[11px]">Covered Members</span>
            <span className="font-bold text-[#1A1F2B] block mt-0.5 truncate">{policy.familyMembers}</span>
          </div>
        </div>

        {/* View Full Coverage CTA */}
        <button
          type="button"
          onClick={onNavigateToCoverage}
          className="w-full py-3 bg-[#1958E8] hover:bg-[#1447C0] text-white text-[14px] font-bold rounded-full transition-colors flex items-center justify-center gap-1.5 min-h-[48px]"
        >
          <span>View Full Coverage Breakdown</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* 4. Ask ClaimReady Teaser Card */}
      <div
        onClick={onNavigateToAsk}
        role="button"
        tabIndex={0}
        className="bg-[#EAF1FF] rounded-[20px] p-4.5 border border-[#1958E8]/20 hover:border-[#1958E8] cursor-pointer transition-all flex items-center justify-between gap-3 group"
      >
        <div className="flex items-center gap-3">
          <IconTile icon={MessageSquare} variant="blue" size="md" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[15px] font-bold text-[#1958E8]">
                Ask ClaimReady
              </span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.2 rounded-full bg-white text-[#1958E8] border border-[#1958E8]/20">
                Grounded
              </span>
            </div>
            <p className="text-[13px] text-[#595959]">
              Ask questions answered strictly using your own policy clauses.
            </p>
          </div>
        </div>

        <ArrowRight className="w-5 h-5 text-[#1958E8] group-hover:translate-x-1 transition-transform flex-shrink-0 stroke-[2.2]" />
      </div>

      {/* 5. Action OptionCards: Admission, Appeal, Emergency Card */}
      <div className="space-y-3">
        <span className="text-[12px] font-bold text-[#595959] uppercase tracking-wider block px-1">
          Hospital & Claims Support
        </span>

        {/* OptionCard 1: At Hospital Now */}
        <OptionCard
          icon={Hospital}
          variant="amber"
          title="At the hospital now"
          description="Check room rent limits & pre-discharge checklist"
          badge="Admission"
          badgeVariant="amber"
          onClick={onNavigateToAdmission}
        />

        {/* OptionCard 2: Claim Rejected or Reduced */}
        <OptionCard
          icon={AlertTriangle}
          variant="red"
          title="Claim was rejected or reduced"
          description="Generate a cited appeal letter using verified clauses"
          badge="Appeal"
          badgeVariant="red"
          onClick={onNavigateToAppeal}
        />

        {/* OptionCard 3: Emergency Info Card */}
        <OptionCard
          icon={PhoneCall}
          variant="green"
          title="Emergency Info Card"
          description="Instant helpline, TPA contact & policy card"
          badge="High Priority"
          badgeVariant="green"
          onClick={onNavigateToEmergencyCard}
        />
      </div>
    </div>
  );
}
