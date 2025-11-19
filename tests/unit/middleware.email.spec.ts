// @ts-nocheck
/// <reference path="../setup-tests.d.ts" />
import EmailSchemaMiddleware from '../../src/middlewares/email';

describe('EmailSchemaMiddleware', () => {
	test('attaches email on valid body', async () => {
		const body = { from: 'me@me.com', subject: 'hi', text: 'hello' };
		const req = new Request('http://localhost/api', {
			method: 'POST',
			body: JSON.stringify(body),
			headers: { 'content-type': 'application/json' },
		}) as any;

		await EmailSchemaMiddleware(req);
		expect(req.email).toBeDefined();
		expect(req.email.subject).toBe('hi');
	});

	test('accepts html-only payloads', async () => {
		const body = { from: 'me@me.com', subject: 'hi', html: '<strong>hello</strong>' };
		const req = new Request('http://localhost/api', {
			method: 'POST',
			body: JSON.stringify(body),
			headers: { 'content-type': 'application/json' },
		}) as any;

		await EmailSchemaMiddleware(req);
		expect(req.email).toBeDefined();
		expect(req.email.html).toContain('hello');
	});

	test('returns Response on invalid body', async () => {
		const body = { not: 'valid' };
		const req = new Request('http://localhost/api', {
			method: 'POST',
			body: JSON.stringify(body),
			headers: { 'content-type': 'application/json' },
		}) as any;

		const resp = await EmailSchemaMiddleware(req);
		expect(resp).toBeInstanceOf(Response);
		expect((resp as Response).status).toBe(400);
	});
});
