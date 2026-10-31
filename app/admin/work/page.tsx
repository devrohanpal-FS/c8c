import { Metadata } from 'next';
import AdminWorkClient from './AdminWorkClient';

export const metadata: Metadata = {
  title: 'Work Index Management | CRE8TIVECOVE CMS',
  description: 'Manage agency portfolio works, video previews, and case study content.',
};

export default function AdminWorkPage() {
  return <AdminWorkClient />;
}