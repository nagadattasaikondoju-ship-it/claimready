'use client';

import React from 'react';
import { PolicyData } from '@/lib/types';
import { StatusPill } from './StatusPill';
import { CitationChip } from './CitationChip';
import { IconTile } from './IconTile';
import { Shield, Bed, Clock, Percent, Activity, AlertCircle } from 'lucide-react';

interface ComparisonCarouselProps {
  policies: PolicyData[];
  onOpenCitation: (clause: string, page: number, quote: string, title: string, policyName: string) => void;
}

export function ComparisonCarousel({ policies, onOpenCitation }: ComparisonCarouselProps) {
  if (!policies || policies.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between px-1">
        <span className="text-[12px] font-bold text-[#595959] uppercase tracking-wider">
          Side-by-Side Facts Comparison ({policies.length} Policies)
        </span>
        <span className="text-[11px] font-semibold text-[#595959]">
          ← Swipe to compare →
        </span>
      </div>

      {/* Horizontal scroll container */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory">
        {policies.map((p, pIdx) => (
          <div
            key={p.id || pIdx}
            className="w-[300px] sm:w-[340px] flex-shrink-0 bg-white rounded-[20px] p-5 border border-[#E2E8F0] space-y-4 snap-start"
          >
            {/* Policy Header */}
            <div className="space-y-1 border-b border-[#E2E8F0] pb-3">
              <div className="text-[11px] font-bold text-[#1958E8] uppercase tracking-wider truncate">
                {p.insurerName}
              </div>
              <h4 className="text-[18px] font-bold text-[#1A1F2B] leading-snug truncate">
                {p.policyName}
              </h4>
              <div className="flex items-center justify-between text-[12px] text-[#595959] pt-1">
                <span>Sum Insured:</span>
                <span className="font-extrabold text-[#1958E8]">{p.sumInsured}</span>
              </div>
            </div>

            {/* Extracted 10 fields */}
            <div className="space-y-3">
              {p.fields.map((f, fIdx) => (
                <div
                  key={f.field || fIdx}
                  className="p-3 bg-[#FAFBFC] rounded-xl border border-[#E2E8F0] space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[12px] font-bold text-[#1A1F2B] truncate">
                      {f.title}
                    </span>
                    <StatusPill status={f.status} />
                  </div>

                  <div className="text-[13px] font-bold text-[#1958E8]">
                    {f.value}
                  </div>

                  <p className="text-[11px] text-[#595959] line-clamp-2">
                    {f.plainMeaning}
                  </p>

                  <div className="pt-1 flex justify-start">
                    <CitationChip
                      clause={f.clause}
                      page={f.page}
                      onClick={() =>
                        onOpenCitation(f.clause, f.page, f.quote, f.title, p.policyName)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Factual Disclaimer */}
            <div className="text-[11px] text-[#595959] bg-[#FAFBFC] p-2.5 rounded-xl border border-[#E2E8F0] text-center">
              ClaimReady provides factual comparisons only and never ranks or recommends policies.
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
