const { FlatCompat } = require('@eslint/eslintrc');

const js = require( "@eslint/js");

const compat = new FlatCompat({
    recommendedConfig: js.configs.recommended
});

module.exports = [
    ...compat.extends('eslint:recommended', 'plugin:react/recommended', 'plugin:@typescript-eslint/recommended', 'prettier', 'plugin:prettier/recommended'),
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: '@typescript-eslint/parser',
        },
        plugins: {
            '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
            'react': require('eslint-plugin-react'),
            'prettier': require('eslint-plugin-prettier'),
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            'prettier/prettier': 'error',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
];