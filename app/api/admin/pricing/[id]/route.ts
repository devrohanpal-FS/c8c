import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { canManageContent } from '@/lib/permissions';
import { prisma } from '@/lib/db';
import { AuditService } from '@/lib/audit';
import { pricingTierSchema } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleUpdate(req, (await params).id);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleUpdate(req, (await params).id);
}

async function handleUpdate(req: Request, id: string) {
  try {
    const user = await requireAuthUser();

    if (!canManageContent(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const validated = pricingTierSchema.partial().parse(body);

    const updateData: Record<string, any> = {};
    if (validated.name !== undefined) updateData.name = validated.name;
    if (validated.slug !== undefined) updateData.slug = validated.slug;
    if (validated.description !== undefined) updateData.description = validated.description;
    if (validated.priceLabel !== undefined) updateData.priceLabel = validated.priceLabel;
    if (validated.billingPeriod !== undefined) updateData.billingPeriod = validated.billingPeriod;
    if (validated.features !== undefined) {
      updateData.features = typeof validated.features === 'string' ? validated.features : JSON.stringify(validated.features || []);
    }
    if (validated.ctaText !== undefined) updateData.ctaText = validated.ctaText;
    if (validated.ctaUrl !== undefined) updateData.ctaUrl = validated.ctaUrl;
    if (validated.featured !== undefined) updateData.featured = validated.featured;
    if (validated.active !== undefined) updateData.active = validated.active;
    if (validated.order !== undefined) updateData.order = validated.order;

    const updated = await prisma.pricingTier.update({
      where: { id },
      data: updateData,
    });

    await AuditService.log({
      userId: user.id,
      action: 'UPDATE_PRICING_TIER',
      entity: 'PricingTier',
      entityId: id,
      details: { id, ...updateData },
    });

    return NextResponse.json({ tier: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update pricing tier' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuthUser();

    if (!canManageContent(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const deleted = await prisma.pricingTier.delete({
      where: { id: (await params).id },
    });

    await AuditService.log({
      userId: user.id,
      action: 'DELETE_PRICING_TIER',
      entity: 'PricingTier',
      entityId: (await params).id,
      details: { name: deleted.name },
    });

    return NextResponse.json({ success: true, tier: deleted });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete pricing tier' },
      { status: 500 }
    );
  }
}