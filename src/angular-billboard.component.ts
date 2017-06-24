import {
    Component,
    ElementRef,
    Input,
    OnInit,
    Renderer2
} from '@angular/core';

@Component({
    selector: 'angular-billboard',
    template: '<!-- angular-billboard-chart -->'
})
export class AngularBillboardComponent implements OnInit {
    
    private el: HTMLElement;
    @Input() private chart: any;
    
    constructor(private renderer: Renderer2, private elementRef: ElementRef) {
        this.el = elementRef.nativeElement;
    }
    
    ngOnInit() {
        this.renderer.appendChild(this.el, this.chart.element);
    }
}
