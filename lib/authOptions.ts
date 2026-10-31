import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { AuditService } from '@/lib/audit';
import { rateLimit, resetRateLimit, getClientIp } from '@/lib/rate-limit';
import { getNextAuthSecret } from '@/lib/env';

const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'CRE8TIVECOVE Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'admin@cre8tivecove.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const normalizedEmail = credentials.email.toLowerCase().trim();
        const ip = getClientIp(req as any);
        const rateLimitKey = `login:${normalizedEmail}:${ip}`;
        const limitCheck = rateLimit(rateLimitKey, 5, 60 * 1000);

        if (!limitCheck.success) {
          await AuditService.log({
            action: 'LOGIN_RATE_LIMITED',
            entity: 'User',
            details: { email: normalizedEmail, ip },
            ipAddress: ip,
          });
          throw new Error('Too many login attempts. Please wait 60 seconds before trying again.');
        }

        const user = await prisma.user.findFirst({
          where: {
            email: normalizedEmail,
            deletedAt: null,
          },
        });

        if (!user || !user.password) {
          await AuditService.log({
            action: 'FAILED_LOGIN_USER_NOT_FOUND',
            entity: 'User',
            details: { email: normalizedEmail, ip },
            ipAddress: ip,
          });
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          await AuditService.log({
            action: 'FAILED_LOGIN_INVALID_PASSWORD',
            entity: 'User',
            entityId: user.id,
            details: { email: user.email, ip },
            ipAddress: ip,
          });
          return null;
        }


        resetRateLimit(rateLimitKey);


        await AuditService.log({
          userId: user.id,
          action: 'SUCCESSFUL_LOGIN',
          entity: 'User',
          entityId: user.id,
          details: { email: user.email, role: user.role, ip },
          ipAddress: ip,
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  secret: getNextAuthSecret(),
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      const now = Date.now();

      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
        token.lastActivity = now;
      }

      if (trigger === 'update' && session?.lastActivity) {
        token.lastActivity = session.lastActivity;
      }

      const role = token.role as string | undefined;
      if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
        const lastActivity = (token.lastActivity as number) || now;
        if (now - lastActivity > INACTIVITY_TIMEOUT_MS) {

          return {};
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (!token || !token.id || !token.role) {
        return null as any;
      }

      if (session.user) {
        (session.user as { id?: string; role?: string; lastActivity?: number }).id = token.id as string;
        (session.user as { id?: string; role?: string; lastActivity?: number }).role = token.role as string;
        (session.user as { id?: string; role?: string; lastActivity?: number }).lastActivity = (token.lastActivity as number) || Date.now();
      }

      return session;
    },
  },
  events: {
    async signOut({ token }) {
      if (token?.id) {
        await AuditService.log({
          userId: token.id as string,
          action: 'SUCCESSFUL_LOGOUT',
          entity: 'User',
          entityId: token.id as string,
        });
      }
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
};