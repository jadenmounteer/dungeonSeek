import { Injectable } from '@angular/core';
import { Npc, NpcStats, NpcType } from '../types/npc';
import { LocationNode } from './location-service';
import { CardRewardType } from '../types/card-reward-type';
import { DeckName } from '../types/card-deck';
import { Character, CharacterStats } from '../types/character';

@Injectable({
  providedIn: 'root',
})
export class NpcFactory {
  constructor() {}

  // Npcs Generated relative to the player have stats that are created relative to the player and difficulty.
  // Npcs that are generated in the world have their own stats independent of the player. For example, the main
  // boss can be generated independent of the player while a bandit is relative to the player's stats.
  public generateNpcRelativeToCurrentPlayer(
    npcType: NpcType,
    currentPlayer: Character,
    difficulty: CardRewardType
  ): Npc {
    const newNpc: Npc = {
      id: '',
      npcType: npcType,
      name: this.#generateNewNpcName(npcType),
      npcStats: this.#generateNpcStatsRelativeToPlayer(
        difficulty,
        currentPlayer.characterStats
      ),
      currentLocation: currentPlayer.currentLocation,
      level: 1,
      inParty: false,
      directionFacing: this.#getDirectionFacingRelativeToPlayer(currentPlayer),
      rewardTypeForDefeatingNpc: difficulty,
    };

    return newNpc;
  }

  #getDirectionFacingRelativeToPlayer(
    currentPlayer: Character
  ): 'Right' | 'Left' {
    // If the player is facing right, the npc should face left and vice versa.
    return currentPlayer.directionFacing === 'Right' ? 'Left' : 'Right';
  }

  #generateNpcStatsRelativeToPlayer(
    difficulty: CardRewardType,
    characterStats: CharacterStats
  ): NpcStats {
    let npcStats: NpcStats;

    switch (difficulty) {
      case 'Easy':
        npcStats = this.#generateStatsInRangeRelativeToPlayer(
          characterStats,
          0.2,
          0.3
        );
        break;
      case 'Moderate':
        npcStats = this.#generateStatsInRangeRelativeToPlayer(
          characterStats,
          0.3,
          0.4
        );
        break;
      case 'Hard':
        npcStats = this.#generateStatsInRangeRelativeToPlayer(
          characterStats,
          0.4,
          0.6
        );
        break;
      case 'Insane':
        npcStats = this.#generateStatsInRangeRelativeToPlayer(
          characterStats,
          0.5,
          0.8
        );
        break;
      default:
        throw new Error('Unknown difficulty: ' + difficulty);
    }

    return npcStats;
  }

  #generateStatsInRangeRelativeToPlayer(
    characterStats: CharacterStats,
    minRatio: number,
    maxRatio: number
  ): NpcStats {
    // Generate NPC stats that are within the specified range of the player's stats
    let healthTotal = this.#randomInRange(
      characterStats.health.total * minRatio,
      characterStats.health.total * maxRatio
    );

    const npcStats: NpcStats = {
      health: {
        total: healthTotal,
        current: healthTotal,
      },
    } as NpcStats;

    return npcStats;
  }

  #randomInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
    ];

    const randomName = names[Math.floor(Math.random() * names.length)];
    return randomName + ' the ';
  }
}
