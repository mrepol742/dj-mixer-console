import { Component, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { WaveformComponent } from '../../../shared/waveform/waveform.component';
import { DeckAudioService } from '../../../core/services/deck-audio/deck-audio.service';
import { AudioEngineService } from '../../../core/services/audio-engine/audio-engine.service';
import { DeckControlService } from '../../../core/services/deck-control/deck-control.service';
import { KnobComponent } from '../../../shared/knob/knob.component';
import { SliderComponent } from '../../../shared/slider/slider.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { CommonModule } from '@angular/common';
import { Track } from '../../../core/services/storage/storage.types';
import { BehaviorSubject } from 'rxjs';
import { Library } from '../../../core/services/player-control/player-control.types';

@Component({
  selector: 'app-deck-b',
  imports: [
    WaveformComponent,
    MatIcon,
    KnobComponent,
    SliderComponent,
    ButtonComponent,
    CommonModule,
  ],
  templateUrl: './deck-b.component.html',
  styleUrl: './deck-b.component.css',
})
export class DeckBComponent {
  @ViewChild(WaveformComponent) waveform!: WaveformComponent;
  deckAudio!: DeckAudioService;
  isPlaying: boolean = false;
  isLoading: boolean = false;
  isDraggingOver: boolean = false;
  private trackMetadataSubject = new BehaviorSubject<Library | null>(null);
  trackMetadata$ = this.trackMetadataSubject.asObservable();

  constructor(
    private audioEngine: AudioEngineService,
    private deckControl: DeckControlService,
  ) {}

  ngOnInit() {
    this.deckAudio = this.audioEngine.createDeck();

    this.deckControl.loadTrack$.subscribe(({ deck, track }) => {
      if (deck !== 'B') return;
      this.isLoading = true;
      const _track = JSON.parse(track);
      this.trackMetadataSubject.next(_track);

      this.audioEngine.loadTrackFromUrl(_track.url).then((buffer) => {
        this.deckAudio.loadTrack(buffer);

        fetch(_track.url)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File([blob], 'track.mp3', { type: blob.type });
            this.waveform.loadTrack(file);
            this.isLoading = false;
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
    this.isDraggingOver = false;
    this.isLoading = true;

    const track = event.dataTransfer?.getData('application/audio-track');
    if (track) {
      try {
        const _track = JSON.parse(track);
        this.trackMetadataSubject.next(_track);
        this.loadUrl(_track.url);
      } catch (error) {
        console.error(error);
      } finally {
        return;
      }
    }

    if (!event.dataTransfer?.files) return;

    const file = event.dataTransfer.files[0];
    if (!file.type.startsWith('audio/')) return;
    this.loadFile(file);
  }

  loadUrl(url: string) {
    this.audioEngine.loadTrackFromUrl(url).then((buffer) => {
      this.deckAudio.loadTrack(buffer);
      this.isLoading = false;

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
    this.isDraggingOver = true;
  }

  onDragLeave(event: DragEvent) {
    this.isDraggingOver = false;
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
    const value = event;
    this.deckAudio.setVolume(value);
  }

  setTempo(event: any) {
    const value = event;
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
