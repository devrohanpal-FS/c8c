import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

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
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized access: User session required.');
  }
  return user;
}