import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		environment: 'node',
		include: ['tests/unit/**/*.spec.ts', 'tests/e2e/**/*.spec.ts'],
		coverage: {
			reporter: ['text', 'lcov'],
		},
	},
});
