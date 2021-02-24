import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ArticleCardViewComponent } from "./article-card-preview.component";

describe("ArticleDetailsComponent", () => {
  let component: ArticleCardViewComponent;
  let fixture: ComponentFixture<ArticleCardViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ArticleCardViewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleCardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
