import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getMuxClient } from "@/lib/mux/client";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify admin
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

  const mux = getMuxClient();

  // Create a direct upload URL
  const upload = await mux.video.uploads.create({
    cors_origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
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
