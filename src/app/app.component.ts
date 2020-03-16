import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pwademo';
  constructor(private swUpdate: SwUpdate) {
    if (this.swUpdate.isEnabled) {
        this.swUpdate.available.subscribe(() => {
            if (confirm('New version available. Load New Version?')) {
                // tslint:disable-next-line: deprecation
                window.location.reload(true);
            }
        });
    }
}
}
