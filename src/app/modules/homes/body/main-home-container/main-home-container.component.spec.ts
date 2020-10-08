import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainHomeContainerComponent } from './main-home-container.component';

describe('MainHomeContainerComponent', () => {
  let component: MainHomeContainerComponent;
  let fixture: ComponentFixture<MainHomeContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainHomeContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainHomeContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
