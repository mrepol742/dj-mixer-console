import { Component, signal, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Mixer } from './features/mixer/mixer';
import { DeckA } from './features/deck-a/deck-a';
import { DeckB } from './features/deck-b/deck-b';
import { Effects } from './features/effects/effects';
import { Recorder } from './features/recorder/recorder';
import { Library } from './features/library/library';
import { AudioEngine } from './core/audio-engine';
@Component({
  selector: 'app-root',
  imports: [DeckA, DeckB, Effects, Recorder, Mixer, Library, MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('dj-mixer');
}
