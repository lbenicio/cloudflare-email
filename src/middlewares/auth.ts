/**
 * Middleware to check if the user is authenticated
 * @param request
 * @constructors
 */
const AuthMiddleware = (request: Request, env: Env) => {
	console.log('AuthMiddleware: Checking authentication');
	const authHeader = (request.headers.get('Authorization') ?? request.headers.get('authorization') ?? '').trim();
	const token = authHeader.includes(' ') ? authHeader.split(' ').at(-1) || '' : authHeader;

	// Strict check for token existence
	if (!env.TOKEN || env.TOKEN.length === 0) {
		console.log('AuthMiddleware: TOKEN environment variable is not set');
		return new Response('You must set the TOKEN environment variable.', {
			status: 401,
		});
	}

	if (token !== env.TOKEN) {
		console.log('AuthMiddleware: Unauthorized access attempt with token', token);
		console.log('Expected token:', env.TOKEN);
		return new Response('Unauthorized', { status: 401 });
	}
};

export default AuthMiddleware;
