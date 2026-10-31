import { Metadata } from 'next';
import DashboardClient from './DashboardClient';

export const metadata: Metadata = {
  title: 'CMS Dashboard | CRE8TIVECOVE',
  description: 'Enterprise CMS Dashboard Hub for Cre8tiveCove Agency Management.',
};

export default function DashboardPage() {
  return <DashboardClient />;
}