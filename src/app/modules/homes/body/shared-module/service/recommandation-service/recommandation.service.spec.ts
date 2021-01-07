import { TestBed } from '@angular/core/testing';

import { RecomandationService } from './recommandation.service';

describe('RecomandationServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RecomandationService = TestBed.get(RecomandationService);
    expect(service).toBeTruthy();
  });
});
