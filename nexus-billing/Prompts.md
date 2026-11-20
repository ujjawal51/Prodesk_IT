# AI transparency

## User request
The user supplied the Prodesk IT Nexus Corporate assignment for both frontend and fullstack tracks and asked for the code. Requirements included Admin/Client RBAC, invoice ownership, Stripe Checkout, raw-body signature-verified webhooks, paid PDF receipts, email delivery, and submission demonstration.

## AI contribution
ChatGPT authored the React UI, Express routes, SQLite schema, authentication/authorization, Stripe integration, PDFKit generation, Nodemailer outbox worker, tests, environment template, and documentation. No real credentials were supplied or embedded.

## Decisions and implementation reasoning
- Raw `express.raw` is mounted on the Stripe webhook before JSON middleware. `stripe.webhooks.constructEvent` verifies signatures; this was checked against the official stripe-node repository/example.
- Stable, persisted checkout attempt IDs are used as Stripe idempotency keys; button disabling alone cannot prevent duplicate payments.
- Webhook data is reconciled to persisted invoice ownership, amount, currency and attempt. Event IDs are deduplicated and invoice payment IDs checked.
- PDFKit collects stream chunks into Buffer.concat only after its end event. A custom vector N wordmark and Nexus Corporate text serve as a placeholder logo, with PAID and payment references only on verified paid invoices.
- Database transaction commits payment and outbox together. Worker retries PDF/SMTP failures without reverting payment or requiring the customer to pay again.
- SQLite is deliberately restricted to a single instance with durable storage; this is disclosed rather than claimed horizontally scalable.

## Validation
Automated security tests cover unauthenticated access, admin denial, IDOR on all three invoice endpoints, request origin protection, validation, concurrent stable checkout keys, invalid signatures, incorrect amounts, unpaid events, event replay, paid checkout rejection, PDF downloads and SMTP retry. External Stripe and SMTP are mocked in tests except Stripe's real signature generation/verification code. React production build was run. No live payment, email, hosted deployment, or recorded demo was performed.

## Human review still needed
Configure test keys and real recipient; run live Stripe CLI flow; verify official logo/branding; inspect the UI in a browser and PDF layout; verify hosted disk persistence and SMTP acceptance; record the requested demo. Review security and operational limitations in README.md.
