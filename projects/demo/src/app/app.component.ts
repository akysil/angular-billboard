import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Root component of the demo application.
 */
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
})
export class AppComponent {}
