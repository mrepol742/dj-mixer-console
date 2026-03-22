import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface DeckCommand {
  deck: 'A' | 'B';
  track: string;
}

@Injectable({
  providedIn: 'root',
})
export class DeckControlService {
  private _loadTrack = new Subject<DeckCommand>();
  loadTrack$ = this._loadTrack.asObservable();

  // the track is expected to be a stringify json
  loadTrack(deck: 'A' | 'B', track: string) {
    this._loadTrack.next({ deck, track });
  }
}
