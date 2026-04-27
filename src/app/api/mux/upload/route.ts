import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getMuxClient } from "@/lib/mux/client";
import { assertSameOrigin } from "@/lib/security/origin";

export async function POST(request: Request) {
  const originError = assertSameOrigin(request);
  if (originError) return originError;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { lessonId } = await request.json();

  if (!lessonId) {
    return NextResponse.json(
      { error: "lessonId is required" },
      { status: 400 }
    );
  }

  // Fail closed if app URL isn't configured — would otherwise allow a wide
  // CORS origin in production.
  const corsOrigin = process.env.NEXT_PUBLIC_APP_URL;
  if (!corsOrigin) {
    return NextResponse.json(
      { error: "Server misconfiguration: NEXT_PUBLIC_APP_URL not set" },
      { status: 500 }
    );
  }

  const mux = getMuxClient();

  const upload = await mux.video.uploads.create({
    cors_origin: corsOrigin,
    new_asset_settings: {
      playback_policy: ["signed"],
      encoding_tier: "baseline",
    },
  });

  return NextResponse.json({
    uploadUrl: upload.url,
    uploadId: upload.id,
    lessonId,
  });
}
