import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  canManageUsers,
  canViewAuditLogs,
  canManageSettings,
  canManageContent,
  canViewAdmin,
  hasPermission,
} from '../lib/permissions/index';
import { userCreateSchema } from '../lib/validation/index';

describe('Bucket 4: Data Integrity, Access Control & RBAC Suite', () => {
  describe('RBAC Permission Hierarchy & Contract Alignment', () => {
    it('allows SUPER_ADMIN and ADMIN to manage users, blocking EDITOR and VIEWER', () => {
      assert.strictEqual(canManageUsers('SUPER_ADMIN'), true);
      assert.strictEqual(canManageUsers('ADMIN'), true);
      assert.strictEqual(canManageUsers('EDITOR'), false);
      assert.strictEqual(canManageUsers('VIEWER'), false);
      assert.strictEqual(canManageUsers(undefined), false);
      assert.strictEqual(canManageUsers(null), false);
    });

    it('allows SUPER_ADMIN and ADMIN to view audit logs, blocking EDITOR and VIEWER', () => {
      assert.strictEqual(canViewAuditLogs('SUPER_ADMIN'), true);
      assert.strictEqual(canViewAuditLogs('ADMIN'), true);
      assert.strictEqual(canViewAuditLogs('EDITOR'), false);
      assert.strictEqual(canViewAuditLogs('VIEWER'), false);
      assert.strictEqual(canViewAuditLogs('ANONYMOUS'), false);
    });

    it('strictly restricts system settings to SUPER_ADMIN only', () => {
      assert.strictEqual(canManageSettings('SUPER_ADMIN'), true);
      assert.strictEqual(canManageSettings('ADMIN'), false);
      assert.strictEqual(canManageSettings('EDITOR'), false);
      assert.strictEqual(canManageSettings('VIEWER'), false);
    });

    it('enforces content management permissions correctly across tiers', () => {
      assert.strictEqual(canManageContent('SUPER_ADMIN'), true);
      assert.strictEqual(canManageContent('ADMIN'), true);
      assert.strictEqual(canManageContent('EDITOR'), true);
      assert.strictEqual(canManageContent('VIEWER'), false);
    });

    it('allows all authenticated roles to view admin portal', () => {
      assert.strictEqual(canViewAdmin('SUPER_ADMIN'), true);
      assert.strictEqual(canViewAdmin('ADMIN'), true);
      assert.strictEqual(canViewAdmin('EDITOR'), true);
      assert.strictEqual(canViewAdmin('VIEWER'), true);
      assert.strictEqual(canViewAdmin(null), false);
    });
  });

  describe('Principle of Least Privilege User Validation', () => {
    it('defaults user creation role to VIEWER when role is omitted', () => {
      const payload = {
        name: 'Regular Viewer',
        email: 'viewer@cre8tivecove.com',
        password: 'Password1234!',
      };

      const result = userCreateSchema.safeParse(payload);
      assert.strictEqual(result.success, true);
      if (result.success) {
        assert.strictEqual(result.data.role, 'VIEWER');
      }
    });

    it('allows explicit role assignment for privileged roles', () => {
      const payload = {
        name: 'New Administrator',
        email: 'admin@cre8tivecove.com',
        password: 'AdminPassword1234!',
        role: 'ADMIN',
      };

      const result = userCreateSchema.safeParse(payload);
      assert.strictEqual(result.success, true);
      if (result.success) {
        assert.strictEqual(result.data.role, 'ADMIN');
      }
    });

    it('rejects invalid or arbitrary role strings', () => {
      const payload = {
        name: 'Hacker User',
        email: 'attacker@evil.com',
        password: 'AttackPassword1234!',
        role: 'ROOT_SUPERUSER',
      };

      const result = userCreateSchema.safeParse(payload);
      assert.strictEqual(result.success, false);
    });
  });
});
