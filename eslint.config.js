import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import typescriptEslintParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';

const compat = new FlatCompat({
	recommendedConfig: js.configs.recommended,
});

export default [
	{
		ignores: [
			'**/node_modules/*',
			'**/dist/*',
			'**/.direnv/*',
			'**/eslint.config.js',
			'**/.prettierrc.cjs',
			'**/.git/*',
			'**/.storage/*',
			'**/.data/*',
		],
	},
	{
		files: ['**/*.ts', '**/*.js'],
		ignores: ['dist/**', 'eslint.config.js', '.prettierrc.cjs', '.direnv/**'],
		languageOptions: {
			parser: typescriptEslintParser,
			ecmaVersion: 2024,
			sourceType: 'module',
			globals: {
				module: 'readonly',
				require: 'readonly',
				exports: 'readonly',
				process: 'readonly',
				__dirname: 'readonly',
			},
		},
		plugins: {
			'@typescript-eslint': typescriptEslintPlugin,
			prettier: prettierPlugin,
		},
		rules: {
			'prettier/prettier': 'error',
			'@typescript-eslint/no-require-imports': 'off',
			'no-undef': 'off',
		},
	},
	{
		files: ['**/*.cjs'],
		languageOptions: {
			sourceType: 'script',
			globals: {
				module: 'readonly',
				require: 'readonly',
				exports: 'readonly',
				process: 'readonly',
				__dirname: 'readonly',
			},
		},
		rules: {
			'no-undef': 'off',
			'@typescript-eslint/no-require-imports': 'off',
		},
		env: {
			node: true,
		},
	},
	...compat.extends('eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'),
];
