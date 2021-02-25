import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ArticleAnalysisComponent } from "./article-analysis";

describe("DashboardComponent", () => {
  let component: ArticleAnalysisComponent;
  let fixture: ComponentFixture<ArticleAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ArticleAnalysisComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
