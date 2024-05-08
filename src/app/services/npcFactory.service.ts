import { Injectable } from '@angular/core';
import { Npc, NpcType } from '../types/npc';
import { LocationNode } from './location-service';
import { CardRewardType } from '../types/card-reward-type';

@Injectable({
  providedIn: 'root',
})
export class NpcFactory {
  constructor() {}

  public generateNewNpc(
    npcType: NpcType,
    location: LocationNode,
    difficulty: CardRewardType,
    directionFacing: 'Right' | 'Left' = 'Right'
  ): Npc {
    const newNpc: Npc = {
      id: '',
      npcType: npcType,
      name: this.#generateNewNpcName(npcType),
      npcStats: {
        health: {
          total: 100,
          current: 100,
        },
        mana: {
          total: 100,
          current: 100,
        },
        stamina: {
          total: 100,
          current: 100,
        },
      },
      currentLocation: location,
      level: 1,
      inParty: false,
      directionFacing: directionFacing,
      rewardTypeForDefeatingNpc: difficulty,
    };

    return newNpc;
  }

  #generateNewNpcName(npcType: NpcType): string {
    switch (npcType) {
      case NpcType.BANDIT:
        return this.#generateMaleHumanName() + NpcType.BANDIT;
      case NpcType.GOBLIN:
        return 'Goblin';
      case NpcType.ORC:
        return 'Orc';
      case NpcType.OGRE:
        return 'Ogre';
      case NpcType.GIANT:
        return 'Giant';
      default:
        throw new Error('Unknown npcType: ' + npcType);
    }
  }
  #generateMaleHumanName(): string {
    const names = [
      'John',
      'Bob',
      'Billy',
      'Tom',
      'Tim',
      'Jim',
      'Joe',
      'Jack',
      'James',
      'Jake',
      'Ragnor',
      'Grubber',
      'Hank',
      'Hector',
      'Hugo',
    ];

    const randomName = names[Math.floor(Math.random() * names.length)];
    return randomName + ' the ';
  }
}
