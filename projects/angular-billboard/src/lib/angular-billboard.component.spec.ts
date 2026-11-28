import { ChangeDetectionStrategy, Component, NgZone, ɵprovideZonelessChangeDetection as provideZonelessChangeDetection, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';

import type { Chart, ChartOptions } from 'billboard.js';
import { bb } from 'billboard.js';
import { afterEach, beforeEach, describe, expect, it, type Mock, type MockInstance, vi } from 'vitest';

import { AngularBillboardComponent } from './angular-billboard.component';

const first: ChartOptions = { data: { columns: [['data1', 30, 200, 100]] } };
const second: ChartOptions = { data: { columns: [['data2', 1, 2, 3]] } };

interface FakeChart {
    destroy: Mock<() => void>;
    inAngularZone: boolean;
}

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AngularBillboardComponent],
    selector: 'angular-test-host',
    standalone: true,
    template: '<angular-billboard [options]="options()" (chartInit)="charts.push($event)" />',
})
class HostComponent {
    readonly charts: Chart[] = [];
    readonly options = signal<ChartOptions>(first);
}

function chartElement(fixture: ComponentFixture<HostComponent>): HTMLElement {
    return (fixture.nativeElement as HTMLElement).querySelector('angular-billboard')!;
}

function fake(chart: Chart | undefined): FakeChart {
    return chart as unknown as FakeChart;
}

describe('AngularBillboardComponent', () => {
    let generate: MockInstance<typeof bb.generate>;

    beforeEach(() => {
        generate = vi.spyOn(bb, 'generate').mockImplementation(() => {
            const chart: FakeChart = { destroy: vi.fn<() => void>(), inAngularZone: NgZone.isInAngularZone() };

            return chart as unknown as Chart;
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe.each([
        { name: 'with zone.js', providers: [], zoneless: false },
        { name: 'zoneless', providers: [provideZonelessChangeDetection()], zoneless: true },
    ])('$name', ({ providers, zoneless }) => {
        let fixture: ComponentFixture<HostComponent>;
        let host: HostComponent;

        async function settle(): Promise<void> {
            if (!zoneless) {
                // Change detection runs inside the Angular zone, as it does in an application.
                TestBed.inject(NgZone).run(() => {
                    fixture.detectChanges();
                    TestBed.flushEffects();
                });
            }

            await fixture.whenStable();
        }

        beforeEach(async () => {
            TestBed.configureTestingModule({ providers });
            fixture = TestBed.createComponent(HostComponent);
            host = fixture.componentInstance;
            await settle();
        });

        it('creates the chart once after render and emits it', async () => {
            await settle();

            expect(generate).toHaveBeenCalledOnce();
            expect(generate).toHaveBeenCalledWith({ ...first, bindto: chartElement(fixture) });
            expect(host.charts).toEqual([generate.mock.results[0].value]);
        });

        it('creates the chart outside the Angular zone', () => {
            expect(fake(host.charts[0]).inAngularZone).toBe(false);
        });

        it('destroys the old chart and creates a new one when options change', async () => {
            const [old] = host.charts;

            host.options.set(second);
            await settle();

            expect(fake(old).destroy).toHaveBeenCalledOnce();
            expect(generate).toHaveBeenCalledTimes(2);
            expect(generate).toHaveBeenLastCalledWith({ ...second, bindto: chartElement(fixture) });
            expect(host.charts).toHaveLength(2);
            expect(fake(host.charts[1]).destroy).not.toHaveBeenCalled();
        });

        it('destroys the chart when the component is destroyed', () => {
            const [chart] = host.charts;

            fixture.destroy();

            expect(fake(chart).destroy).toHaveBeenCalledOnce();
        });
    });

    it('lets a chartInit handler write signals', async () => {
        @Component({
            imports: [AngularBillboardComponent],
            selector: 'angular-test-signal-host',
            standalone: true,
            template: '<angular-billboard [options]="options" (chartInit)="chart.set($event)" />',
        })
        class SignalHostComponent {
            readonly chart = signal<Chart | null>(null);
            readonly options = first;
        }

        const fixture = TestBed.createComponent(SignalHostComponent);

        fixture.detectChanges();
        TestBed.flushEffects();
        await fixture.whenStable();

        expect(fixture.componentInstance.chart()).toBe(generate.mock.results[0].value);
    });
});
