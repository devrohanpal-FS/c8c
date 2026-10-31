import { NextResponse } from 'next/server';
import { getPublishedWork } from '@/lib/services/publicContentService';

export const revalidate = 60;

export async function GET() {
  try {
    const works = await getPublishedWork();
    return NextResponse.json({ works });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch works.' }, { status: 500 });
  }
}