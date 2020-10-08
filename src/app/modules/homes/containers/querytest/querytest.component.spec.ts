import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuerytestComponent } from './querytest.component';

describe('QuerytestComponent', () => {
  let component: QuerytestComponent;
  let fixture: ComponentFixture<QuerytestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuerytestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuerytestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
