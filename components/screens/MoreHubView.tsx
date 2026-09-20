'use client';

import React from 'react';
import { OptionCard } from '../OptionCard';
import { IconTile } from '../IconTile';
import {
  MessageSquare,
  PhoneCall,
  Calculator,
  Columns,
  Settings,
  Shield,
  MoreHorizontal,
} from 'lucide-react';

interface MoreHubViewProps {
  onNavigateToAsk: () => void;
  onNavigateToEmergencyCard: () => void;
  onNavigateToNeedsCalc: () => void;
  onNavigateToCompare: () => void;
  onNavigateToSettings: () => void;
}

export function MoreHubView({
  onNavigateToAsk,
  onNavigateToEmergencyCard,
  onNavigateToNeedsCalc,
  onNavigateToCompare,
  onNavigateToSettings,
}: MoreHubViewProps) {
  return (
    <div className="space-y-4 text-left max-w-lg mx-auto py-2 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-[20px] p-5 border border-[#E2E8F0] space-y-1">
        <span className="text-[11px] font-bold text-[#1958E8] uppercase tracking-wider">
          Hub & Tools
        </span>
        <h2 className="text-[20px] font-bold text-[#1A1F2B]">
          More Features
        </h2>
        <p className="text-[13px] text-[#595959]">
          Grounded Q&A, emergency contact card, calculators, and settings.
        </p>
      </div>

      {/* 5 Rows */}
      <div className="space-y-2.5">
        {/* Row 1: Ask ClaimReady */}
        <OptionCard
          icon={MessageSquare}
          variant="blue"
          title="Ask ClaimReady"
          description="Grounded answers using your policy clauses"
          badge="Grounded"
          badgeVariant="blue"
          onClick={onNavigateToAsk}
        />

        {/* Row 2: Emergency Info Card */}
        <OptionCard
          icon={PhoneCall}
          variant="green"
          title="Emergency Info Card"
          description="Helpline, TPA contact & emergency card"
          badge="High Priority"
          badgeVariant="green"
          onClick={onNavigateToEmergencyCard}
        />

        {/* Row 3: Coverage Needs Calculator */}
        <OptionCard
          icon={Calculator}
          variant="amber"
          title="Coverage Needs Calculator"
          description="Educational sum insured assessment (no products named)"
          onClick={onNavigateToNeedsCalc}
        />

        {/* Row 4: Compare My Policies */}
        <OptionCard
          icon={Columns}
          variant="blue"
          title="Compare My Policies"
          description="Side-by-side factual comparison with zero ranking"
          onClick={onNavigateToCompare}
        />

        {/* Row 5: Settings */}
        <OptionCard
          icon={Settings}
          variant="blue"
          title="Settings & Privacy"
          description="Language, zero storage verification & about"
          onClick={onNavigateToSettings}
        />
      </div>

      {/* Footer Disclaimer */}
      <div className="pt-3 text-center space-y-1 text-[12px] text-[#595959]">
        <div className="font-semibold text-[#1A1F2B]">
          ClaimReady — A free tool that explains your health insurance policy.
        </div>
        <div className="text-[11px]">
          For informed families. Healthier tomorrows.
        </div>
      </div>
    </div>
  );
}
