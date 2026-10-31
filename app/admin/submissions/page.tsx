import { Metadata } from 'next';
import AdminSubmissionsClient from './AdminSubmissionsClient';

export const metadata: Metadata = {
  title: 'Lead Inquiries | CRE8TIVECOVE CMS',
  description: 'Manage inbound project lead submissions and client requests.',
};

export default function AdminSubmissionsPage() {
  return <AdminSubmissionsClient />;
}