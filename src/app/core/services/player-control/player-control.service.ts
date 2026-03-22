import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DeckAudioService } from '../deck-audio/deck-audio.service';
import { AudioEngineService } from '../audio-engine/audio-engine.service';
import { extractMetadata } from '../../../utils/media';
import { Library } from './player-control.types';

@Injectable({ providedIn: 'root' })
export class PlayerControlService {
  private _isPlaying = new BehaviorSubject<boolean>(false);
  isPlaying$ = this._isPlaying.asObservable();
  deckAudio!: DeckAudioService;
  private _isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this._isLoading.asObservable();
  _trackInfo$ = new BehaviorSubject<Library | null>(null);
  trackInfo$ = this._trackInfo$.asObservable();
  private _isPlayerReady = new BehaviorSubject<boolean>(false);
  isPlayerReady$ = this._isPlayerReady.asObservable();

  constructor(private audioEngine: AudioEngineService) {
    this.deckAudio = this.audioEngine.createDeck();
  }

  setVolume(value: number) {
    this.deckAudio.gainNode.gain.value = value;
  }

  updateProgress() {
    return this.deckAudio.getProgress();
  }

  async play(track: Library) {
    if (this._isPlaying.getValue() && !this._isLoading.getValue()) {
      this.deckAudio.stop();
    }

    this._isPlayerReady.next(true);
    this._isPlaying.next(true);
    this._isLoading.next(true);

    await this.blobUrlToBlob(track.url).then(async (blob) => {
      const metadataPromise = await extractMetadata(blob, track.url, track.title);
      this._trackInfo$.next(metadataPromise);
    });

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

  async stop() {
    this.deckAudio.stop();
    this._isPlaying.next(false);
    this._isPlayerReady.next(false);
  }

  async paused() {
    if (!this._isPlaying.getValue()) {
      this.deckAudio.resume();
      this._isPlayerReady.next(true);
      this._isPlaying.next(true);
      return;
    }
    this.deckAudio.pause();
    this._isPlaying.next(false);
  }

  private blobUrlToBlob(blobUrl: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', blobUrl);
      xhr.responseType = 'blob';

      xhr.onload = () => resolve(xhr.response);
      xhr.onerror = () => reject(new Error('Failed to convert blob URL'));

      xhr.send();
    });
  }
}
