import { NextResponse } from 'next/server';
import { BtsService } from '@/lib/services/btsService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const btsImages = await BtsService.getAllBts(true);
    return NextResponse.json({ btsImages });
  } catch (error: unknown) {
    console.error('GET /api/bts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch BTS images' },
      { status: 500 }
    );
  }
}
