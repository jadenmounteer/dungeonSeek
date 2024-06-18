import { Injectable } from '@angular/core';
import {
  Npc,
  NpcType,
  npcDifficultyToLevel,
  npcTypeToArmorClassArray,
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
    const npcLevel = this.getNpcLevel(difficulty);

    const newNpc: Npc = {
      id: '',
      npcType: npcType,
      name: this.generateNewNpcName(npcType),
      deckName: deckName,
      npcStats: {
        health: {
          total: 100,
          current: 100,
        },
        armorClass: this.generateNpcArmorClass(npcType),
      },
      currentLocation: location,
      position: location.position,
      level: npcLevel,
      inParty: false,
      directionFacing: directionFacing,
      rewardTypeForDefeatingNpc: difficulty,
    };

    return newNpc;
  }

  private getNpcLevel(difficulty: CardRewardType): number {
    const minMax = npcDifficultyToLevel[difficulty];
    if (!minMax) {
      throw new Error('Unknown difficulty: ' + difficulty);
    }
    return Math.floor(
      Math.random() * (minMax.max - minMax.min + 1) + minMax.min
    );
  }

  private generateNewNpcName(npcType: NpcType): string {
    const nameArray = npcTypeToNameArray[npcType];
    if (!nameArray) {
      throw new Error('Unknown npcType: ' + npcType);
    }
    return this.generateRandomName(nameArray) + npcType.toLocaleLowerCase();
  }

  private generateNpcArmorClass(npcType: NpcType): number {
    const armorClass = npcTypeToArmorClassArray[npcType];
    if (!armorClass) {
      throw new Error('Unknown npcType: ' + npcType);
    }
    return armorClass;
  }

  private generateRandomName(names: string[]): string {
    const randomName = names[Math.floor(Math.random() * names.length)];
    return randomName + ' the ';
  }
}
