import AdminWorkClient from "../AdminWorkClient";

export const metadata = {
  title: "Edit Project | CRE8TIVECOVE Admin",
  description: "Edit existing portfolio work item.",
};

interface AdminWorkEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminWorkEditPage({ params }: AdminWorkEditPageProps) {
  const { id } = await params;
  return <AdminWorkClient editId={id} />;
}