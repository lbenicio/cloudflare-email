import type { SendEmailService } from 'cloudflare:email';

declare global {
	interface Env {
		TOKEN: string;
		CONTACT_TO: string;
		CONTACT_FROM: string;
		SEND_EMAIL: SendEmailService;
	}
}

export {};
