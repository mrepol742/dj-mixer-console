import { TestBed } from '@angular/core/testing';

import { DeckControlService } from './deck-control.service';

describe('DeckControlService', () => {
  let service: DeckControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeckControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
