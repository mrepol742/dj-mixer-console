import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckB } from './deck-b';

describe('DeckB', () => {
  let component: DeckB;
  let fixture: ComponentFixture<DeckB>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeckB],
    }).compileComponents();

    fixture = TestBed.createComponent(DeckB);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
