import { TestBed } from '@angular/core/testing';

import { TvaHistoriesService } from './tva-histories.service';

describe('TvaHistoriesService', () => {
  let service: TvaHistoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TvaHistoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
