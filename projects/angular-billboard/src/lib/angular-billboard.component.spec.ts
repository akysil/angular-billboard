import { TestBed } from '@angular/core/testing';

import { describe, expect, it } from 'vitest';

import { AngularBillboardComponent } from './angular-billboard.component';

describe('AngularBillboardComponent', () => {
    it('creates', () => {
        const fixture = TestBed.createComponent(AngularBillboardComponent);

        expect(fixture.componentInstance).toBeInstanceOf(AngularBillboardComponent);
    });
});
