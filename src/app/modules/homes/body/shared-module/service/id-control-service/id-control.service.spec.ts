import { TestBed } from '@angular/core/testing';

import { IdControlService } from './id-control.service';

describe('IdControlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IdControlService = TestBed.get(IdControlService);
    expect(service).toBeTruthy();
  });
});
