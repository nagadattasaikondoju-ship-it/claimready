'use client';

import React, { useState } from 'react';
import { ChecklistItem } from '@/lib/types';
import { CheckSquare, Check, FileCheck, Info } from 'lucide-react';

const INITIAL_CHECKLIST: ChecklistItem[] = [
  {
    id: 'bills',
    title: 'Hospitalisation Bills',
    description: 'Itemised break-up of room, doctor, medicines, and consumables.',
    checked: true,
  },
  {
    id: 'summary',
    title: 'Discharge Summary',
    description: 'Clinical history, diagnosis, treatment given, and doctor signatures.',
    checked: true,
  },
  {
    id: 'rx',
    title: 'Prescriptions & Pharmacy Bills',
    description: 'Doctor prescriptions matching all claimed pharmacy bills.',
    checked: false,
  },
  {
    id: 'reports',
    title: 'Investigation & Lab Reports',
    description: 'Diagnostic blood tests, X-rays, MRI, and biopsy reports.',
    checked: false,
  },
  {
    id: 'kyc',
    title: 'Identity & KYC Proof',
    description: "Patient and proposer's Aadhaar or PAN card copy.",
    checked: false,
  },
  {
    id: 'form',
    title: 'Signed Claim Form (Part A & B)',
    description: 'Duly filled claim form with hospital seal and signature.',
    checked: false,
  },
];

export function ChecklistWidget() {
  const [items, setItems] = useState<ChecklistItem[]>(INITIAL_CHECKLIST);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const checkedCount = items.filter((i) => i.checked).length;
  const progressPercent = Math.round((checkedCount / items.length) * 100);

  return (
    <div className="bg-white rounded-[24px] p-6 sm:p-7 border border-[#DDE2EA] shadow-card space-y-5 text-left animate-fadeIn">
      {/* Header & Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DDE2EA]/60 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#1E4FA8] bg-[#E8EEF9] px-2.5 py-0.5 rounded-full border border-[#1E4FA8]/20">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Pre-Discharge Document Checklist</span>
          </div>
          <h3 className="text-[20px] font-bold text-[#1A1F2B]">
            Documents for Claim Settlement
          </h3>
          <p className="text-[13px] text-[#5A6272]">
            Keep these original documents ready before leaving the hospital.
          </p>
        </div>

        <div className="bg-[#F7F9FC] rounded-2xl p-3 border border-[#DDE2EA] text-right self-start sm:self-auto min-w-[130px]">
          <span className="text-[11px] text-[#5A6272] block font-semibold">Collected</span>
          <span className="text-[16px] font-extrabold text-[#1E4FA8] mt-0.5 block">
            {checkedCount} of {items.length} ({progressPercent}%)
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-[#F0F4F8] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#1E4FA8] transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Checklist Rows */}
      <div className="space-y-2.5">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
              item.checked
                ? 'bg-[#E8EEF9]/40 border-[#1E4FA8]/30 shadow-xs'
                : 'bg-[#F7F9FC] border-[#DDE2EA] hover:bg-[#E8EEF9]/20'
            }`}
          >
            {/* Custom Checkbox */}
            <div className="mt-0.5 flex-shrink-0">
              {item.checked ? (
                <div className="w-5 h-5 rounded-md bg-[#1E4FA8] flex items-center justify-center text-white shadow-xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-md border-2 border-[#DDE2EA] bg-white hover:border-[#1E4FA8]" />
              )}
            </div>

            {/* Content */}
            <div className="space-y-0.5 flex-1 min-w-0">
              <div
                className={`text-[14px] font-bold ${
                  item.checked ? 'text-[#1E4FA8]' : 'text-[#1A1F2B]'
                }`}
              >
                {item.title}
              </div>
              <p className="text-[12px] text-[#5A6272] leading-snug">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
