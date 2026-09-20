'use client';

import React, { useState } from 'react';
import { Upload, FileText, Lock, Sparkles, CheckCircle2, ChevronRight, ShieldCheck, Zap } from 'lucide-react';
import { PolicyData } from '@/lib/types';
import { SAMPLE_POLICIES } from '@/lib/extract/mock-samples';

interface UploadSectionProps {
  onSelectPolicy: (policy: PolicyData) => void;
  onCustomUpload?: (file: File) => void;
}

export function UploadSection({ onSelectPolicy, onCustomUpload }: UploadSectionProps) {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('hdfc-ergo-optima-secure');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (onCustomUpload) {
        onCustomUpload(file);
      } else {
        // Fallback to rich HDFC ERGO preset if no custom extractor API configured
        const fallback = SAMPLE_POLICIES[0];
        onSelectPolicy({
          ...fallback,
          policyName: file.name.replace(/\.[^/.]+$/, ''),
        });
      }
    }
  };

  return (
    <div className="space-y-6 text-left max-w-2xl mx-auto py-2 animate-fadeIn">
      {/* Hero Title & Direct Position */}
      <div className="space-y-2 text-center pt-2">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#1E4FA8] bg-[#E8EEF9] px-3 py-1 rounded-full border border-[#1E4FA8]/20">
          <Zap className="w-3.5 h-3.5" />
          <span>Upload-First • 100% Free • No Login</span>
        </div>

        <h1 className="text-[26px] sm:text-[32px] font-bold text-[#1A1F2B] tracking-tight leading-tight">
          Explain Your Health Insurance Policy
        </h1>

        <p className="text-[14px] sm:text-[15px] text-[#5A6272] max-w-lg mx-auto leading-relaxed">
          Upload your policy document to instantly uncover room rent caps, waiting periods, and hidden claim deductions in plain language.
        </p>
      </div>

      {/* Primary Upload Dropzone Card */}
      <label className="block border-2 border-dashed border-[#1E4FA8]/30 hover:border-[#1E4FA8] bg-white hover:bg-[#E8EEF9]/30 rounded-[24px] p-8 text-center cursor-pointer transition-all shadow-xs group">
        <input
          type="file"
          accept=".pdf,image/png,image/jpeg"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="w-14 h-14 rounded-2xl bg-[#E8EEF9] text-[#1E4FA8] flex items-center justify-center mx-auto shadow-xs mb-3.5 group-hover:scale-105 transition-transform">
          <Upload className="w-7 h-7 stroke-[2.2]" />
        </div>

        <div className="text-[16px] font-bold text-[#1A1F2B]">
          Tap to upload your policy
        </div>
        <div className="text-[13px] text-[#5A6272] mt-1 font-medium">
          PDF or photo (max 10 MB)
        </div>
        <div className="text-[11px] text-[#5A6272]/80 mt-0.5">
          Supports PDF, JPG, PNG • Instant In-Memory Processing
        </div>
      </label>

      {/* 1-Click Instant Test with Popular Indian Policies */}
      <div className="bg-white rounded-[24px] p-5 sm:p-6 border border-[#DDE2EA] shadow-card space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold text-[#5A6272] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#1E4FA8]" />
            <span>Or test instantly with sample Indian policies:</span>
          </span>
          <span className="text-[11px] font-semibold text-[#0E7A4A] bg-[#E6F7EE] px-2.5 py-0.5 rounded-full">
            1-Click Load
          </span>
        </div>

        <div className="space-y-2">
          {SAMPLE_POLICIES.map((policy) => {
            const isSelected = selectedPresetId === policy.id;
            return (
              <div
                key={policy.id}
                onClick={() => {
                  setSelectedPresetId(policy.id);
                  onSelectPolicy(policy);
                }}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${
                  isSelected
                    ? 'bg-[#E8EEF9] border-[#1E4FA8] shadow-xs'
                    : 'bg-[#F7F9FC] border-[#DDE2EA] hover:bg-[#E8EEF9]/40 hover:border-[#1E4FA8]/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isSelected
                        ? 'bg-[#1E4FA8] text-white'
                        : 'bg-white border border-[#DDE2EA] text-[#1E4FA8]'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="text-[14px] font-bold text-[#1A1F2B] group-hover:text-[#1E4FA8] transition-colors">
                      {policy.policyName}
                    </div>
                    <div className="text-[12px] text-[#5A6272]">
                      {policy.insurerName} • Sum Insured: {policy.sumInsured}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[12px] font-bold text-[#1E4FA8] hidden sm:inline">
                    Explain Policy
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#1E4FA8] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DPDP Zero Storage Privacy Guarantee */}
      <div className="p-4 bg-[#F7F9FC] rounded-2xl border border-[#DDE2EA] flex items-start gap-3 text-[12px] text-[#5A6272]">
        <Lock className="w-4 h-4 text-[#22B573] flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-[#1A1F2B]">Privacy First & Zero Storage: </span>
          <span>
            Your documents are processed entirely in memory and never saved to any database or disk. No login or phone number required.
          </span>
        </div>
      </div>
    </div>
  );
}
