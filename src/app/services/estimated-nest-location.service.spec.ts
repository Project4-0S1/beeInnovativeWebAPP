import { TestBed } from '@angular/core/testing';

import { EstimatedNestLocationService } from './estimated-nest-location.service';

describe('EstimatedNestLocationService', () => {
  let service: EstimatedNestLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstimatedNestLocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
