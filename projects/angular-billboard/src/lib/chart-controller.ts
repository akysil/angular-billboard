import type { Chart, ChartOptions } from 'billboard.js';
import { bb } from 'billboard.js';

/**
 * Owns the lifecycle of one billboard.js chart.
 *
 * @remarks
 * Plain TypeScript with no Angular dependency, so the same class works with every supported Angular version.
 */
export class ChartController {
    private current: Chart | null = null;
    private element: HTMLElement | null = null;

    /**
     * The current billboard.js chart, or `null` when there is none.
     */
    get chart(): Chart | null {
        return this.current;
    }

    /**
     * Creates a chart in `element`, destroying any chart this controller already owns.
     *
     * @param element - The element the chart renders into. It overrides any `bindto` in `options`.
     * @param options - billboard.js chart options.
     * @returns The new chart.
     */
    create(element: HTMLElement, options: ChartOptions): Chart {
        this.destroy();
        this.element = element;
        this.current = bb.generate({ ...options, bindto: element });

        return this.current;
    }

    /**
     * Destroys the chart. Safe to call more than once.
     */
    destroy(): void {
        this.current?.destroy();
        this.current = null;
        this.element = null;
    }

    /**
     * Destroys the current chart and creates a new one in the same element.
     *
     * @param options - billboard.js chart options.
     * @returns The new chart.
     * @throws Error when no chart was created, or after {@link ChartController.destroy}.
     */
    regenerate(options: ChartOptions): Chart {
        if (!this.element) {
            throw new Error('ChartController: call create() before regenerate().');
        }

        return this.create(this.element, options);
    }
}
