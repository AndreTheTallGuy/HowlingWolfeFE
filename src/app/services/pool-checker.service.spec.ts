import { TestBed } from '@angular/core/testing';

import { PoolCheckerService } from './pool-checker.service';

describe('PoolCheckerService', () => {
  let service: PoolCheckerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoolCheckerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
