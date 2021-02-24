import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAnalysisComponent } from './my-analysis.component';

describe('MyAnalysisComponent', () => {
  let component: MyAnalysisComponent;
  let fixture: ComponentFixture<MyAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyAnalysisComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
