import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaveformComponent } from './waveform.component';

describe('Waveform', () => {
  let component: WaveformComponent;
  let fixture: ComponentFixture<WaveformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaveformComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WaveformComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
