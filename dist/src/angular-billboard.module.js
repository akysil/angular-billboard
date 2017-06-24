import { NgModule } from '@angular/core';
import { AngularBillboardComponent } from './angular-billboard.component';
import { AngularBillboardService } from './angular-billboard.service';
var AngularBillboardModule = (function () {
    function AngularBillboardModule() {
    }
    return AngularBillboardModule;
}());
export { AngularBillboardModule };
AngularBillboardModule.decorators = [
    { type: NgModule, args: [{
                declarations: [AngularBillboardComponent],
                providers: [AngularBillboardService],
                exports: [AngularBillboardComponent]
            },] },
];
/** @nocollapse */
AngularBillboardModule.ctorParameters = function () { return []; };
//# sourceMappingURL=angular-billboard.module.js.map