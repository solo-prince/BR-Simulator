
import { Weapon, WeaponCategory, Character, LootItem } from './types';

export const WEAPONS: Weapon[] = [
  {
    id: 'w1',
    name: 'SCAR - Titan',
    category: WeaponCategory.AR,
    damage: 78,
    rateOfFire: 65,
    range: 70,
    reloadSpeed: 60,
    ammoCapacity: 30,
    image: 'https://picsum.photos/seed/scar/400/200'
  },
  {
    id: 'w2',
    name: 'UMP - Cataclysm',
    category: WeaponCategory.SMG,
    damage: 55,
    rateOfFire: 90,
    range: 35,
    reloadSpeed: 85,
    ammoCapacity: 40,
    image: 'https://picsum.photos/seed/ump/400/200'
  },
  {
    id: 'w3',
    name: 'M82B - Barrett',
    category: WeaponCategory.SNIPER,
    damage: 100,
    rateOfFire: 12,
    range: 99,
    reloadSpeed: 20,
    ammoCapacity: 5,
    image: 'https://picsum.photos/seed/m82b/400/200'
  },
  {
    id: 'w4',
    name: 'SPAS12 - Venom',
    category: WeaponCategory.SHOTGUN,
    damage: 95,
    rateOfFire: 25,
    range: 12,
    reloadSpeed: 40,
    ammoCapacity: 7,
    image: 'https://picsum.photos/seed/spas/400/200'
  },
  {
    id: 'w5',
    name: 'G18 - Akimbo',
    category: WeaponCategory.PISTOL,
    damage: 45,
    rateOfFire: 75,
    range: 25,
    reloadSpeed: 90,
    ammoCapacity: 20,
    image: 'https://picsum.photos/seed/g18/400/200'
  }
];

export const LOOT_ITEMS: LootItem[] = [
  { id: 'l1', name: 'Medkit', type: 'health', description: 'Restores 75 HP over 5 seconds.', rarity: 'common' },
  { id: 'l2', name: 'Extended Mag', type: 'attachment', description: 'Increases ammo capacity by 50%.', rarity: 'rare' },
  { id: 'l3', name: 'Level 3 Vest', type: 'armor', description: 'Reduces incoming damage by 40%.', rarity: 'epic' },
  { id: 'l4', name: 'Adrenaline Shot', type: 'health', description: 'Instant full heal and 20% speed boost.', rarity: 'legendary' },
  { id: 'l5', name: '4x Scope', type: 'attachment', description: 'Significantly increases accuracy at range.', rarity: 'rare' },
  { id: 'l6', name: 'AR Ammo Crate', type: 'ammo', description: 'Refills all rifle ammunition.', rarity: 'common' }
];

export const CHARACTERS: Character[] = [
  {
    id: 'c1',
    name: 'Kratos',
    ability: 'War Cry',
    abilityDesc: 'Increases damage and movement speed by 15% for 10 seconds.',
    image: 'https://picsum.photos/seed/char1/300/400',
    stats: { speed: 80, health: 100, luck: 50 }
  },
  {
    id: 'c2',
    name: 'Zoe',
    ability: 'Healing Mist',
    abilityDesc: 'Creates a zone that restores 5HP per second for allies.',
    image: 'https://picsum.photos/seed/char2/300/400',
    stats: { speed: 70, health: 120, luck: 60 }
  },
  {
    id: 'c3',
    name: 'Cipher',
    ability: 'Glitch Step',
    abilityDesc: 'Teleports a short distance and becomes invisible for 2 seconds.',
    image: 'https://picsum.photos/seed/char3/300/400',
    stats: { speed: 95, health: 80, luck: 40 }
  },
  {
    id: 'c4',
    name: 'Jade',
    ability: 'Bounty Hunter',
    abilityDesc: 'Receive 50% more loot and credits from kills.',
    image: 'https://picsum.photos/seed/char4/300/400',
    stats: { speed: 75, health: 90, luck: 95 }
  }
];
