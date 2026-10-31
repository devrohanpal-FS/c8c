"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable, { Column } from "@/components/admin/DataTable";
import Search from "@/components/admin/Search";
import Filters from "@/components/admin/Filters";
import Pagination from "@/components/admin/Pagination";
import StatusBadge from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/Toast";
import { History, RefreshCw, Shield, Info } from "lucide-react";

interface AuditLog {
  id: string;
  userId: string | null;
  userEmail: string | null;
  userName: string | null;
  userRole: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  details: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  status: "SUCCESS" | "FAILED" | "DENIED";
  createdAt: string;
}

export default function AdminAuditLogsClient() {
  const { addToast } = useToast();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const fetchLogs = React.useCallback(async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        page: page.toString(),
        limit: "15",
        search,
        action: actionFilter,
        status: statusFilter,
      });

      const res = await fetch(`/api/admin/audit-logs?${query.toString()}`);
      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("Access denied. Super Admin role required.");
        }
        throw new Error("Failed to load audit logs");
      }
      const data = await res.json();
      setLogs(data.items || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.total || 0);
    } catch (err: any) {
      addToast(err.message || "Error fetching audit logs", "error");
    } finally {
      setLoading(false);
    }
  }, [page, search, actionFilter, statusFilter, addToast]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);


  const columns: Column<AuditLog>[] = [
    {
      key: "createdAt",
      header: "Timestamp",
      render: (log) => (
        <span className="font-mono text-xs text-slate-300">
          {new Date(log.createdAt).toLocaleString()}
        </span>
      ),
    },
    {
      key: "user",
      header: "User",
      render: (log) => (
        <div>
          <div className="font-medium text-white">{log.userName || log.userEmail || "System / Guest"}</div>
          {log.userRole && (
            <div className="text-xs text-amber-400 font-mono mt-0.5">{log.userRole}</div>
          )}
        </div>
      ),
    },
    {
      key: "action",
      header: "Action",
      render: (log) => (
        <span className="font-mono text-xs text-amber-300 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
          {log.action}
        </span>
      ),
    },
    {
      key: "entity",
      header: "Target Entity",
      render: (log) => (
        <div>
          <span className="text-xs text-slate-300 font-medium">{log.entityType}</span>
          {log.entityId && (
            <span className="block font-mono text-[10px] text-slate-500 truncate max-w-[120px]">
              ID: {log.entityId}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (log) => <StatusBadge status={log.status} />,
    },
    {
      key: "ipAddress",
      header: "IP Address",
      render: (log) => (
        <span className="font-mono text-xs text-slate-400">
          {log.ipAddress || "N/A"}
        </span>
      ),
    },
    {
      key: "details",
      header: "Details",
      render: (log) => (
        <button
          onClick={() => setSelectedLog(log)}
          className="text-xs text-amber-400 hover:text-amber-300 underline font-medium flex items-center gap-1"
        >
          <Info size={12} /> View Details
        </button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Shield className="text-amber-400" size={24} /> Audit Trail & System Logs
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Immutable record of all administrative actions, authentication attempts, and content mutations.
            </p>
          </div>
          <button
            onClick={fetchLogs}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg border border-slate-700 transition"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh Logs
          </button>
        </div>

        {}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <Search
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            placeholder="Search action, email, IP, entity..."
          />
          <div className="flex flex-wrap gap-2 items-center">
            <Filters
              options={[
                { label: "All Statuses", value: "ALL" },
                { label: "SUCCESS", value: "SUCCESS" },
                { label: "FAILED", value: "FAILED" },
                { label: "DENIED", value: "DENIED" },
              ]}
              activeValue={statusFilter}
              onChange={(val) => {
                setStatusFilter(val);
                setPage(1);
              }}
            />
          </div>
        </div>

        {}
        <DataTable
          columns={columns}
          data={logs}
          isLoading={loading}
          keyExtractor={(item) => item.id}
          emptyTitle="No Audit Logs Found"
          emptyDescription="Audit records will automatically populate as actions are performed across the CMS."
        />

        {}
        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={totalCount}
          />
        )}
      </div>

      {}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <History className="text-amber-400" size={18} /> Audit Log Record Detail
              </h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-white text-lg font-bold px-2"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto pr-1 text-sm text-slate-300">
              <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div>
                  <span className="text-xs text-slate-500 block">Log ID</span>
                  <span className="font-mono text-xs text-slate-300">{selectedLog.id}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Timestamp</span>
                  <span className="font-mono text-xs text-slate-300">{new Date(selectedLog.createdAt).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Actor Email</span>
                  <span className="text-xs font-semibold text-amber-300">{selectedLog.userEmail || "System"}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Role</span>
                  <span className="text-xs font-semibold text-amber-400">{selectedLog.userRole || "N/A"}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Action Performed</span>
                  <span className="font-mono text-xs text-emerald-400">{selectedLog.action}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Status</span>
                  <StatusBadge status={selectedLog.status} />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">IP Address</span>
                  <span className="font-mono text-xs text-slate-300">{selectedLog.ipAddress || "Unknown"}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Target Entity</span>
                  <span className="font-mono text-xs text-slate-300">{selectedLog.entityType} ({selectedLog.entityId || "N/A"})</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 font-medium block mb-1">User Agent Header:</span>
                <p className="font-mono text-xs bg-slate-950 p-2.5 rounded border border-slate-800 break-all text-slate-400">
                  {selectedLog.userAgent || "N/A"}
                </p>
              </div>

              <div>
                <span className="text-xs text-slate-400 font-medium block mb-1">Payload Details:</span>
                <pre className="font-mono text-xs bg-slate-950 p-3 rounded border border-slate-800 text-amber-200/80 overflow-x-auto whitespace-pre-wrap">
                  {(() => {
                    if (!selectedLog.details) return "No extra payload metadata recorded.";
                    try {
                      return JSON.stringify(JSON.parse(selectedLog.details), null, 2);
                    } catch {
                      return selectedLog.details;
                    }
                  })()}
                </pre>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-right">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}