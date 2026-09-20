'use client';

import React from 'react';
import { usePolicyContext } from '@/lib/store/policy-context';
import { CoverageField } from '@/lib/types';
import { AppealView } from './screens/AppealView';

interface AppealLetterViewProps {
  onOpenCitation?: (clause: string, page: number, quote: string, title: string, policyName: string) => void;
}

export function AppealLetterView({ onOpenCitation }: AppealLetterViewProps) {
  const { activePolicy } = usePolicyContext();

  if (!activePolicy) {
    return (
      <div className="p-4 bg-white rounded-2xl border border-[#E2E8F0] text-center text-[13px] text-[#595959]">
        Please load a policy document to generate an appeal letter.
      </div>
    );
  }

  // Explicitly type parameter 'f' as CoverageField to resolve implicit any errors
  const roomField = activePolicy.fields.find((f: CoverageField) => f.field === 'room_rent_cap');
  const pedField = activePolicy.fields.find((f: CoverageField) => f.field === 'ped_waiting_period');

  return (
    <AppealView
      policy={activePolicy}
      onOpenCitation={onOpenCitation || (() => {})}
    />
  );
}

export default AppealLetterView;
