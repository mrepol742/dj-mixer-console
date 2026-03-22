import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataFormComponent } from './metadata-form.component';

describe('MetadataForm', () => {
  let component: MetadataFormComponent;
  let fixture: ComponentFixture<MetadataFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetadataFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MetadataFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
