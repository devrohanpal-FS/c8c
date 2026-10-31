export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'VIEWER';

const ROLE_RANK: Record<UserRole, number> = {
  SUPER_ADMIN: 4,
  ADMIN: 3,
  EDITOR: 2,
  VIEWER: 1,
};

export function hasPermission(userRole: string | undefined | null, requiredRole: UserRole): boolean {
  if (!userRole) return false;
  const currentRank = ROLE_RANK[userRole as UserRole] || 0;
  const requiredRank = ROLE_RANK[requiredRole] || 99;
  return currentRank >= requiredRank;
}

export function canViewAdmin(userRole: string | undefined | null): boolean {
  return hasPermission(userRole, 'VIEWER');
}

export function canManageContent(userRole: string | undefined | null): boolean {
  return hasPermission(userRole, 'EDITOR');
}

export function canManageUsers(userRole: string | undefined | null): boolean {
  return hasPermission(userRole, 'ADMIN');
}

export function canViewAuditLogs(userRole: string | undefined | null): boolean {
  return hasPermission(userRole, 'ADMIN');
}

export function canManageSettings(userRole: string | undefined | null): boolean {
  return hasPermission(userRole, 'SUPER_ADMIN');
}
