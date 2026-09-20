import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PolicyData } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query = '', policy } = body as { query: string; policy: PolicyData };

    if (!policy) {
      return NextResponse.json({
        success: true,
        answer: "Please upload your policy document first so I can inspect your specific terms.",
        citations: [],
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback if no key is configured
      return NextResponse.json({
        success: true,
        answer: "Gemini API key is not configured. Please check your environment variables.",
        citations: [],
      });
    }

    const candidateModels = [
      process.env.GEMINI_MODEL,
      'gemini-3.1-flash-lite',
      'gemini-3.5-flash-lite',
      'gemini-3.5-flash',
      'gemini-flash-latest',
    ].filter(Boolean) as string[];

    const genAI = new GoogleGenerativeAI(apiKey);

    const prompt = `
You are ClaimReady's Grounded Policy Assistant.
Answer the user's question about their health insurance policy STRICTLY based on the provided policy data and clauses.

POLICY DETAILS:
Insurer: ${policy.insurerName}
Policy Name: ${policy.policyName}
Policy Number: ${policy.policyNumber}
Sum Insured: ${policy.sumInsured}
Policy Period: ${policy.policyPeriod}
Helpline: ${policy.insurerHelpline}

POLICY FIELDS & CLAUSES:
${JSON.stringify(policy.fields, null, 2)}

USER QUESTION:
"${query}"

INSTRUCTIONS:
1. Grounding: Answer ONLY from the policy fields and terms provided above. Never invent or speculate on terms not in the document.
2. If the answer is not mentioned in the policy fields, explicitly reply: "This specific term or clause is not stated in your uploaded policy schedule. You may need to verify directly with ${policy.insurerName} at ${policy.insurerHelpline}."
3. Plain language: Explain in simple, supportive terms without legal jargon.
4. Citations: If you reference any policy term, include the exact clause and page number in the citations array.

Return JSON in this exact structure:
{
  "answer": "Plain language answer explaining the exact coverage, limits, or requirements...",
  "citations": [
    {
      "clause": "e.g. Clause 2.1",
      "page": 1,
      "title": "Room Rent Limit",
      "quote": "Exact verbatim quote from policy field"
    }
  ]
}
`;

    let text = '';
    for (const m of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: m,
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.1,
          },
        });
        const result = await model.generateContent(prompt);
        text = result.response.text();
        if (text) break;
      } catch (mErr: any) {
        console.warn(`Model ${m} failed in Ask ClaimReady:`, mErr?.message);
      }
    }

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleaned);
    }

    return NextResponse.json({
      success: true,
      answer: parsed.answer || "I could not find information regarding this in your uploaded policy.",
      citations: Array.isArray(parsed.citations) ? parsed.citations : [],
    });
  } catch (error: any) {
    console.error('Ask ClaimReady error:', error);
    return NextResponse.json(
      { success: false, error: 'Query processing failed' },
      { status: 500 }
    );
  }
}
