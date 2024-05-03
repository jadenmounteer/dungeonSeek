import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GameDialogueService {
  public showGameDialogue = false;
  public gameDialogueMessage: string = '';

  constructor() {}
}
