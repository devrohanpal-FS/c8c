import AdminWorkClient from "../AdminWorkClient";

export const metadata = {
  title: "New Project | CRE8TIVECOVE Admin",
  description: "Create a new portfolio work item.",
};

export default function AdminWorkNewPage() {
  return <AdminWorkClient autoOpenNew={true} />;
}