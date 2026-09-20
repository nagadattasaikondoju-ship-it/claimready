'use client';

import React, { useState } from 'react';
import { Upload, FileText, Lock, Sparkles, ChevronRight, Zap, ShieldCheck } from 'lucide-react';
import { PolicyData } from '@/lib/types';
import { SAMPLE_POLICIES } from '@/lib/extract/mock-samples';
import { IconTile } from '../IconTile';

interface UploadViewProps {
  onSelectPolicy: (policy: PolicyData) => void;
  onUploadFile: (file: File) => void;
  onOpenDigiLocker: () => void;
}

export function UploadView({ onSelectPolicy, onUploadFile, onOpenDigiLocker }: UploadViewProps) {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('hdfc-ergo-optima-secure');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onUploadFile(file);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-lg mx-auto py-2 animate-fadeIn">
      {/* Title & Tagline */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#1958E8] bg-[#EAF1FF] px-3 py-1 rounded-full border border-[#1958E8]/20">
          <Zap className="w-3.5 h-3.5" />
          <span>Upload-First • 100% Free • No Login</span>
        </div>

        <h1 className="text-[26px] sm:text-[30px] font-bold text-[#1A1F2B] tracking-tight leading-tight">
          Explain Your Health Insurance Policy
        </h1>

        <p className="text-[14px] text-[#595959] max-w-md mx-auto leading-relaxed">
          Uncover room rent caps, waiting periods, and deductible traps in plain language.
        </p>
      </div>

      {/* 1. Official DigiLocker Direct Connect Action */}
      <div
        onClick={onOpenDigiLocker}
        className="bg-[#0A3871] hover:bg-[#082e5d] text-white rounded-[20px] p-5 cursor-pointer transition-all shadow-md hover:shadow-lg border border-white/10 flex items-center justify-between group active:scale-[0.99]"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-7 h-7 text-[#22B573]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-bold text-white">Import from DigiLocker</span>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-[#22B573] text-white px-2 py-0.5 rounded-full">
                Instant
              </span>
            </div>
            <p className="text-[12px] text-white/75 mt-0.5">
              Govt. of India verified • No PDF download needed
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-white font-bold text-[12px] sm:text-[13px] bg-white/10 group-hover:bg-white/20 px-3.5 py-2 rounded-full transition-colors flex-shrink-0">
          <span>Connect</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="w-full border-t border-[#E2E8F0]" />
        <span className="bg-[#FAFBFC] px-3 text-[11px] font-bold text-[#595959] uppercase tracking-wider relative">
          Or Upload Manually
        </span>
      </div>

      {/* 2. Primary Upload Dropzone Card */}
      <label className="block border-2 border-dashed border-[#1958E8]/35 hover:border-[#1958E8] bg-white hover:bg-[#EAF1FF]/25 rounded-[20px] p-6 text-center cursor-pointer transition-all group">
        <input
          type="file"
          accept=".pdf,image/png,image/jpeg"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="w-12 h-12 rounded-2xl bg-[#EAF1FF] text-[#1958E8] flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform border border-[#1958E8]/20">
          <Upload className="w-6 h-6 stroke-[2.2]" />
        </div>

        <div className="text-[15px] font-bold text-[#1A1F2B]">
          Upload policy schedule PDF or photo
        </div>
        <div className="text-[12px] text-[#595959] mt-0.5 font-medium">
          PDF, JPG, PNG (up to 20 MB) • In-Memory Processing
        </div>
      </label>

      {/* 1-Click Instant Test with Popular Indian Policies */}
      <div className="bg-white rounded-[20px] p-5 border border-[#E2E8F0] space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold text-[#595959] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#1958E8]" />
            <span>Or test with sample Indian policies:</span>
          </span>
          <span className="text-[11px] font-bold text-[#1FAA5C] bg-[#EAFBF1] px-2.5 py-0.5 rounded-full border border-[#1FAA5C]/20">
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
                    ? 'bg-[#EAF1FF] border-[#1958E8]'
                    : 'bg-[#FAFBFC] border-[#E2E8F0] hover:bg-[#EAF1FF]/40 hover:border-[#1958E8]/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconTile icon={FileText} variant="blue" size="sm" />

                  <div>
                    <div className="text-[14px] font-bold text-[#1A1F2B] group-hover:text-[#1958E8] transition-colors">
                      {policy.policyName}
                    </div>
                    <div className="text-[12px] text-[#595959]">
                      {policy.insurerName} • Sum Insured: {policy.sumInsured}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[12px] font-bold text-[#1958E8] hidden sm:inline">
                    Explain Policy
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#1958E8] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Privacy Guarantee (Exact Mandated Copy) */}
      <div className="p-4 bg-[#EAFBF1]/60 rounded-[20px] border border-[#1FAA5C]/20 flex items-start gap-3 text-[12px] text-[#595959] text-left">
        <Lock className="w-4 h-4 text-[#1FAA5C] flex-shrink-0 mt-0.5 stroke-[2.2]" />
        <div className="space-y-1">
          <span className="font-bold text-[#1A1F2B]">Privacy & Data Handling: </span>
          <p className="leading-relaxed">
            ClaimReady doesn't save your documents. To read your policy, we send it securely to Google's Gemini AI, which doesn't use it to train its models and may keep it for a limited time only to prevent misuse.
          </p>
        </div>
      </div>
    </div>
  );
}
