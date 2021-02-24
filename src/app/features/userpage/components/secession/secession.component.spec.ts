import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecessionComponent } from './secession.component';

describe('SecessionComponent', () => {
  let component: SecessionComponent;
  let fixture: ComponentFixture<SecessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SecessionComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
