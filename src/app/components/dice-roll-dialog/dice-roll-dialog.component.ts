import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { MenuUnderlineComponent } from '../menu-underline/menu-underline.component';
import {
  DiceRollComparator,
  DiceRollDialogData,
  Die,
} from '../../services/dice-roll-dialogue.service';

@Component({
  selector: 'app-dice-roll-dialog',
  standalone: true,
  imports: [CommonModule, MenuComponent, MenuUnderlineComponent],
  templateUrl: './dice-roll-dialog.component.html',
  styleUrl: './dice-roll-dialog.component.scss',
})
export class DiceRollDialogComponent implements OnInit {
  @Input() public data: DiceRollDialogData | undefined;
  @Output() public successClose: EventEmitter<void> = new EventEmitter<void>();

  // Used to output the dice roll result
  @Output() public resultClose: EventEmitter<number> =
    new EventEmitter<number>();

  // This probability calculator helps in determining how many dice to use for a given probability: https://www.gigacalculator.com/calculators/dice-probability-calculator.php
  private dotPositionMatrix = {
    1: [[50, 50]],
    2: [
      [20, 20],
      [80, 80],
    ],
    3: [
      [20, 20],
      [50, 50],
      [80, 80],
    ],
    4: [
      [20, 20],
      [20, 80],
      [80, 20],
      [80, 80],
    ],
    5: [
      [20, 20],
      [20, 80],
      [50, 50],
      [80, 20],
      [80, 80],
    ],
    6: [
      [20, 20],
      [20, 80],
      [50, 20],
      [50, 80],
      [80, 20],
      [80, 80],
    ],
  };

  protected rolledDice: boolean = false;
  protected inTargetRange: boolean = false;

  protected dice: Die[] = [];

  protected sum: number = 0;
  protected initialized = false;

  constructor() {}
  ngOnInit(): void {
    this.rollDice();
    this.initialized = true;
  }

  // Creates the face of the dice. Called when the dice is rolled as well.
  private rollDice(): number {
    if (!this.data) {
      throw new Error('Data is not defined');
    }
    this.dice = [];
    let sum = 0;
    for (let i = 0; i < this.data.numberOfDice; i++) {
      this.dice.push(this.createDie());
    }

    for (let die of this.dice) {
      sum += die.value;
    }
    return sum;
  }

  private createDie(): Die {
    let dieValue = Math.floor(Math.random() * 6) + 1;
    let die: Die = {
      value: dieValue,
      dots: [],
    };

    // This is the matrix of the dot positions for each face of the die.
    let dotPositions =
      this.dotPositionMatrix[dieValue as keyof typeof this.dotPositionMatrix];
    for (let dotPosition of dotPositions) {
      die.dots.push({
        topPosition: dotPosition[0],
        leftPosition: dotPosition[1],
      });
    }

    return die;
  }

  protected onRoll(): void {
    this.rolledDice = true;
    this.sum = this.rollDice();

    if (this.data?.comparator && this.data?.targetNumber) {
      // They are doing a pass or fail check, rather than wanting to get the result
      this.inTargetRange = this.checkTargetRange(
        this.data.comparator,
        this.data.targetNumber
      );
    }
  }

  private checkTargetRange(
    comparator: DiceRollComparator,
    targetNumber: number
  ): boolean {
    if (!this.data) {
      throw new Error('Data is not defined');
    }
    switch (comparator) {
      case '>=':
        return this.sum >= targetNumber;
      case '<=':
        return this.sum <= targetNumber;
      case '=':
        return this.sum === targetNumber;
    }
  }

  // Call this event if there is a pass or fail event and they fail, or you just need the result
  protected onClose(): void {
    this.resultClose.emit(this.sum);
  }

  // Call this event if there is a pass or fail event and they pass.
  protected OnSuccessClose(): void {
    this.successClose.emit();
  }
}
