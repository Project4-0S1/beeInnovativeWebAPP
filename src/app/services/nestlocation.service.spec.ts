import { TestBed } from '@angular/core/testing';

import { NestlocationService } from './nestlocation.service';

describe('NestlocationService', () => {
  let service: NestlocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NestlocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
