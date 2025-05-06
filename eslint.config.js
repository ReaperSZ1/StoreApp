import globals from 'globals';
import pluginJs from '@eslint/js';
import prettier from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		languageOptions: {
			globals: {
				...globals.node, // Mantém as variáveis globais do Node.js
				// Adiciona variáveis do ambiente de navegador
				document: 'readonly',
				window: 'readonly',
				console: 'readonly',
				navigator: 'readonly',
				localStorage: 'readonly',
				sessionStorage: 'readonly'
			},
			env: {
				jest: true // Isso permite o uso de funções do Jest
			}
		}
	},
	pluginJs.configs.recommended,
	prettier,
	{
		rules: {
			'capitalized-comments': 'off',
			semi: ['error', 'always'], // Exige ponto e vírgula sempre
			indent: 'off' // Desativa a verificação de indentação (tabulação)
		}
	}
];
