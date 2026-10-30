import { absoluteUrl, SITE_ORIGIN } from "./site";

// Customer order confirmation, sent from the Stripe webhook. Email clients
// ignore <style> blocks and web fonts unevenly, so this sticks to tables,
// inline styles, and system font stacks, with a plain-text twin.

export type OrderEmailItem = {
  name: string;
  price: string;
  // Absolute URL of a web-friendly photo (the grid thumbnail), if any.
  imageUrl?: string;
};

export type OrderEmailInput = {
  firstName?: string;
  items: OrderEmailItem[];
  total: string;
  shipTo: string[];
};

const INK = "#171717";
const MUTED = "#6b6b6b";
const PINE = "rgb(42, 65, 42)";
const PAPER = "#f7f6f2";
const RULE = "#e7e5e4";
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function orderConfirmationText({
  firstName,
  items,
  total,
  shipTo,
}: OrderEmailInput): string {
  const lines = items.map((i) => `  • ${i.name} — ${i.price}`).join("\n");
  return `${firstName ? `Hi ${firstName},` : "Hi,"}

Thank you for your order from Congress of Beauty.

${lines}

Total: ${total}

It ships within a week to:
${shipTo.join("\n")}

If anything looks wrong, just reply to this email.

— Congress of Beauty
${SITE_ORIGIN}`;
}

export function orderConfirmationHtml({
  firstName,
  items,
  total,
  shipTo,
}: OrderEmailInput): string {
  const greeting = firstName ? `Hi ${escapeHtml(firstName)},` : "Hi,";
  const logoUrl = absoluteUrl("/images/email/logo-red.png");

  const itemRows = items
    .map(
      (i) => `
          <tr>
            <td style="padding: 0 0 28px; text-align: center;">
              ${
                i.imageUrl
                  ? `<img src="${escapeHtml(i.imageUrl)}" width="280" alt="${escapeHtml(i.name)}" style="display: block; margin: 0 auto 14px; width: 280px; max-width: 100%; height: auto; border: 0;">`
                  : ""
              }
              <div style="font-family: ${SERIF}; font-size: 18px; color: ${INK};">${escapeHtml(i.name)}</div>
              <div style="font-family: ${SANS}; font-size: 15px; color: ${MUTED}; padding-top: 4px;">${escapeHtml(i.price)}</div>
            </td>
          </tr>`,
    )
    .join("");

  const address = shipTo.map(escapeHtml).join("<br>");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Your Congress of Beauty order</title>
</head>
<body style="margin: 0; padding: 0; background: ${PAPER};">
  <div style="display: none; max-height: 0; overflow: hidden;">Thank you for your order — it ships within a week.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: ${PAPER};">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background: #ffffff;">
          <tr>
            <td align="center" style="padding: 40px 32px 8px;">
              <a href="${SITE_ORIGIN}"><img src="${logoUrl}" width="120" alt="Congress of Beauty" style="display: block; width: 120px; height: auto; border: 0;"></a>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px 8px; text-align: center;">
              <h1 style="margin: 0; font-family: ${SERIF}; font-size: 26px; font-weight: normal; color: ${INK};">Thank you for your order</h1>
              <p style="margin: 16px 0 0; font-family: ${SANS}; font-size: 15px; line-height: 1.6; color: ${MUTED};">${greeting} your piece is on its way soon. Here&rsquo;s what you bought.</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px 40px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${itemRows}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top: 1px solid ${RULE};">
                <tr>
                  <td style="padding: 16px 0; font-family: ${SANS}; font-size: 15px; color: ${INK};">Total</td>
                  <td style="padding: 16px 0; font-family: ${SANS}; font-size: 15px; color: ${INK}; text-align: right;">${escapeHtml(total)}</td>
                </tr>
                <tr>
                  <td style="padding: 0 0 16px; font-family: ${SANS}; font-size: 13px; color: ${MUTED};">Shipping</td>
                  <td style="padding: 0 0 16px; font-family: ${SANS}; font-size: 13px; color: ${MUTED}; text-align: right;">Free</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 40px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: ${PAPER};">
                <tr>
                  <td style="padding: 20px 24px;">
                    <div style="font-family: ${SERIF}; font-size: 17px; color: ${PINE};">Ships within a week</div>
                    <div style="padding-top: 8px; font-family: ${SANS}; font-size: 14px; line-height: 1.6; color: ${INK};">${address}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px 40px 40px; text-align: center; font-family: ${SANS}; font-size: 14px; line-height: 1.6; color: ${MUTED};">
              If anything looks wrong, just reply to this email.<br>
              <a href="${SITE_ORIGIN}" style="color: ${PINE};">cob-studio.com</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
