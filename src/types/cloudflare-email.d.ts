declare module 'cloudflare:email' {
	export class EmailMessage {
		constructor(from: string, to: string | null, raw: ReadableStream | string);
		readonly from: string;
		readonly to: string | null;
		readonly raw: ReadableStream | string;
	}

	export interface SendEmailService {
		send(message: EmailMessage): Promise<void>;
	}
}
