import { Component, Inject, OnInit } from '@angular/core';
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
import { Character, CharacterClass } from '../../types/character';
import { AuthService } from '../../auth/auth.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';

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
    MatTabsModule,
    MatRadioModule,
  ],
  templateUrl: './add-or-edit-character.component.html',
  styleUrl: './add-or-edit-character.component.scss',
})
export class AddOrEditCharacterComponent implements OnInit {
  protected character: Character = {
    id: '',
    userId: this.authService.activeUser?.uid || '',
    name: '',
    class: 'Sorcerer',
    level: 1,

    sex: 'Male',
    position: {
      xPosition: 0,
      yPosition: 0,
    },
    movementSpeed: 0,
    inParty: false,
    currentLocation: null,
    directionFacing: 'Right',
    equipmentCards: [],
    potionCards: [],
    itemCards: [],
    spellCards: [],
    statusCards: [],
    health: 0,
    mana: 0,
    experience: 0,
    gold: 0,
  };

  constructor(
    public dialogRef: MatDialogRef<AddOrEditCharacterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Character | null,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.character = this.data;
    }

    if (this.character.userId === '') {
      alert(
        "Sorry for the trouble, but we can't find your user ID. Please reach out to Jaden for help."
      );
    }
  }

  protected onNoClick(): void {
    this.dialogRef.close();
  }

  protected changeCharacterClass(characterClass: CharacterClass): void {
    this.character.class = characterClass;
  }
}
