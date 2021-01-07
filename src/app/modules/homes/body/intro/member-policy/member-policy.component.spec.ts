import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberPolicyComponent } from './member-policy.component';

describe('MemberPolicyComponent', () => {
  let component: MemberPolicyComponent;
  let fixture: ComponentFixture<MemberPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberPolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
