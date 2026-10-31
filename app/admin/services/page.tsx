import { Metadata } from 'next';
import AdminServicesClient from './AdminServicesClient';

export const metadata: Metadata = {
  title: 'Services Management | CRE8TIVECOVE CMS',
  description: 'Manage agency service capabilities, descriptions, and feature pricing.',
};

export default function AdminServicesPage() {
  return <AdminServicesClient />;
}