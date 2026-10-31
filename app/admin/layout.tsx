import React from 'react';
import { ToastProvider } from '@/components/admin/Toast';

export const metadata = {
  title: "Admin Panel | CRE8TIVECOVE",
  description: "CRE8TIVECOVE CMS Administration Panel",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ToastProvider>{children}</ToastProvider>;
}