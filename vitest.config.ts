import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	resolve: {
		alias: {
			'cloudflare:email': path.resolve(__dirname, 'tests/mocks/cloudflare-email.ts'),
		},
	},
	test: {
		globals: true,
		environment: 'node',
		include: ['tests/unit/**/*.spec.ts', 'tests/e2e/**/*.spec.ts'],
		coverage: {
			reporter: ['text', 'lcov'],
		},
	},
});
