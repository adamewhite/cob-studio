import "server-only";
import { Resend } from "resend";

let client: Resend | null = null;

export function getResend(): Resend {
  if (client) return client;
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("RESEND_API_KEY is not set");
  }
  client = new Resend(key);
  return client;
}

export const SALE_FROM_EMAIL = "Congress of Beauty <sales@cob-studio.com>";

export function getSaleNotificationEmail(): string {
  const to = process.env.SALE_NOTIFICATION_EMAIL;
  if (!to) throw new Error("SALE_NOTIFICATION_EMAIL is not set");
  return to;
}
