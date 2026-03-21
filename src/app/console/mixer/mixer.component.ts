import { Component, ViewChild } from '@angular/core';
import { DeckAComponent } from './deck-a/deck-a.component';
import { DeckBComponent } from './deck-b/deck-b.component';
import { AudioEngineService } from '../../core/services/audio-engine/audio-engine.service';
import { KnobComponent } from '../../shared/knob/knob.component';
import { SliderComponent } from '../../shared/slider/slider.component';
import { DividerComponent } from '../../shared/divider/divider.component';

@Component({
  selector: 'app-mixer',
  imports: [DeckAComponent, DeckBComponent, KnobComponent, SliderComponent, DividerComponent],
  templateUrl: './mixer.component.html',
  styleUrl: './mixer.component.css',
})
export class MixerComponent {
  @ViewChild('deckRefA') deckA!: DeckAComponent;
  @ViewChild('deckRefB') deckB!: DeckBComponent;

  constructor(private audioEngine: AudioEngineService) {}

  setCrossfader(event: any) {
    if (!this.deckA || !this.deckB) {
      console.warn('Decks are still not found!');
      return;
    }

    const value = parseFloat(event);
    this.audioEngine.setCrossfader(
      this.deckA.deckAudio.gainNode,
      this.deckB.deckAudio.gainNode,
      value,
    );
  }

  setMasterVolumne(event: any) {
    const value = parseFloat(event);
    this.audioEngine.setMasterVolume(
      this.deckA.deckAudio.gainNode,
      this.deckB.deckAudio.gainNode,
      value,
    );
  }

  setTempo(event: any) {
    const value = parseFloat(event);
    this.deckA.deckAudio.setTempo(value);
    this.deckB.deckAudio.setTempo(value);
  }

  setLow(event: any) {
    const value = parseFloat(event);
    this.deckA.deckAudio.setLowGain(value);
    this.deckB.deckAudio.setLowGain(value);
  }

  setMid(event: any) {
    const value = parseFloat(event);
    this.deckA.deckAudio.setMidGain(value);
    this.deckB.deckAudio.setMidGain(value);
  }

  setHigh(event: any) {
    const value = parseFloat(event);
    this.deckA.deckAudio.setHighGain(value);
    this.deckB.deckAudio.setHighGain(value);
  }
}
