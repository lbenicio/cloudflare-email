# Cloudflare Worker Email Server

<!-- markdownlint-disable MD033 MD034 -->
<div align="center">
 <img src="https://github.com/Sh4yy/cloudflare-email/assets/23535123/36a28753-7ded-45ef-bfed-fcc308658b33" alt="Cloudflare Worker Email Server"/>
 <br />
  <h1>Cloudflare Worker Email Server</h1>
 <p>Send contact-form style emails from Cloudflare Workers using Cloudflare Email Routing.</p>
</div>

## Getting Started

1. **Clone and install**

  ```bash
  git clone https://github.com/lbenicio/cloudflare-email.git
  cd cloudflare-email
  npm install
  ```

2. **Configure environment variables** – edit `wrangler.toml` and set `CONTACT_FROM` (an email on a domain managed by Cloudflare Email Routing) and `CONTACT_TO` (the destination inbox you verified in Email Routing).
3. **Add the auth token** – store your shared secret with `wrangler secret put TOKEN` (repeat for each environment you use).
4. **Enable `send_email` binding** – Email Routing must be enabled for your zone and at least one `send_email` binding has to be configured (see below).
5. **Deploy** – `npm run deploy:prod` publishes the Worker (local dev: `npm run start:dev`).

## Cloudflare Email Routing setup

- Follow the [Email Routing quick-start](https://developers.cloudflare.com/email-routing/get-started/) to verify both the sender domain and the destination inbox.
- Add DNS records (SPF, DKIM, and routing-specific records) suggested by Cloudflare after enabling Email Routing.
- Declare the binding in `wrangler.toml` (one per environment). Example:

  ```toml
  [[send_email]]
  name = "SEND_EMAIL"
  destination_address = "contact@example.com"
  allowed_sender_addresses = ["no-reply@example.com"]
  ```

  Use `allowed_destination_addresses` if you want to allow multiple inboxes instead of a single `destination_address`.
- Keep `CONTACT_FROM`/`CONTACT_TO` consistent with the binding restrictions or Cloudflare will reject the send attempt.

## Authentication

Requests must include an `Authorization` header that matches the `TOKEN` secret stored in your Worker environment. Example:

```http
POST /api/email HTTP/1.1
Host: <your-worker>
Authorization: super-secret-token
Content-Type: application/json
```

## Usage

`/api/email` accepts JSON payloads that contain the visitor’s address, subject, and at least one body field (text or HTML). The Worker injects the actual recipient/sender addresses based on `CONTACT_TO`/`CONTACT_FROM` before calling Cloudflare’s native email API.

### Basic payload

```json
{
  "from": "visitor@example.com",
  "subject": "Need a quote",
  "text": "Hey! Please call me back."
}
```

### HTML payload

```json
{
  "from": { "email": "visitor@example.com", "name": "Jane Doe" },
  "subject": "Website contact",
  "html": "<p>Could you tell me more about your services?</p>"
}
```

Rules:

- `from` accepts either a string (`"user@example.com"`) or an object with `email` and optional `name`.
- `subject` must be a non-empty string.
- You must provide at least one body field: `text` or `html`.
- The Worker sets the `Reply-To` header to the `from` value so you can reply directly from your inbox.

## Development and testing

- **Local dev**: `npm run start:dev`
- **Type checking**: `npm run type:check`
- **Tests**: `npm test`
- **Formatting**: `npm run fmt:all`

Vitest unit and E2E tests cover the middleware, routing, and the Cloudflare email integration shim. Run them before deploying to ensure your changes keep working.

## Deploying

Use Wrangler to deploy:

```bash
npm run deploy:prod
```

Ensure the production environment in `wrangler.toml` mirrors the bindings/vars required for Email Routing. Update the `TOKEN`, `CONTACT_FROM`, and `CONTACT_TO` values whenever they change.
