// @ts-nocheck
/// <reference path="../setup-tests.d.ts" />
/// <reference types="vitest" />
import Email from '../../src/controllers/email';

describe('Email controller', () => {
	const baseEnv = {
		CONTACT_TO: 'owner@example.com',
		CONTACT_FROM: 'no-reply@example.com',
		SEND_EMAIL: { send: vi.fn().mockResolvedValue(undefined) },
	} as unknown as Env;

	beforeEach(() => {
		(baseEnv.SEND_EMAIL.send as any).mockClear();
	});

	test('send composes MIME message with text and html', async () => {
		const payload = {
			from: { email: 'visitor@example.com', name: 'Visitor' },
			subject: 'Hello there',
			text: 'Plain message',
			html: '<p>HTML message</p>',
		};

		await Email.send(payload as any, baseEnv);
		expect(baseEnv.SEND_EMAIL.send).toHaveBeenCalledTimes(1);
		const message = (baseEnv.SEND_EMAIL.send as any).mock.calls[0][0];
		expect(message.from).toBe(baseEnv.CONTACT_FROM);
		expect(message.to).toBe(baseEnv.CONTACT_TO);
		expect(message.raw).toContain('Reply-To:');
		expect(message.raw).toContain('visitor@example.com');
		expect(message.raw).toContain('text/plain');
		expect(message.raw).toContain('text/html');
	});

	test('stringifyContact handles string and object', () => {
		const stringify = (Email as any).stringifyContact.bind(Email);
		expect(stringify('user@example.com')).toBe('user@example.com');
		expect(stringify({ email: 'user@example.com', name: 'User' })).toBe('User <user@example.com>');
	});

	test('throws when contact addresses are missing', async () => {
		const badEnv = { ...baseEnv, CONTACT_TO: '', CONTACT_FROM: '' } as Env;
		await expect(Email.send({ from: 'a@b.com', subject: 'hi', text: 'x' } as any, badEnv)).rejects.toThrow();
	});
});
