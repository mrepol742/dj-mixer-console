import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckBComponent } from './deck-b.component';

describe('DeckB', () => {
  let component: DeckBComponent;
  let fixture: ComponentFixture<DeckBComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeckBComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeckBComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
