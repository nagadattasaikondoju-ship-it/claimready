import { NextRequest, NextResponse } from 'next/server';
import { SAMPLE_POLICIES } from '@/lib/extract/mock-samples';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData().catch(() => null);
    const file = formData?.get('file') as File | null;

    // Zero document storage: Process in-memory
    const sample = SAMPLE_POLICIES[0];
    const fileName = file?.name || 'Uploaded_Policy.pdf';

    return NextResponse.json({
      success: true,
      policy: {
        ...sample,
        policyName: fileName.replace(/\.[^/.]+$/, ''),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to extract policy' },
      { status: 500 }
    );
  }
}
