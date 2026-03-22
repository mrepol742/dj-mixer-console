import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { DeckAudioService } from '../../core/services/deck-audio/deck-audio.service';
import { AudioEngineService } from '../../core/services/audio-engine/audio-engine.service';
import { StorageService } from '../../core/services/storage/storage.service';
import { BehaviorSubject } from 'rxjs';
import { DeckControlService } from '../../core/services/deck-control/deck-control.service';
import { PlayerControlService } from '../../core/services/player-control/player-control.service';
import { DialogService } from '../../core/services/dialog/dialog.service';
import { MetadataFormComponent } from './metadata-form/metadata-form.component';
import { extractMetadata } from '../../utils/media';
import { createBlobFromURL } from '../../utils/url';
import { Library } from '../../core/services/player-control/player-control.types';
import { Track } from '../../core/services/storage/storage.types';

@Component({
  selector: 'app-library',
  imports: [CommonModule],
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
      ...f.metadata,
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
    const current = this._tracks.value;
    const url = URL.createObjectURL(file);
    createBlobFromURL(url).then(async (blob) => {
      if (!blob) {
        console.error('Failed to create blob from URL for file:', file.name);
        console.info('Adding track with basic metadata only');
        const metadata = {
          id: crypto.randomUUID(),
          title: file.name,
          artist: 'Unknown Artist',
          album: 'Unknown Album',
          bpm: null,
          filename: file.name,
          cover_url: null,
          url,
          created_at: new Date(),
        };
        this._tracks.next([...current, metadata]);
        await this.offlineStorage.saveFile(file, metadata);
        return;
      }

      const metadata = await extractMetadata(blob, url, file.name);
      const newMetadata = {
        ...metadata,
        url,
      };
      this._tracks.next([...current, newMetadata]);
      await this.offlineStorage.saveFile(file, newMetadata);
    });
  }

  async removeTrack(id: string) {
    await this.offlineStorage.deleteFile(id);
    const updated = this._tracks.value.filter((t) => t.id !== id);
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
    event.dataTransfer?.setData('application/audio-track', JSON.stringify(track));
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
    this.deckControl.loadTrack('A', JSON.stringify(track));
    this.contextMenuVisible = false;
  }

  addToDeckB(track: Library) {
    this.deckControl.loadTrack('B', JSON.stringify(track));
    this.contextMenuVisible = false;
  }

  deleteTrack(track: Library) {
    this.removeTrack(track.id);
    this.contextMenuVisible = false;
  }

  viewMetadata(track: Library) {
    this.dialogService.open(MetadataFormComponent, { name: 'John Doe' });
    this.contextMenuVisible = false;
  }

  editMetadata(track: Library) {
    this.dialogService.open(MetadataFormComponent, { name: 'John Doe' });
    this.contextMenuVisible = false;
  }

  exportTrack(track: Library) {
    const link = document.createElement('a');
    link.href = track.url;
    link.download = track.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
