import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET() {
  try {
    const user = await getCurrentUser();
    return NextResponse.json({
      success: true,
      user: user || null,
    });
  } catch (error) {
    console.error("[Session API] Error:", error);
    return NextResponse.json({
      success: true,
      user: null,
    });
  }
}
