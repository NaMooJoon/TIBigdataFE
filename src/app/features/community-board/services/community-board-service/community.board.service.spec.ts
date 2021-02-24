import { TestBed } from "@angular/core/testing";

import { CommunityBoardService } from "./community.board.service";

describe("CommunityService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: CommunityBoardService = TestBed.get(CommunityBoardService);
    expect(service).toBeTruthy();
  });
});
