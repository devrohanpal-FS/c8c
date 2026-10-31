import AdminWorkClient from "../AdminWorkClient";

export const metadata = {
  title: "Edit Project | CRE8TIVECOVE Admin",
  description: "Edit existing portfolio work item.",
};

export default function AdminWorkEditPage({ params }: { params: { id: string } }) {
  return <AdminWorkClient editId={params.id} />;
}