import { Component, signal, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Mixer } from './features/mixer/mixer';
import { Effects } from './features/effects/effects';
import { Recorder } from './features/recorder/recorder';
import { LibraryFeature } from './features/library/library';
import { DevtoolsDetector } from './core/security/devtools-dectector';
import { Player } from './features/player/player';

@Component({
  selector: 'app-root',
  imports: [Effects, Recorder, Mixer, LibraryFeature, Player, MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('dj-mixer');

  constructor(private _devtoolsDetector: DevtoolsDetector) {}

  ngOnInit() {
    this._devtoolsDetector.init();
  }
}
