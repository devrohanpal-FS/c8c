import { Metadata } from 'next';
import { Suspense } from 'react';
import AdminLoginClient from './AdminLoginClient';
import { LoadingState } from '@/components/admin/LoadingState';

export const metadata: Metadata = {
  title: 'Admin Sign In | CRE8TIVECOVE CMS',
  description: 'Secure CMS Authentication Portal for Cre8tiveCove Agency Management.',
};

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><LoadingState label="Loading Auth..." /></div>}>
      <AdminLoginClient />
    </Suspense>
  );
}