import { Component, Inject, Input, OnInit } from '@angular/core';
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
import { GameSession } from '../../types/game-session';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-create-or-edit-game-session-dialogue',
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
  ],
  templateUrl: './create-or-edit-game-session-dialogue.component.html',
  styleUrl: './create-or-edit-game-session-dialogue.component.scss',
})
export class CreateOrEditGameSessionDialogueComponent implements OnInit {
  protected newGameSession: GameSession = {
    id: '',
    userID: '',
    gameName: '',
    campaign: '',
    playerIDs: [],
    activePlayerIDs: [],
  };

  constructor(
    public dialogRef: MatDialogRef<CreateOrEditGameSessionDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GameSession | null
  ) {}

  public ngOnInit(): void {
    if (this.data) {
      // This means we are editing an existing game session
      this.newGameSession = this.data;
    }
  }

  protected onNoClick(): void {
    this.dialogRef.close();
  }
}
