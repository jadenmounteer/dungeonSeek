import { TestBed } from '@angular/core/testing';

import { MovementNodeService } from './movement-node.service';

describe('MovementNodeService', () => {
  let service: MovementNodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovementNodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
