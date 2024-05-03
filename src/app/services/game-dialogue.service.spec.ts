import { TestBed } from '@angular/core/testing';

import { GameDialogueService } from './game-dialogue.service';

describe('GameDialogueService', () => {
  let service: GameDialogueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameDialogueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
