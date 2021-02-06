import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteNewCommunityDocComponent } from './write-new-community-doc.component';

describe('WriteNewCommunityDocComponent', () => {
  let component: WriteNewCommunityDocComponent;
  let fixture: ComponentFixture<WriteNewCommunityDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WriteNewCommunityDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteNewCommunityDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
