import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getMuxClient } from "@/lib/mux/client";
import { assertSameOrigin } from "@/lib/security/origin";

/**
 * Creates a Mux direct-upload URL for a course testimonial video.
 *
 * Unlike lesson videos (signed playback), testimonials are public marketing
 * content shown on the sales page to logged-out visitors, so the asset uses a
 * PUBLIC playback policy. The client stores the returned uploadId on the
 * testimonial row; the Mux webhook then fills in mux_playback_id.
 */
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

  const { testimonialId } = await request.json();
  if (!testimonialId) {
    return NextResponse.json(
      { error: "testimonialId is required" },
      { status: 400 }
    );
  }

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
      playback_policy: ["public"],
      encoding_tier: "baseline",
    },
  });

  // Record the upload id so the webhook can match the finished asset back to
  // this testimonial. Any previous playback id is kept, so a replaced video
  // stays playable until the new one finishes processing.
  const { data: updated, error } = await supabase
    .from("course_testimonials")
    .update({ mux_upload_id: upload.id })
    .eq("id", testimonialId)
    .select("id");

  if (error || !updated?.length) {
    return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
  }

  return NextResponse.json({ uploadUrl: upload.url, uploadId: upload.id });
}
