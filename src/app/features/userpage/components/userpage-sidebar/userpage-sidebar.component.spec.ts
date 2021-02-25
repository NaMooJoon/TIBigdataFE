import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserpageSidebarComponent } from './userpage-sidebar.component';

describe('UserpageSidebarComponent', () => {
  let component: UserpageSidebarComponent;
  let fixture: ComponentFixture<UserpageSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserpageSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserpageSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
