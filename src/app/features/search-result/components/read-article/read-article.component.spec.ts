import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ReadArticle } from "./read-article.component";

describe("SearchDetailComponent", () => {
  let component: ReadArticle;
  let fixture: ComponentFixture<ReadArticle>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReadArticle],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadArticle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
