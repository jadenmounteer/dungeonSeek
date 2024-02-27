import { CampaignNames } from '../services/game-session/campaign-service/campaign-service.service';

export interface GameSession {
  id: string;
  userID: string;
  gameName: string;
  campaignName: CampaignNames;
  characterIDs: string[];
  playersCurrentlyInGame: string[];
}
