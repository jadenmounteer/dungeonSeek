import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

export type ConfirmationDialogData = {
  title: string | undefined;
  message: string;
};

@Component({
  selector: 'app-confirmation-dialogue',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './confirmation-dialogue.component.html',
  styleUrl: './confirmation-dialogue.component.scss',
})
export class ConfirmationDialogueComponent {
  constructor(
    public dialogueRef: MatDialogRef<ConfirmationDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData
  ) {}

  protected onNoClick(): void {
    this.dialogueRef.close();
  }

  protected onYesClick(): void {
    this.dialogueRef.close('yes');
  }
}
