import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ArticleLibraryComponent } from "./article-library.component";

describe("ArticleLibraryComponent", () => {
  let component: ArticleLibraryComponent;
  let fixture: ComponentFixture<ArticleLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ArticleLibraryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
