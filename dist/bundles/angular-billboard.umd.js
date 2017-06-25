(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.angularBillboard = global.ng.angularBillboard || {}),global.ng.core));
}(this, (function (exports,_angular_core) { 'use strict';

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
AngularBillboardComponent.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'angular-billboard',
                template: '<!-- angular-billboard-chart -->'
            },] },
];
/** @nocollapse */
AngularBillboardComponent.ctorParameters = function () { return [
    { type: _angular_core.Renderer2, },
    { type: _angular_core.ElementRef, },
]; };
AngularBillboardComponent.propDecorators = {
    'chart': [{ type: _angular_core.Input },],
};

var bb = require('billboard.js').bb; // import a module with no types
var AngularBillboardService = (function () {
    function AngularBillboardService() {
    }
    AngularBillboardService.prototype.generate = function () {
        var data = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            data[_i] = arguments[_i];
        }
        return data.map(function (options) { return bb.generate(options); });
    };
    return AngularBillboardService;
}());
AngularBillboardService.decorators = [
    { type: _angular_core.Injectable },
];
/** @nocollapse */
AngularBillboardService.ctorParameters = function () { return []; };

var AngularBillboardModule = (function () {
    function AngularBillboardModule() {
    }
    return AngularBillboardModule;
}());
AngularBillboardModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                declarations: [AngularBillboardComponent],
                providers: [AngularBillboardService],
                exports: [AngularBillboardComponent]
            },] },
];
/** @nocollapse */
AngularBillboardModule.ctorParameters = function () { return []; };

/**
 * @module
 */

exports.AngularBillboardModule = AngularBillboardModule;
exports.AngularBillboardComponent = AngularBillboardComponent;
exports.AngularBillboardService = AngularBillboardService;

Object.defineProperty(exports, '__esModule', { value: true });

})));
