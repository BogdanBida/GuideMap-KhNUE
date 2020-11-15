/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BuildingService } from './building.service';

describe('Service: Building', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BuildingService]
    });
  });

  it('should ...', inject([BuildingService], (service: BuildingService) => {
    expect(service).toBeTruthy();
  }));
});
