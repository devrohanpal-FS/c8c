import { NextRequest, NextResponse } from 'next/server';
import { getPublishedServiceBySlug } from '@/lib/services/publicContentService';

export const revalidate = 60;

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    if (!slug) {
      return NextResponse.json({ error: 'Slug parameter is required.' }, { status: 400 });
    }

    const service = await getPublishedServiceBySlug(slug);
    if (!service) {
      return NextResponse.json({ error: 'Service not found.' }, { status: 404 });
    }

    return NextResponse.json({ service });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch service.' }, { status: 500 });
  }
}
