import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyAgreementComponent } from './policy-agreement.component';

describe('PolicyAgreementComponent', () => {
  let component: PolicyAgreementComponent;
  let fixture: ComponentFixture<PolicyAgreementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolicyAgreementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
