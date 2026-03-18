import { TestBed } from '@angular/core/testing';

import { DeckAudioService } from './deck-audio.service';

describe('DeckAudioService', () => {
  let service: DeckAudioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeckAudioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
