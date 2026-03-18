import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Library } from './library.component.types';
import { DeckAudioService } from '../../core/services/deck-audio/deck-audio.service';
import { AudioEngineService } from '../../core/services/audio-engine/audio-engine.service';
import { StorageService } from '../../core/services/storage/storage.service';
import { BehaviorSubject } from 'rxjs';
import { DeckControlService } from '../../core/services/deck-control/deck-control.service';
import { PlayerControlService } from '../../core/services/player-control/player-control.service';
import { DialogService } from '../../core/services/dialog/dialog.service';

@Component({
  selector: 'app-library',
  imports: [CommonModule, MatIcon],
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css'],
})
export class LibraryComponent {
  private _tracks = new BehaviorSubject<Library[]>([]);
  public tracks$ = this._tracks.asObservable();
  deckAudio!: DeckAudioService;
  isPlaying: boolean = false;
  contextMenuVisible = false;
  contextMenuPosition = { x: 0, y: 0 };
  contextMenuTrack!: Library;

  constructor(
    private audioEngine: AudioEngineService,
    private offlineStorage: StorageService,
    private deckControl: DeckControlService,
    private playerControl: PlayerControlService,
    private dialogService: DialogService,
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
    this.dialogService.open(LibraryComponent, { name: 'John Doe' });
    this.contextMenuVisible = false;
  }
}
