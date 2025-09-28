// @ts-nocheck
/// <reference path="../setup-tests.d.ts" />
import AuthMiddleware from '../../src/middlewares/auth';

describe('AuthMiddleware', () => {
	test('returns 401 if TOKEN not set in env', () => {
		const req = new Request('http://localhost') as any;
		const env = {} as any;
		const resp = AuthMiddleware(req, env);
		expect(resp).toBeInstanceOf(Response);
		expect((resp as Response).status).toBe(401);
	});

	test('returns 401 if token mismatch', () => {
		const req = new Request('http://localhost', { headers: { Authorization: 'x' } }) as any;
		const env = { TOKEN: 'y' } as any;
		const resp = AuthMiddleware(req, env);
		expect(resp).toBeInstanceOf(Response);
		expect((resp as Response).status).toBe(401);
	});
});
