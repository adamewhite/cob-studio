"use server";

import "server-only";
import { headers } from "next/headers";
import { getResend, NEWSLETTER_FROM_EMAIL } from "./resend";
import { absoluteUrl } from "./site";

export type SubscribeResult =
  | { ok: true }
  | { ok: false; error: string };

export type ConfirmResult =
  | { ok: true }
  | { ok: false; error: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Signup is double opt-in: a new contact is created outside the newsletter
// segment and only joins it after clicking the link in the confirmation
// email. The link carries the Resend contact ID, a random UUID, so no
// separate token or secret is needed.

// A pending (unconfirmed) address gets at most one confirmation email per
// window, so the form can't be used to flood someone's inbox.
const CONFIRMATION_COOLDOWN_MS = 10 * 60 * 1000;

// Best-effort per-IP limit. In-memory, so it resets per server instance; the
// per-address cooldown above is the guard that actually holds.
const IP_WINDOW_MS = 10 * 60 * 1000;
const IP_MAX_ATTEMPTS = 5;
const ipAttempts = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (ipAttempts.get(ip) ?? []).filter(
    (t) => now - t < IP_WINDOW_MS,
  );
  recent.push(now);
  ipAttempts.set(ip, recent);
  if (ipAttempts.size > 5000) {
    const oldest = ipAttempts.keys().next().value;
    if (oldest) ipAttempts.delete(oldest);
  }
  return recent.length > IP_MAX_ATTEMPTS;
}

async function clientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}

async function segmentIdsFor(contactId: string): Promise<string[] | null> {
  const result = await getResend().contacts.segments.list({ contactId });
  if (result.error) return null;
  return result.data.data.map((s) => s.id);
}

async function sendConfirmation(email: string, contactId: string) {
  const link = absoluteUrl(
    `/newsletter/confirm?id=${encodeURIComponent(contactId)}`,
  );
  return getResend().emails.send({
    from: NEWSLETTER_FROM_EMAIL,
    to: email,
    subject: "Confirm your Congress of Beauty signup",
    text: `Thanks for signing up for news from Congress of Beauty.

Confirm your email to start hearing about new work:
${link}

If you didn't sign up, you can ignore this email and you won't hear from us.`,
  });
}

async function sendWelcome(email: string) {
  return getResend().emails.send({
    from: NEWSLETTER_FROM_EMAIL,
    to: email,
    subject: "You're on the Congress of Beauty list",
    text: `Thanks for confirming — you're on the list.

You'll hear from us when new paintings, drawings, and sculpture are ready. In the meantime, the studio is open:
${absoluteUrl("/artwork")}

Every newsletter includes a link to unsubscribe at any time.`,
  });
}

const GENERIC_ERROR = "Sign up failed. Please try again in a moment.";

export async function subscribeToNewsletter(
  email: string,
  honeypot = "",
): Promise<SubscribeResult> {
  // Bots fill in every field; people never see this one. Pretend it worked.
  if (honeypot) return { ok: true };

  const trimmed = email.trim();
  if (!trimmed) {
    return { ok: false, error: "Please enter your email." };
  }
  if (!EMAIL_PATTERN.test(trimmed)) {
    return { ok: false, error: "That doesn't look like an email." };
  }

  const segmentId = process.env.RESEND_SEGMENT_ID;
  if (!segmentId) {
    return { ok: false, error: "Newsletter is temporarily unavailable." };
  }

  if (isRateLimited(await clientIp())) {
    return {
      ok: false,
      error: "Too many attempts. Please try again in a few minutes.",
    };
  }

  const resend = getResend();
  const existing = await resend.contacts.get({ email: trimmed });
  if (existing.error && existing.error.name !== "not_found") {
    console.error("Newsletter contact lookup failed", existing.error);
    return { ok: false, error: GENERIC_ERROR };
  }

  if (existing.data) {
    const contact = existing.data;
    const segments = await segmentIdsFor(contact.id);
    if (segments === null) return { ok: false, error: GENERIC_ERROR };

    // Already confirmed: nothing to send.
    if (segments.includes(segmentId) && !contact.unsubscribed) {
      return { ok: true };
    }

    const age = Date.now() - Date.parse(contact.created_at);
    if (age < CONFIRMATION_COOLDOWN_MS) return { ok: true };

    // Pending contacts that belong to no list are recreated so their
    // created_at restarts the cooldown; anyone on another list keeps their
    // record and simply gets a fresh link.
    if (segments.length === 0) {
      await resend.contacts.remove({ id: contact.id });
    } else {
      const sent = await sendConfirmation(trimmed, contact.id);
      if (sent.error) {
        console.error("Newsletter confirmation email failed", sent.error);
        return { ok: false, error: GENERIC_ERROR };
      }
      return { ok: true };
    }
  }

  const created = await resend.contacts.create({ email: trimmed });
  if (created.error || !created.data) {
    console.error("Newsletter contact create failed", created.error);
    return { ok: false, error: GENERIC_ERROR };
  }

  const sent = await sendConfirmation(trimmed, created.data.id);
  if (sent.error) {
    console.error("Newsletter confirmation email failed", sent.error);
    return { ok: false, error: GENERIC_ERROR };
  }
  return { ok: true };
}

export async function confirmSubscription(
  contactId: string,
): Promise<ConfirmResult> {
  const invalid = {
    ok: false as const,
    error:
      "This confirmation link isn't valid anymore. Please sign up again from the footer.",
  };
  if (!contactId) return invalid;

  const segmentId = process.env.RESEND_SEGMENT_ID;
  if (!segmentId) {
    return { ok: false, error: "Newsletter is temporarily unavailable." };
  }

  const resend = getResend();
  const contact = await resend.contacts.get({ id: contactId });
  if (contact.error) {
    if (contact.error.name === "not_found") return invalid;
    console.error("Newsletter confirm lookup failed", contact.error);
    return { ok: false, error: GENERIC_ERROR };
  }

  const segments = await segmentIdsFor(contactId);
  if (segments === null) return { ok: false, error: GENERIC_ERROR };
  const alreadyConfirmed =
    segments.includes(segmentId) && !contact.data.unsubscribed;
  if (alreadyConfirmed) return { ok: true };

  if (contact.data.unsubscribed) {
    const updated = await resend.contacts.update({
      id: contactId,
      unsubscribed: false,
    });
    if (updated.error) {
      console.error("Newsletter resubscribe failed", updated.error);
      return { ok: false, error: GENERIC_ERROR };
    }
  }

  if (!segments.includes(segmentId)) {
    const added = await resend.contacts.segments.add({ contactId, segmentId });
    if (added.error) {
      console.error("Newsletter segment add failed", added.error);
      return { ok: false, error: GENERIC_ERROR };
    }
  }

  const welcome = await sendWelcome(contact.data.email);
  if (welcome.error) {
    // They're subscribed either way; a missing welcome isn't worth an error.
    console.error("Newsletter welcome email failed", welcome.error);
  }
  return { ok: true };
}
