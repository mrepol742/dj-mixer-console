import { Component, signal, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { EffectsComponent } from './effects/effects.component';
import { RecorderComponent } from './recorder/recorder.component';
import { MixerComponent } from './mixer/mixer.component';
import { LibraryComponent } from './library/library.component';
import { PlayerComponent } from './player/player.component';

@Component({
  selector: 'app-console',
  imports: [CommonModule, EffectsComponent, RecorderComponent, MixerComponent, LibraryComponent, PlayerComponent, MatIconModule],
  templateUrl: './console.component.html',
  styleUrl: './console.component.css',
})
export class ConsoleComponent {}
