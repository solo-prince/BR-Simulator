
export enum WeaponCategory {
  AR = 'AR',
  SMG = 'SMG',
  SNIPER = 'SNIPER',
  SHOTGUN = 'SHOTGUN',
  PISTOL = 'PISTOL'
}

export interface Weapon {
  id: string;
  name: string;
  category: WeaponCategory;
  damage: number; // 0-100
  rateOfFire: number; // 0-100
  range: number; // 0-100
  reloadSpeed: number; // 0-100
  ammoCapacity: number;
  image: string;
}

export interface LootItem {
  id: string;
  name: string;
  type: 'health' | 'ammo' | 'armor' | 'attachment';
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Character {
  id: string;
  name: string;
  ability: string;
  abilityDesc: string;
  image: string;
  stats: {
    speed: number;
    health: number;
    luck: number;
  };
}

export interface PlayerLoadout {
  character: Character;
  primaryWeapon: Weapon;
  secondaryWeapon: Weapon;
  inventory: LootItem[];
}

export interface MatchEvent {
  time: string;
  message: string;
  type: 'kill' | 'info' | 'zone' | 'danger' | 'loot';
}
