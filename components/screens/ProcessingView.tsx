'use client';

import React, { useEffect, useState, useRef } from 'react';
import { ProcessingChecklist, StepItem } from '../ProcessingChecklist';
import { Info, Sparkles, RefreshCw, AlertCircle, FileWarning, ArrowRight } from 'lucide-react';
import { PolicyData } from '@/lib/types';
import { SAMPLE_POLICIES } from '@/lib/extract/mock-samples';

interface ProcessingViewProps {
  file: File | null;
  presetPolicy?: PolicyData | null;
  fileName?: string;
  onComplete: (policy: PolicyData) => void;
  onRetry: () => void;
}

export function ProcessingView({
  file,
  presetPolicy,
  fileName = 'Policy_Document.pdf',
  onComplete,
  onRetry,
}: ProcessingViewProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isNonPolicyDoc, setIsNonPolicyDoc] = useState(false);
  const extractionStarted = useRef(false);

  const stepLabels = [
    { id: '1', label: 'Uploading document', sublabel: 'Reading document into secure memory...' },
    { id: '2', label: 'Verifying policy authenticity', sublabel: 'Validating Indian insurer & schedule structure...' },
    { id: '3', label: 'Extracting 10 core clauses', sublabel: 'Room rent, waiting periods & co-pays...' },
    { id: '4', label: 'Grounding citations', sublabel: 'Matching clause numbers & exact page quotes...' },
  ];

  useEffect(() => {
    // If user selected a preset demo policy, simulate swift checklist and complete
    if (presetPolicy) {
      const timer1 = setTimeout(() => setCurrentStepIndex(1), 600);
      const timer2 = setTimeout(() => setCurrentStepIndex(2), 1200);
      const timer3 = setTimeout(() => setCurrentStepIndex(3), 1800);
      const timer4 = setTimeout(() => {
        onComplete(presetPolicy);
      }, 2400);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    }

    // If real file was uploaded, trigger live Gemini extraction API
    if (file && !extractionStarted.current) {
      extractionStarted.current = true;

      // Animate steps 1 and 2 while waiting for AI API
      const stepTimer1 = setTimeout(() => setCurrentStepIndex(1), 1000);
      const stepTimer2 = setTimeout(() => setCurrentStepIndex(2), 3000);

      const performExtraction = async () => {
        try {
          const formData = new FormData();
          formData.append('file', file);

          const res = await fetch('/api/extract', {
            method: 'POST',
            body: formData,
          });

          const data = await res.json().catch(() => null);

          if (!res.ok || !data?.success) {
            setHasError(true);
            if (data?.isPolicy === false) {
              setIsNonPolicyDoc(true);
              setErrorMessage(
                data?.rejectionReason ||
                  'This document does not appear to be an Indian health insurance policy schedule.'
              );
            } else {
              setErrorMessage(
                data?.error ||
                  'Could not extract policy clauses from this file. Please make sure it is a readable PDF or photo.'
              );
            }
            return;
          }

          // Extraction successful
          setCurrentStepIndex(3);
          setTimeout(() => {
            onComplete(data.policy);
          }, 900);
        } catch (err: any) {
          console.error('Extraction error:', err);
          setHasError(true);
          setErrorMessage(
            err?.message || 'Network error occurred while analyzing document. Please try again.'
          );
        }
      };

      performExtraction();

      return () => {
        clearTimeout(stepTimer1);
        clearTimeout(stepTimer2);
      };
    }
  }, [file, presetPolicy, onComplete]);

  const steps: StepItem[] = stepLabels.map((s, idx) => ({
    ...s,
    status:
      hasError && idx === currentStepIndex
        ? 'active'
        : idx < currentStepIndex
        ? 'done'
        : idx === currentStepIndex
        ? 'active'
        : 'pending',
  }));

  const progressPercent = hasError
    ? Math.min(((currentStepIndex + 1) / stepLabels.length) * 100, 75)
    : Math.min(((currentStepIndex + 1) / stepLabels.length) * 100, 100);

  return (
    <div className="space-y-6 text-left max-w-md mx-auto py-6 animate-fadeIn">
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#1A1F2B]">
          {hasError ? 'Document Check Failed' : 'Analysing Your Policy'}
        </h2>
        <p className="text-[13px] text-[#595959] truncate max-w-xs mx-auto">
          {fileName}
        </p>
      </div>

      {/* Segmented Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] font-bold text-[#595959]">
          <span>{hasError ? 'Halted' : 'Progress'}</span>
          <span className={hasError ? 'text-[#C0392B]' : 'text-[#1958E8]'}>
            {Math.round(progressPercent)}%
          </span>
        </div>
        <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ease-out rounded-full ${
              hasError ? 'bg-[#C0392B]' : 'bg-[#1958E8]'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Processing Checklist */}
      <ProcessingChecklist steps={steps} />

      {/* Rejection / Error Alert Card */}
      {hasError ? (
        <div className="p-4 bg-[#FDE8E8] rounded-[20px] border border-[#C0392B]/30 space-y-3 animate-shake">
          <div className="flex items-start gap-2.5 text-[#C0392B]">
            {isNonPolicyDoc ? (
              <FileWarning className="w-5 h-5 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="font-bold text-[14px]">
                {isNonPolicyDoc
                  ? 'Not an Indian Health Insurance Policy'
                  : 'Document Analysis Incomplete'}
              </h4>
              <p className="text-[12px] text-[#1A1F2B] mt-1 leading-relaxed">
                {errorMessage}
              </p>
            </div>
          </div>

          <div className="pt-2 space-y-2 border-t border-[#C0392B]/15">
            <button
              type="button"
              onClick={onRetry}
              className="w-full py-2.5 bg-[#C0392B] hover:bg-[#A93226] active:scale-[0.98] transition-all text-white font-bold text-[13px] rounded-full flex items-center justify-center gap-2 shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Upload policy schedule PDF</span>
            </button>

            <button
              type="button"
              onClick={() => onComplete(SAMPLE_POLICIES[0])}
              className="w-full py-2 bg-white hover:bg-slate-50 text-[#595959] hover:text-[#1A1F2B] font-semibold text-[12px] rounded-full border border-[#E2E8F0] flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Or explore with sample Optima Secure policy</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#595959]" />
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Info Card */}
          <div className="p-4 bg-[#EAF1FF] rounded-[20px] border border-[#1958E8]/15 flex items-start gap-3 text-[13px] text-[#1A1F2B]">
            <Info className="w-5 h-5 text-[#1958E8] flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-[#1958E8]">Processed in secure memory: </span>
              <p className="text-[#595959] leading-relaxed">
                Extracting room rent, pre-existing disease waiting, and verifying clause citations without storing your document.
              </p>
            </div>
          </div>

          {/* Tip for clearer scan */}
          <div className="p-3.5 bg-[#FFF6E9] rounded-xl border border-[#D97706]/20 flex items-center gap-2.5 text-[12px] text-[#D97706] font-medium">
            <Sparkles className="w-4 h-4 flex-shrink-0" />
            <span>High-resolution PDF policy schedules yield 100% clause extraction accuracy.</span>
          </div>
        </>
      )}
    </div>
  );
}
