import { TestBed } from "@angular/core/testing";

import { AnalysisDatabaseService } from "./analysis.database.service";

describe("AnalysisDatabaseService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: AnalysisDatabaseService = TestBed.get(
      AnalysisDatabaseService
    );
    expect(service).toBeTruthy();
  });
});
