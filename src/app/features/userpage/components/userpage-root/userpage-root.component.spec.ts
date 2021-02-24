import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserpageRootComponent } from './userpage-root.component';

describe('UserpageRootComponent', () => {
  let component: UserpageRootComponent;
  let fixture: ComponentFixture<UserpageRootComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserpageRootComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserpageRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
