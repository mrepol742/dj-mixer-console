import { Component, signal } from '@angular/core';
import { DevtoolsDetector } from './utils/devtools-dectector';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class App {
  protected readonly title = signal('dj-mixer');

  constructor(private _devtoolsDetector: DevtoolsDetector) {}

  ngOnInit() {
    this._devtoolsDetector.init();
  }
}
