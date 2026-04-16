import crypto from "crypto";

export function verifyPayPlusSignature(
  body: string,
  secretKey: string,
  receivedSignature: string
): boolean {
  const computed = crypto
    .createHmac("sha256", secretKey)
    .update(body)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(computed),
    Buffer.from(receivedSignature)
  );
}
