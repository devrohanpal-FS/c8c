import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { UserService, UserRole } from '@/lib/services/userService';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  return PATCH(req, { params });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuthUser();

    if (user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: SUPER_ADMIN privilege required to modify users.' },
        { status: 403 }
      );
    }

    const body = await req.json();

    if (body.role) {
      const updatedUser = await UserService.updateUserRole(params.id, body.role as UserRole, user.id);
      return NextResponse.json({ success: true, user: updatedUser });
    }

    if (body.password) {
      const result = await UserService.resetUserPassword(params.id, body.password, user.id);
      return NextResponse.json({ success: true, message: 'Password reset successfully.', user: result });
    }

    return NextResponse.json({ error: 'No valid update operation specified.' }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'User update failed.' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuthUser();

    if (user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: SUPER_ADMIN privilege required to deactivate users.' },
        { status: 403 }
      );
    }

    const deactivatedUser = await UserService.deactivateUser(params.id, user.id);
    return NextResponse.json({ success: true, message: 'User account deactivated.', user: deactivatedUser });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'User deactivation failed.' },
      { status: 400 }
    );
  }
}