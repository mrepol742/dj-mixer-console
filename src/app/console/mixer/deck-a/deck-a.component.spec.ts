import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckAComponent } from './deck-a.component';

describe('DeckA', () => {
  let component: DeckAComponent;
  let fixture: ComponentFixture<DeckAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeckAComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeckAComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
