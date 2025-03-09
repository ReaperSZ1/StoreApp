import globals from 'globals';
import pluginJs from '@eslint/js';
import prettier from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
	{ languageOptions: { globals: globals.node } },
	pluginJs.configs.recommended,
	prettier,
	{
		rules: {
            "capitalized-comments": 'off',
			semi: ['error', 'always'], // Exige ponto e vírgula sempre
			indent: 'off' // Desativa a verificação de indentação (tabulação)
		}
	}
];
