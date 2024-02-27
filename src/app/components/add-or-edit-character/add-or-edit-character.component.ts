import { Component, Inject } from '@angular/core';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { Character } from '../../types/character';

@Component({
  selector: 'app-add-or-edit-character',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    CommonModule,
    MatSelectModule,
  ],
  templateUrl: './add-or-edit-character.component.html',
  styleUrl: './add-or-edit-character.component.scss',
})
export class AddOrEditCharacterComponent {
  constructor(
    public dialogRef: MatDialogRef<AddOrEditCharacterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Character | null
  ) {}

  protected onNoClick(): void {
    this.dialogRef.close();
  }
}
