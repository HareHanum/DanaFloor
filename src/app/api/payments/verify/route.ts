import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyPendingPaymentsForUser } from "@/lib/payplus/verify";
import { assertSameOrigin } from "@/lib/security/origin";
import { rateLimitOr429 } from "@/lib/security/rate-limit";

// Triggered by the client to recover a stuck purchase. Returns whether any
// pending payment was confirmed.
export async function POST(request: Request) {
  const originError = assertSameOrigin(request);
  if (originError) return originError;

  const rl = await rateLimitOr429(request, "payments-verify", 20, 60);
  if (rl) return rl;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let courseId: string | undefined;
  try {
    const body = await request.json();
    if (typeof body?.courseId === "string") courseId = body.courseId;
  } catch {
    // body is optional
  }

  const granted = await verifyPendingPaymentsForUser(
    createAdminClient(),
    user.id,
    courseId
  );

  return NextResponse.json({ granted });
}
