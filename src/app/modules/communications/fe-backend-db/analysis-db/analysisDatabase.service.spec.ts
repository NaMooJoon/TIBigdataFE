import { TestBed } from '@angular/core/testing';

import { AnalysisDatabaseService } from './analysisDatabase.service';

describe('AnalysisDatabaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnalysisDatabaseService = TestBed.get(AnalysisDatabaseService);
    expect(service).toBeTruthy();
  });
});
