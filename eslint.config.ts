import js from '@eslint/js';
import perfectionist from 'eslint-plugin-perfectionist';
import react from 'eslint-plugin-react';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
	js.configs.recommended,
	...tseslint.configs.recommended,
	react.configs.flat.recommended,
	globalIgnores([
		'node_modules',
		'dist',
		'website/node_modules',
		'website/.next',
		'website/public',
		'website/pnpm-workspace.yaml',
		'website/pnpm-lock.yaml',
		'public',
		'pnpm-lock.yaml',
		'.husky',
		'commitlint.config.js',
	]),
	{
		files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		plugins: {
			perfectionist,
		},
		rules: {
			'perfectionist/sort-array-includes': [
				'error',
				{ order: 'asc', type: 'natural' },
			],
			'perfectionist/sort-classes': [
				'error',
				{ order: 'asc', type: 'natural' },
			],
			'perfectionist/sort-heritage-clauses': [
				'error',
				{ order: 'asc', type: 'natural' },
			],
			'perfectionist/sort-imports': [
				'error',
				{
					groups: [
						['builtin', 'external'],
						['internal', 'parent', 'sibling', 'index'],
					],
					order: 'asc',
					type: 'natural',
				},
			],
			'perfectionist/sort-interfaces': [
				'error',
				{ order: 'asc', type: 'natural' },
			],
			'perfectionist/sort-jsx-props': [
				'error',
				{ order: 'asc', type: 'natural' },
			],
			'perfectionist/sort-maps': ['error', { order: 'asc', type: 'natural' }],
			'perfectionist/sort-named-exports': [
				'error',
				{ order: 'asc', type: 'natural' },
			],
			'perfectionist/sort-object-types': [
				'error',
				{ order: 'asc', type: 'natural' },
			],
			'perfectionist/sort-objects': [
				'error',
				{ order: 'asc', type: 'natural' },
			],
			'perfectionist/sort-variable-declarations': [
				'error',
				{ order: 'asc', type: 'natural' },
			],
			'react/jsx-uses-react': 'off',
			'react/react-in-jsx-scope': 'off',
		},
		settings: {
			react: {
				version: '^19.2.0',
			},
		},
	},
]);
