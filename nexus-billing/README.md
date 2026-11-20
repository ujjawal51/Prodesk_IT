# Nexus Corporate Billing

React + Express implementation covering BOTH assignment tracks. Node 22.13+ (tested on Node 24), SQLite, Stripe Checkout, PDFKit and Nodemailer. USD only, integer cents throughout. Original text/vector Nexus wordmark included; no official logo was provided.

## Start locally (Windows PowerShell)

```powershell
npm ci
Copy-Item .env.example .env
# Edit .env before running the next commands
npm run seed
npm run dev
```

Open http://localhost:5173. Set JWT_SECRET to a random 32+ character secret, SEED_PASSWORD to a unique 12+ character password, Stripe TEST secret and webhook secret, and SMTP settings. Never put secrets into frontend/VITE variables. Do not commit .env. Configure CLIENT_EMAIL with your real recipient inbox BEFORE seeding to demonstrate delivery. The default .test inboxes cannot receive mail.

Accounts: admin@nexus.test (Admin), CLIENT_EMAIL or alex@nexus.test (Client A), jamie@nexus.test (Client B). All use the seed password. Seed preserves existing accounts. This seed is for a demo deployment, not a public user-registration flow. Use distinct passwords for any real clients. The seed command logs default names; use CLIENT_EMAIL when overridden.

## Stripe webhook development

Install and authenticate the official Stripe CLI, then run:

```sh
stripe login
stripe listen --events checkout.session.completed,checkout.session.async_payment_succeeded --forward-to localhost:3000/api/webhooks/stripe
```

Copy the listener's `whsec_...` secret into .env and restart the server. Use the matching account's `sk_test_...` key. Create an invoice through this app, then pay through its Checkout URL. Test card: 4242 4242 4242 4242, a future expiry, any three-digit CVC. Generic `stripe trigger` fixture sessions are not linked to local invoices and correctly fail reconciliation. Do not submit real card data in test mode.

Payment status is never set by the browser, a success URL, or an admin mutation. A signed Stripe event must match the stored invoice, attempt, amount, currency, mode, session (when persisted), and payment intent. The webhook uses the ORIGINAL raw request bytes before express.json. It commits payment and a durable delivery job together, then acknowledges. The worker starts PDF/email delivery within five seconds and retries failures with backoff.

## Commands

- `npm test`: API integration/security tests; signed webhook verification uses the real Stripe SDK. Checkout and SMTP transports are mocked, so tests do NOT prove live Stripe or SMTP connectivity.
- `npm run build`: production React bundle.
- `npm start`: production API, static SPA, and receipt worker.

## Security design

- JWT in HttpOnly, SameSite=Strict cookie, Secure in production; one-hour expiry; explicit issuer/audience/algorithm. Role is read from the database, not trusted from browser input.
- Public exceptions to JWT: login and Stripe webhook. Webhook is authenticated by Stripe signature. All other /api routes require JWT, including unknown routes.
- Origin checks protect state-changing cookie-authenticated requests. For Postman tests include `Origin: <APP_URL>` and the login cookie. Host frontend and API on the same origin; Vite proxies /api locally.
- Admin middleware blocks both dashboard and invoice creation. Ownership middleware protects invoice JSON, checkout, and PDF. Another client's existing invoice returns 403.
- Input validation and parameterized SQL; no client-supplied prices, currencies, recipients, status or payment intents are accepted.
- UI uses immediate ref lock plus disabled loading button. Server persists an attempt before Stripe and uses the attempt's stable idempotency key and identical parameters for concurrent/retried calls.
- Existing open sessions are reused. Completed sessions block another payment. A confirmed expired session is removed; the next click starts a new attempt. Unknown attempts older than 30 minutes fail closed, requiring reconciliation rather than risking a new charge after Stripe's idempotency retention window.
- Invoice PDF bytes live in SQLite, never in a publicly served directory. Browser downloads an authenticated blob using Content-Disposition and a temporary object URL.
- Frontend route guards render 403 without rendering Admin content. API is independently protected against direct requests.

### Reconcile an ambiguous attempt

If Stripe accepted session creation but the app lost the response and could not recover it within 30 minutes, the app blocks another session. Inspect Stripe Dashboard/logs for the persisted attempt's `invoice-<attempt UUID>` idempotency key or invoice metadata. Confirm the matching session and set its ID on the attempt using a controlled database operation. If it is paid, replay the signed event from Stripe; if open, reuse it; if expired, the app allows a new attempt. Do not delete an unresolved attempt without confirming no payable or paid session exists. This intentionally prioritizes preventing duplicate payment over automatic recovery.

## Deployment: one Render web service

This implementation serves frontend and backend together; a separate Vercel deployment is unnecessary.

1. Push source to your own GitHub repository (exclude .env, data, node_modules).
2. Create a Node web service, Node 24, build `npm ci && npm run build`, start `node server/index.js`.
3. Attach a persistent disk at `/var/data`; set `DB_PATH=/var/data/nexus.db`. Ephemeral/free filesystems are NOT suitable for this database.
4. Set NODE_ENV=production, APP_URL to the exact HTTPS service origin with no trailing slash, JWT_SECRET, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM, SEED_PASSWORD and CLIENT_EMAIL in environment settings.
5. Run `node server/seed.js` once from the service shell; then remove SEED_PASSWORD from hosted configuration.
6. Register the public Stripe endpoint `https://YOUR-SERVICE/api/webhooks/stripe`, subscribe to the two events above, and use THAT endpoint's signing secret, not the CLI secret.
7. Run one application instance. The embedded worker's mutex is process-local. For horizontal scaling, move to PostgreSQL plus a distributed job queue/leases. Back up the persistent database, including receipts.

SMTP is at-least-once: a crash after SMTP acceptance but before the DB update can cause a duplicate email. Stable Message-ID helps downstream threading but does not guarantee deduplication. Payment updates and delivery-job creation are idempotent. Monitor pending deliveries and webhook failures. JWT logout clears the browser cookie; there is no server-side stolen-token revocation system in this assignment implementation.

No live deployment, real Stripe test payment, external SMTP delivery or browser automation was performed in the build environment. Those require your credentials/configuration and end-to-end demonstration. Do not submit this as fully verified production delivery until completing the checklist below.

## Submission and demo

See DEMO-CHECKLIST.md and Prompts.md. No paid-state simulator or fake payment bypass is included.

## Official references

- https://docs.stripe.com/webhooks/signature
- https://docs.stripe.com/checkout/fulfillment
- https://docs.stripe.com/api/idempotent_requests
- https://docs.stripe.com/stripe-cli
- https://github.com/stripe/stripe-node
