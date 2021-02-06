import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteCommunityDocComponent } from './write-community-doc.component';

describe('WriteCommunityDocComponent', () => {
  let component: WriteCommunityDocComponent;
  let fixture: ComponentFixture<WriteCommunityDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WriteCommunityDocComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteCommunityDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
