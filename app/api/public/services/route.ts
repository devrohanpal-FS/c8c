import { NextRequest, NextResponse } from 'next/server';
import { getPublishedServices } from '@/lib/services/publicContentService';

export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const services = await getPublishedServices(category);
    return NextResponse.json({ services });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch services.' }, { status: 500 });
  }
}