import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { PlayerControl } from '../../core/player-control';

@Component({
  selector: 'app-player',
  imports: [CommonModule, MatIcon],
  templateUrl: './player.html',
  styleUrl: './player.css',
})
export class Player {
  playerControl = inject(PlayerControl);

  isPlaying$ = this.playerControl.isPlaying$;
  isLoading$ = this.playerControl.isLoading$;
}
