import { ElementRef, OnInit, Renderer2 } from '@angular/core';
export declare class AngularBillboardComponent implements OnInit {
    private renderer;
    private elementRef;
    private el;
    private chart;
    constructor(renderer: Renderer2, elementRef: ElementRef);
    ngOnInit(): void;
}
