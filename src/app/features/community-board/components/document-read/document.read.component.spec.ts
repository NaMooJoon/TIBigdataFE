import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DocumentReadComponent } from "./document.read.component";

describe("DocumentReadComponent", () => {
  let component: DocumentReadComponent;
  let fixture: ComponentFixture<DocumentReadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentReadComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentReadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
