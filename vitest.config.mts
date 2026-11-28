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
        },
        environment: 'jsdom',
        globals: true,
        include: ['projects/**/*.spec.ts'],
        setupFiles: ['test-setup.ts'],
    },
});
