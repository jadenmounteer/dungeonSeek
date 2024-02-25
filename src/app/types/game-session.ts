export interface GameSession {
  id: string;
  userID: string;
  gameName: string;
  campaign: string;
  playerIDs: string[];
  playersCurrentlyInGame: string[];
}
