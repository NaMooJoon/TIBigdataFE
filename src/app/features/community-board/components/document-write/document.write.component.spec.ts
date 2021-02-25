import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DocumentWriteComponent } from "./document.write.component";

describe("DocumentWriteComponent", () => {
  let component: DocumentWriteComponent;
  let fixture: ComponentFixture<DocumentWriteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentWriteComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentWriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
