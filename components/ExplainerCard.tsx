'use client';

import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { CitationChip } from './CitationChip';

interface ExplainerCardProps {
  plainMeaning: string;
  quote?: string;
  clause?: string;
  page?: number;
  onOpenCitation?: () => void;
}

export function ExplainerCard({
  plainMeaning,
  quote,
  clause,
  page,
  onOpenCitation,
}: ExplainerCardProps) {
  const [showExact, setShowExact] = useState(false);

  return (
    <div className="bg-[#EAF1FF] rounded-[20px] p-4 border border-[#1958E8]/15 space-y-2.5 text-left">
      {/* Heading */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#1958E8] uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#1958E8]" />
          <span>In simple language</span>
        </div>

        {clause && page && (
          <CitationChip
            clause={clause}
            page={page}
            onClick={onOpenCitation}
          />
        )}
      </div>

      {/* 1-2 Plain English Sentences */}
      <p className="text-[14px] leading-relaxed text-[#1A1F2B] font-medium">
        {plainMeaning}
      </p>

      {/* Expandable Exact Text */}
      {quote && (
        <div className="pt-1 border-t border-[#1958E8]/10">
          <button
            type="button"
            onClick={() => setShowExact(!showExact)}
            className="flex items-center gap-1 text-[12px] font-bold text-[#1958E8] hover:underline"
          >
            <span>{showExact ? 'Hide exact policy text' : 'Show exact policy text'}</span>
            {showExact ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showExact && (
            <div className="mt-2 p-3 bg-white rounded-xl border border-[#1958E8]/20 text-[13px] font-mono text-[#1A1F2B] italic leading-relaxed animate-fadeIn">
              <div className="text-[10px] font-bold text-[#595959] uppercase mb-1 flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-[#1958E8]" />
                <span>Clause {clause} (Page {page})</span>
              </div>
              "{quote}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
