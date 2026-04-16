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
