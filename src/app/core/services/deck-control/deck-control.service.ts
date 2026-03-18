import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface DeckCommand {
  deck: 'A' | 'B';
  trackUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class DeckControlService {
  private _loadTrack = new Subject<DeckCommand>();
  loadTrack$ = this._loadTrack.asObservable();

  loadTrack(deck: 'A' | 'B', trackUrl: string) {
    this._loadTrack.next({ deck, trackUrl });
  }
}
