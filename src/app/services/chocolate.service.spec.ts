import { TestBed } from '@angular/core/testing';

import { ChocolateService } from './chocolate.service';

describe('ChocolateService', () => {
  let service: ChocolateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChocolateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
