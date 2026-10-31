import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { canManageContent } from '@/lib/permissions';
import { ContactService } from '@/lib/services/contactService';
import { AuditService } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await requireAuthUser();

    if (!canManageContent(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const submissions = await ContactService.getAllSubmissions();
    return NextResponse.json({ submissions });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch contact submissions.' },
      { status: 401 }
    );
  }
}