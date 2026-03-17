import { Component, ViewChild } from '@angular/core';
import { DeckA } from '../deck-a/deck-a';
import { DeckB } from '../deck-b/deck-b';
import { AudioEngine } from '../../core/audio-engine';

@Component({
  selector: 'app-mixer',
  imports: [DeckA, DeckB],
  templateUrl: './mixer.html',
  styleUrl: './mixer.css',
})
export class Mixer {
  @ViewChild('deckRefA') deckA!: DeckA;
  @ViewChild('deckRefB') deckB!: DeckB;

  constructor(private audioEngine: AudioEngine) {}

  setCrossfader(event: any) {
    if (!this.deckA || !this.deckB) {
      console.warn('Decks are still not found!');
      return;
    }

    const value = parseFloat(event.target.value);
    this.audioEngine.setCrossfader(
      this.deckA.deckAudio.gainNode,
      this.deckB.deckAudio.gainNode,
      value,
    );
  }

  setMasterVolumne(event: any) {
    const value = parseFloat(event.target.value);
    this.audioEngine.setMasterVolume(value);
  }
}
