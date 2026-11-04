import React from 'react';
import { ToastProvider } from '@/components/admin/Toast';
import SessionProviderWrapper from '@/components/SessionProviderWrapper';

export const metadata = {
  title: "Admin Panel | CRE8TIVECOVE",
  description: "CRE8TIVECOVE CMS Administration Panel",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProviderWrapper>
      <ToastProvider>{children}</ToastProvider>
    </SessionProviderWrapper>
  );
}