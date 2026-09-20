import { NextRequest, NextResponse } from 'next/server';
import { SAMPLE_POLICIES } from '@/lib/extract/mock-samples';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { policyIds = [] } = body;

    const policies = SAMPLE_POLICIES.filter((p) => policyIds.includes(p.id));

    return NextResponse.json({
      success: true,
      policies: policies.length > 0 ? policies : SAMPLE_POLICIES.slice(0, 2),
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Compare failed' }, { status: 500 });
  }
}
