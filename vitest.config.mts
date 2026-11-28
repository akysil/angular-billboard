import angular from '@analogjs/vite-plugin-angular';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [angular({ tsconfig: 'tsconfig.spec.json' })],
    test: {
        coverage: {
            // deploy-demo.mjs only forwards to demo-site.mjs; its spec runs it in a child process, which coverage cannot see.
            exclude: ['**/*.spec.ts', '**/*.spec.mjs', 'scripts/deploy-demo.mjs'],
            include: ['projects/angular-billboard/src/**/*.ts', 'scripts/**/*.mjs'],
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
        include: ['projects/**/*.spec.ts', 'scripts/**/*.spec.mjs'],
        setupFiles: ['test-setup.ts'],
    },
});
