import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DeckAudio } from './deck-audio';
import { AudioEngine } from './audio-engine';
import { Library } from '../features/library/library.types';
import * as jsmediatags from 'jsmediatags/dist/jsmediatags.min.js';

export interface Metadata {
  tags: {
    title?: string;
    artist?: string;
    album?: string;
    picture?: {
      data: number[];
      format: string;
    };
  };
}

export interface MetadataResult {
  title: string;
  artist: string;
  album: string;
  coverUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class PlayerControl {
  private _isPlaying = new BehaviorSubject<boolean>(false);
  isPlaying$ = this._isPlaying.asObservable();
  deckAudio!: DeckAudio;
  private _isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this._isLoading.asObservable();
  _trackInfo$ = new BehaviorSubject<MetadataResult>({
    title: 'Unknown Title',
    artist: 'Unknown Artist',
    album: 'Unknown Album',
  });
  trackInfo$ = this._trackInfo$.asObservable();
  private _isPlayerReady = new BehaviorSubject<boolean>(false);
  isPlayerReady$ = this._isPlayerReady.asObservable();

  constructor(private audioEngine: AudioEngine) {
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
      const metadataPromise = await this.extractMetadata(blob, track.name);
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

  private extractMetadata(blob: Blob, fileName: string): Promise<MetadataResult> {
    return new Promise((resolve) => {
      jsmediatags.read(blob, {
        onSuccess: (tag: Metadata) => {
          const { title, artist, album } = tag.tags;
          let coverUrl: string | undefined;

          if (tag.tags.picture) {
            const { data, format } = tag.tags.picture;
            const byteArray = new Uint8Array(data);
            const blob = new Blob([byteArray], { type: format });
            coverUrl = URL.createObjectURL(blob);
          }

          resolve({
            title: title || fileName,
            artist: artist || 'Unknown Artist',
            album: album || 'Unknown Album',
            coverUrl,
          });
        },
        onError: () => {
          resolve({ title: 'Unknown Title', artist: 'Unknown Artist', album: 'Unknown Album' });
        },
      });
    });
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
