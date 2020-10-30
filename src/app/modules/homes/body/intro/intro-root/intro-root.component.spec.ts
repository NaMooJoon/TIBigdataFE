import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroRootComponent } from './intro-root.component';

describe('IntroRootComponent', () => {
  let component: IntroRootComponent;
  let fixture: ComponentFixture<IntroRootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntroRootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntroRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
