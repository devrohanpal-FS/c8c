import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { canManageContent } from '@/lib/permissions';
import { prisma } from '@/lib/db';
import { AuditService } from '@/lib/audit';
import { homePageSchema } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await requireAuthUser();

    if (!canManageContent(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let homeData = await prisma.homePage.findFirst();
    if (!homeData) {
      homeData = await prisma.homePage.create({
        data: {
          heroTitle: 'WEIRD ENERGY SINCE Y2K',
          heroSubtitle: 'Featured Work',
        },
      });
    }

    const collageItems = await prisma.homeCollageItem.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ home: homeData, collageItems });
  } catch (error: any) {
    console.error('GET /api/admin/home error:', error);
    const isAuth = error?.message === 'Unauthorized';
    return NextResponse.json(
      { error: isAuth ? 'Unauthorized' : 'Failed to fetch Home Page content' },
      { status: isAuth ? 401 : 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const user = await requireAuthUser();

    if (!canManageContent(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const validated = homePageSchema.parse(body);
    const { collageItems, ...homeData } = validated;

    const dataToSave = {
      heroTitle: homeData.heroTitle,
      heroSubtitle: homeData.heroSubtitle ?? 'Featured Work',
      heroVideoUrl: homeData.heroVideoUrl ?? null,
      heroPosterUrl: homeData.heroPosterUrl ?? null,
      heroCtaText: homeData.heroCtaText ?? 'EXPLORE WORK',
      heroCtaUrl: homeData.heroCtaUrl ?? '/work',
      marqueeText: homeData.marqueeText ?? 'STRATEGY • CREATIVE DIRECTION • VISUAL IDENTITY • DIGITAL EXPERIENCES • BRANDING',
      marqueeActive: homeData.marqueeActive ?? true,
      ctaHeading: homeData.ctaHeading ?? 'READY TO MAKE SOMETHING WEIRD?',
      ctaDescription: homeData.ctaDescription ?? "Let's build something people won't stop talking about.",
      ctaButtonText: homeData.ctaButtonText ?? 'START A PROJECT',
      ctaButtonUrl: homeData.ctaButtonUrl ?? '/contact',
      cultureTag: homeData.cultureTag || 'THE CULTURE',
      cultureTitle: homeData.cultureTitle || 'BEHIND THE LENS BEYOND THE STORY',
    };

    const existing = await prisma.homePage.findFirst();

    const updated = existing
      ? await prisma.homePage.update({
          where: { id: existing.id },
          data: dataToSave,
        })
      : await prisma.homePage.create({
          data: dataToSave,
        });

    if (Array.isArray(collageItems)) {
      await prisma.homeCollageItem.deleteMany();
      if (collageItems.length > 0) {
        await prisma.homeCollageItem.createMany({
          data: collageItems.map((item, idx: number) => ({
            mediaUrl: item.mediaUrl || '',
            alt: item.alt || '',
            title: item.title || item.alt || `CULTURE SLIDE #${idx + 1}`,
            subtitle: item.subtitle || 'Visual Craft & Heritage',
            badge: item.badge || `0${idx + 1} CULTURE`,
            buttonText: item.buttonText || 'View Story',
            linkUrl: item.linkUrl || '/work',
            order: item.order ?? idx + 1,
            active: item.active ?? true,
          })),
        });
      }
    }

    const updatedCollage = await prisma.homeCollageItem.findMany({
      orderBy: { order: 'asc' },
    });

    await AuditService.log({
      userId: user.id,
      action: 'UPDATE_HOME_PAGE',
      entity: 'HomePage',
      entityId: updated.id,
      details: { ...dataToSave, collageItemsCount: collageItems?.length ?? 0 },
    });

    return NextResponse.json({ home: updated, collageItems: updatedCollage });
  } catch (error: any) {
    console.error('PUT /api/admin/home error:', error);
    const isValidation = error?.name === 'ZodError';
    const isAuth = error?.message === 'Unauthorized';
    return NextResponse.json(
      { error: isAuth ? 'Unauthorized' : (isValidation ? 'Invalid home page content' : 'Failed to update Home Page content') },
      { status: isAuth ? 401 : (isValidation ? 400 : 500) }
    );
  }
}