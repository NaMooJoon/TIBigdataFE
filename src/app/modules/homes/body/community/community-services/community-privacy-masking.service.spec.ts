import { TestBed } from '@angular/core/testing';

import { CommunityPrivacyMaskingService } from './community-privacy-masking.service';

describe('CommunityPrivacyMaskingService', () => {
  let service: CommunityPrivacyMaskingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommunityPrivacyMaskingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
