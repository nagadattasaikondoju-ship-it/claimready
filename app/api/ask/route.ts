import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query = '', policy } = body;

    if (!policy) {
      return NextResponse.json({
        success: true,
        answer: "This isn't something I can find in your policy — please upload your policy document first.",
        citations: [],
      });
    }

    const qLower = query.toLowerCase();
    let answer = "This isn't something I can find in your policy — you may need to ask your insurer directly.";
    let citations: any[] = [];

    if (qLower.includes('room') || qLower.includes('rent')) {
      const field = policy.fields?.find((f: any) => f.field === 'room_rent_cap');
      if (field) {
        answer = `Your policy room limit is: ${field.value}. ${field.plainMeaning}`;
        citations = [{ clause: field.clause, page: field.page, title: field.title, quote: field.quote }];
      }
    } else if (qLower.includes('icu')) {
      const field = policy.fields?.find((f: any) => f.field === 'icu_cap');
      if (field) {
        answer = `Your ICU limit: ${field.value}. ${field.plainMeaning}`;
        citations = [{ clause: field.clause, page: field.page, title: field.title, quote: field.quote }];
      }
    } else if (qLower.includes('waiting') || qLower.includes('ped')) {
      const field = policy.fields?.find((f: any) => f.field === 'ped_waiting_period');
      if (field) {
        answer = `Pre-existing disease waiting period is ${field.value}. ${field.plainMeaning}`;
        citations = [{ clause: field.clause, page: field.page, title: field.title, quote: field.quote }];
      }
    }

    return NextResponse.json({
      success: true,
      answer,
      citations,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Query processing failed' },
      { status: 500 }
    );
  }
}
