import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CombatService {
  #team1 = []; // The team of the current player and their party members
  #team2 = []; // The team of the current enemies
  constructor() {}

  public startCombat(): void {}
}
