import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Library } from './library.types';
import { DeckAudio } from '../../core/deck-audio';
import { AudioEngine } from '../../core/audio-engine';

@Component({
  selector: 'app-library',
  imports: [CommonModule, MatIcon],
  templateUrl: './library.html',
  styleUrls: ['./library.css'],
})
export class LibraryFeature {
  tracks: Library[] = [];
  deckAudio!: DeckAudio;
  isPlaying: boolean = false;

  constructor(private audioEngine: AudioEngine) {}

  ngOnInit() {
    this.deckAudio = this.audioEngine.createDeck();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    this.handleFiles(input.files);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (!event.dataTransfer?.files) return;

    this.handleFiles(event.dataTransfer.files);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  handleFiles(files: FileList) {
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('audio/')) {
        const url = URL.createObjectURL(file);

        this.tracks.push({
          name: file.name,
          url: url,
        });
      }
    });
  }

  playTrack(track: Library) {
    this.audioEngine.loadTrackFromUrl(track.url).then((buffer) => {
      if (this.isPlaying) {
        this.isPlaying = false;
        this.deckAudio.stop();
      }
      this.isPlaying = true;
      this.deckAudio.loadTrack(buffer);
      this.deckAudio.play();
    });
  }
}
