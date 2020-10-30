import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialsRootComponent } from './specials-root.component';

describe('SpecialsRootComponent', () => {
  let component: SpecialsRootComponent;
  let fixture: ComponentFixture<SpecialsRootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialsRootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialsRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
