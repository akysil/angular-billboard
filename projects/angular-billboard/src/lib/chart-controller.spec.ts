import type { Chart, ChartOptions } from 'billboard.js';
import { bb } from 'billboard.js';
import { afterEach, beforeEach, describe, expect, it, type Mock, type MockInstance, vi } from 'vitest';

import { ChartController } from './chart-controller';

const options: ChartOptions = { data: { columns: [['data1', 30, 200, 100]] } };

const destroySpies = new WeakMap<Chart, Mock<() => void>>();

function fakeChart(): Chart {
    const destroy = vi.fn<() => void>();
    const chart = { destroy } as unknown as Chart;

    destroySpies.set(chart, destroy);

    return chart;
}

function destroyOf(chart: Chart): Mock<() => void> | undefined {
    return destroySpies.get(chart);
}

describe('ChartController', () => {
    let controller: ChartController;
    let element: HTMLElement;
    let generate: MockInstance<typeof bb.generate>;

    beforeEach(() => {
        controller = new ChartController();
        element = document.createElement('div');
        generate = vi.spyOn(bb, 'generate').mockImplementation(() => fakeChart());
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('has no chart before create', () => {
        expect(controller.chart).toBeNull();
    });

    it('creates a chart bound to the element', () => {
        const chart = controller.create(element, options);

        expect(generate).toHaveBeenCalledOnce();
        expect(generate).toHaveBeenCalledWith({ ...options, bindto: element });
        expect(controller.chart).toBe(chart);
    });

    it('binds to the given element even when options set bindto', () => {
        controller.create(element, { ...options, bindto: '#elsewhere' });

        expect(generate.mock.calls[0][0].bindto).toBe(element);
    });

    it('does not mutate the options it is given', () => {
        const given: ChartOptions = { ...options };

        controller.create(element, given);

        expect(given).toEqual(options);
    });

    it('destroys the previous chart when create is called again', () => {
        const first = controller.create(element, options);
        const second = controller.create(element, options);

        expect(destroyOf(first)).toHaveBeenCalledOnce();
        expect(destroyOf(second)).not.toHaveBeenCalled();
        expect(controller.chart).toBe(second);
    });

    it('regenerates in the same element and destroys the previous chart', () => {
        const first = controller.create(element, options);
        const next: ChartOptions = { data: { columns: [['data2', 1, 2, 3]] } };

        const second = controller.regenerate(next);

        expect(destroyOf(first)).toHaveBeenCalledOnce();
        expect(generate).toHaveBeenLastCalledWith({ ...next, bindto: element });
        expect(second).not.toBe(first);
        expect(controller.chart).toBe(second);
    });

    it('throws on regenerate before create', () => {
        expect(() => controller.regenerate(options)).toThrowError('call create() before regenerate()');
        expect(generate).not.toHaveBeenCalled();
    });

    it('throws on regenerate after destroy', () => {
        controller.create(element, options);
        controller.destroy();

        expect(() => controller.regenerate(options)).toThrowError('call create() before regenerate()');
    });

    it('destroys the chart and clears it', () => {
        const chart = controller.create(element, options);

        controller.destroy();

        expect(destroyOf(chart)).toHaveBeenCalledOnce();
        expect(controller.chart).toBeNull();
    });

    it('is safe to destroy twice', () => {
        const chart = controller.create(element, options);

        controller.destroy();
        expect(() => controller.destroy()).not.toThrow();

        expect(destroyOf(chart)).toHaveBeenCalledOnce();
        expect(controller.chart).toBeNull();
    });

    it('is safe to destroy before create', () => {
        expect(() => controller.destroy()).not.toThrow();
        expect(controller.chart).toBeNull();
    });
});
