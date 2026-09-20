import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { policy } = body;

    if (!policy) {
      return NextResponse.json({ success: false, error: 'Policy required' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      card: {
        policyName: policy.policyName,
        insurerName: policy.insurerName,
        policyNumber: policy.policyNumber,
        sumInsured: policy.sumInsured,
        familyMembers: policy.familyMembers,
        insurerHelpline: policy.insurerHelpline,
        tpaName: policy.tpaName,
        tpaHelpline: policy.tpaHelpline,
        cashlessNumber: policy.cashlessNumber,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}
