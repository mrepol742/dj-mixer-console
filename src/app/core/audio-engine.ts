import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DeckAudio } from './deck-audio';

@Injectable({
  providedIn: 'root',
})
export class AudioEngine {
  audioContext!: AudioContext;
  deckAGain: any;
  deckBGain: any;
  source: any;
  gainNode: any;
  audioBuffer: any;

  initAudio() {
    if (this.audioContext) return;

    if (typeof window === 'undefined') {
      throw new Error('WebAudio cannot run on server');
    }

    const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;

    if (!AudioContextClass) {
      throw new Error('Web Audio API not supported');
    }

    this.audioContext = new AudioContextClass();

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    this.deckAGain = this.audioContext.createGain();
    this.deckBGain = this.audioContext.createGain();
    this.gainNode = this.audioContext.createGain();

    this.deckAGain.connect(this.audioContext.destination);
    this.deckBGain.connect(this.audioContext.destination);
    this.gainNode.connect(this.audioContext.destination);
  }

  createDeck(): DeckAudio {
    if (!this.audioContext) {
      this.initAudio();
    }

    if (!this.audioContext) {
      throw new Error('AudioContext not initialized');
    }

    return new DeckAudio(this.audioContext, this.gainNode);
  }

  async loadFileToBuffer(file: File): Promise<AudioBuffer> {
    if (!this.audioContext) {
      this.initAudio();
    }

    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
  }

  async loadTrackFromUrl(url: string): Promise<AudioBuffer> {
    if (!this.audioContext) {
      this.initAudio();
    }

    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
  }

  play() {
    if (!this.audioBuffer) return;

    this.source = this.audioContext.createBufferSource();
    this.source.buffer = this.audioBuffer;

    this.source.connect(this.gainNode);

    this.source.start();
  }

  stop() {
    if (this.source) {
      this.source.stop();
    }
  }

  setVolume(value: number) {
    this.gainNode.gain.value = value;
  }

  setMasterVolume(deckAGain: GainNode, deckBGain: GainNode, value: number) {
    this.gainNode.gain.value = value;
  }

  setTempo(value: number) {
    if (this.source) {
      this.source.playbackRate.value = value;
    }
  }

  setCrossfader(deckAGain: GainNode, deckBGain: GainNode, value: number) {
    deckAGain.gain.value = 1 - value;
    deckBGain.gain.value = value;
  }
}
