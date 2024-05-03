import { Injectable, inject } from '@angular/core';
import { GameStateService } from './game-state.service';

@Injectable({
  providedIn: 'root',
})
export class GameDialogueService {
  #gameStateService: GameStateService = inject(GameStateService);
  public showGameDialogue = false;
  public gameDialogueMessage: string = '';

  public buttonOneCallback: () => void = () => {
    alert('Button callback not set');
  };

  public buttonTwoCallback: () => void = () => {
    alert('Button callback not set');
  };

  constructor() {}
}
