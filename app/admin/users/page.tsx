import AdminUsersClient from "./AdminUsersClient";

export const metadata = {
  title: "User Management | CRE8TIVECOVE Admin",
  description: "Manage admin users, roles, and access permissions.",
};

export default function AdminUsersPage() {
  return <AdminUsersClient />;
}