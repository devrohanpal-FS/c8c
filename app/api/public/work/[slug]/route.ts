import { NextResponse } from 'next/server';
import { getPublishedWorkBySlug } from '@/lib/services/publicContentService';

export const revalidate = 60;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const work = await getPublishedWorkBySlug(slug);

    if (!work) {
      return NextResponse.json(
        { error: 'Project not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ work });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch project.' },
      { status: 500 }
    );
  }
}
