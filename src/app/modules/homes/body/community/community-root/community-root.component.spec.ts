import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityRootComponent } from './community-root.component';

describe('CommunityRootComponent', () => {
  let component: CommunityRootComponent;
  let fixture: ComponentFixture<CommunityRootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunityRootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
