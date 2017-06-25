import { Injectable } from '@angular/core';
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
export { AngularBillboardService };
AngularBillboardService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
AngularBillboardService.ctorParameters = function () { return []; };
//# sourceMappingURL=angular-billboard.service.js.map