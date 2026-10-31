import { Metadata } from 'next';
import AdminFeaturedWorkClient from './AdminFeaturedWorkClient';

export const metadata: Metadata = {
  title: 'Featured Work Management | CRE8TIVECOVE CMS',
  description: 'Upload, manage, and feature agency projects on the homepage.',
};

export default function FeaturedWorkPage() {
  return <AdminFeaturedWorkClient />;
}
