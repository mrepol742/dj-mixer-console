import { TestBed } from '@angular/core/testing';

import { DevtoolsDetector } from './devtools-dectector';

describe('DevtoolsDetector', () => {
  let service: DevtoolsDetector;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DevtoolsDetector);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
