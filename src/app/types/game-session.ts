import { CampaignNames } from '../services/game-session/campaign-service/campaign-service.service';

export interface GameSession {
  id: string;
  userID: string;
  gameName: string;
  campaignName: CampaignNames;
  playerIDs: string[];
  playersCurrentlyInGame: string[];
  entranceCode: string;
  currentTurn: number;
}
