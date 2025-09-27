# Cloudflare Worker Email Server

<!-- markdownlint-disable MD033 MD034 -->
<div align="center">
 <img src="https://github.com/Sh4yy/cloudflare-email/assets/23535123/36a28753-7ded-45ef-bfed-fcc308658b33" alt="Cloudflare Worker Email Server"/>
 <br>
  <h1>Cloudflare Worker Email Server</h1>
 <p>Send free transactional emails from your Cloudflare Workers using MailChannels.</p>
</div>

## Getting Started

1. Clone this repository
2. Install the dependencies with `npm install`
3. Use the command `npx wrangler secret put --env production TOKEN` to deploy a securely stored token to Cloudflare. With this command, you will be prompted to enter a random secret value, which will be used to authenticate your requests with the HTTP `Authorization` header as described below. You can also set this encrypted value directly in your Cloudflare dashboard.
4. Deploy the worker with `npm run deploy`

Or deploy directly to Cloudflare

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Sh4yy/cloudflare-email)

## Setup SPF

SPF is a DNS record that helps prevent email spoofing. You will need to add an SPF record to your domain to allow MailChannels to send emails on your behalf.

1. Add a `TXT` record to your domain with the following values:

- Name: `@`

<div align="center">
    <img src="https://github.com/Sh4yy/cloudflare-email/assets/23535123/36a28753-7ded-45ef-bfed-fcc308658b33" alt="Cloudflare Worker Email Server" />
    <br />
    <h1>Cloudflare Worker Email Server</h1>
    <p>Send free transactional emails from your Cloudflare Workers using MailChannels.</p>
</div>

## Getting Started

1. Clone this repository.
2. Install the dependencies with `npm install`.
3. Use the command `npx wrangler secret put --env production TOKEN` to create a securely stored token in Cloudflare. You will be prompted to enter a secret value that will be used to authenticate requests via the `Authorization` header. You can also set this encrypted value directly in the Cloudflare dashboard.
4. Deploy the worker with `npm run deploy`.

Or deploy directly to Cloudflare:

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Sh4yy/cloudflare-email)

## Setup SPF

SPF is a DNS record that helps prevent email spoofing. Add an SPF `TXT` record to your domain to allow MailChannels to send emails on your behalf.

Add a `TXT` record with these values:

- Name: `@`
- Value: `v=spf1 a mx include:relay.mailchannels.net ~all`

If you're seeing a Domain Lockdown error, follow these steps:

Add a `TXT` record with these values:

- Name: `_mailchannels`
- Value: `v=mc1 cfid=yourdomain.workers.dev` (the `cfid` value is shown in the error response)

## Setup DKIM

Optional but recommended: set up DKIM for your domain. Follow the MailChannels guide: https://support.mailchannels.com/hc/en-us/articles/7122849237389-Adding-a-DKIM-Signature

## Usage

After deploying, you can send emails by POSTing to `/api/email` with an `Authorization` header containing your token.

### Basic Email

The most basic request body:

```json
{
    # Cloudflare Worker Email Server

    <!-- markdownlint-disable MD033 MD034 MD041 -->
    <div align="center">
        <img src="https://github.com/Sh4yy/cloudflare-email/assets/23535123/36a28753-7ded-45ef-bfed-fcc308658b33" alt="Cloudflare Worker Email Server" />
        <br />
        <h1>Cloudflare Worker Email Server</h1>
        <p>Send free transactional emails from your Cloudflare Workers using MailChannels.</p>
    </div>

    ## Getting Started

    1. Clone this repository.
    2. Install the dependencies with `npm install`.
    3. Use the command `npx wrangler secret put --env production TOKEN` to create a securely stored token in Cloudflare. You will be prompted to enter a secret value that will be used to authenticate requests via the `Authorization` header. You can also set this encrypted value directly in the Cloudflare dashboard.
    4. Deploy the worker with `npm run deploy`.

    Or deploy directly to Cloudflare:

    [![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Sh4yy/cloudflare-email)

    ## Setup SPF

    SPF is a DNS record that helps prevent email spoofing. Add an SPF `TXT` record to your domain to allow MailChannels to send emails on your behalf.

    Add a `TXT` record with these values:

    - Name: `@`
    - Value: `v=spf1 a mx include:relay.mailchannels.net ~all`

    If you're seeing a Domain Lockdown error, follow these steps:

    Add a `TXT` record with these values:

    - Name: `_mailchannels`
    - Value: `v=mc1 cfid=yourdomain.workers.dev` (the `cfid` value is shown in the error response)

    ## Setup DKIM

    Optional but recommended: set up DKIM for your domain. Follow the MailChannels guide: [MailChannels DKIM guide](https://support.mailchannels.com/hc/en-us/articles/7122849237389-Adding-a-DKIM-Signature)

    ## Usage

    After deploying, you can send emails by POSTing to `/api/email` with an `Authorization` header containing your token.

    ### Basic Email

    The most basic request body:

    ```json
    {
        "to": "john@example.com",
        "from": "me@example.com",
        "subject": "Hello World",
        "text": "Hello World"
    }
    ```

    ### HTML Emails

    Send HTML by including an `html` field in the request body:

    ```json
    {
        "to": "john@example.com",
        "from": "me@example.com",
        "subject": "Hello World",
        "html": "<h1>Hello World</h1>"
    }
    ```

    ### Sender and Recipient Name

    You can provide `name` properties for `to` and `from`:

    ```json
    {
        "to": { "email": "john@example.com", "name": "John Doe" },
        "from": { "email": "me@example.com", "name": "Jane Doe" },
        "subject": "Hello World",
        "text": "Hello World"
    }
    ```

    ### Sending to Multiple Recipients

    You can send to multiple recipients by passing arrays:

    ```json
    {
        "to": [
            "john@example.com",
            "rose@example.com"
        ],
        "from": "me@example.com",
        "subject": "Hello World",
        "text": "Hello World"
    }
    ```

    Or with objects containing `name` and `email`:

    ```json
    {
        "to": [
            { "email": "john@example.com", "name": "John Doe" },
            { "email": "rose@example.com", "name": "Rose Doe" }
        ],
        "from": "me@example.com",
        "subject": "Hello World",
        "text": "Hello World"
    }
    ```

    ### Sending BCC and CC

    You can include `cc` and `bcc` arrays in the same way:

    ```json
    {
        "to": "john@example.com",
        "from": "me@example.com",
        "subject": "Hello World",
        "text": "Hello World",
        "cc": [
            "jim@example.com",
            "rose@example.com"
        ],
        "bcc": [
            "gil@example.com"
        ]
    }
    ```

    ### Reply To

    You can set a `replyTo` field:

    ```json
    {
        "to": "john@example.com",
        "from": "me@example.com",
        "replyTo": "support@example.com",
        "subject": "Hello World",
        "text": "Hello World"
    }
    ```

    ## Wrangler v4

    This project is configured to work with Wrangler v4. Quick commands:

    - Install Wrangler globally: `npm install -g wrangler@^4`
    - Local dev: `wrangler dev`
    - Publish: `wrangler publish --env production`

    If you run into build issues, ensure your local `node` and `npm` are up to date and run `npm install` to refresh devDependencies.
