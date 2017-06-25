# angular-billboard #

[![NPM Version](http://img.shields.io/npm/v/angular-billboard.svg?style=flat)](https://www.npmjs.com/package/angular-billboard)

[billboard.js](https://naver.github.io/billboard.js/) for Angular.

## Install ##
1. Install via npm:

    ```bash
    npm install angular-billboard --save
    ```
    
2. Import basic billboard.js styles. For example, directly in html:

    ```html
    <link rel="stylesheet" href="http://naver.github.io/billboard.js/release/latest/dist/billboard.min.css">
    ```
    
    Or in .angular-cli.json if you use [Angular CLI](https://cli.angular.io/)
    ```json
    {
        "apps": [
            {
                "styles": [
                    "../node_modules/billboard.js/dist/billboard.min.css"
                ]
            }
        ]
    }
    ```
    
## Usage ##

#### Module ####

Include the `AngularBillboardModule` in your app root module.

```typescript
    // app.module.ts 
    import { NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { AppComponent } from './app.component';
    import { AngularBillboardModule } from 'angular-billboard';
    
    @NgModule({
        declarations: [AppComponent],
        imports:      [BrowserModule, AngularBillboardModule],
        bootstrap:    [AppComponent]
    })
    export class AppModule {}
``` 

#### Component ####

Inject the `AngularBillboardService` where you need it.

```typescript
    // app.component.ts
    import { Component, OnInit } from '@angular/core';
    import { AngularBillboardService } from 'angular-billboard'
    
    @Component({
        selector:    'app-root',
        templateUrl: './app.component.html'
    })
    export class AppComponent implements OnInit {
        
        charts: any[];
        chartsOptions: any[];
        
        constructor(private angularBillboardService: AngularBillboardService) {}
        
        ngOnInit() {
            this.chartsOptions = [
                {
                    data:  {
                        type:    'bar',
                        columns: [
                            ['data1', 30, 200, 100, 170, 150, 250],
                            ['data2', 130, 100, 140, 35, 110, 50],
                            ['data3', 10, 80, 240, 35, 11, 70]
                        ]
                    },
                    title: {
                        text: 'Bar'
                    }
                }
            ];
            this.charts = this.angularBillboardService.generate(...this.chartsOptions);
        }
    }
```

#### Template ####

Use `<angular-billboard>` tag in template. The component needs a billboards.js chart object passed as the `chart` argument.

```html
    <!-- app.component.html -->
    <angular-billboard *ngFor="let chart of charts" [chart]="chart">
    </angular-billboard>
```

## API ##

The API follows the [billboard.js API](https://naver.github.io/billboard.js/release/latest/doc/)

## License ##

MIT
