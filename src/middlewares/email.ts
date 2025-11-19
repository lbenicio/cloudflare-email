import iEmailSchema, { IEmail } from '../schema/email';

export type EmailRequest = Request & {
	email?: IEmail;
};

/**
 * Middleware to validate the request body against the email schema
 * @param request
 * @constructor
 */
const EmailSchemaMiddleware = async (request: EmailRequest) => {
	let content: unknown = {};

	try {
		content = await request.json();
	} catch (err) {
		console.warn('EmailSchemaMiddleware: Failed to parse body as JSON', err);
	}

	console.log('EmailSchemaMiddleware: Validating email', content);
	const email = iEmailSchema.safeParse(content ?? {});
	console.log('EmailSchemaMiddleware: Validation result', email);
	if (email.success) {
		request.email = email.data;
		console.log('EmailSchemaMiddleware: Email validated successfully');
		return;
	}

	console.log('EmailSchemaMiddleware: Validation failed');
	console.log(email.error);
	return new Response('Bad Request', {
		status: 400,
	});
};

export default EmailSchemaMiddleware;
