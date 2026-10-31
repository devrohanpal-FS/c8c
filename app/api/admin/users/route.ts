import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { UserService } from '@/lib/services/userService';
import { userCreateSchema } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await requireAuthUser();

    if (user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: SUPER_ADMIN privilege required to view user list.' },
        { status: 403 }
      );
    }

    const users = await UserService.getAllUsers();
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 401 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireAuthUser();

    if (user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: SUPER_ADMIN privilege required to create user accounts.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validated = userCreateSchema.parse(body);

    const newUser = await UserService.createUser(validated, user.id);
    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Invalid request payload.' },
      { status: 400 }
    );
  }
}