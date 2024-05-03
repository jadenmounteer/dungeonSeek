import { Injectable, inject } from '@angular/core';
import { GameStateService } from './game-state.service';

@Injectable({
  providedIn: 'root',
})
export class GameDialogueService {
  #gameStateService: GameStateService = inject(GameStateService);
  public showGameDialogue = false;
  public gameDialogueMessage: string = '';

  private defaultCallback: () => void = () => {};

  public buttonOneCallback = this.defaultCallback;

  public buttonTwoCallback = this.defaultCallback;

  constructor() {}

  public closeDialogue(): void {
    this.showGameDialogue = false;
    this.buttonOneCallback = this.defaultCallback;
    this.buttonTwoCallback = this.defaultCallback;
  }
}
