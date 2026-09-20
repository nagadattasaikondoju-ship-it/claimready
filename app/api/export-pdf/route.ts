import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { policy } = body;

    return NextResponse.json({
      success: true,
      message: 'Client-side print/PDF rendering triggered for zero-server storage',
      policyTitle: policy?.policyName || 'Policy_Coverage',
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Export failed' }, { status: 500 });
  }
}
