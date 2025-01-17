import { TestBed } from '@angular/core/testing';

import { UserBeehiveService } from './user-beehive.service';

describe('UserBeehiveService', () => {
  let service: UserBeehiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserBeehiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
