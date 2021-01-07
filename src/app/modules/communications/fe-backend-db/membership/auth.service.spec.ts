import { TestBed } from '@angular/core/testing';

import { EPAuthService } from './auth.service';

describe('EPAuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EPAuthService = TestBed.get(EPAuthService);
    expect(service).toBeTruthy();
  });
});
