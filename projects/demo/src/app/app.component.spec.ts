import { TestBed } from '@angular/core/testing';

import { describe, expect, it } from 'vitest';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
    it('renders the heading', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();

        const element = fixture.nativeElement as HTMLElement;

        expect(element.querySelector('h1')?.textContent).toBe('angular-billboard demo');
    });
});
