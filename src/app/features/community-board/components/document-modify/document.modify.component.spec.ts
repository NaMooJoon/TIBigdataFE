import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DocumentModifyComponent } from "./document.modify.component";

describe("DocumentModifyComponent", () => {
  let component: DocumentModifyComponent;
  let fixture: ComponentFixture<DocumentModifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentModifyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
