import { Component, signal, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RecorderComponent } from './recorder/recorder.component';
import { MixerComponent } from './mixer/mixer.component';
import { LibraryComponent } from './library/library.component';
import { PlayerComponent } from './player/player.component';
import { DividerComponent } from '../shared/divider/divider.component';

@Component({
  selector: 'app-console',
  imports: [
    CommonModule,
    RecorderComponent,
    MixerComponent,
    LibraryComponent,
    PlayerComponent,
    MatIconModule,
    DividerComponent,
  ],
  templateUrl: './console.component.html',
  styleUrl: './console.component.css',
})
export class ConsoleComponent {}
