'use client';

import React, { useState } from 'react';
import { usePolicyContext } from '@/lib/store/policy-context';
import { PolicyData, CoverageField } from '@/lib/types';
import { CitationChip } from './CitationChip';
import { AppHeader } from './AppHeader';
import { StatusPill } from './StatusPill';

interface ComparisonMatrixProps {
  onBack?: () => void;
  onOpenCitation?: (clause: string, page: number, quote: string, title: string, policyName: string) => void;
}

export function ComparisonMatrix({ onBack, onOpenCitation }: ComparisonMatrixProps) {
  const { policies, activePolicy } = usePolicyContext();
  const [selectedPolicies, setSelectedPolicies] = useState<PolicyData[]>(
    policies && policies.length > 0 ? policies.slice(0, 3) : []
  );

  const togglePolicy = (p: PolicyData) => {
    if (selectedPolicies.some((item: PolicyData) => item.id === p.id)) {
      if (selectedPolicies.length > 1) {
        setSelectedPolicies(selectedPolicies.filter((item: PolicyData) => item.id !== p.id));
      }
    } else {
      if (selectedPolicies.length < 3) {
        setSelectedPolicies([...selectedPolicies, p]);
      }
    }
  };

  const fieldKeys = [
    'room_rent_cap',
    'icu_cap',
    'copay_percentage',
    'ped_waiting_period',
    'initial_waiting_period',
    'sub_limits',
  ];

  return (
    <div className="space-y-4 text-left max-w-2xl mx-auto py-2">
      <AppHeader title="Policy Comparison Matrix" showBack={!!onBack} onBack={onBack} />

      <div className="p-4 bg-white rounded-[20px] border border-[#E2E8F0] space-y-3">
        <div className="flex items-center justify-between text-[12px] font-bold text-[#595959]">
          <span>Select Policies to Compare ({selectedPolicies.length}/3)</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {policies.map((pol: PolicyData) => {
            const isSelected = selectedPolicies.some((s: PolicyData) => s.id === pol.id);
            return (
              <button
                key={pol.id}
                type="button"
                onClick={() => togglePolicy(pol)}
                className={`text-[12px] font-bold px-3 py-1.5 rounded-full border transition-all ${
                  isSelected
                    ? 'bg-[#1958E8] text-white border-[#1958E8]'
                    : 'bg-[#FAFBFC] text-[#595959] border-[#E2E8F0] hover:bg-[#EAF1FF]'
                }`}
              >
                {pol.policyName.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-none">
        <table className="w-full bg-white rounded-[20px] border border-[#E2E8F0] overflow-hidden text-left text-[13px]">
          <thead className="bg-[#FAFBFC] border-b border-[#E2E8F0]">
            <tr>
              <th className="p-3.5 font-bold text-[#595959]">Coverage Feature</th>
              {selectedPolicies.map((pol: PolicyData) => (
                <th key={pol.id} className="p-3.5 font-bold text-[#1958E8] min-w-[160px]">
                  {pol.policyName}
                  <div className="text-[11px] text-[#595959] font-normal">{pol.sumInsured}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {fieldKeys.map((key) => {
              const label = key.replace(/_/g, ' ').toUpperCase();
              return (
                <tr key={key} className="hover:bg-[#FAFBFC]">
                  <td className="p-3.5 font-semibold text-[#1A1F2B]">{label}</td>
                  {selectedPolicies.map((pol: PolicyData) => {
                    const fieldItem = pol.fields.find((item: CoverageField) => item.field === key);
                    return (
                      <td key={pol.id} className="p-3.5 space-y-1">
                        {fieldItem ? (
                          <>
                            <div className="font-bold text-[#1A1F2B] text-[12px]">
                              {fieldItem.value}
                            </div>
                            <StatusPill status={fieldItem.status} />
                            <div className="pt-1">
                              <CitationChip
                                clause={fieldItem.clause}
                                page={fieldItem.page}
                                onClick={() =>
                                  onOpenCitation &&
                                  onOpenCitation(
                                    fieldItem.clause,
                                    fieldItem.page,
                                    fieldItem.quote,
                                    fieldItem.title,
                                    pol.policyName
                                  )
                                }
                              />
                            </div>
                          </>
                        ) : (
                          <span className="text-[#595959] text-[11px]">N/A</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ComparisonMatrix;
