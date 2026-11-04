import { NextResponse } from 'next/server';
import { getPublicSiteSettings } from '@/lib/services/publicContentService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await getPublicSiteSettings();
    return NextResponse.json({ settings });
  } catch (_error: unknown) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}