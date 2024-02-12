module.exports = {
	extends: ['airbnb-typescript/base', 'plugin:@typescript-eslint/recommended', 'prettier'],
	plugins: ['import', 'prettier', '@typescript-eslint'],
	parserOptions: {
		project: './tsconfig.json',
	},
	rules: {
		quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
		'import/prefer-default-export': 'off', //prefer default export
		'@typescript-eslint/no-empty-interface': 'off', // no empty interface
		'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], //no unused vars
		'no-underscore-dangle': ['error', { allow: ['_id', '_update', '_doc'] }], // no under score
		'class-methods-use-this': 'off', // allow this
		'@typescript-eslint/no-non-null-assertion': 'off', // null assertion allow
	},
}
