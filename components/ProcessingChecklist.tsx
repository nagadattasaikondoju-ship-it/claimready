'use client';

import React from 'react';
import { Check, Loader2 } from 'lucide-react';

export interface StepItem {
  id: string;
  label: string;
  sublabel?: string;
  status: 'done' | 'active' | 'pending';
}

interface ProcessingChecklistProps {
  steps: StepItem[];
}

export function ProcessingChecklist({ steps }: ProcessingChecklistProps) {
  return (
    <div className="space-y-3 text-left">
      {steps.map((step) => {
        return (
          <div
            key={step.id}
            className={`flex items-start gap-3.5 p-3.5 rounded-2xl border transition-all ${
              step.status === 'active'
                ? 'bg-[#EAF1FF] border-[#1958E8]/30'
                : step.status === 'done'
                ? 'bg-[#EAFBF1]/60 border-[#1FAA5C]/20'
                : 'bg-white border-[#E2E8F0] opacity-60'
            }`}
          >
            {/* Leading Icon */}
            <div className="flex-shrink-0 mt-0.5">
              {step.status === 'done' && (
                <div className="w-6 h-6 rounded-full bg-[#1FAA5C] text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
              {step.status === 'active' && (
                <div className="w-6 h-6 rounded-full bg-[#EAF1FF] text-[#1958E8] flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin stroke-[2.5]" />
                </div>
              )}
              {step.status === 'pending' && (
                <div className="w-6 h-6 rounded-full border-2 border-[#E2E8F0] bg-transparent" />
              )}
            </div>

            {/* Label */}
            <div className="space-y-0.5">
              <div
                className={`text-[14px] font-bold ${
                  step.status === 'active'
                    ? 'text-[#1958E8]'
                    : step.status === 'done'
                    ? 'text-[#1A1F2B]'
                    : 'text-[#595959]'
                }`}
              >
                {step.label}
              </div>
              {step.sublabel && (
                <div className="text-[12px] text-[#595959]">
                  {step.sublabel}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
