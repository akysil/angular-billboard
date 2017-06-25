import { Injectable } from '@angular/core';

declare function require(module: string): any;
const {bb} = require('billboard.js'); // import a module with no types

@Injectable()
export class AngularBillboardService {
    
    generate(...data: any[]) {
        return data.map((options: any) => bb.generate(options));
    }
}
