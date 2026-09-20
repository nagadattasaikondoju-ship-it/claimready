import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PolicyData, CoverageField, StatusType } from '@/lib/types';
import { SAMPLE_POLICIES } from '@/lib/extract/mock-samples';

// Max file size: 20MB
const MAX_FILE_SIZE = 20 * 1024 * 1024;

export const maxDuration = 60; // Allow up to 60s for Gemini document analysis

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData().catch(() => null);
    if (!formData) {
      return NextResponse.json(
        { success: false, error: 'No form data submitted' },
        { status: 400 }
      );
    }

    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No document file uploaded' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File exceeds maximum limit of 20MB' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'GEMINI_API_KEY is not configured in environment. Please add it to your environment variables.',
        },
        { status: 500 }
      );
    }

    // In-memory zero-storage buffer conversion
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString('base64');

    let mimeType = file.type || 'application/pdf';
    const lowerName = file.name.toLowerCase();
    if (lowerName.endsWith('.pdf')) {
      mimeType = 'application/pdf';
    } else if (lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg')) {
      mimeType = 'image/jpeg';
    } else if (lowerName.endsWith('.png')) {
      mimeType = 'image/png';
    } else if (lowerName.endsWith('.webp')) {
      mimeType = 'image/webp';
    } else if (lowerName.endsWith('.txt')) {
      mimeType = 'text/plain';
    }

    // Fallback list of modern fast Gemini models
    const candidateModels = [
      process.env.GEMINI_MODEL,
      'gemini-3.1-flash-lite',
      'gemini-3.5-flash-lite',
      'gemini-3.5-flash',
      'gemini-flash-latest',
    ].filter(Boolean) as string[];

    const genAI = new GoogleGenerativeAI(apiKey);


    const extractionPrompt = `
You are the ClaimReady Document Classifier and Policy Extraction Engine.
Your role is to strictly analyze uploaded documents for Indian health insurance policyholders.

PRIVACY & COMPLIANCE MANDATE:
- All processing is ephemeral and in-memory. Zero document retention.
- You must NOT hallucinate or guess any policy clause. If a term is not explicitly found, state that it is not found.

TASK 1: CLASSIFY THE DOCUMENT
Inspect the provided document thoroughly.
Is this an authentic Indian Health Insurance policy document (such as a Policy Schedule, Certificate of Insurance, Premium Schedule, Policy Wordings, or Renewal Notice issued by an IRDAI-regulated Indian health or general insurer, e.g., Star Health, HDFC ERGO, Care Health, Niva Bupa, ICICI Lombard, Aditya Birla, New India Assurance, United India, National Insurance, Oriental Insurance, Bajaj Allianz, Tata AIG, SBI General, ManipalCigna, etc.)?

IF THE DOCUMENT IS NOT AN INDIAN HEALTH INSURANCE POLICY:
(For example: it is a cooking recipe, vehicle/motor insurance, life/term insurance, resume, hospital bill/discharge summary without policy schedule, bank statement, identity proof, invoice, or unrelated text)
You MUST return this exact JSON format:
{
  "isPolicy": false,
  "rejectionReason": "This document does not appear to be an Indian health insurance policy schedule or certificate. We detected that this is [brief description of what the document actually is]. ClaimReady can only analyze authentic health insurance policies."
}

TASK 2: EXTRACT POLICY CLAUSES (Only if isPolicy is true)
Extract the following information strictly from the document text. Every field MUST include the exact page number, clause reference (e.g. Clause 2.1 or Section B.4), and exact verbatim quote from the policy.

Required JSON Structure:
{
  "isPolicy": true,
  "id": "slug-name",
  "insurerName": "Name of insurer (e.g. HDFC ERGO General Insurance)",
  "policyName": "Name of policy product (e.g. Optima Secure)",
  "policyNumber": "Policy or certificate number, or 'Not visible in upload'",
  "sumInsured": "Sum insured with ₹ symbol (e.g. ₹10,00,000)",
  "policyPeriod": "Start date to end date (e.g. 15 Apr 2025 to 14 Apr 2026)",
  "familyMembers": "Persons covered (e.g. 2 Adults (Self, Spouse))",
  "userName": "Proposer name if available, or 'Policyholder'",
  "insurerHelpline": "Customer care toll-free number or '1800 258 5881'",
  "tpaName": "TPA name or 'In-house Claims Management'",
  "tpaHelpline": "TPA contact phone or helpline",
  "cashlessNumber": "Toll free number for cashless intimation",
  "fields": [
    {
      "field": "room_rent",
      "title": "Room Rent Limit",
      "category": "caps",
      "value": "e.g. No limit / Single Private AC Room / 1% of Sum Insured",
      "status": "covered" | "warning" | "not_covered" | "not_found",
      "quote": "Exact verbatim quote from policy",
      "page": 1,
      "clause": "e.g. Section 1.1",
      "explanation": "Plain language explanation of how this affects hospital room choice and proportionate deductions",
      "plainMeaning": "Short 1-sentence summary",
      "iconName": "Bed"
    },
    {
      "field": "ped_waiting",
      "title": "Pre-Existing Disease (PED) Waiting Period",
      "category": "waiting",
      "value": "e.g. 36 Months / 24 Months / None",
      "status": "covered" | "warning" | "not_covered" | "not_found",
      "quote": "Exact verbatim quote from policy",
      "page": 1,
      "clause": "e.g. Section 2.1",
      "explanation": "Plain language explanation of PED waiting period",
      "plainMeaning": "Short summary",
      "iconName": "Clock"
    },
    {
      "field": "initial_waiting",
      "title": "Initial Waiting Period",
      "category": "waiting",
      "value": "e.g. 30 Days (accidents covered from Day 1)",
      "status": "covered" | "warning" | "not_covered" | "not_found",
      "quote": "Exact verbatim quote",
      "page": 1,
      "clause": "e.g. Section 2.2",
      "explanation": "Hospitalization due to illness not covered in first 30 days except accidental injury",
      "plainMeaning": "Short summary",
      "iconName": "ShieldAlert"
    },
    {
      "field": "specific_waiting",
      "title": "Specific Disease Waiting Period (2-Year List)",
      "category": "waiting",
      "value": "e.g. 24 Months for Cataract, Hernia, Joint Replacement, Stones",
      "status": "covered" | "warning" | "not_covered" | "not_found",
      "quote": "Exact verbatim quote",
      "page": 1,
      "clause": "e.g. Section 2.3",
      "explanation": "Specified list of treatments have a mandatory 24-month waiting duration",
      "plainMeaning": "Short summary",
      "iconName": "FileText"
    },
    {
      "field": "copay",
      "title": "Co-payment",
      "category": "caps",
      "value": "e.g. Nil / 20% Zone Co-pay / 10% Senior Co-pay",
      "status": "covered" | "warning" | "not_covered" | "not_found",
      "quote": "Exact verbatim quote",
      "page": 1,
      "clause": "e.g. Section 3.1",
      "explanation": "Percentage of total claim that must be paid out of pocket",
      "plainMeaning": "Short summary",
      "iconName": "Percent"
    },
    {
      "field": "ncb",
      "title": "No-Claim Bonus (NCB)",
      "category": "caps",
      "value": "e.g. 50% increase each claim-free year up to max 100%",
      "status": "covered" | "warning" | "not_covered" | "not_found",
      "quote": "Exact verbatim quote",
      "page": 1,
      "clause": "e.g. Section 4.1",
      "explanation": "Cumulative sum insured bonus earned without premium increase",
      "plainMeaning": "Short summary",
      "iconName": "TrendingUp"
    },
    {
      "field": "daycare",
      "title": "Day Care Treatments",
      "category": "procedures",
      "value": "e.g. All Day Care Procedures Covered (requires <24h hospitalization due to tech)",
      "status": "covered" | "warning" | "not_covered" | "not_found",
      "quote": "Exact verbatim quote",
      "page": 1,
      "clause": "e.g. Section 1.3",
      "explanation": "Treatments requiring less than 24 hours hospitalization due to technological advancement",
      "plainMeaning": "Short summary",
      "iconName": "Activity"
    },
    {
      "field": "pre_post_hosp",
      "title": "Pre & Post-Hospitalization",
      "category": "logistics",
      "value": "e.g. 60 Days Pre / 180 Days Post Hospitalization",
      "status": "covered" | "warning" | "not_covered" | "not_found",
      "quote": "Exact verbatim quote",
      "page": 1,
      "clause": "e.g. Section 1.4",
      "explanation": "Medical expenses incurred before admission and after discharge related to condition",
      "plainMeaning": "Short summary",
      "iconName": "Calendar"
    },
    {
      "field": "modern_treatment",
      "title": "Modern Treatments & Advanced Tech",
      "category": "procedures",
      "value": "e.g. Covered up to Sum Insured / Sub-limits apply on robotic surgery",
      "status": "covered" | "warning" | "not_covered" | "not_found",
      "quote": "Exact verbatim quote",
      "page": 1,
      "clause": "e.g. Section 1.5",
      "explanation": "Coverage for 12 IRDAI modern treatments (robotic, stem cell, immunotherapies)",
      "plainMeaning": "Short summary",
      "iconName": "Zap"
    },
    {
      "field": "restoration",
      "title": "Sum Insured Restoration Benefit",
      "category": "caps",
      "value": "e.g. 100% Instant Restoration for subsequent claims in same year",
      "status": "covered" | "warning" | "not_covered" | "not_found",
      "quote": "Exact verbatim quote",
      "page": 1,
      "clause": "e.g. Section 1.6",
      "explanation": "Recharges base sum insured automatically if exhausted during policy period",
      "plainMeaning": "Short summary",
      "iconName": "RefreshCw"
    }
  ]
}

Status guidance:
- 'covered': Favorable policy condition (e.g. Single Private AC room, no co-pay, instant restore).
- 'warning': Restriction that can cause unexpected out-of-pocket expenses (e.g. 1% room rent cap, 20% co-pay, 36-month waiting period).
- 'not_covered': Explicit exclusion in the document.
- 'not_found': The clause is not mentioned or absent in the uploaded schedule.
`;

    let responseText = '';
    let lastError: any = null;

    for (const m of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: m,
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.1,
          },
        });

        const result = await model.generateContent([
          {
            inlineData: {
              mimeType,
              data: base64Data,
            },
          },
          {
            text: extractionPrompt,
          },
        ]);

        responseText = result.response.text();
        if (responseText) break;
      } catch (modelErr: any) {
        lastError = modelErr;
        console.warn(`Extraction model ${m} encountered error, trying next fallback:`, modelErr?.message);
      }
    }

    if (!responseText) {
      throw lastError || new Error('All AI extraction models were temporarily unavailable');
    }

    let parsed: any;
    try {
      parsed = JSON.parse(responseText);
    } catch (parseErr) {
      // Clean potential markdown wrap
      const cleaned = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleaned);
    }

    if (!parsed || parsed.isPolicy === false) {
      return NextResponse.json({
        success: false,
        isPolicy: false,
        rejectionReason:
          parsed?.rejectionReason ||
          'This document does not appear to be an authentic Indian health insurance policy schedule. Please upload your official policy schedule or certificate.',
      });
    }

    // Ensure fallback fields exist
    const policyData: PolicyData = {
      id: parsed.id || `custom-${Date.now()}`,
      insurerName: parsed.insurerName || 'Indian Health Insurer',
      policyName: parsed.policyName || file.name.replace(/\.[^/.]+$/, ''),
      policyNumber: parsed.policyNumber || 'Not specified',
      sumInsured: parsed.sumInsured || '₹10,00,000',
      policyPeriod: parsed.policyPeriod || '1 Year Policy',
      familyMembers: parsed.familyMembers || 'Self',
      userName: parsed.userName || 'Policyholder',
      insurerHelpline: parsed.insurerHelpline || '1800 258 5881',
      tpaName: parsed.tpaName || 'In-house Claims',
      tpaHelpline: parsed.tpaHelpline || '1800 258 5881',
      cashlessNumber: parsed.cashlessNumber || '1800 258 5881',
      fields: Array.isArray(parsed.fields) ? parsed.fields : [],
    };

    return NextResponse.json({
      success: true,
      isPolicy: true,
      policy: policyData,
    });
  } catch (error: any) {
    console.error('Policy extraction error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to process document with Gemini AI',
      },
      { status: 500 }
    );
  }
}
