import AdminSettingsClient from "./AdminSettingsClient";

export const metadata = {
  title: "Site Settings | CRE8TIVECOVE Admin",
  description: "Configure global contact details, social channels, and default SEO.",
};

export default function AdminSettingsPage() {
  return <AdminSettingsClient />;
}