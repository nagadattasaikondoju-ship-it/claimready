'use client';

import React, { useState } from 'react';
import { IconTile } from '../IconTile';
import {
  Calculator,
  Users,
  Calendar,
  Building2,
  HeartPulse,
  Wallet,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export function CoverageNeedsCalcView() {
  const [step, setStep] = useState<number>(1);
  const [familyType, setFamilyType] = useState<string>('nuclear');
  const [ageGroup, setAgeGroup] = useState<string>('36-50');
  const [cityTier, setCityTier] = useState<string>('tier1');
  const [hasPED, setHasPED] = useState<string>('no');
  const [budgetComfort, setBudgetComfort] = useState<string>('balanced');

  const totalSteps = 5;

  // Recommendation logic (pure educational guidelines, zero products named)
  const calculateNeeds = () => {
    let minSI = 5;
    let maxSI = 10;
    let planType = 'Family Floater Plan';

    if (familyType === 'individual') {
      planType = 'Individual Health Plan';
      minSI = cityTier === 'tier1' ? 7.5 : 5;
      maxSI = cityTier === 'tier1' ? 15 : 10;
    } else if (familyType === 'senior') {
      planType = 'Senior Citizen Specialized Plan';
      minSI = 10;
      maxSI = 25;
    } else if (familyType === 'joint') {
      planType = 'Multi-Individual / Comprehensive Floater';
      minSI = 15;
      maxSI = 30;
    } else {
      // Nuclear
      planType = 'Family Floater Plan (2 Adults + Children)';
      minSI = cityTier === 'tier1' ? 10 : 7.5;
      maxSI = cityTier === 'tier1' ? 20 : 15;
    }

    if (hasPED === 'yes') {
      minSI += 5;
      maxSI += 5;
    }

    return {
      planType,
      minSI,
      maxSI,
    };
  };

  const recommendation = calculateNeeds();

  return (
    <div className="space-y-5 text-left max-w-lg mx-auto py-2 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-[20px] p-5 border border-[#E2E8F0] space-y-2">
        <div className="flex items-center gap-3">
          <IconTile icon={Calculator} variant="blue" size="md" />
          <div>
            <span className="text-[11px] font-bold text-[#1958E8] uppercase tracking-wider">
              Educational Calculator
            </span>
            <h2 className="text-[19px] font-bold text-[#1A1F2B]">
              Coverage Needs Calculator
            </h2>
          </div>
        </div>
        <p className="text-[13px] text-[#595959] leading-relaxed">
          Estimate the ideal sum insured range for your household based on medical cost realities.
        </p>
      </div>

      {step <= totalSteps ? (
        <div className="bg-white rounded-[20px] p-5 sm:p-6 border border-[#E2E8F0] space-y-5 animate-fadeIn">
          {/* Step Progress indicator */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold text-[#595959]">
              <span>Step {step} of {totalSteps}</span>
              <span className="text-[#1958E8]">{Math.round((step / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1958E8] transition-all rounded-full"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 1: Family Composition */}
          {step === 1 && (
            <div className="space-y-3.5">
              <h3 className="text-[16px] font-bold text-[#1A1F2B]">
                Who needs health cover in your family?
              </h3>
              <div className="space-y-2">
                {[
                  { id: 'individual', title: 'Just Myself (Individual)', desc: '1 Adult' },
                  { id: 'nuclear', title: 'Nuclear Family', desc: 'Self + Spouse + Children' },
                  { id: 'joint', title: 'Joint Family with Parents', desc: '3+ Adults + Children' },
                  { id: 'senior', title: 'Senior Citizen Parents Only', desc: 'Ages 60+' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setFamilyType(opt.id);
                      setStep(2);
                    }}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                      familyType === opt.id
                        ? 'bg-[#EAF1FF] border-[#1958E8]'
                        : 'bg-[#FAFBFC] border-[#E2E8F0] hover:bg-[#EAF1FF]/40'
                    }`}
                  >
                    <div className="text-[14px] font-bold text-[#1A1F2B]">{opt.title}</div>
                    <div className="text-[12px] text-[#595959]">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Eldest Member Age */}
          {step === 2 && (
            <div className="space-y-3.5">
              <h3 className="text-[16px] font-bold text-[#1A1F2B]">
                What is the age of the eldest family member?
              </h3>
              <div className="space-y-2">
                {[
                  { id: 'under35', title: 'Under 35 years' },
                  { id: '36-50', title: '36 to 50 years' },
                  { id: '51-65', title: '51 to 65 years' },
                  { id: '65plus', title: 'Above 65 years' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setAgeGroup(opt.id);
                      setStep(3);
                    }}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                      ageGroup === opt.id
                        ? 'bg-[#EAF1FF] border-[#1958E8]'
                        : 'bg-[#FAFBFC] border-[#E2E8F0] hover:bg-[#EAF1FF]/40'
                    }`}
                  >
                    <div className="text-[14px] font-bold text-[#1A1F2B]">{opt.title}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: City Tier */}
          {step === 3 && (
            <div className="space-y-3.5">
              <h3 className="text-[16px] font-bold text-[#1A1F2B]">
                Where do you typically seek medical treatment?
              </h3>
              <div className="space-y-2">
                {[
                  { id: 'tier1', title: 'Tier 1 Metro (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata)', desc: 'Higher room rent & treatment benchmarks' },
                  { id: 'tier2', title: 'Tier 2 City (State Capital / Major Hub)', desc: 'Moderate medical cost inflation' },
                  { id: 'tier3', title: 'Tier 3 / District Town', desc: 'Standard local hospital network' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setCityTier(opt.id);
                      setStep(4);
                    }}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                      cityTier === opt.id
                        ? 'bg-[#EAF1FF] border-[#1958E8]'
                        : 'bg-[#FAFBFC] border-[#E2E8F0] hover:bg-[#EAF1FF]/40'
                    }`}
                  >
                    <div className="text-[14px] font-bold text-[#1A1F2B]">{opt.title}</div>
                    <div className="text-[12px] text-[#595959]">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Existing Conditions */}
          {step === 4 && (
            <div className="space-y-3.5">
              <h3 className="text-[16px] font-bold text-[#1A1F2B]">
                Does anyone have pre-existing health conditions (Diabetes, BP, Thyroid, Asthma)?
              </h3>
              <div className="space-y-2">
                {[
                  { id: 'yes', title: 'Yes, declared past health conditions' },
                  { id: 'no', title: 'No existing diagnosed conditions' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setHasPED(opt.id);
                      setStep(5);
                    }}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                      hasPED === opt.id
                        ? 'bg-[#EAF1FF] border-[#1958E8]'
                        : 'bg-[#FAFBFC] border-[#E2E8F0] hover:bg-[#EAF1FF]/40'
                    }`}
                  >
                    <div className="text-[14px] font-bold text-[#1A1F2B]">{opt.title}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Savings Comfort */}
          {step === 5 && (
            <div className="space-y-3.5">
              <h3 className="text-[16px] font-bold text-[#1A1F2B]">
                What is your target financial protection priority?
              </h3>
              <div className="space-y-2">
                {[
                  { id: 'balanced', title: 'Comprehensive Family Protection (Balanced)', desc: 'Zero room capping and 100% cashless security' },
                  { id: 'high', title: 'Critical Illness & Super High Coverage', desc: 'Protection against major surgeries & ICU stays' },
                  { id: 'conservative', title: 'Standard Basic Health Coverage', desc: 'Essential hospitalisation buffer' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setBudgetComfort(opt.id);
                      setStep(6);
                    }}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                      budgetComfort === opt.id
                        ? 'bg-[#EAF1FF] border-[#1958E8]'
                        : 'bg-[#FAFBFC] border-[#E2E8F0] hover:bg-[#EAF1FF]/40'
                    }`}
                  >
                    <div className="text-[14px] font-bold text-[#1A1F2B]">{opt.title}</div>
                    <div className="text-[12px] text-[#595959]">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Results View */
        <div className="bg-white rounded-[20px] p-5 sm:p-6 border border-[#E2E8F0] space-y-5 animate-fadeIn">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#1958E8] uppercase tracking-wider">
              Educational Assessment Result
            </span>
            <h3 className="text-[20px] font-bold text-[#1A1F2B]">
              Recommended Coverage Framework
            </h3>
          </div>

          {/* Recommended Sum Insured Card */}
          <div className="bg-[#EAF1FF] rounded-[20px] p-5 border border-[#1958E8]/20 space-y-2">
            <span className="text-[11px] font-bold text-[#595959] uppercase block">
              Suggested Sum Insured Range
            </span>
            <div className="text-[24px] font-extrabold text-[#1958E8]">
              ₹ {recommendation.minSI} Lakhs – ₹ {recommendation.maxSI} Lakhs
            </div>
            <div className="text-[13px] font-bold text-[#1A1F2B]">
              Structure: {recommendation.planType}
            </div>
          </div>

          {/* 3 Things to Look For */}
          <div className="space-y-2.5">
            <span className="text-[12px] font-bold text-[#595959] uppercase tracking-wider block">
              3 Critical Rules to Verify When Comparing:
            </span>

            <div className="p-3.5 bg-[#FAFBFC] rounded-xl border border-[#E2E8F0] space-y-0.5 text-[13px]">
              <div className="font-bold text-[#1A1F2B] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#1FAA5C]" />
                <span>1. Zero Room Rent Capping</span>
              </div>
              <p className="text-[#595959]">
                Ensure single private AC room has no sub-limit to prevent 30-50% proportionate deductions on doctor and surgeon bills.
              </p>
            </div>

            <div className="p-3.5 bg-[#FAFBFC] rounded-xl border border-[#E2E8F0] space-y-0.5 text-[13px]">
              <div className="font-bold text-[#1A1F2B] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#1FAA5C]" />
                <span>2. 0% Mandatory Co-Payment</span>
              </div>
              <p className="text-[#595959]">
                Avoid plans that mandate a 10-20% co-payment on approved claims across age groups.
              </p>
            </div>

            <div className="p-3.5 bg-[#FAFBFC] rounded-xl border border-[#E2E8F0] space-y-0.5 text-[13px]">
              <div className="font-bold text-[#1A1F2B] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#1FAA5C]" />
                <span>3. Pre-Existing Disease (PED) Waiting Period</span>
              </div>
              <p className="text-[#595959]">
                Check whether waiting period for declared conditions is 24 months vs 36/48 months.
              </p>
            </div>
          </div>

          {/* Independent Regulatory Boundary Guarantee */}
          <div className="p-3.5 bg-[#EAFBF1] rounded-xl border border-[#1FAA5C]/25 text-[12px] text-[#1FAA5C] font-medium leading-relaxed">
            ClaimReady is an independent educational tool. We never sell, recommend, or rank specific insurance products or insurance companies by name.
          </div>

          {/* Reset button */}
          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full py-3 bg-[#FAFBFC] hover:bg-[#EAF1FF] text-[#1958E8] font-bold text-[14px] rounded-full border border-[#E2E8F0] flex items-center justify-center gap-2 min-h-[48px]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Recalculate Needs</span>
          </button>
        </div>
      )}
    </div>
  );
}
