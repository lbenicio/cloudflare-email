// @ts-nocheck
/// <reference path="../setup-tests.d.ts" />
import app from '../../src/main';
import Email from '../../src/controllers/email';

describe('E2E: /api/email', () => {
	test('POST /api/email returns 200 when valid and authorized', async () => {
		// stub Email.send to avoid network calls
		const sendSpy = vi.spyOn(Email, 'send').mockResolvedValue(undefined as any);

		const body = { from: 'me@example.com', subject: 'Hi', text: 'Hello' };
		const TOKEN = 'TEST_TOKEN_123';
		const headers = new Headers({ 'Content-Type': 'application/json' });
		headers.set('Authorization', TOKEN);
		const req = new Request('https://example.com/api/email', {
			method: 'POST',
			headers,
			body: JSON.stringify(body),
		});

		// set env with TOKEN to match middleware; router will call middleware with env if provided by cloudflare runtime
		const resp = await(app as any).fetch(
			req as Request,
			{
				TOKEN,
				CONTACT_TO: 'owner@example.com',
				CONTACT_FROM: 'no-reply@example.com',
				SEND_EMAIL: { send: vi.fn() },
			} as any
		);

		expect(resp.status).toBe(200);
		expect(sendSpy).toHaveBeenCalled();

		sendSpy.mockRestore();
	});
});
