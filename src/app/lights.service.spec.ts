import { TestBed } from '@angular/core/testing';

import { LightsService } from './lights.service';

describe('LightsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LightsService = TestBed.get(LightsService);
    expect(service).toBeTruthy();
  });
});
