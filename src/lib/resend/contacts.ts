import type { Resend } from "resend";

// Resend moved to a global Contacts model (Nov 2025): Audiences became
// Segments, and the /audiences/{id}/contacts endpoints are deprecated.
// Contacts are now created once per email and attached to segments.
//
// The SDK never throws on API errors — it returns { data, error }. Always
// check `error`, otherwise failures are silently reported as success.

/**
 * Segment that marketing-consent contacts are added to. The old Audience ID
 * is the same object (now called a Segment), so RESEND_AUDIENCE_ID still works
 * as a fallback until the env var is renamed.
 */
export function getMarketingSegmentId(): string | undefined {
  return process.env.RESEND_SEGMENT_ID || process.env.RESEND_AUDIENCE_ID || undefined;
}

/**
 * Adds (or re-subscribes) a contact who gave marketing consent and puts them
 * in the marketing segment. Returns true on success. Never throws.
 */
export async function addMarketingContact(
  resend: Resend,
  { email, firstName }: { email: string; firstName?: string }
): Promise<boolean> {
  const segmentId = getMarketingSegmentId();

  try {
    const created = await resend.contacts.create({
      email,
      firstName: firstName || undefined,
      unsubscribed: false,
      ...(segmentId ? { segments: [{ id: segmentId }] } : {}),
    });

    if (!created.error) {
      console.log("Contact added to Resend:", email);
      return true;
    }

    // Most likely the contact already exists (contacts are global now, e.g.
    // they signed up through another form). They just gave consent again, so
    // mark them subscribed and make sure they are in the segment.
    const updated = await resend.contacts.update({ email, unsubscribed: false });
    if (updated.error) {
      console.error("Failed to add contact to Resend:", {
        email,
        createError: created.error,
        updateError: updated.error,
      });
      return false;
    }

    if (segmentId) {
      const added = await resend.contacts.segments.add({ email, segmentId });
      // Adding a contact that is already in the segment may return an error;
      // log it for visibility but the contact itself is subscribed.
      if (added.error) {
        console.warn("Contact updated but segment add returned an error:", {
          email,
          error: added.error,
        });
      }
    }

    console.log("Existing Resend contact re-subscribed:", email);
    return true;
  } catch (e) {
    // Network-level failure (fetch threw).
    console.error("Failed to add contact to Resend:", email, e);
    return false;
  }
}

/**
 * Globally unsubscribes a contact from all broadcasts. Returns true on
 * success. Never throws.
 */
export async function unsubscribeContact(
  resend: Resend,
  email: string
): Promise<boolean> {
  try {
    const { error } = await resend.contacts.update({ email, unsubscribed: true });
    if (error) {
      console.error("Failed to unsubscribe contact:", { email, error });
      return false;
    }
    console.log("Contact unsubscribed:", email);
    return true;
  } catch (e) {
    console.error("Failed to unsubscribe contact:", email, e);
    return false;
  }
}
