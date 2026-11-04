import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { canManageUsers } from '@/lib/permissions';
import { UserService } from '@/lib/services/userService';
import { userCreateSchema } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await requireAuthUser();

    if (!canManageUsers(user.role)) {
      return NextResponse.json(
        { error: 'Forbidden: Administrator privilege required to view user list.' },
        { status: 403 }
      );
    }

    const users = await UserService.getAllUsers();
    return NextResponse.json({ users });
  } catch (error: unknown) {
    console.error('GET /api/admin/users error:', error);
    const errMsg = error instanceof Error ? error.message : '';
    const isAuth = errMsg.includes('Unauthorized');
    return NextResponse.json(
      { error: isAuth ? 'Unauthorized access' : 'Failed to fetch users.' },
      { status: isAuth ? 401 : 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireAuthUser();

    if (!canManageUsers(user.role)) {
      return NextResponse.json(
        { error: 'Forbidden: Administrator privilege required to create user accounts.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validated = userCreateSchema.parse(body);

    const newUser = await UserService.createUser(validated, user.id);
    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (error: unknown) {
    console.error('POST /api/admin/users error:', error);
    const errMsg = error instanceof Error ? error.message : '';
    const isAuth = errMsg.includes('Unauthorized');
    const isValidation = error instanceof Error && error.name === 'ZodError';
    return NextResponse.json(
      { error: isAuth ? 'Unauthorized access' : isValidation ? 'Invalid user payload.' : 'Failed to create user.' },
      { status: isAuth ? 401 : isValidation ? 400 : 500 }
    );
  }
}