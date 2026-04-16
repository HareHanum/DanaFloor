import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getMuxClient } from "@/lib/mux/client";

export async function POST(request: Request) {
  const body = await request.text();

  // Verify Mux webhook signature
  const signature = request.headers.get("mux-signature");
  if (!signature || !process.env.MUX_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 401 });
  }

  // Mux webhook verification
  try {
    const mux = getMuxClient();
    mux.webhooks.verifySignature(
      body,
      {
        "mux-signature": signature,
      },
      process.env.MUX_WEBHOOK_SECRET
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body);
  const supabase = createAdminClient();

  switch (event.type) {
    case "video.asset.ready": {
      const asset = event.data;
      const playbackId = asset.playback_ids?.[0]?.id;
      const assetId = asset.id;
      const duration = Math.round(asset.duration ?? 0);
      const uploadId = asset.upload_id;

      if (playbackId && uploadId) {
        // Find the lesson by mux_asset_id (which we set to upload_id during upload)
        const { data: lesson } = await supabase
          .from("lessons")
          .select("id")
          .eq("mux_asset_id", uploadId)
          .single();

        if (lesson) {
          await supabase
            .from("lessons")
            .update({
              mux_playback_id: playbackId,
              mux_asset_id: assetId,
              duration_seconds: duration,
            })
            .eq("id", lesson.id);

          console.log(
            `Mux asset ready: lesson=${lesson.id}, playbackId=${playbackId}`
          );
        }
      }
      break;
    }

    case "video.asset.errored": {
      console.error("Mux asset error:", event.data);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
