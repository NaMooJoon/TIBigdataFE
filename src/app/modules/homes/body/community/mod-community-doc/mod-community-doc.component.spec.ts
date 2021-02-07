import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModCommunityDocComponent } from './mod-community-doc.component';

describe('ModCommunityDocComponent', () => {
  let component: ModCommunityDocComponent;
  let fixture: ComponentFixture<ModCommunityDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModCommunityDocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModCommunityDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
