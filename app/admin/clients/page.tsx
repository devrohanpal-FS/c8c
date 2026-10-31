import { Metadata } from 'next';
import AdminClientsClient from './AdminClientsClient';

export const metadata: Metadata = {
  title: 'Client Roster | CRE8TIVECOVE CMS',
  description: 'Manage agency partner client logos, roster, and featured brand relationships.',
};

export default function AdminClientsPage() {
  return <AdminClientsClient />;
}