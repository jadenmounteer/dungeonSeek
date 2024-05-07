import { TestBed } from '@angular/core/testing';

import { NpcCardService } from './npc-card.service';

describe('NpcCardService', () => {
  let service: NpcCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NpcCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
