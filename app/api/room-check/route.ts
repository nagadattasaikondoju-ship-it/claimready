import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { roomPrice = 0, roomCap = 5000, isNoCap = false, billAmount = 300000 } = body;

    const isOverCap = !isNoCap && roomPrice > roomCap;
    const allowedRatio = isOverCap && roomPrice > 0 ? roomCap / roomPrice : 1.0;
    const penaltyPercentage = isOverCap ? Math.round((1 - allowedRatio) * 100) : 0;
    const estimatedDeductionCut = isOverCap ? Math.round(billAmount * 0.7 * (1 - allowedRatio)) : 0;
    const totalOutOfPocket = isOverCap ? (roomPrice - roomCap) * 4 + estimatedDeductionCut : 0;

    return NextResponse.json({
      success: true,
      isNoCap,
      isOverCap,
      penaltyPercentage,
      estimatedDeductionCut,
      totalOutOfPocket,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Calculation error' },
      { status: 500 }
    );
  }
}
