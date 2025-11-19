import { EmailMessage } from 'cloudflare:email';
import { IContact, IEmail } from '../schema/email';

const EOL = '\r\n';

class Email {
	/**
	 * Sends an email using Cloudflare's native send_email binding.
	 */
	static async send(email: IEmail, env: Env) {
		Email.assertEnv(env);
		const raw = Email.buildMimeMessage(email, env);
		const message = new EmailMessage(env.CONTACT_FROM, env.CONTACT_TO, raw);
		await env.SEND_EMAIL.send(message);
	}

	protected static assertEnv(env: Env) {
		if (!env?.CONTACT_FROM) {
			throw new Error('CONTACT_FROM is not configured.');
		}

		if (!env?.CONTACT_TO) {
			throw new Error('CONTACT_TO is not configured.');
		}

		if (!env?.SEND_EMAIL) {
			throw new Error('SEND_EMAIL binding is not configured.');
		}
	}

	protected static buildMimeMessage(email: IEmail, env: Env): string {
		const sanitizedFrom = Email.sanitizeHeaderValue(env.CONTACT_FROM);
		const sanitizedTo = Email.sanitizeHeaderValue(env.CONTACT_TO);
		const subject = Email.sanitizeHeaderValue(email.subject);
		const replyTo = Email.sanitizeHeaderValue(Email.stringifyContact(email.from));
		const contactFrom = Email.sanitizeHeaderValue(Email.stringifyContact(email.from));
		const dateHeader = new Date().toUTCString();
		const messageId = Email.buildMessageId(sanitizedFrom);
		const headers: string[] = [
			`Date: ${dateHeader}`,
			`From: ${sanitizedFrom}`,
			`To: ${sanitizedTo}`,
			`Subject: ${subject}`,
			`Message-ID: ${messageId}`,
			'Reply-To: ' + replyTo,
			'X-Contact-From: ' + contactFrom,
			'MIME-Version: 1.0',
		];

		const hasText = Boolean(email.text);
		const hasHtml = Boolean(email.html);
		let body = '';

		if (hasText && hasHtml) {
			const boundary = Email.generateBoundary();
			headers.push(`Content-Type: multipart/alternative; boundary="${boundary}"`);
			body = Email.buildMultipartBody(boundary, email);
		} else {
			const contentType = hasHtml ? 'text/html' : 'text/plain';
			headers.push(`Content-Type: ${contentType}; charset=utf-8`);
			headers.push('Content-Transfer-Encoding: 7bit');
			body = (email.html ?? email.text ?? '').trimEnd();
		}

		return `${headers.join(EOL)}${EOL}${EOL}${body}${EOL}`;
	}

	protected static buildMultipartBody(boundary: string, email: IEmail): string {
		const sections: string[] = [];

		if (email.text) {
			sections.push(
				`--${boundary}` +
					`${EOL}Content-Type: text/plain; charset=utf-8${EOL}Content-Transfer-Encoding: 7bit${EOL}${EOL}${email.text}${EOL}`
			);
		}

		if (email.html) {
			sections.push(
				`--${boundary}` + `${EOL}Content-Type: text/html; charset=utf-8${EOL}Content-Transfer-Encoding: 7bit${EOL}${EOL}${email.html}${EOL}`
			);
		}

		sections.push(`--${boundary}--`);
		return sections.join(EOL) + EOL;
	}

	protected static generateBoundary() {
		return `----cf-email-${crypto.randomUUID()}`;
	}

	protected static buildMessageId(fromHeader: string) {
		const domain = Email.extractDomain(fromHeader) || 'worker.email';
		return `<${crypto.randomUUID()}@${domain}>`;
	}

	protected static extractDomain(headerValue: string) {
		const emailMatch = headerValue.match(/<([^>]+)>/);
		const addr = emailMatch?.[1] ?? headerValue;
		return addr.split('@')[1] ?? '';
	}

	protected static sanitizeHeaderValue(value: string) {
		return value.replace(/[\r\n]+/g, ' ').trim();
	}

	protected static stringifyContact(contact: IContact): string {
		if (typeof contact === 'string') {
			return contact;
		}

		const name = contact.name ? Email.sanitizeHeaderValue(contact.name) : '';
		const email = Email.sanitizeHeaderValue(contact.email);
		return name ? `${name} <${email}>` : email;
	}
}

export default Email;
