import { TestBed } from '@angular/core/testing';

import { CommunityServiceService } from './community-service.service';

describe('CommunityServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommunityServiceService = TestBed.get(CommunityServiceService);
    expect(service).toBeTruthy();
  });
});
