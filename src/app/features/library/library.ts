import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Library } from './library.types';
import { DeckAudio } from '../../core/deck-audio';
import { AudioEngine } from '../../core/audio-engine';
import { OfflineStorage } from '../../core/offline-storage';
import { BehaviorSubject } from 'rxjs';
import { DeckControl } from '../../core/deck-control';
import { PlayerControl } from '../../core/player-control';

@Component({
  selector: 'app-library',
  imports: [CommonModule, MatIcon],
  templateUrl: './library.html',
  styleUrls: ['./library.css'],
})
export class LibraryFeature {
  private _tracks = new BehaviorSubject<Library[]>([]);
  public tracks$ = this._tracks.asObservable();
  deckAudio!: DeckAudio;
  isPlaying: boolean = false;
  contextMenuVisible = false;
  contextMenuPosition = { x: 0, y: 0 };
  contextMenuTrack!: Library;

  constructor(
    private audioEngine: AudioEngine,
    private offlineStorage: OfflineStorage,
    private deckControl: DeckControl,
    private playerControl: PlayerControl,
  ) {
    this.loadStoredTracks();
  }

  ngOnInit() {
    this.deckAudio = this.audioEngine.createDeck();
  }

  private async loadStoredTracks() {
    const files = await this.offlineStorage.getAllFiles();
    const tracks: Library[] = files.map((f) => ({
      name: f.name,
      url: URL.createObjectURL(f.data),
    }));
    this._tracks.next(tracks);
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

  async addFile(file: File) {
    await this.offlineStorage.saveFile(file);
    const current = this._tracks.value;
    this._tracks.next([...current, { name: file.name, url: URL.createObjectURL(file) }]);
  }

  async removeTrack(name: string) {
    await this.offlineStorage.deleteFile(name);
    const updated = this._tracks.value.filter((t) => t.name !== name);
    this._tracks.next(updated);
  }

  handleFiles(files: FileList) {
    Array.from(files).forEach(async (file) => {
      if (file.type.startsWith('audio/')) {
        await this.addFile(file);
      }
    });
  }

  playTrack(track: Library) {
    this.contextMenuVisible = false;
    this.playerControl.play(track);

  }

  onDragStart(event: DragEvent, track: Library) {
    event.dataTransfer?.setData('application/audio-url', track.url);
  }

  onRightClick(event: MouseEvent, track: Library) {
    event.preventDefault();
    this.contextMenuTrack = track;
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };
    this.contextMenuVisible = true;
  }

  @HostListener('document:click')
  hideContextMenu() {
    this.contextMenuVisible = false;
  }

  addToDeckA(track: Library) {
    this.deckControl.loadTrack('A', track.url);
    this.contextMenuVisible = false;
  }

  addToDeckB(track: Library) {
    this.deckControl.loadTrack('B', track.url);
    this.contextMenuVisible = false;
  }

  deleteTrack(track: Library) {
    this.removeTrack(track.name);
    this.contextMenuVisible = false;
  }

  viewMetadata(track: Library) {
    alert(`Viewing metadata for: ${track.name}`);
    this.contextMenuVisible = false;
  }
}
