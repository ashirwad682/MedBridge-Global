import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie, getCurrentUser } from "@/lib/auth/session";
import { logAuditEvent } from "@/lib/auth/audit";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const ip = req.headers.get("x-forwarded-for") || "local";
    const userAgent = req.headers.get("user-agent") || "";

    if (user) {
      await logAuditEvent({
        userId: user.id,
        action: "LOGOUT",
        resource: "User",
        status: "SUCCESS",
        ipAddress: ip,
        userAgent,
      });
    }

    await clearSessionCookie();

    return NextResponse.json({
      success: true,
      message: "Successfully signed out.",
    });
  } catch (error) {
    console.error("[Logout API] Error:", error);
    await clearSessionCookie();
    return NextResponse.json({ success: true });
  }
}
