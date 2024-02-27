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
import { GameSession } from '../../../types/game-session';
import { CommonModule } from '@angular/common';
import {
  CampaignNames,
  CampaignServiceService,
} from '../../../services/game-session/campaign-service/campaign-service.service';
import { Campaign } from '../../../types/campaign';
import { MatSelectModule } from '@angular/material/select';
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
    MatSelectModule,
  ],
  templateUrl: './create-or-edit-game-session-dialogue.component.html',
  styleUrl: './create-or-edit-game-session-dialogue.component.scss',
})
export class CreateOrEditGameSessionDialogueComponent implements OnInit {
  protected campaigns = CampaignNames;

  // TODO https://dev.to/shane/working-with-enums-in-angular-html-templates-2io9

  protected newGameSession: GameSession = {
    id: '',
    userID: '',
    gameName: '',
    campaignName: 'Age_of_the_Necromancer' as CampaignNames,
    playerIDs: [],
    playersCurrentlyInGame: [],
  };

  constructor(
    public dialogRef: MatDialogRef<CreateOrEditGameSessionDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GameSession | null,
    protected campaignService: CampaignServiceService
  ) {}

  public async ngOnInit(): Promise<void> {
    if (this.data) {
      // This means we are editing an existing game session
      this.newGameSession = this.data;
    }

    // Fetch the campaign data
    // TODO if we wanted to get JSON data...
    // const response = await this.campaignService.fetchCampaigns();

    // // catch error
    // if (!response.ok) {
    //   throw new Error('Failed to fetch campaigns');
    // }

    // const data = await response.json();

    // this.listOfCampaigns.push(data);
  }

  protected onNoClick(): void {
    this.dialogRef.close();
  }

  protected setCampaignName(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.newGameSession.campaignName = target.value as CampaignNames;
  }
}
