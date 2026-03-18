import { Component, inject, NgZone } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { PlayerControlService } from '../../core/services/player-control/player-control.service';

@Component({
  selector: 'app-player',
  imports: [CommonModule, MatIcon],
  templateUrl: './player.component.html',
  styleUrl: './player.component.css',
})
export class PlayerComponent {
  constructor(private ngZone: NgZone) {}

  playerControl = inject(PlayerControlService);

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
