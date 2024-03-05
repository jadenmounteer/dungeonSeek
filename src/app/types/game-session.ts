import { CampaignNames } from '../services/game-session/campaign-service/campaign-service.service';

export interface GameSession {
  id: string;
  userID: string;
  gameName: string;
  campaignName: CampaignNames;
  playerIDs: string[];
  entranceCode: string;
  currentTurn: Turn;
}

export interface Turn {
  turnNumber: number;
  characterIDsWhoHaveTakenTurn: string[]; // A list of ids of characters who have taken the turn already. Will be reset every turn
  playerIDsWhoHaveFinishedTurn: string[]; // A list of ids of players who have finished their turns already. Will be reset every turn
}
