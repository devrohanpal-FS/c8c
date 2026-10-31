import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { canManageContent } from '@/lib/permissions';
import { prisma } from '@/lib/db';
import { AuditService } from '@/lib/audit';
import { pricingTierSchema } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await requireAuthUser();

    if (!canManageContent(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const tiers = await prisma.pricingTier.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ tiers });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch pricing tiers' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireAuthUser();

    if (!canManageContent(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const validated = pricingTierSchema.parse(body);
    const slug = validated.slug || validated.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const features = typeof validated.features === 'string' ? validated.features : JSON.stringify(validated.features || []);

    const created = await prisma.pricingTier.create({
      data: {
        name: validated.name,
        slug,
        description: validated.description || '',
        priceLabel: validated.priceLabel || '$0',
        billingPeriod: validated.billingPeriod || 'project',
        features,
        ctaText: validated.ctaText || 'GET STARTED',
        ctaUrl: validated.ctaUrl || '/contact',
        featured: validated.featured ?? false,
        active: validated.active ?? true,
        order: validated.order ?? 0,
      },
    });

    await AuditService.log({
      userId: user.id,
      action: 'CREATE_PRICING_TIER',
      entity: 'PricingTier',
      entityId: created.id,
      details: { name: created.name, slug: created.slug },
    });

    return NextResponse.json({ tier: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create pricing tier' },
      { status: 500 }
    );
  }
}