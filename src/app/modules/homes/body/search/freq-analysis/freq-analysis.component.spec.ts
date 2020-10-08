import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreqAnalysisComponent } from "./freq-analysis.component";

describe('FreqAnalysisComponent', () => {
  let component: FreqAnalysisComponent;
  let fixture: ComponentFixture<FreqAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreqAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreqAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
