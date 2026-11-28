import { ChangeDetectionStrategy, Component, destroyPlatform } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideServerRendering, renderApplication } from '@angular/platform-server';

import type { ChartOptions } from 'billboard.js';
import { bb } from 'billboard.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AngularBillboardComponent } from './angular-billboard.component';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AngularBillboardComponent],
    selector: 'angular-test-host',
    standalone: true,
    template: '<angular-billboard [options]="options" />',
})
class HostComponent {
    readonly options: ChartOptions = { data: { columns: [['data1', 30, 200, 100]] } };
}

describe('AngularBillboardComponent on the server', () => {
    beforeEach(() => {
        destroyPlatform();
    });

    afterEach(() => {
        destroyPlatform();
        vi.restoreAllMocks();
    });

    it('renders without calling billboard.js', async () => {
        const generate = vi.spyOn(bb, 'generate');

        const html = await renderApplication(() => bootstrapApplication(HostComponent, { providers: [provideServerRendering()] }), {
            document: '<html><body><angular-test-host></angular-test-host></body></html>',
        });

        expect(html).toContain('<angular-billboard');
        expect(generate).not.toHaveBeenCalled();
    });
});
