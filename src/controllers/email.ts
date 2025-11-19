import { EmailMessage } from 'cloudflare:email';
import { createMimeMessage, Mailbox } from 'mimetext';
import { IContact, IEmail } from '../schema/email';

class Email {
	/**
	 * Sends an email using Cloudflare's native send_email binding.
	 */
	static async send(email: IEmail, env: Env) {
		const message = Email.createEmailMessage(email, env);
		await env.SEND_EMAIL.send(message);
	}

	/**
	 * Builds a fully formatted MIME message and wraps it in an EmailMessage instance.
	 */
	protected static createEmailMessage(email: IEmail, env: Env): EmailMessage {
		if (!env?.CONTACT_FROM) {
			throw new Error('CONTACT_FROM is not configured.');
		}

		if (!env?.CONTACT_TO) {
			throw new Error('CONTACT_TO is not configured.');
		}

		if (!env?.SEND_EMAIL) {
			throw new Error('SEND_EMAIL binding is not configured.');
		}

		const mime = createMimeMessage();
		mime.setSender(env.CONTACT_FROM);
		mime.setRecipient(env.CONTACT_TO);
		mime.setSubject(email.subject);

		Email.attachBody(mime, email);
		Email.attachReplyToHeader(mime, email.from);
		mime.setHeader('X-Contact-From', Email.stringifyContact(email.from));

		return new EmailMessage(env.CONTACT_FROM, env.CONTACT_TO, mime.asRaw());
	}

	/**
	 * Adds text/html body parts based on the payload.
	 */
	protected static attachBody(mime: ReturnType<typeof createMimeMessage>, email: IEmail) {
		if (email.text) {
			mime.addMessage({ contentType: 'text/plain', data: email.text });
		}

		if (email.html) {
			mime.addMessage({ contentType: 'text/html', data: email.html });
		}
	}

	/**
	 * Ensures replies in the inbox go back to the original sender.
	 */
	protected static attachReplyToHeader(mime: ReturnType<typeof createMimeMessage>, from: IContact) {
		const mailbox = Email.toMailbox(from);
		mime.setHeader('Reply-To', mailbox);
	}

	protected static stringifyContact(contact: IContact): string {
		if (typeof contact === 'string') {
			return contact;
		}

		return contact.name ? `${contact.name} <${contact.email}>` : contact.email;
	}

	protected static toMailbox(contact: IContact): Mailbox {
		if (typeof contact === 'string') {
			return new Mailbox(contact);
		}

		return new Mailbox({ addr: contact.email, name: contact.name });
	}
}

export default Email;
