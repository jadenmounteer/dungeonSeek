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

export type DiceRollComparator = '>=' | '<=' | '=';

export type DiceRollDialogData = {
  title: string;
  message: string;
  numberOfDice: number;
  comparator: DiceRollComparator;
  targetNumber: number;
};

@Component({
  selector: 'app-dice-roll-dialog',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatButtonModule,
  ],
  templateUrl: './dice-roll-dialog.component.html',
  styleUrl: './dice-roll-dialog.component.scss',
})
export class DiceRollDialogComponent {
  // This probability calculator helps in determining how many dice to use for a given probability: https://www.gigacalculator.com/calculators/dice-probability-calculator.php

  constructor(
    public dialogueRef: MatDialogRef<DiceRollDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DiceRollDialogData
  ) {}

  protected onNoClick(): void {
    this.dialogueRef.close();
  }

  protected onYesClick(): void {
    this.dialogueRef.close('yes');
  }
}
