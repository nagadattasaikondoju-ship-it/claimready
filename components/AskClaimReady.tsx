'use client';

import React from 'react';
import { usePolicyContext } from '@/lib/store/policy-context';
import { CoverageField } from '@/lib/types';
import { AskClaimReadyView } from './screens/AskClaimReadyView';

interface AskClaimReadyProps {
  onOpenCitation?: (clause: string, page: number, quote: string, title: string, policyName: string) => void;
}

export function AskClaimReady({ onOpenCitation }: AskClaimReadyProps) {
  const { activePolicy } = usePolicyContext();

  if (!activePolicy) {
    return (
      <div className="p-4 bg-white rounded-2xl border border-[#E2E8F0] text-center text-[13px] text-[#595959]">
        Please load a policy document to ask grounded questions.
      </div>
    );
  }

  // Explicit typing for 'f: CoverageField' in all field searches to eliminate implicit any
  const roomField = activePolicy.fields.find((f: CoverageField) => f.field === 'room_rent_cap');
  const icuField = activePolicy.fields.find((f: CoverageField) => f.field === 'icu_cap');
  const pedField = activePolicy.fields.find((f: CoverageField) => f.field === 'ped_waiting_period');
  const prePostField = activePolicy.fields.find((f: CoverageField) => f.field === 'pre_post_hospitalization');

  return (
    <AskClaimReadyView
      policy={activePolicy}
      onOpenCitation={onOpenCitation || (() => {})}
    />
  );
}

export default AskClaimReady;
