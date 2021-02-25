import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutSideMenuComponent } from './about-side-menu.component';

describe('AboutSideMenuComponent', () => {
  let component: AboutSideMenuComponent;
  let fixture: ComponentFixture<AboutSideMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutSideMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutSideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
