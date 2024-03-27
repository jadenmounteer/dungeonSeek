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
  value: number;
  dots: Dot[];
}

export interface Dot {
  topPosition: number;
  leftPosition: number;
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

  protected dice: Die[] = [];

  constructor(
    public dialogueRef: MatDialogRef<DiceRollDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DiceRollDialogData
  ) {
    this.rollDice();
  }

  // Creates the face of the dice. Called when the dice is rolled as well.
  private rollDice(): void {
    for (let i = 0; i < this.data.numberOfDice; i++) {
      this.dice.push(this.createDie());
    }
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

    console.log(die);

    return die;
  }

  protected onRoll(): void {}
}
