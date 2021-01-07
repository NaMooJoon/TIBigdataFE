import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestToAdminComponent } from './request-to-admin.component';

describe('RequestToAdminComponent', () => {
  let component: RequestToAdminComponent;
  let fixture: ComponentFixture<RequestToAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestToAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestToAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
