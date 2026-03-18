import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecorderComponent } from './recorder.component';

describe('Recorder', () => {
  let component: RecorderComponent;
  let fixture: ComponentFixture<RecorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecorderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecorderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
