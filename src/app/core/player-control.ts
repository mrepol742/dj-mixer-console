import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DeckAudio } from './deck-audio';
import { AudioEngine } from './audio-engine';
import { Library } from '../features/library/library.types';

@Injectable({ providedIn: 'root' })
export class PlayerControl {
  private _isPlaying = new BehaviorSubject<boolean>(false);
  isPlaying$ = this._isPlaying.asObservable();
  deckAudio!: DeckAudio;
  private _isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this._isLoading.asObservable();

  constructor(private audioEngine: AudioEngine) {
    this.deckAudio = this.audioEngine.createDeck();
  }

  play(track: Library) {
    if (this._isPlaying.getValue() && !this._isLoading.getValue()) {
      this.deckAudio.stop();
    }

    this._isPlaying.next(true);
    this._isLoading.next(true);

    this.audioEngine
      .loadTrackFromUrl(track.url)
      .then((buffer) => {
        this.deckAudio.loadTrack(buffer);
        this.deckAudio.play();
        this._isLoading.next(false);
      })
      .catch(() => {
        this._isPlaying.next(false);
        this._isLoading.next(false);
      });
  }
}
