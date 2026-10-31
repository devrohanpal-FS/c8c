import { prisma } from '@/lib/db';
import { AuditService } from '@/lib/audit';
import { hashPassword, validatePasswordStrength } from '@/lib/security';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'VIEWER';

export class UserService {
  static async getAllUsers() {
    return await prisma.user.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createUser(
    data: { name: string; email: string; password: string; role: UserRole },
    actorId: string
  ) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase().trim() },
    });

    if (existing) {
      throw new Error('User with this email address already exists.');
    }

    const hashedPassword = await hashPassword(data.password);
    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase().trim(),
        password: hashedPassword,
        role: data.role,
      },
    });

    await AuditService.log({
      userId: actorId,
      action: 'USER_CREATED',
      entity: 'User',
      entityId: newUser.id,
      details: { email: newUser.email, role: newUser.role },
    });

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };
  }

  static async updateUserRole(targetUserId: string, newRole: UserRole, actorId: string) {
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      throw new Error('User not found.');
    }


    if (targetUser.role === 'SUPER_ADMIN' && newRole !== 'SUPER_ADMIN') {
      const superAdminCount = await prisma.user.count({
        where: { role: 'SUPER_ADMIN', deletedAt: null },
      });

      if (superAdminCount <= 1) {
        throw new Error('Security Error: Cannot demote the last remaining SUPER_ADMIN user.');
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
    });

    await AuditService.log({
      userId: actorId,
      action: 'USER_ROLE_UPDATED',
      entity: 'User',
      entityId: updatedUser.id,
      details: { email: updatedUser.email, oldRole: targetUser.role, newRole },
    });

    return updatedUser;
  }

  static async deactivateUser(targetUserId: string, actorId: string) {
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      throw new Error('User not found.');
    }


    if (targetUser.role === 'SUPER_ADMIN') {
      const superAdminCount = await prisma.user.count({
        where: { role: 'SUPER_ADMIN', deletedAt: null },
      });

      if (superAdminCount <= 1) {
        throw new Error('Security Error: Cannot deactivate the last remaining SUPER_ADMIN user.');
      }
    }

    const deactivatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { deletedAt: new Date() },
    });

    await AuditService.log({
      userId: actorId,
      action: 'USER_DEACTIVATED',
      entity: 'User',
      entityId: deactivatedUser.id,
      details: { email: deactivatedUser.email },
    });

    return deactivatedUser;
  }

  static async resetUserPassword(targetUserId: string, newPassword: string, actorId: string) {
    validatePasswordStrength(newPassword);

    const hashedPassword = await hashPassword(newPassword);
    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { password: hashedPassword },
    });

    await AuditService.log({
      userId: actorId,
      action: 'USER_PASSWORD_RESET',
      entity: 'User',
      entityId: updatedUser.id,
      details: { email: updatedUser.email },
    });

    return { id: updatedUser.id, email: updatedUser.email };
  }
}