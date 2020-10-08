import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadCommunityDocComponent } from './read-community-doc.component';

describe('ReadCommunityDocComponent', () => {
  let component: ReadCommunityDocComponent;
  let fixture: ComponentFixture<ReadCommunityDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadCommunityDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadCommunityDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
