import { NgModule } from '@angular/core';

import { AngularBillboardComponent } from './angular-billboard.component';
import { AngularBillboardService } from './angular-billboard.service';

@NgModule({
    declarations: [AngularBillboardComponent],
    providers:    [AngularBillboardService],
    exports:      [AngularBillboardComponent]
})
export class AngularBillboardModule {
}
