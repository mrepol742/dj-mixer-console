import { TestBed } from '@angular/core/testing';

import { DeckAudio } from './deck-audio';

describe('DeckAudio', () => {
  let service: DeckAudio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeckAudio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
