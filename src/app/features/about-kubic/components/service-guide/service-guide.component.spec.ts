import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceGuideComponent } from './service-guide.component';

describe('ServiceComponent', () => {
  let component: ServiceGuideComponent;
  let fixture: ComponentFixture<ServiceGuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceGuideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
