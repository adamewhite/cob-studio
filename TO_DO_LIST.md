# cob-studio — To do

Where things stand and what's left to ship real sales. Stop point: live deploy at https://www.cob-studio.com with full Stripe Checkout in **live mode** running successfully on a real card. Prices are temporarily $0.50 site-wide for safe testing.

## Done so far
- ✅ Cart drawer + localStorage persistence
- ✅ Stripe Checkout end-to-end (test → live mode)
- ✅ Resend sale-notification emails to evilofbanality@gmail.com
- ✅ Live mode webhook + production env vars in Vercel
- ✅ Real-card test purchase succeeded; refund issued (3-5 business days back to card)
- ✅ Stripe customer email toggles on (Successful payments + Refunds)
- ✅ OG image, favicon, custom domain, dark green wall background on botanicals
- ✅ Newsletter capture in footer (Resend Audience → General segment)
- ✅ Policy pages live: `/policies/shipping`, `/policies/returns`, `/policies/privacy`
- ✅ Vercel Web Analytics + Speed Insights wired in and enabled
- ✅ About page copy refreshed
- ✅ Real prices restored ($325 botanicals / $225 drawings / $275 mushroom casts)
- ✅ Maine sales tax registration submitted (2026-05-11, confirmation `0-003-866-562`) — awaiting issuance
- ✅ Cloudflare Email Routing live: `hello@` and `sales@cob-studio.com` forward to evilofbanality@gmail.com
- ✅ `/contact` page (email-only, points at hello@cob-studio.com)
- ✅ Gmail "Send mail as" configured for both `hello@` and `sales@` via Resend SMTP — full email loop closed

## Blocking real sales

### 1. Maine sales tax — awaiting issuance, then 3 follow-ups
Registration submitted 2026-05-11. Confirmation number: **0-003-866-562**. Maine typically issues within a few business days to ~2 weeks; the account number arrives via the MTP Letters card or email.

Once the Sales Tax Account Number is issued:
1. Stripe dashboard → Settings → Tax → **Tax registrations** → Add registration → US, **Maine**, Standard. Effective date = date Maine issued the registration.
2. Flip `automatic_tax: { enabled: false }` → `true` in `app/api/checkout/route.ts:84`. Also fix the stale `// TODO: re-enable once NY Certificate of Authority is registered.` comment on line 83 — should reference Maine.
3. Make a note of the assigned filing frequency (almost certainly annual at this volume) and the first return due date. Even zero-revenue periods need a $0 return filed.

Background: 5.5% statewide, no local add-ons. Only Maine residents are taxed; other states only become relevant once you hit their economic nexus thresholds (typically $100K/yr or 200 transactions per state).

### 2. Stripe public business details (after the logo is ready)
At https://dashboard.stripe.com/settings/public, set:
- **Public business name**: COB STUDIO (currently "John Orth" — appears as the sender on customer receipts)
- **Statement descriptor**: e.g. `COB STUDIO` (max ~22 chars; appears on customer credit card statements)
- **Support email**: probably `evilofbanality@gmail.com` for now
- **Business website**: `https://www.cob-studio.com`
- **Logo**: upload the COB mark (PNG/JPG, square, 128×128+)

## Polish before "launching"

### 3. /checkout/cancel page
Currently `cancel_url` in the checkout API points to `/`. A friendlier "cart preserved, come back when ready" page would read better. Optional. File: `app/api/checkout/route.ts`.

### 4. Sold-state visual check
Flip one artwork to `sold: true` in `app/lib/artwork.ts` and view it locally to confirm:
- Listing page shows the piece is sold
- Detail page hides Add to Cart, shows "Sold"
- /api/checkout refuses to create a session for it (already coded server-side)

### 5. Test newsletter in production
Now that the form is live and `RESEND_SEGMENT_ID` is set in Vercel, submit a real signup on cob-studio.com and confirm it lands in Resend → Audience → Contacts (segment: General). Also delete the `test@test.com` contact left over from local testing.

### 6. Get the site indexed on Google and Bing
Currently neither search engine can index cob-studio.com because there's no sitemap or robots.txt published and no Search Console verification.

**a. Generate sitemap + robots (prereq)**
Next.js App Router conventions:
- `app/sitemap.ts` — exports a function that returns all artwork detail URLs, category/series pages, and policy pages.
- `app/robots.ts` — points crawlers at the sitemap and allows everything except `/api/*` and `/checkout/*`.

**b. Google Search Console**
- https://search.google.com/search-console → Add property → URL prefix → `https://www.cob-studio.com`.
- Verify ownership via DNS TXT record (preferred over HTML meta — survives redeploys).
- Once verified: Sitemaps → submit `https://www.cob-studio.com/sitemap.xml`.

**c. Bing Webmaster Tools**
- https://www.bing.com/webmasters → Add site.
- Easiest: "Import from Google Search Console" — pulls the verification across automatically.
- Otherwise verify via DNS or HTML tag, then submit the same sitemap URL.

**d. Optional after the above:** Google Business Profile (only if you want a map/knowledge-panel listing — skip for studios that don't take visitors). Google Merchant Center / Bing Shopping (only if you plan to run paid Shopping ads).

## Operational workflow when a real sale comes in

The webhook emails you when a sale happens. Steps to fulfill:

1. Email arrives at evilofbanality@gmail.com — subject `Sale: <slug>` with order details and shipping address.
2. Open `app/lib/artwork.ts` → find the artwork by slug → add `sold: true,`.
3. `git commit -am "Mark <slug> sold" && git push`.
4. Vercel auto-deploys. Piece is now hidden/marked sold within ~1 min.
5. Pack and ship the piece. USPS with tracking (per shipping policy: within 3–5 business days).
6. Reply to the customer (their email is in the sale notification) with tracking.

## Nice-to-haves (not blocking)

- **Custom branded order confirmation email to customer.** Stripe sends a default receipt; can be replaced with a Resend email styled to match the site.
- **Welcome email on newsletter signup.** Currently signup is silent — adding a one-time welcome email via Resend would feel more intentional.
- **Newsletter double opt-in.** Single opt-in is fine for US/CAN. Worth revisiting if you ever start collecting EU signups (GDPR).
- **Inventory backup** — `artwork.ts` is source of truth and is in git. No action needed unless you grow beyond a single source file.
- **Stripe Claude Code skill** — `npx skills add -y https://docs.stripe.com` if Stripe work expands beyond hosted Checkout.

## Reference

### Local dev with Stripe webhooks
Two terminals:
```
npm run dev
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
The `stripe listen` command prints a `whsec_…` signing secret for local use only — it goes in `.env.local` as `STRIPE_WEBHOOK_SECRET`. This is **different** from the production webhook secret in Vercel.

### Test card (test mode only)
- Number: `4242 4242 4242 4242`
- Expiry: any future date
- CVC: any 3 digits
- ZIP: any

### Env vars in use
- `STRIPE_SECRET_KEY` — server-side. Local: `sk_test_…`. Vercel production: `sk_live_…`.
- `STRIPE_WEBHOOK_SECRET` — server-side. **Different value local vs. production.** Local: from `stripe listen`. Vercel production: from the live event destination.
- `RESEND_API_KEY` — server-side. **Full access** scope (needs contact-write for newsletter).
- `RESEND_SEGMENT_ID` — server-side. ID of the Resend Audience "General" segment that newsletter signups join.
- `SALE_NOTIFICATION_EMAIL` — recipient of sale emails (currently evilofbanality@gmail.com).
