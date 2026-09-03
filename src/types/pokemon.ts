export type PokemonType =
  | 'Normal'
  | 'Fire'
  | 'Water'
  | 'Grass'
  | 'Electric'
  | 'Ice'
  | 'Fighting'
  | 'Poison'
  | 'Ground'
  | 'Flying'
  | 'Psychic'
  | 'Bug'
  | 'Rock'
  | 'Ghost'
  | 'Dragon'
  | 'Dark'
  | 'Steel'
  | 'Fairy';

export interface PokemonTypeInfo {
  name: PokemonType;
  nameId: string; // Indonesian name translation
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  iconName: string;
  weaknesses: PokemonType[]; // Types this type is weak against (takes 1.6x)
  resistances: PokemonType[]; // Types this type resists (takes 0.625x)
  immunities: PokemonType[]; // Types this type is immune to in PoGO (takes 0.39x)
  superEffectiveAgainst: PokemonType[]; // Deals 1.6x to these
  notVeryEffectiveAgainst: PokemonType[]; // Deals 0.625x to these
  noDamageAgainst: PokemonType[]; // Deals 0.39x to these in PoGO
}

export type RoleTag =
  | 'Gym Defender'
  | 'Raid Attacker'
  | 'PvP Great League'
  | 'PvP Ultra League'
  | 'PvP Master League'
  | 'Mega Evolver'
  | 'Rocket Buster'
  | 'Trophy'
  | 'Trade Target';

export interface StoragePokemon {
  id: string;
  name: string;
  dexNumber: number;
  cp?: number;
  isHundo: boolean; // IV 100% (15/15/15)
  isShiny: boolean;
  isLucky?: boolean;
  isShadow?: boolean;
  isPurified?: boolean;
  types: PokemonType[];
  roles: RoleTag[];
  fastMove?: string;
  chargedMoves?: string[];
  notes?: string;
  spriteUrl?: string;
  createdAt: number;
  updatedAt?: number;
}

export interface RaidBossData {
  id: number;
  name: string;
  displayName: string;
  tier: 'Tier 1' | 'Tier 3' | 'Tier 5' | 'Mega' | 'Shadow Tier 5' | 'Primal' | 'Elite Raid';
  types: PokemonType[];
  spriteUrl: string;
  officialArtwork: string;
  baseStats: {
    hp: number;
    attack: number;
    defense: number;
    speed?: number;
  };
  height?: number;
  weight?: number;
  bestCounters: RecommendedCounter[];
}

export interface RecommendedCounter {
  name: string;
  dexNumber: number;
  types: PokemonType[];
  fastMove: string;
  fastMoveType: PokemonType;
  chargedMove: string;
  chargedMoveType: PokemonType;
  effectiveness: 'Double Super Effective (2.56x)' | 'Super Effective (1.6x)';
  multiplier: number;
  attack?: number;
  defense?: number;
  stamina?: number;
  maxCp?: number;
  powerScore?: number;
  rankTier?: 'S+' | 'S' | 'A+' | 'A' | 'B';
  isShadowAvailable?: boolean;
  isMegaAvailable?: boolean;
}

export interface CoordinateSpot {
  id: string;
  name: string;
  city: string;
  country: string;
  flag: string;
  lat: number;
  lng: number;
  timeZone: string;
  category: 'Hotspot Dunia' | 'Gym Cluster' | 'Farm Spot' | 'Indonesia Hotspot' | 'Custom';
  description: string;
  isDefault?: boolean;
  isFavorite?: boolean;
}

export interface GlobalEventConfig {
  eventName: string;
  localStartTime: string; // e.g. "14:00"
  durationHours: number; // e.g. 3
  eventDate: string; // e.g. "2026-09-05"
}

export interface HoppingScheduleItem {
  spot: CoordinateSpot;
  localStart: string;
  localEnd: string;
  wibStart: string;
  wibEnd: string;
  wibDateStr: string;
  utcOffsetStr: string; // e.g. "UTC+7", "UTC-4", "UTC+12"
  utcOffsetMinutes: number; // in minutes
  startTimestampWib: number;
  endTimestampWib: number;
  status: 'live' | 'upcoming' | 'ended';
  timeUntilOrRemaining: string;
  timeDifferenceWibHours: number; // Difference compared to WIB (UTC+7)
}

export interface EvolutionStageItem {
  dex: number;
  name: string;
  sprite: string;
  types?: PokemonType[];
  isCurrent?: boolean;
}

export interface TypeTopPokemonFamily {
  dex: number;
  name: string;
  types: PokemonType[];
  sprite: string;
  officialArtwork?: string;
  isLegendary?: boolean;
  isMythical?: boolean;
  isUltraBeast?: boolean;
  isMega?: boolean;
  attack: number;
  defense: number;
  stamina: number;
  maxCp: number;
  powerScore: number;
  rankTier: 'S+' | 'S' | 'A+' | 'A' | 'B';
  evolutionLine: EvolutionStageItem[];
  evolutionSummary: string;
  hasEvolution: boolean;
  recommendedMoves?: {
    fast: string;
    charged: string;
  };
  roleNote?: string;
}
