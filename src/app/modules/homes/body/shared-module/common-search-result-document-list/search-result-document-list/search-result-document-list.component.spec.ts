import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultDocumentListComponent } from './search-result-document-list.component';

describe('SearchResultDocumentListComponent', () => {
  let component: SearchResultDocumentListComponent;
  let fixture: ComponentFixture<SearchResultDocumentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchResultDocumentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultDocumentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
