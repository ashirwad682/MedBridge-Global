import { NextResponse } from "next/server";
import { getCurrentUser, AuthenticatedUser } from "./session";

export type RoleRequirement = "patient" | "doctor" | "any";

export interface AuthorizedContext {
  user: AuthenticatedUser;
}

export async function authorizeRequest(
  requiredRole: RoleRequirement = "any"
): Promise<{ user: AuthenticatedUser } | NextResponse> {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        error: "Authentication required. Please sign in to access this resource.",
      },
      { status: 401 }
    );
  }

  if (!user.isActive) {
    return NextResponse.json(
      {
        success: false,
        error: "Your account is currently inactive. Please contact patient support.",
      },
      { status: 403 }
    );
  }

  if (requiredRole !== "any" && user.role !== requiredRole) {
    return NextResponse.json(
      {
        success: false,
        error: `Access denied. This endpoint is restricted to ${requiredRole} accounts only.`,
      },
      { status: 403 }
    );
  }

  return { user };
}

export function isAuthorizedResponse(
  result: { user: AuthenticatedUser } | NextResponse
): result is { user: AuthenticatedUser } {
  return "user" in result;
}

