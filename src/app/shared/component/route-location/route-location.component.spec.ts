import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteLocationComponent } from './route-location.component';

describe('RouteLocationComponent', () => {
  let component: RouteLocationComponent;
  let fixture: ComponentFixture<RouteLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RouteLocationComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
