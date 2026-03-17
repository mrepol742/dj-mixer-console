import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Knob } from './knob';

describe('Knob', () => {
  let component: Knob;
  let fixture: ComponentFixture<Knob>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Knob],
    }).compileComponents();

    fixture = TestBed.createComponent(Knob);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
