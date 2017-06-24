import { Injectable } from '@angular/core';

declare function require(module: string): any;
const {bb} = require('billboard.js'); // no types import

@Injectable()
export class AngularBillboardService {
    
    generate(...data: any[]) {
        return data.map((options: any) => bb.generate(options));
    }
}
