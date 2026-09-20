'use client';

import React from 'react';
import { usePolicyContext } from '@/lib/store/policy-context';
import { DischargeView } from './screens/DischargeView';

export function DischargeTimer({ onOpenCitation }: { onOpenCitation?: (clause: string, page: number, quote: string, title: string, policyName: string) => void }) {
  const { activePolicy } = usePolicyContext();

  if (!activePolicy) {
    return (
      <div className="p-4 bg-white rounded-2xl border border-[#E2E8F0] text-center text-[13px] text-[#595959]">
        Please load a policy first to track discharge deadlines.
      </div>
    );
  }

  return (
    <DischargeView
      policy={activePolicy}
      onOpenCitation={onOpenCitation || (() => {})}
    />
  );
}

export default DischargeTimer;
