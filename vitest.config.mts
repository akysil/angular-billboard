import angular from '@analogjs/vite-plugin-angular';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [angular({ tsconfig: 'tsconfig.spec.json' })],
    test: {
        coverage: {
            exclude: ['**/*.spec.ts'],
            include: ['projects/angular-billboard/src/**/*.ts'],
            provider: 'v8',
            reporter: ['text', 'html', 'lcov'],
            thresholds: {
                branches: 100,
                functions: 100,
                lines: 100,
                statements: 100,
            },
        },
        environment: 'jsdom',
        globals: true,
        include: ['projects/**/*.spec.ts'],
        setupFiles: ['test-setup.ts'],
    },
});
