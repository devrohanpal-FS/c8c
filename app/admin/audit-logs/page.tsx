import AdminAuditLogsClient from "./AdminAuditLogsClient";

export const metadata = {
  title: "Audit Logs | CRE8TIVECOVE Admin",
  description: "View system action audit logs and security event history.",
};

export default function AdminAuditLogsPage() {
  return <AdminAuditLogsClient />;
}