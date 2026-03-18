import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnobComponent } from './knob.component';

describe('Knob', () => {
  let component: KnobComponent;
  let fixture: ComponentFixture<KnobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KnobComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KnobComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
