'use client';

import React from 'react';
import { CitationChip } from './CitationChip';

interface AssumptionCardProps {
  resultText: string;
  basisSentence: string;
  clause: string;
  page: number;
  onOpenCitation?: () => void;
  className?: string;
}

export function AssumptionCard({
  resultText,
  basisSentence,
  clause,
  page,
  onOpenCitation,
  className = '',
}: AssumptionCardProps) {
  // Ensure the sentence starts with "We have..." if not already
  const formattedSentence = basisSentence.startsWith('We have')
    ? basisSentence
    : `We have ${basisSentence.charAt(0).toLowerCase() + basisSentence.slice(1)}`;

  return (
    <div
      className={`bg-[#FFF6E9] rounded-[20px] p-4.5 border border-[#D97706]/20 space-y-2.5 text-left ${className}`}
    >
      {/* (1) Result in large bold text + (2) "Estimate" tag pill beside it */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="text-[20px] font-bold text-[#D97706] tracking-tight">
          {resultText}
        </div>
        <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white text-[#D97706] border border-[#D97706]/30">
          Estimate
        </span>
      </div>

      {/* (3) One sentence starting "We have..." explaining the calculation basis */}
      <p className="text-[13px] text-[#1A1F2B] leading-relaxed font-medium">
        {formattedSentence}
      </p>

      {/* (4) CitationChip for the underlying policy fact */}
      <div className="pt-1 flex justify-start">
        <CitationChip
          clause={clause}
          page={page}
          onClick={onOpenCitation}
        />
      </div>
    </div>
  );
}
