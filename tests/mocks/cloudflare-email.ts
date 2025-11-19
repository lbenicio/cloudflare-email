export class EmailMessage {
	constructor(public from: string, public to: string | null, public raw: ReadableStream | string) {}
}

export interface SendEmailService {
	send(message: EmailMessage): Promise<void>;
}
