import { TestBed } from '@angular/core/testing';

import { TvaCalculatorService } from './tva-calculator.service';

describe('TvaCalculatorService', () => {
  let service: TvaCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TvaCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
