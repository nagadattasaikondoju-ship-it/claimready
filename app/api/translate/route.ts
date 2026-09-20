import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { targetLanguage = 'en' } = body;

    return NextResponse.json({
      success: true,
      targetLanguage,
      status: 'translated',
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Translation failed' }, { status: 500 });
  }
}
