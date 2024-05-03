import { Injectable } from '@angular/core';
import { Character } from '../types/character';

@Injectable({
  providedIn: 'root',
})
export class CharacterStateService {
  public allCharactersCurrentlyInGameSession: Character[] = [];
  public charactersBeingControlledByClient: Character[] = [];
  public characterBeingControlledByClient: Character | undefined;

  constructor() {}
}
