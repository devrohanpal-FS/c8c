import { NextRequest, NextResponse } from "next/server";
import { requireAuthUser } from "@/lib/auth";
import { canManageSettings } from "@/lib/permissions";
import { getAuditLogsService } from "@/lib/services";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {

  try {
    const user = await requireAuthUser();

    if (!canManageSettings(user.role)) {
      return NextResponse.json({ error: "Forbidden: Super Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "15", 10);
    const search = searchParams.get("search") || undefined;
    const action = searchParams.get("action") || undefined;
    const status = searchParams.get("status") || undefined;

    const result = await getAuditLogsService({
      page,
      limit,
      search,
      action,
      status,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("GET /api/admin/audit-logs error:", error);
    const isAuth = error?.message === "Unauthorized";
    return NextResponse.json(
      { error: isAuth ? "Unauthorized" : "Failed to fetch audit logs" },
      { status: isAuth ? 401 : 500 }
    );
  }
}