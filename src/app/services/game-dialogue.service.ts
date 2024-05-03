import { Injectable, inject } from '@angular/core';

export interface GameDialogueData {
  message: string;
  showButtonOne: boolean;
  showButtonTwo: boolean;
  buttonOneText: string;
  buttonTwoText: string;
}
@Injectable({
  providedIn: 'root',
})
export class GameDialogueService {
  public gameDialogueData: GameDialogueData =
    this.#setGameDialogueDataToDefault();

  public showGameDialogue = false;

  public buttonOneCallback: (() => void) | undefined;

  public buttonTwoCallback: (() => void) | undefined;

  constructor() {}

  public showDialogue(
    message: string,
    showButtonOne = true,
    showButtonTwo = false,
    buttonOneText?: string,
    buttonTwoText?: string
  ): void {
    this.gameDialogueData.message = message;
    this.gameDialogueData.showButtonOne = showButtonOne;
    this.gameDialogueData.showButtonTwo = showButtonTwo;
    this.gameDialogueData.buttonOneText = buttonOneText || 'Close';
    this.gameDialogueData.buttonTwoText = buttonTwoText || '';

    this.showGameDialogue = true;
  }

  public closeDialogue(): void {
    this.showGameDialogue = false;
    this.buttonOneCallback = undefined;
    this.buttonTwoCallback = undefined;
    this.gameDialogueData = this.#setGameDialogueDataToDefault();
  }

  #setGameDialogueDataToDefault(): GameDialogueData {
    return {
      message: '',
      showButtonOne: false,
      showButtonTwo: false,
      buttonOneText: 'Close',
      buttonTwoText: '',
    };
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
