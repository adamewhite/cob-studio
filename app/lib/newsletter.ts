"use server";

import "server-only";
import { getResend } from "./resend";

export type SubscribeResult =
  | { ok: true }
  | { ok: false; error: string };

export async function subscribeToNewsletter(
  email: string,
): Promise<SubscribeResult> {
  const trimmed = email.trim();
  if (!trimmed) {
    return { ok: false, error: "Please enter your email." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { ok: false, error: "That doesn't look like an email." };
  }

  const segmentId = process.env.RESEND_SEGMENT_ID;
  if (!segmentId) {
    return { ok: false, error: "Newsletter is temporarily unavailable." };
  }

  const result = await getResend().contacts.create({
    email: trimmed,
    segments: [{ id: segmentId }],
  });

  if (result.error) {
    if (result.error.name === "validation_error") {
      return { ok: true };
    }
    return {
      ok: false,
      error: "Sign up failed. Please try again in a moment.",
    };
  }

  return { ok: true };
}
