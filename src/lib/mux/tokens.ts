import Mux from "@mux/mux-node";

let signingMux: Mux | null = null;

function getSigningClient() {
  if (signingMux) return signingMux;

  signingMux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
    jwtSigningKey: process.env.MUX_SIGNING_KEY_ID!,
    jwtPrivateKey: process.env.MUX_SIGNING_PRIVATE_KEY!,
  });

  return signingMux;
}

export async function generatePlaybackToken(
  playbackId: string,
  userId: string
) {
  const mux = getSigningClient();
  return await mux.jwt.signPlaybackId(playbackId, {
    expiration: "4h",
    params: { viewer_id: userId },
  });
}

// Signed token for a still image of the video (image.mux.com/<id>/thumbnail.jpg).
// With signed playback, image parameters must be inside the token, not the URL.
export async function generateThumbnailToken(
  playbackId: string,
  width = 320
) {
  const mux = getSigningClient();
  return await mux.jwt.signPlaybackId(playbackId, {
    type: "thumbnail",
    expiration: "12h",
    params: { width: String(width) },
  });
}
