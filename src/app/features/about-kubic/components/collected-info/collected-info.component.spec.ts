import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectedInfoComponent } from './collected-info.component';

describe('CollectedInfoComponent', () => {
  let component: CollectedInfoComponent;
  let fixture: ComponentFixture<CollectedInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectedInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectedInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
