import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rejectionReason = '', policyName = 'Health Policy', insurerName = 'Insurer', policyNumber = 'POL-123', clauses = [] } = body;

    const letter = `Date: ${new Date().toLocaleDateString('en-IN')}

To,
Grievance Redressal Officer / Claims Department,
${insurerName}
Subject: Formal Appeal Against Claim Deduction/Rejection
Policy Name: ${policyName} (No: ${policyNumber})

Dear Claims Team,

I am formally requesting a reconsideration of the deduction/rejection applied (${rejectionReason}).

Based on the verified policy terms:
${clauses.map((c: any) => `- Clause ${c.clause} (Page ${c.page}): ${c.quote || c.title}`).join('\n')}

The deduction is in violation of the contract clauses cited above. Kindly review and release the admissible claim amount.

Sincerely,
Insured Policyholder`;

    return NextResponse.json({
      success: true,
      letter,
      citations: clauses,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to generate appeal draft' },
      { status: 500 }
    );
  }
}
