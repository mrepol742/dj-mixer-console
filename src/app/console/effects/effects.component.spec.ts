import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EffectsComponent } from './effects.component';

describe('Effects', () => {
  let component: EffectsComponent;
  let fixture: ComponentFixture<EffectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EffectsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EffectsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
