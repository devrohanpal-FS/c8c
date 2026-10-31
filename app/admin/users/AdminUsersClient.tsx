'use client';

import React, { useEffect, useState } from 'react';
import { Users, Plus, ShieldCheck, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { DataTable, Column } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { FormField } from '@/components/admin/FormField';
import { SelectField } from '@/components/admin/SelectField';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { useToast } from '@/components/admin/Toast';

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersClient() {
  const { addToast } = useToast();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);


  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deactivatingUserId, setDeactivatingUserId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);


  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'EDITOR' | 'VIEWER'>('ADMIN');

  const fetchUsers = () => {
    setLoading(true);
    fetch('/api/admin/users')
      .then((res) => res.json())
      .then((data) => {
        if (data.users) setUsers(data.users);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (res.ok) {
        addToast('success', 'User Created', `Account created for ${email}.`);
        setIsCreateOpen(false);
        setName('');
        setEmail('');
        setPassword('');
        fetchUsers();
      } else {
        addToast('error', 'User Creation Failed', data.error || 'Could not create user.');
      }
    } catch {
      addToast('error', 'Error', 'Failed to submit request.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async () => {
    if (!deactivatingUserId) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/users/${deactivatingUserId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        addToast('success', 'User Deactivated', 'Account has been deactivated.');
        setDeactivatingUserId(null);
        fetchUsers();
      } else {
        addToast('error', 'Deactivation Denied', data.error || 'Could not deactivate user.');
      }
    } catch {
      addToast('error', 'Error', 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const columns: Column<UserItem>[] = [
    {
      key: 'name',
      header: 'Name & Email',
      render: (u) => (
        <div className="flex flex-col text-left">
          <span className="font-sans font-bold text-white text-xs">{u.name}</span>
          <span className="font-mono text-[11px] text-gray-400">{u.email}</span>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'System Role',
      render: (u) => <StatusBadge status={u.role} size="sm" />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (u) => (
        <button
          onClick={() => setDeactivatingUserId(u.id)}
          className="p-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          title="Deactivate Admin Account"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];

  return (
    <AdminLayout pageTitle="User Management">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h2 className="font-condensed text-3xl font-bold uppercase text-white tracking-wide flex items-center gap-2">
            <Users className="w-6 h-6 text-[#ffd700]" />
            <span>Admin Users & Access Control</span>
          </h2>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#ffd700] text-[#0a0a0a] font-sans font-bold text-xs uppercase tracking-widest hover:bg-white transition-all shadow-lg hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Create New User</span>
          </button>
        </div>

        <DataTable
          columns={columns}
          data={users}
          isLoading={loading}
          keyExtractor={(item) => item.id}
        />

        {}
        {isCreateOpen && (
          <div className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-[#121212] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-left">
              <h3 className="font-condensed text-3xl font-bold uppercase text-white tracking-wide mb-6">
                Create Admin User
              </h3>

              <form onSubmit={handleCreateUser} className="flex flex-col gap-5">
                <FormField label="FULL NAME" required>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full bg-[#181818] text-white px-4 py-3 rounded-2xl font-sans text-xs outline-none border border-white/15 focus:border-[#ffd700]"
                  />
                </FormField>

                <FormField label="EMAIL ADDRESS" required>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@cre8tivecove.com"
                    className="w-full bg-[#181818] text-white px-4 py-3 rounded-2xl font-sans text-xs outline-none border border-white/15 focus:border-[#ffd700]"
                  />
                </FormField>

                <FormField label="PASSWORD" required>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#181818] text-white px-4 py-3 rounded-2xl font-sans text-xs outline-none border border-white/15 focus:border-[#ffd700]"
                  />
                </FormField>

                <SelectField
                  label="ASSIGN ROLE"
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'ADMIN' | 'EDITOR' | 'VIEWER')}
                  options={[
                    { label: 'ADMIN (Content + Inquiries)', value: 'ADMIN' },
                    { label: 'EDITOR (Content Only)', value: 'EDITOR' },
                    { label: 'VIEWER (Read Only)', value: 'VIEWER' },
                  ]}
                />

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="px-5 py-2.5 rounded-full border border-white/20 text-gray-300 font-sans text-xs font-bold uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-full bg-[#ffd700] text-[#0a0a0a] font-sans text-xs font-bold uppercase tracking-wider hover:bg-white"
                  >
                    {submitting ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ConfirmDialog
          isOpen={Boolean(deactivatingUserId)}
          title="Deactivate Admin Account"
          message="Are you sure you want to deactivate this account? Deactivated users will immediately lose CMS access."
          confirmLabel="Deactivate Account"
          onConfirm={handleDeactivate}
          onCancel={() => setDeactivatingUserId(null)}
          isLoading={submitting}
        />
      </div>
    </AdminLayout>
  );
}