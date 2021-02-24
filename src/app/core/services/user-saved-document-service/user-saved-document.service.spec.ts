import { TestBed } from "@angular/core/testing";

import { UserSavedDocumentService } from "./user-saved-document.service";

describe("UserSavedDocumentService", () => {
  let service: UserSavedDocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserSavedDocumentService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
