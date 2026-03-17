import { Component, ViewChild } from '@angular/core';
import { AudioEngine } from '../../core/audio-engine';
import { Waveform } from '../../shared/waveform/waveform';
import { DeckAudio } from '../../core/deck-audio';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-deck-b',
  imports: [Waveform, MatIcon],
  templateUrl: './deck-b.html',
  styleUrl: './deck-b.css',
})
export class DeckB {
  @ViewChild(Waveform) waveform!: Waveform;
  deckAudio!: DeckAudio;
  isPlaying: boolean = false;

  constructor(private audioEngine: AudioEngine) {}

  ngAfterViewInit() {
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

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (!event.dataTransfer?.files) return;

    const file = event.dataTransfer.files[0];
    if (!file.type.startsWith('audio/')) return;

    this.audioEngine.loadFileToBuffer(file).then((buffer) => {
      this.deckAudio.loadTrack(buffer);
      this.waveform.loadTrack(file);
    });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
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
    const value = event.target.value;
    this.deckAudio.setVolume(value);
  }

  setTempo(event: any) {
    const value = event.target.value;
    this.deckAudio.setTempo(value);
  }
}
