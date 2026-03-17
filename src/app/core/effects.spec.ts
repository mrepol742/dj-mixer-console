import { TestBed } from '@angular/core/testing';

import { Effects } from './effects';

describe('Effects', () => {
  let service: Effects;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Effects);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
