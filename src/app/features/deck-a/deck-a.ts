import { Component, ViewChild } from '@angular/core';
import { AudioEngine } from '../../core/audio-engine';
import { Waveform } from '../../shared/waveform/waveform';
import { DeckAudio } from '../../core/deck-audio';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-deck-a',
  imports: [Waveform, MatIcon],
  templateUrl: './deck-a.html',
  styleUrl: './deck-a.css',
})
export class DeckA {
  @ViewChild(Waveform) waveform!: Waveform;
  deckAudio!: DeckAudio;
  isPlaying: boolean = false;

  constructor(private audioEngine: AudioEngine) {}

  ngOnInit() {
    this.deckAudio = this.audioEngine.createDeck();
  }

  loadTrack(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.audioEngine.loadFileToBuffer(file).then((buffer) => {
      this.deckAudio.loadTrack(buffer);
      this.waveform.loadTrack(file);
    });
  }

  play() {
    if (this.isPlaying) {
      this.isPlaying = false;
      this.pause();
      return;
    }
    this.isPlaying = true;
    this.deckAudio.play();
    //this.waveform.play();
  }

  pause() {
    this.deckAudio.pause();
    // this.waveform.stop();
  }

  stop() {
    this.deckAudio.stop();
    //this.waveform.stop();
  }

  setVolume(event: any) {
    const value = parseFloat(event.target.value);
    this.deckAudio.setVolume(value);
  }

  setTempo(event: any) {
    const value = parseFloat(event.target.value);
    this.deckAudio.setTempo(value);
  }
}
