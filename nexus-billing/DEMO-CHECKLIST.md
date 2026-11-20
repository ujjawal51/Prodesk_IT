# Demo video (about 4–6 minutes)

1. Show app URL, sign in as Admin; show total revenue and all clients. Create an invoice for Client A with a clear description and amount.
2. Sign out and sign in as Client B. Show the invoice is absent. Manually request Client A invoice URL: 403. Type /admin/dashboard: 403. In Postman show GET /api/admin/dashboard and POST /api/admin/invoices with Client cookie return 403.
3. Sign out; sign in as Client A. Show their invoice and outstanding amount; open invoice detail and download unpaid PDF.
4. Click Pay Invoice; show immediate spinner/disabled state. Complete Stripe TEST checkout with 4242 4242 4242 4242 and future expiry. Return to invoice; wait for webhook confirmation. Never claim the redirect proves payment.
5. Show terminal logs: Verified payment webhook persisted, PDF generated, Receipt email sent. Redact secrets and personal recipient addresses.
6. Open the PAID PDF; show Nexus logo, amount, description, payment reference, date. Show the actual received email attachment in the configured inbox.
7. Replay the same event in Stripe; show one invoice payment, one delivery row, no second charge. Run npm test and show 11 passing tests.
8. Refresh Admin dashboard and show revenue update. Present repository and deployed app URLs, then Prompts.md.

## Submission fields
- Live app URL: fill after deployment
- Backend URL: same origin as app; /api prefix
- GitHub URL: fill after pushing
- Demo video URL: fill after recording

## Before recording
- Stripe TEST mode only; matching account and signing secret.
- Real CLIENT_EMAIL seeded and SMTP configured.
- Production keys and app passwords only in environment variables.
- Persistent disk and one application instance.
- Use an actual invoice-created Checkout session, not a generic CLI fixture.
