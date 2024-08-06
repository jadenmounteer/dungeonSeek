import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { WeaponCardInfo } from '../types/weapon-card-info';
import { Npc } from '../types/npc';

export type DiceRollComparator = '>=' | '<=' | '=';

export type DiceRollDialogData = {
  title: string;
  message: string;
  closeButtonName: string;
  numberOfDice: number;

  // these properties are only needed for pass or fail situations
  comparator: DiceRollComparator | undefined;
  targetNumber: number | undefined;
};

export interface Die {
  value: number;
  dots: Dot[];
}

export interface Dot {
  topPosition: number;
  leftPosition: number;
}

@Injectable({
  providedIn: 'root',
})
export class DiceRollDialogueService {
  public diceRollingData: DiceRollDialogData | undefined;

  public showDiceDialogue = false;

  public successButtonCallback: (() => void) | undefined;

  public resultButtonCallback: ((result: number) => void) | undefined;

  public currentCharacterRollingDice = false;
  public currentCharacterRolledForEventCardThisTurn = false;

  public drawEventCardSub = new Subject<void>();
  public dealDamageToNPCSub = new Subject<number>();

  constructor() {}

  public showDialogue(diceRollingData: DiceRollDialogData): void {
    this.diceRollingData = diceRollingData;
    this.currentCharacterRollingDice = true;
    this.showDiceDialogue = true;
  }

  public closeDialogue(): void {
    this.showDiceDialogue = false;
    this.currentCharacterRollingDice = false;
    this.successButtonCallback = undefined;
    this.resultButtonCallback = undefined;
  }

  public handleSuccessClose(): void {
    this.showDiceDialogue = false;
    this.currentCharacterRollingDice = false;

    if (this.successButtonCallback === undefined) {
      return;
    }

    this.successButtonCallback();
  }

  public handleResultClose(result: number): void {
    this.showDiceDialogue = false;
    this.currentCharacterRollingDice = false;

    if (this.resultButtonCallback === undefined) {
      return;
    }

    this.resultButtonCallback(result);
  }

  /**
   * Before ending their turn, a character must roll for an event card.
   * They have a 1 in 4 chance of drawing an event card.
   */
  public rollForEventCard() {
    const diceRollingData: DiceRollDialogData = {
      title: 'Roll for Event Card',
      message: 'If you roll a 3 or less, draw an event card.',
      closeButtonName: 'Draw Event Card',
      numberOfDice: 1,
      comparator: '<=',
      targetNumber: 6, // use 6 for testing
    };
    this.currentCharacterRolledForEventCardThisTurn = true;

    this.showDialogue(diceRollingData);

    this.successButtonCallback = this.drawEventCard.bind(this);
  }

  private drawEventCard(): void {
    this.closeDialogue();
    this.drawEventCardSub.next();
  }

  public rollForDamage(weaponInfo: WeaponCardInfo, npcToAttack: Npc): void {
    const diceRollingData: DiceRollDialogData = {
      title: `Attacking ${npcToAttack.npcType}`,
      message: `Roll to see how much damage you can cause with your ${weaponInfo.name}`,
      closeButtonName: 'Close',
      numberOfDice: weaponInfo.stats.numberOfAttackDice,
      comparator: undefined,
      targetNumber: undefined,
    };
    this.showDialogue(diceRollingData);
    this.resultButtonCallback = this.dealDamageToNPC.bind(this);
  }

  private dealDamageToNPC(result: number): void {
    this.dealDamageToNPCSub.next(result);
  }
}
