import { TestBed } from '@angular/core/testing';

import { WeaponCardService } from './weapon-card.service';

describe('WeaponCardService', () => {
  let service: WeaponCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeaponCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
