import { Component, ElementRef, Input, Renderer2 } from '@angular/core';
var AngularBillboardComponent = (function () {
    function AngularBillboardComponent(renderer, elementRef) {
        this.renderer = renderer;
        this.elementRef = elementRef;
        this.el = elementRef.nativeElement;
    }
    AngularBillboardComponent.prototype.ngOnInit = function () {
        this.renderer.appendChild(this.el, this.chart.element);
    };
    return AngularBillboardComponent;
}());
export { AngularBillboardComponent };
AngularBillboardComponent.decorators = [
    { type: Component, args: [{
                selector: 'angular-billboard',
                template: '<!-- angular-billboard-chart -->'
            },] },
];
/** @nocollapse */
AngularBillboardComponent.ctorParameters = function () { return [
    { type: Renderer2, },
    { type: ElementRef, },
]; };
AngularBillboardComponent.propDecorators = {
    'chart': [{ type: Input },],
};
//# sourceMappingURL=angular-billboard.component.js.map