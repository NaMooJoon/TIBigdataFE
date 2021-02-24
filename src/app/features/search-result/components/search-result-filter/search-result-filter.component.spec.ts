import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultFilterComponent } from './search-result-filter.component';

describe('SearchFilterComponent', () => {
  let component: SearchResultFilterComponent;
  let fixture: ComponentFixture<SearchResultFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchResultFilterComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
