import { TestBed } from '@angular/core/testing';

import { ItemCardService } from './item-card.service';

describe('ItemCardService', () => {
  let service: ItemCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
