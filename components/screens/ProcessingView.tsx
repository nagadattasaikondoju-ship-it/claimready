'use client';

import React, { useEffect, useState } from 'react';
import { ProcessingChecklist, StepItem } from '../ProcessingChecklist';
import { Info, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { PolicyData } from '@/lib/types';
import { SAMPLE_POLICIES } from '@/lib/extract/mock-samples';

interface ProcessingViewProps {
  fileName?: string;
  onComplete: (policy: PolicyData) => void;
  onRetry: () => void;
}

export function ProcessingView({ fileName = 'Policy_Document.pdf', onComplete, onRetry }: ProcessingViewProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  const stepLabels = [
    { id: '1', label: 'Uploading document', sublabel: 'Reading PDF pages in memory...' },
    { id: '2', label: 'Extracting policy details', sublabel: 'Insurer, sum insured & schedule tables...' },
    { id: '3', label: 'Finding key coverages', sublabel: 'Room rent, waiting periods & co-pays...' },
    { id: '4', label: 'Verifying citations', sublabel: 'Validating clause & page numbers...' },
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStepIndex(1), 700);
    const timer2 = setTimeout(() => setCurrentStepIndex(2), 1400);
    const timer3 = setTimeout(() => setCurrentStepIndex(3), 2100);
    const timer4 = setTimeout(() => {
      // Complete processing and load first sample policy (or customized for the file)
      const sample = SAMPLE_POLICIES[0];
      onComplete({
        ...sample,
        policyName: fileName ? fileName.replace(/\.[^/.]+$/, '') : sample.policyName,
      });
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [fileName, onComplete]);

  const steps: StepItem[] = stepLabels.map((s, idx) => ({
    ...s,
    status: idx < currentStepIndex ? 'done' : idx === currentStepIndex ? 'active' : 'pending',
  }));

  const progressPercent = Math.min(((currentStepIndex + 1) / stepLabels.length) * 100, 100);

  return (
    <div className="space-y-6 text-left max-w-md mx-auto py-6 animate-fadeIn">
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#1A1F2B]">
          Analysing Your Policy
        </h2>
        <p className="text-[13px] text-[#595959]">
          {fileName}
        </p>
      </div>

      {/* Segmented Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] font-bold text-[#595959]">
          <span>Progress</span>
          <span className="text-[#1958E8]">{Math.round(progressPercent)}%</span>
        </div>
        <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1958E8] transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Processing Checklist */}
      <ProcessingChecklist steps={steps} />

      {/* Info Card */}
      <div className="p-4 bg-[#EAF1FF] rounded-[20px] border border-[#1958E8]/15 flex items-start gap-3 text-[13px] text-[#1A1F2B]">
        <Info className="w-5 h-5 text-[#1958E8] flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-[#1958E8]">Please keep this page open: </span>
          <p className="text-[#595959] leading-relaxed">
            We are extracting 10 critical policy clauses and verifying page citations in memory.
          </p>
        </div>
      </div>

      {/* Tip for clearer scan */}
      <div className="p-3.5 bg-[#FFF6E9] rounded-xl border border-[#D97706]/20 flex items-center gap-2.5 text-[12px] text-[#D97706] font-medium">
        <Sparkles className="w-4 h-4 flex-shrink-0" />
        <span>Tip: High-resolution PDF policy schedules yield 100% clause extraction accuracy.</span>
      </div>

      {/* Error / Retry State if needed */}
      {hasError && (
        <div className="p-4 bg-[#FDE8E8] rounded-[20px] border border-[#C0392B]/20 space-y-3">
          <div className="flex items-center gap-2 text-[#C0392B] font-bold text-[14px]">
            <AlertCircle className="w-4 h-4" />
            <span>Processing timed out or file unreadable</span>
          </div>
          <p className="text-[12px] text-[#1A1F2B]">
            Could not read text from this document. Please upload a clear original PDF or high-resolution photo.
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="w-full py-2.5 bg-[#C0392B] text-white font-bold text-[13px] rounded-full flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try another file</span>
          </button>
        </div>
      )}
    </div>
  );
}
