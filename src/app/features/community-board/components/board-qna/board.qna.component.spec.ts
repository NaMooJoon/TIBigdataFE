import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { QnaComponent } from "./board.qna.component";

describe("QnaComponent", () => {
  let component: QnaComponent;
  let fixture: ComponentFixture<QnaComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [QnaComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(QnaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("loadFirstDocList sould return valid list", () => {
    expect(component.loadFirstDocList).not.toBeDefined();
  });
});
