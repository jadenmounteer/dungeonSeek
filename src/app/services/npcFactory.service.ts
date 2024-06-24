import { Injectable } from '@angular/core';
import {
  Npc,
  NpcType,
  npcDifficultyToLevel,
  npcTypeToArmorClassArray,
  npcTypeToHealthArray,
  npcTypeToNameArray,
} from '../types/npc';
import { LocationNode } from './location-service';
import { CardRewardType } from '../types/card-reward-type';
import { DeckName } from '../types/card-deck';

@Injectable({
  providedIn: 'root',
})
export class NpcFactory {
  constructor() {}

  public generateNewNpc(
    npcType: NpcType,
    location: LocationNode,
    difficulty: CardRewardType,
    directionFacing: 'Right' | 'Left' = 'Right',
    deckName: DeckName
  ): Npc {
    const newNpc: Npc = {
      id: '',
      npcType: npcType,
      name: this.generateNewNpcName(npcType),
      deckName: deckName,
      movementSpeed: 4,
      npcStats: {
        health: { total: 100, current: 100 },
        armorClass: 100,
      },

      currentLocation: location,
      position: location.position,

      inParty: false,
      directionFacing: directionFacing,
      rewardTypeForDefeatingNpc: difficulty,
    };

    return newNpc;
  }

  private generateNewNpcName(npcType: NpcType): string {
    const nameArray = npcTypeToNameArray[npcType];
    if (!nameArray) {
      throw new Error('Unknown npcType: ' + npcType);
    }
    return this.generateRandomName(nameArray) + npcType.toLocaleLowerCase();
  }

  private generateNpcHealth(npcType: NpcType, level: number): number {
    const initialHealth = npcTypeToHealthArray[npcType];
    if (!initialHealth) {
      throw new Error('Unknown npcType: ' + npcType);
    }

    // Add a bonus according to the npc's level;
    const levelBonus = Math.floor(level / 2);

    return levelBonus + initialHealth;
  }

  private generateRandomName(names: string[]): string {
    const randomName = names[Math.floor(Math.random() * names.length)];
    return randomName + ' the ';
  }
}
