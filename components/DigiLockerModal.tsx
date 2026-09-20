'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, Smartphone, CheckCircle2, ArrowRight, Loader2, FileText, Lock, Sparkles, Building2 } from 'lucide-react';
import { PolicyData } from '@/lib/types';

interface DigiLockerDoc {
  docId: string;
  name: string;
  insurer: string;
  policyNumber: string;
  sumInsured: string;
  validTill: string;
  issuerBadge: string;
  verifiedAt: string;
}

interface DigiLockerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPolicyImported: (docName: string, policy: PolicyData) => void;
}

export function DigiLockerModal({ isOpen, onClose, onPolicyImported }: DigiLockerModalProps) {
  const [step, setStep] = useState<'input' | 'otp' | 'documents'>('input');
  const [identifier, setIdentifier] = useState('9876543210');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [documents, setDocuments] = useState<DigiLockerDoc[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/digilocker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send-otp', identifier }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to send OTP. Please check your number.');
        return;
      }
      setStep('otp');
      setOtp('123456'); // Pre-fill sample test OTP for frictionless experience
    } catch (err: any) {
      setError(err?.message || 'Network error connecting to DigiLocker gateway.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/digilocker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify-otp', otp }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid OTP. Please enter 6 digits.');
        return;
      }
      setDocuments(data.documents || []);
      setStep('documents');
    } catch (err: any) {
      setError(err?.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDocument = async (doc: DigiLockerDoc) => {
    setSelectedDocId(doc.docId);
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/digilocker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'fetch-doc', docId: doc.docId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success || !data.policy) {
        setError(data.error || 'Failed to fetch document from DigiLocker.');
        setSelectedDocId(null);
        return;
      }

      onClose();
      onPolicyImported(data.docName, data.policy);
    } catch (err: any) {
      setError(err?.message || 'Failed to import policy.');
      setSelectedDocId(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-[24px] shadow-2xl overflow-hidden border border-[#E2E8F0] flex flex-col max-h-[90vh]">
        {/* DigiLocker Header */}
        <div className="bg-[#0A3871] text-white p-5 flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-6 h-6 text-[#22B573]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[17px] tracking-tight">DigiLocker</span>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-[#22B573] text-white px-2 py-0.5 rounded-full">
                  Official
                </span>
              </div>
              <p className="text-[11px] text-white/70">
                National e-Governance Division • Govt. of India
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-[12px] font-medium rounded-xl border border-red-200">
              {error}
            </div>
          )}

          {/* STEP 1: MOBILE / AADHAAR INPUT */}
          {step === 'input' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="text-center space-y-1">
                <h3 className="text-[17px] font-bold text-[#1A1F2B]">
                  Link Your DigiLocker Account
                </h3>
                <p className="text-[13px] text-[#595959]">
                  We will securely discover your active health insurance policies issued by Indian insurers.
                </p>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[12px] font-bold text-[#1A1F2B] flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-[#1958E8]" />
                  <span>Mobile Number or 12-digit Aadhaar</span>
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-4 py-3 bg-[#FAFBFC] border border-[#E2E8F0] rounded-xl text-[14px] font-medium text-[#1A1F2B] focus:outline-none focus:border-[#1958E8] transition-colors"
                  required
                />
                <span className="text-[11px] text-[#595959]">
                  Enter the mobile number registered with your health insurer or Aadhaar.
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#0A3871] hover:bg-[#072852] active:scale-[0.98] text-white font-bold text-[14px] rounded-full transition-all flex items-center justify-center gap-2 shadow-md shadow-[#0A3871]/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting to DigiLocker...</span>
                  </>
                ) : (
                  <>
                    <span>Send DigiLocker OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="p-3 bg-[#EAF1FF]/60 rounded-xl border border-[#1958E8]/15 flex items-start gap-2 text-[11px] text-[#595959]">
                <Lock className="w-3.5 h-3.5 text-[#1958E8] flex-shrink-0 mt-0.5" />
                <span>Zero data retention. Credentials and policy certificates are never stored on any server.</span>
              </div>
            </form>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center space-y-1">
                <h3 className="text-[17px] font-bold text-[#1A1F2B]">
                  Enter 6-digit Verification OTP
                </h3>
                <p className="text-[13px] text-[#595959]">
                  Sent to mobile linked with DigiLocker.
                </p>
                <div className="inline-block mt-1 text-[11px] font-bold text-[#22B573] bg-[#EAFBF1] px-2.5 py-0.5 rounded-full border border-[#22B573]/20">
                  Sandbox Active: Use OTP 123456
                </div>
              </div>

              <div className="space-y-1.5 text-center">
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-48 mx-auto px-4 py-3 bg-[#FAFBFC] border-2 border-[#1958E8] rounded-xl text-center text-[22px] tracking-[0.3em] font-bold text-[#1A1F2B] focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#22B573] hover:bg-[#1CA064] active:scale-[0.98] text-white font-bold text-[14px] rounded-full transition-all flex items-center justify-center gap-2 shadow-md"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying with MeitY Gateway...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify & Discover Policies</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="text-[12px] text-[#595959] hover:text-[#1A1F2B] underline"
                >
                  Change Mobile Number
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: DISCOVERED HEALTH POLICIES */}
          {step === 'documents' && (
            <div className="space-y-4 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[16px] font-bold text-[#1A1F2B]">
                    Discovered Health Policies
                  </h3>
                  <p className="text-[12px] text-[#595959]">
                    Select a certificate to import into ClaimReady:
                  </p>
                </div>
                <span className="text-[11px] font-bold text-[#22B573] bg-[#EAFBF1] px-2.5 py-0.5 rounded-full border border-[#22B573]/20">
                  {documents.length} Found
                </span>
              </div>

              <div className="space-y-2.5">
                {documents.map((doc) => (
                  <div
                    key={doc.docId}
                    onClick={() => !isLoading && handleSelectDocument(doc)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 relative ${
                      selectedDocId === doc.docId
                        ? 'bg-[#EAF1FF] border-[#1958E8] shadow-sm'
                        : 'bg-[#FAFBFC] border-[#E2E8F0] hover:bg-white hover:border-[#1958E8]/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#0A3871] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[14px] text-[#1A1F2B] leading-snug">
                            {doc.name}
                          </h4>
                          <p className="text-[12px] text-[#595959]">
                            {doc.insurer}
                          </p>
                        </div>
                      </div>

                      {selectedDocId === doc.docId ? (
                        <Loader2 className="w-5 h-5 text-[#1958E8] animate-spin flex-shrink-0" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center flex-shrink-0 text-[#1958E8]">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-[#595959]">
                      <span>Sum Insured: <strong className="text-[#1A1F2B]">{doc.sumInsured}</strong></span>
                      <span className="text-[#22B573] font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{doc.issuerBadge}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 flex-shrink-0 text-amber-600" />
                <span>Clicking any policy streams its schedule into Gemini for in-memory clause analysis.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
