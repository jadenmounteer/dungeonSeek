import { Injectable, inject } from '@angular/core';
import { GameStateService } from './game-state.service';

@Injectable({
  providedIn: 'root',
})
export class GameDialogueService {
  #gameStateService: GameStateService = inject(GameStateService);
  public showGameDialogue = false;
  public gameDialogueMessage: string = '';

  public buttonOneCallback: (() => void) | undefined;

  public buttonTwoCallback: (() => void) | undefined;

  constructor() {}

  public closeDialogue(): void {
    this.showGameDialogue = false;
    this.buttonOneCallback = undefined;
    this.buttonTwoCallback = undefined;
  }

  public handleButtonOneClick(): void {
    this.showGameDialogue = false;

    if (this.buttonOneCallback === undefined) {
      return;
    }

    this.buttonOneCallback();
  }

  public handleButtonTwoClick(): void {
    this.showGameDialogue = false;

    if (this.buttonTwoCallback === undefined) {
      return;
    }

    this.buttonTwoCallback();
  }
}
