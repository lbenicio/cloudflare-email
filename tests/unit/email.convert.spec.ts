// @ts-nocheck
/// <reference path="../setup-tests.d.ts" />
/// <reference types="vitest" />
import Email from '../../src/controllers/email';

describe('Email conversion helpers', () => {
	test('convertContact handles string and object', () => {
		// @ts-ignore - accessing protected method for test
		const single = (Email as any).convertContact('a@b.com');
		expect(single).toEqual({ email: 'a@b.com', name: undefined });

		const obj = (Email as any).convertContact({ email: 'c@d.com', name: 'CD' });
		expect(obj).toEqual({ email: 'c@d.com', name: 'CD' });
	});

	test('convertContacts handles array and single', () => {
		// @ts-ignore
		const arr = (Email as any).convertContacts(['a@b.com', { email: 'c@d.com', name: 'CD' }]);
		expect(arr).toEqual([
			{ email: 'a@b.com', name: undefined },
			{ email: 'c@d.com', name: 'CD' },
		]);

		// @ts-ignore
		const single = (Email as any).convertContacts('x@y.com');
		expect(single).toEqual([{ email: 'x@y.com', name: undefined }]);
	});

	test('convertEmail maps fields to IMCEmail structure', () => {
		const input = {
			to: 'to@example.com',
			from: { email: 'me@example.com', name: 'Me' },
			subject: 'Hello',
			text: 'plain',
			html: '<p>html</p>',
			cc: [{ email: 'cc@example.com', name: 'CC' }],
			bcc: ['bcc@example.com'],
			replyTo: 'reply@example.com',
		} as any;

		// @ts-ignore
		const converted = (Email as any).convertEmail(input);

		expect(converted.subject).toBe('Hello');
		expect(converted.from).toEqual({ email: 'me@example.com', name: 'Me' });
		expect(converted.personalizations[0].to).toEqual([{ email: 'to@example.com', name: undefined }]);
		expect(converted.content).toEqual([
			{ type: 'text/plain', value: 'plain' },
			{ type: 'text/html', value: '<p>html</p>' },
		]);
		expect(converted.cc).toEqual([{ email: 'cc@example.com', name: 'CC' }]);
		expect(converted.bcc).toEqual([{ email: 'bcc@example.com', name: undefined }]);
		expect(converted.reply_to).toEqual({ email: 'reply@example.com', name: undefined });
	});
});
