import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

export type DiceRollComparator = '>=' | '<=' | '=';

export type DiceRollDialogData = {
  title: string;
  message: string;
  numberOfDice: number;
  comparator: DiceRollComparator;
  targetNumber: number;
};

export interface Die {
  sides: number;
}

@Component({
  selector: 'app-dice-roll-dialog',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './dice-roll-dialog.component.html',
  styleUrl: './dice-roll-dialog.component.scss',
})
export class DiceRollDialogComponent {
  // This probability calculator helps in determining how many dice to use for a given probability: https://www.gigacalculator.com/calculators/dice-probability-calculator.php

  protected dice: Die[] = [];

  constructor(
    public dialogueRef: MatDialogRef<DiceRollDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DiceRollDialogData
  ) {
    this.createDice();
  }

  private createDice(): void {
    for (let i = 0; i < this.data.numberOfDice; i++) {
      this.dice.push({ sides: 6 });
    }
  }

  protected onRoll(): void {}
}
