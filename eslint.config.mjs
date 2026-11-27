// @ts-check
import { fileURLToPath } from 'node:url';

import angular from '@angular-eslint/eslint-plugin';
import angularTemplate from '@angular-eslint/eslint-plugin-template';
import angularTemplateParser from '@angular-eslint/template-parser';
import js from '@eslint/js';
import vitest from '@vitest/eslint-plugin';
import jsonc from 'eslint-plugin-jsonc';
import perfectionist from 'eslint-plugin-perfectionist';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import sortDestructureKeys from 'eslint-plugin-sort-destructure-keys';
import tsdoc from 'eslint-plugin-tsdoc';
import tseslint from 'typescript-eslint';

const sortOptions = { ignoreCase: true, order: 'asc', type: 'natural' };

export default tseslint.config(
    { ignores: ['dist/', 'coverage/', '.angular/', 'node_modules/', 'package-lock.json'] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommendedTypeChecked, ...tseslint.configs.stylisticTypeChecked],
        files: ['**/*.ts', '**/*.mts'],
        languageOptions: { parserOptions: { projectService: true, tsconfigRootDir: fileURLToPath(new URL('.', import.meta.url)) } },
        plugins: {
            '@angular-eslint': angular,
            perfectionist,
            'simple-import-sort': simpleImportSort,
            'sort-destructure-keys': sortDestructureKeys,
            tsdoc,
        },
        processor: angularTemplate.processors['extract-inline-html'],
        rules: {
            ...angular.configs.recommended.rules,
            '@typescript-eslint/explicit-function-return-type': 'error',
            '@typescript-eslint/explicit-module-boundary-types': 'error',
            '@typescript-eslint/member-ordering': [
                'error',
                {
                    default: {
                        memberTypes: [
                            'private-static-field',
                            'protected-static-field',
                            'public-static-field',
                            'private-instance-field',
                            'protected-instance-field',
                            'public-instance-field',
                            'constructor',
                            'public-instance-method',
                            'protected-instance-method',
                            'private-instance-method',
                            'public-static-method',
                            'protected-static-method',
                            'private-static-method',
                        ],
                        order: 'alphabetically',
                    },
                    interfaces: { order: 'alphabetically' },
                },
            ],
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-floating-promises': ['error', { ignoreIIFE: true, ignoreVoid: true }],
            '@typescript-eslint/no-invalid-void-type': 'error',
            '@typescript-eslint/no-shadow': 'error',
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', ignoreRestSiblings: true }],
            '@typescript-eslint/prefer-enum-initializers': 'error',
            '@typescript-eslint/prefer-literal-enum-member': 'error',
            '@typescript-eslint/prefer-nullish-coalescing': 'error',
            '@typescript-eslint/prefer-optional-chain': 'error',
            '@typescript-eslint/restrict-template-expressions': 'off',
            '@typescript-eslint/switch-exhaustiveness-check': 'error',
            '@typescript-eslint/unified-signatures': 'error',
            'arrow-body-style': ['error', 'as-needed'],
            complexity: ['error', 15],
            eqeqeq: 'error',
            'no-alert': 'error',
            'no-console': 'error',
            'no-debugger': 'error',
            'no-multi-assign': 'error',
            'no-shadow': 'off',
            'no-throw-literal': 'error',
            'no-undef-init': 'error',
            'object-shorthand': ['error', 'always'],
            'perfectionist/sort-enums': ['error', sortOptions],
            'perfectionist/sort-interfaces': ['error', sortOptions],
            'perfectionist/sort-intersection-types': ['error', sortOptions],
            'perfectionist/sort-object-types': ['error', sortOptions],
            'perfectionist/sort-objects': ['error', sortOptions],
            'perfectionist/sort-union-types': ['error', sortOptions],
            'prefer-destructuring': 'error',
            'simple-import-sort/exports': 'error',
            'simple-import-sort/imports': [
                'error',
                {
                    groups: [
                        ['^\\^@'],
                        ['^node:'],
                        ['^@angular/'],
                        ['^@?\\w'],
                        ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
                        ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
                        ['^.+\\.s?css$'],
                    ],
                },
            ],
            'sort-destructure-keys/sort-destructure-keys': 'error',
            'spaced-comment': ['error', 'always', { block: { balanced: true } }],
            'tsdoc/syntax': 'error',
        },
    },
    {
        files: ['projects/angular-billboard/**/*.ts'],
        rules: {
            '@angular-eslint/component-selector': ['error', { prefix: 'angular', style: 'kebab-case', type: 'element' }],
            '@angular-eslint/directive-selector': ['error', { prefix: 'angular', style: 'camelCase', type: 'attribute' }],
        },
    },
    {
        files: ['projects/demo/**/*.ts'],
        rules: {
            '@angular-eslint/component-selector': ['error', { prefix: 'app', style: 'kebab-case', type: 'element' }],
            '@angular-eslint/directive-selector': ['error', { prefix: 'app', style: 'camelCase', type: 'attribute' }],
        },
    },
    {
        files: ['**/*.html'],
        ignores: ['projects/*/src/index.html'],
        languageOptions: { parser: angularTemplateParser },
        plugins: { '@angular-eslint/template': angularTemplate },
        rules: {
            ...angularTemplate.configs.recommended.rules,
            ...angularTemplate.configs.accessibility.rules,
        },
    },
    {
        extends: [vitest.configs.recommended],
        files: ['**/*.spec.ts'],
    },
    {
        extends: [tseslint.configs.disableTypeChecked],
        files: ['**/*.{js,mjs,cjs}'],
    },
    {
        extends: [...jsonc.configs['flat/recommended-with-json']],
        files: ['**/*.json'],
        ignores: ['**/tsconfig*.json'],
        rules: { 'jsonc/sort-keys': ['error', 'asc', { caseSensitive: false, natural: true }] },
    },
    {
        extends: [...jsonc.configs['flat/recommended-with-jsonc']],
        files: ['**/tsconfig*.json'],
        rules: { 'jsonc/sort-keys': ['error', 'asc', { caseSensitive: false, natural: true }] },
    },
    prettierRecommended,
);
