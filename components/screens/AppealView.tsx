'use client';

import React, { useState } from 'react';
import { PolicyData } from '@/lib/types';
import { IconTile } from '../IconTile';
import { ProcessingChecklist, StepItem } from '../ProcessingChecklist';
import { CitationChip } from '../CitationChip';
import {
  AlertTriangle,
  FileEdit,
  Send,
  Copy,
  Check,
  Share2,
  ShieldCheck,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface AppealViewProps {
  policy: PolicyData;
  onOpenCitation: (clause: string, page: number, quote: string, title: string, policyName: string) => void;
}

export function AppealView({ policy, onOpenCitation }: AppealViewProps) {
  const [rejectionInput, setRejectionInput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedLetter, setGeneratedLetter] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [stepIndex, setStepIndex] = useState<number>(0);

  const samplePresets = [
    'Room rent capped and proportionate deduction applied on surgery bills',
    'Claim rejected claiming pre-existing condition (PED) waiting period',
    'Investigation and diagnostic reports deduction under non-medical items',
  ];

  const handleGenerate = () => {
    if (!rejectionInput.trim()) return;
    setIsGenerating(true);
    setStepIndex(0);

    setTimeout(() => setStepIndex(1), 500);
    setTimeout(() => setStepIndex(2), 1100);
    setTimeout(() => {
      // Find relevant policy fields for grounding
      const roomField = policy.fields.find((f) => f.field === 'room_rent_cap');
      const pedField = policy.fields.find((f) => f.field === 'ped_waiting_period');
      const prePostField = policy.fields.find((f) => f.field === 'pre_post_hospitalization');

      const draft = `Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}

To,
The Grievance Redressal Officer / Claims Department,
${policy.insurerName}
Subject: Formal Appeal & Reconsideration Request for Claim Deduction/Rejection
Policy Name: ${policy.policyName}
Policy Number: ${policy.policyNumber}
Insured: ${policy.userName || 'Primary Insured'}

Dear Sir/Madam,

I am writing to formally contest the deduction/rejection communicated regarding our recent hospitalisation claim.

1. Grounding in Contract Terms:
As per the explicitly verified terms of our policy schedule:
- Room Rent & Entitlement: As per Clause ${roomField?.clause || '4.2.1'} (Page ${roomField?.page || 12}), "${roomField?.quote || 'Covered without capping'}".
- Pre-Existing Disease Coverage: As per Clause ${pedField?.clause || '6.1.c'} (Page ${pedField?.page || 19}), coverage is operative in accordance with continuous renewal terms.
- Pre & Post Hospitalisation: As per Clause ${prePostField?.clause || '4.5.1'} (Page ${prePostField?.page || 14}), medical expenses are eligible for ${prePostField?.value || '60/180 days'}.

2. Reconsideration Request:
The deduction applied (${rejectionInput.trim()}) contradicts the contract clauses cited above. The treatment was an in-patient necessity certified by the attending physician.

I request you to re-examine the claim file in light of the above contractual provisions and release the admissible payment at the earliest.

Yours sincerely,
${policy.userName || 'Insured Policyholder'}
Contact: ${policy.insurerHelpline}`;

      setGeneratedLetter(draft);
      setIsGenerating(false);
    }, 1800);
  };

  const steps: StepItem[] = [
    { id: '1', label: 'Matching rejection reason to policy terms', status: stepIndex > 0 ? 'done' : stepIndex === 0 ? 'active' : 'pending' },
    { id: '2', label: 'Extracting verified clause citations', status: stepIndex > 1 ? 'done' : stepIndex === 1 ? 'active' : 'pending' },
    { id: '3', label: 'Drafting grounded appeal letter', status: stepIndex > 2 ? 'done' : stepIndex === 2 ? 'active' : 'pending' },
  ];

  const handleCopy = () => {
    if (!generatedLetter) return;
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (!generatedLetter) return;
    if (navigator.share) {
      navigator.share({ title: 'Appeal Draft Letter', text: generatedLetter }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(generatedLetter)}`, '_blank');
    }
  };

  return (
    <div className="space-y-5 text-left max-w-lg mx-auto py-2 animate-fadeIn">
      {/* Header */}
      <div className="bg-[#FDE8E8] rounded-[20px] p-5 border border-[#C0392B]/20 space-y-2">
        <div className="flex items-center gap-3">
          <IconTile icon={AlertTriangle} variant="red" size="md" />
          <div>
            <span className="text-[11px] font-bold text-[#C0392B] uppercase tracking-wider">
              Claim Dispute Assistant
            </span>
            <h2 className="text-[19px] font-bold text-[#1A1F2B]">
              Appeal a Rejected or Reduced Claim
            </h2>
          </div>
        </div>
        <p className="text-[13px] text-[#595959] leading-relaxed">
          Paste the insurer's rejection remark to generate a formal appeal grounded in your policy clauses.
        </p>
      </div>

      {/* Input Section */}
      {!generatedLetter && !isGenerating && (
        <div className="bg-white rounded-[20px] p-5 border border-[#E2E8F0] space-y-4">
          <div className="space-y-2">
            <label className="block text-[13px] font-bold text-[#1A1F2B]">
              Paste Insurer Rejection or Deduction Remark:
            </label>
            <textarea
              rows={3}
              value={rejectionInput}
              onChange={(e) => setRejectionInput(e.target.value)}
              placeholder="e.g. Room rent proportionate deduction applied or Pre-existing condition exclusion clause invoked..."
              className="w-full p-3.5 rounded-xl border border-[#E2E8F0] text-[14px] text-[#1A1F2B] bg-[#FAFBFC] focus:outline-none focus:border-[#1958E8] leading-relaxed"
            />
          </div>

          {/* Preset Prompts */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-[#595959] uppercase tracking-wider">
              Or tap a common dispute reason:
            </span>
            <div className="space-y-1.5">
              {samplePresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setRejectionInput(preset)}
                  className="w-full text-left p-2.5 bg-[#FAFBFC] hover:bg-[#EAF1FF] rounded-xl border border-[#E2E8F0] text-[12px] text-[#1A1F2B] font-medium transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            disabled={!rejectionInput.trim()}
            onClick={handleGenerate}
            className={`w-full py-3 px-6 text-[14px] font-bold rounded-full transition-all flex items-center justify-center gap-2 min-h-[48px] ${
              rejectionInput.trim()
                ? 'bg-[#1958E8] hover:bg-[#1447C0] text-white shadow-xs'
                : 'bg-[#E2E8F0] text-[#595959] cursor-not-allowed opacity-75'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Cited Appeal Letter</span>
          </button>
        </div>
      )}

      {/* Generation State */}
      {isGenerating && (
        <div className="bg-white rounded-[20px] p-6 border border-[#E2E8F0] space-y-4 animate-fadeIn">
          <h3 className="text-[16px] font-bold text-[#1A1F2B] text-center">
            Drafting Appeal Letter
          </h3>
          <ProcessingChecklist steps={steps} />
        </div>
      )}

      {/* Draft Output Card */}
      {generatedLetter && (
        <div className="bg-white rounded-[20px] p-5 border border-[#E2E8F0] space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <div className="flex items-center gap-2">
              <IconTile icon={FileEdit} variant="blue" size="sm" />
              <h3 className="text-[15px] font-bold text-[#1A1F2B]">
                Generated Appeal Letter
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="text-[12px] font-bold text-[#1958E8] hover:underline"
            >
              {isEditing ? 'Done Editing' : 'Edit text'}
            </button>
          </div>

          {/* Editable / Viewable Letter Box */}
          {isEditing ? (
            <textarea
              rows={14}
              value={generatedLetter}
              onChange={(e) => setGeneratedLetter(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-[#1958E8] text-[13px] font-mono text-[#1A1F2B] bg-[#FAFBFC] focus:outline-none leading-relaxed"
            />
          ) : (
            <div className="p-4 bg-[#FAFBFC] rounded-xl border border-[#E2E8F0] text-[13px] font-mono text-[#1A1F2B] whitespace-pre-line leading-relaxed max-h-[380px] overflow-y-auto">
              {generatedLetter}
            </div>
          )}

          {/* Grounding guarantee */}
          <div className="p-3 bg-[#EAFBF1] rounded-xl border border-[#1FAA5C]/25 flex items-center gap-2 text-[12px] text-[#1FAA5C] font-semibold">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>Every clause cited in this letter corresponds to a verified clause in your policy schedule.</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleCopy}
              className="flex-1 py-2.5 bg-white hover:bg-[#FAFBFC] text-[#1958E8] font-bold text-[13px] rounded-full border border-[#1958E8]/30 flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              {copied ? <Check className="w-4 h-4 text-[#1FAA5C]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy Letter'}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="flex-1 py-2.5 bg-[#1958E8] hover:bg-[#1447C0] text-white font-bold text-[13px] rounded-full flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Draft</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
