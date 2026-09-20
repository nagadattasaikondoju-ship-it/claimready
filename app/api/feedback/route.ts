import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rating, feedback } = body;

    // Privacy-respecting: no document content or personal data logged
    return NextResponse.json({
      success: true,
      message: 'Thank you for your feedback',
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Feedback failed' }, { status: 500 });
  }
}
