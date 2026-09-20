'use client';

import React, { useState } from 'react';
import { PolicyData } from '@/lib/types';
import { SAMPLE_POLICIES } from '@/lib/extract/mock-samples';
import { ComparisonCarousel } from '../ComparisonCarousel';
import { IconTile } from '../IconTile';
import {
  Columns,
  Plus,
  Trash2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface ComparePoliciesViewProps {
  currentPolicy: PolicyData;
  onOpenCitation: (clause: string, page: number, quote: string, title: string, policyName: string) => void;
}

export function ComparePoliciesView({ currentPolicy, onOpenCitation }: ComparePoliciesViewProps) {
  const [selectedPolicies, setSelectedPolicies] = useState<PolicyData[]>([
    currentPolicy,
    SAMPLE_POLICIES.find((p) => p.id !== currentPolicy.id) || SAMPLE_POLICIES[1],
  ]);

  const addPolicy = (p: PolicyData) => {
    if (selectedPolicies.length >= 3) return;
    if (!selectedPolicies.some((item) => item.id === p.id)) {
      setSelectedPolicies([...selectedPolicies, p]);
    }
  };

  const removePolicy = (id: string) => {
    if (selectedPolicies.length <= 1) return;
    setSelectedPolicies(selectedPolicies.filter((p) => p.id !== id));
  };

  const availableToAdd = SAMPLE_POLICIES.filter(
    (p) => !selectedPolicies.some((sel) => sel.id === p.id)
  );

  return (
    <div className="space-y-5 text-left max-w-lg mx-auto py-2 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-[20px] p-5 border border-[#E2E8F0] space-y-2">
        <div className="flex items-center gap-3">
          <IconTile icon={Columns} variant="blue" size="md" />
          <div>
            <span className="text-[11px] font-bold text-[#1958E8] uppercase tracking-wider">
              Factual Comparison
            </span>
            <h2 className="text-[19px] font-bold text-[#1A1F2B]">
              Compare My Policies
            </h2>
          </div>
        </div>
        <p className="text-[13px] text-[#595959] leading-relaxed">
          Side-by-side facts from policy documents you supply. Zero AI scores, zero rankings, zero verdicts.
        </p>
      </div>

      {/* Selected Slots Tracker */}
      <div className="bg-white rounded-[20px] p-4.5 border border-[#E2E8F0] space-y-3">
        <div className="flex items-center justify-between text-[12px] font-bold text-[#595959]">
          <span>Compared Policies ({selectedPolicies.length}/3 Slots)</span>
          <span className="text-[#1958E8]">Select up to 3</span>
        </div>

        <div className="space-y-2">
          {selectedPolicies.map((p) => (
            <div
              key={p.id}
              className="p-3 bg-[#FAFBFC] rounded-xl border border-[#E2E8F0] flex items-center justify-between gap-2"
            >
              <div>
                <div className="text-[13px] font-bold text-[#1A1F2B]">{p.policyName}</div>
                <div className="text-[11px] text-[#595959]">{p.insurerName} • {p.sumInsured}</div>
              </div>

              {selectedPolicies.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePolicy(p.id)}
                  className="p-1.5 text-[#C0392B] hover:bg-[#FDE8E8] rounded-lg transition-colors"
                  title="Remove from comparison"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add Another Slot if < 3 */}
        {selectedPolicies.length < 3 && availableToAdd.length > 0 && (
          <div className="pt-2 border-t border-[#E2E8F0] space-y-1.5">
            <span className="text-[11px] font-bold text-[#595959] uppercase tracking-wider">
              Add another policy to compare:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {availableToAdd.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => addPolicy(p)}
                  className="text-[12px] font-bold text-[#1958E8] bg-[#EAF1FF] hover:bg-[#D7E5FF] px-3 py-1.5 rounded-full border border-[#1958E8]/20 flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{p.policyName.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Comparison Carousel Component */}
      <ComparisonCarousel
        policies={selectedPolicies}
        onOpenCitation={onOpenCitation}
      />
    </div>
  );
}
