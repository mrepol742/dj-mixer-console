import { Component, ViewChild } from '@angular/core';
import { WaveformComponent } from '../../../shared/waveform/waveform.component';
import { MatIcon } from '@angular/material/icon';
import { DeckAudioService } from '../../../core/services/deck-audio/deck-audio.service';
import { AudioEngineService } from '../../../core/services/audio-engine/audio-engine.service';
import { DeckControlService } from '../../../core/services/deck-control/deck-control.service';
import { KnobComponent } from '../../../shared/knob/knob.component';
import { SliderComponent } from '../../../shared/slider/slider.component';
import { ButtonComponent } from '../../../shared/button/button.component';

@Component({
  selector: 'app-deck-a',
  imports: [WaveformComponent, MatIcon, KnobComponent, SliderComponent, ButtonComponent],
  templateUrl: './deck-a.component.html',
  styleUrl: './deck-a.component.css',
})
export class DeckAComponent {
  @ViewChild(WaveformComponent) waveform!: WaveformComponent;
  deckAudio!: DeckAudioService;
  isPlaying: boolean = false;

  constructor(
    private audioEngine: AudioEngineService,
    private deckControl: DeckControlService,
  ) {}

  ngOnInit() {
    this.deckAudio = this.audioEngine.createDeck();

    this.deckControl.loadTrack$.subscribe(({ deck, trackUrl }) => {
      if (deck !== 'A') return;

      this.audioEngine.loadTrackFromUrl(trackUrl).then((buffer) => {
        this.deckAudio.loadTrack(buffer);

        fetch(trackUrl)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File([blob], 'track.mp3', { type: blob.type });
            this.waveform.loadTrack(file);
          });
      });
    });
  }

  loadTrack(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.loadFile(file);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const url = event.dataTransfer?.getData('application/audio-url');
    if (url) return this.loadUrl(url);

    if (!event.dataTransfer?.files) return;

    const file = event.dataTransfer.files[0];
    if (!file.type.startsWith('audio/')) return;
    this.loadFile(file);
  }

  loadUrl(url: string) {
    this.audioEngine.loadTrackFromUrl(url).then((buffer) => {
      this.deckAudio.loadTrack(buffer);

      fetch(url)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], 'track.mp3', { type: 'audio/mp3' });
          this.waveform.loadTrack(file);
        });
    });
  }

  loadFile(file: File) {
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
    const value = parseFloat(event);
    this.deckAudio.setVolume(value);
  }

  setTempo(event: any) {
    const value = parseFloat(event);
    this.deckAudio.setTempo(value);
  }

  setLow(event: any) {
    const value = parseFloat(event);
    this.deckAudio.setLowGain(value);
  }

  setMid(event: any) {
    const value = parseFloat(event);
    this.deckAudio.setMidGain(value);
  }

  setHigh(event: any) {
    const value = parseFloat(event);
    this.deckAudio.setHighGain(value);
  }
}
