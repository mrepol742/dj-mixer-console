import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckA } from './deck-a';

describe('DeckA', () => {
  let component: DeckA;
  let fixture: ComponentFixture<DeckA>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeckA],
    }).compileComponents();

    fixture = TestBed.createComponent(DeckA);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
