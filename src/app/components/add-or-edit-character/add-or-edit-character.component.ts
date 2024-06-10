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
import {
  Character,
  CharacterClass,
  CharacterMenu,
  CharacterStats,
} from '../../types/character';
import { AuthService } from '../../auth/auth.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { LocationService } from '../../services/location-service';

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
  private characterStats: CharacterStats = {
    health: { total: 100, current: 100 },
    mana: { total: 50, current: 50 },
    stamina: { total: 100, current: 100 },
    experience: { total: 0, current: 0 },
  };

  private characterMenu: CharacterMenu = {
    weaponCards: [],
    itemCards: [],
    spellCards: [],
    statusCards: [],
    sideQuestCards: [],
    mainQuestCards: [],
  };

  protected character: Partial<Character> = {
    id: '',
    userId: this.authService.activeUser?.uid || '',
    name: '',
    class: 'Sorcerer',
    level: 1,
    sex: 'Male',
    movementSpeed: 4,
    inParty: false,
    directionFacing: 'Right',
    characterStats: this.characterStats,
    characterMenu: this.characterMenu,
    gold: 0,
  };

  constructor(
    public dialogRef: MatDialogRef<AddOrEditCharacterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Character | null,
    private authService: AuthService,
    protected locationService: LocationService
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.character = this.data;
    } else {
      this.initializeTheCharactersStartingLocation();
    }

    if (this.character.userId === '') {
      alert(
        "Sorry for the trouble, but we can't find your user ID. Please reach out to Jaden for help."
      );
    }
  }

  private initializeTheCharactersStartingLocation() {
    const startingLocation = this.locationService.locationsMap.get('Goeth')!;
    this.character.currentLocation = startingLocation;

    this.character.position = {
      xPosition: startingLocation.position.xPosition,
      yPosition: startingLocation.position.yPosition,
    };
  }

  protected onNoClick(): void {
    this.dialogRef.close();
  }

  protected changeCharacterClass(characterClass: CharacterClass): void {
    this.character.class = characterClass;
  }
}
