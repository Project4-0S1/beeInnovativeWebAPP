import { TestBed } from '@angular/core/testing';

import { BeehiveService } from './beehive.service';

describe('BeehiveService', () => {
  let service: BeehiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BeehiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
