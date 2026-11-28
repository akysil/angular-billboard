import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, effect, ElementRef, inject, Injector, input, NgZone, output, untracked } from '@angular/core';

import type { Chart, ChartOptions } from 'billboard.js';

import { ChartController } from './chart-controller';

/**
 * Renders a billboard.js chart.
 *
 * @remarks
 * The chart is created in the browser after the first render, never during server-side rendering.
 * It is created again whenever `options` changes, and destroyed with the component.
 *
 * @example
 * ```html
 * <angular-billboard [options]="options" (chartInit)="chart = $event" />
 * ```
 */
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'angular-billboard',
    standalone: true,
    template: '',
})
export class AngularBillboardComponent {
    private readonly controller = new ChartController();
    private readonly element: HTMLElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    private readonly injector = inject(Injector);
    private readonly zone = inject(NgZone);

    /**
     * Emits the billboard.js chart each time one is created.
     */
    readonly chartInit = output<Chart>();

    /**
     * billboard.js chart options. Any `bindto` is ignored: the chart renders into this component.
     */
    readonly options = input.required<ChartOptions>();

    constructor() {
        inject(DestroyRef).onDestroy(() => this.controller.destroy());

        afterNextRender(() => {
            effect(
                () => {
                    const options = this.options();

                    untracked(() => this.render(options));
                },
                { injector: this.injector },
            );
        });
    }

    private render(options: ChartOptions): void {
        const chart = this.zone.runOutsideAngular(() => this.controller.create(this.element, options));

        this.chartInit.emit(chart);
    }
}
