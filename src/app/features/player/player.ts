import { Component, inject, NgZone } from '@angular/core';
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
  constructor(private ngZone: NgZone) {}

  playerControl = inject(PlayerControl);

  isPlaying$ = this.playerControl.isPlaying$;
  isLoading$ = this.playerControl.isLoading$;
  trackInfo$ = this.playerControl.trackInfo$;
  isPlayerReady$ = this.playerControl.isPlayerReady$;

  progress = 0;

  ngOnInit() {
    this.updateProgress();
  }

  togglePlay() {
    this.playerControl.paused();
  }

  setVolume(event: any) {
    const value = parseFloat(event.target.value);
    this.playerControl.setVolume(value);
  }

  updateProgress() {
    this.ngZone.run(() => {
      this.progress = this.playerControl.updateProgress();
    });

    requestAnimationFrame(() => this.updateProgress());
  }

  closePlayer() {
    this.playerControl.stop();
  }
}
