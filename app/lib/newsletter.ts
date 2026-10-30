"use server";

import "server-only";
import { headers } from "next/headers";
import { getResend } from "./resend";

export type SubscribeResult =
  | { ok: true }
  | { ok: false; error: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Best-effort per-IP limit. In-memory, so it resets per server instance.
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

  if (!existing.data) {
    const created = await resend.contacts.create({
      email: trimmed,
      segments: [{ id: segmentId }],
    });
    if (created.error) {
      console.error("Newsletter contact create failed", created.error);
      return { ok: false, error: GENERIC_ERROR };
    }
    return { ok: true };
  }

  // Already a contact: make sure they're subscribed and in the segment.
  const contactId = existing.data.id;
  if (existing.data.unsubscribed) {
    const updated = await resend.contacts.update({
      id: contactId,
      unsubscribed: false,
    });
    if (updated.error) {
      console.error("Newsletter resubscribe failed", updated.error);
      return { ok: false, error: GENERIC_ERROR };
    }
  }

  const segments = await resend.contacts.segments.list({ contactId });
  if (segments.error) {
    console.error("Newsletter segment lookup failed", segments.error);
    return { ok: false, error: GENERIC_ERROR };
  }
  if (!segments.data.data.some((s) => s.id === segmentId)) {
    const added = await resend.contacts.segments.add({ contactId, segmentId });
    if (added.error) {
      console.error("Newsletter segment add failed", added.error);
      return { ok: false, error: GENERIC_ERROR };
    }
  }

  return { ok: true };
}
