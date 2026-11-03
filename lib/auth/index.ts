import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/db';

export interface AuthSessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: string | null;
}

export async function getAuthSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser(): Promise<AuthSessionUser | null> {
  const session = await getAuthSession();
  if (!session || !session.user) return null;
  return session.user as AuthSessionUser;
}

export async function requireAuthUser(): Promise<AuthSessionUser> {
  const sessionUser = await getCurrentUser();
  if (!sessionUser || !sessionUser.id) {
    throw new Error('Unauthorized access: User session required.');
  }

  // Active session verification against database to revoke suspended or deleted user tokens immediately
  const dbUser = await prisma.user.findFirst({
    where: {
      id: sessionUser.id,
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  if (!dbUser) {
    throw new Error('Unauthorized access: User account has been deactivated or not found.');
  }

  return dbUser;
}