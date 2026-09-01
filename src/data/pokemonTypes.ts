import { PokemonType, PokemonTypeInfo } from '../types/pokemon';

export const POKEMON_TYPES: PokemonType[] = [
  'Normal',
  'Fire',
  'Water',
  'Grass',
  'Electric',
  'Ice',
  'Fighting',
  'Poison',
  'Ground',
  'Flying',
  'Psychic',
  'Bug',
  'Rock',
  'Ghost',
  'Dragon',
  'Dark',
  'Steel',
  'Fairy',
];

export const POKEMON_TYPE_DETAILS: Record<PokemonType, PokemonTypeInfo> = {
  Normal: {
    name: 'Normal',
    nameId: 'Normal',
    color: '#A8A77A',
    bgColor: 'bg-neutral-600',
    borderColor: 'border-neutral-500',
    textColor: 'text-neutral-200',
    iconName: 'Circle',
    weaknesses: ['Fighting'],
    resistances: [],
    immunities: ['Ghost'],
    superEffectiveAgainst: [],
    notVeryEffectiveAgainst: ['Rock', 'Steel'],
    noDamageAgainst: ['Ghost'],
  },
  Fire: {
    name: 'Fire',
    nameId: 'Api',
    color: '#EE8130',
    bgColor: 'bg-orange-600',
    borderColor: 'border-orange-500',
    textColor: 'text-orange-200',
    iconName: 'Flame',
    weaknesses: ['Water', 'Ground', 'Rock'],
    resistances: ['Fire', 'Grass', 'Ice', 'Bug', 'Steel', 'Fairy'],
    immunities: [],
    superEffectiveAgainst: ['Grass', 'Ice', 'Bug', 'Steel'],
    notVeryEffectiveAgainst: ['Fire', 'Water', 'Rock', 'Dragon'],
    noDamageAgainst: [],
  },
  Water: {
    name: 'Water',
    nameId: 'Air',
    color: '#6390F0',
    bgColor: 'bg-blue-600',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-200',
    iconName: 'Droplets',
    weaknesses: ['Electric', 'Grass'],
    resistances: ['Fire', 'Water', 'Ice', 'Steel'],
    immunities: [],
    superEffectiveAgainst: ['Fire', 'Ground', 'Rock'],
    notVeryEffectiveAgainst: ['Water', 'Grass', 'Dragon'],
    noDamageAgainst: [],
  },
  Grass: {
    name: 'Grass',
    nameId: 'Rumput / Daun',
    color: '#7AC74C',
    bgColor: 'bg-emerald-600',
    borderColor: 'border-emerald-500',
    textColor: 'text-emerald-200',
    iconName: 'Leaf',
    weaknesses: ['Fire', 'Ice', 'Poison', 'Flying', 'Bug'],
    resistances: ['Water', 'Electric', 'Grass', 'Ground'],
    immunities: [],
    superEffectiveAgainst: ['Water', 'Ground', 'Rock'],
    notVeryEffectiveAgainst: ['Fire', 'Grass', 'Poison', 'Flying', 'Bug', 'Dragon', 'Steel'],
    noDamageAgainst: [],
  },
  Electric: {
    name: 'Electric',
    nameId: 'Listrik',
    color: '#F7D02C',
    bgColor: 'bg-yellow-500',
    borderColor: 'border-yellow-400',
    textColor: 'text-yellow-100',
    iconName: 'Zap',
    weaknesses: ['Ground'],
    resistances: ['Electric', 'Flying', 'Steel'],
    immunities: [],
    superEffectiveAgainst: ['Water', 'Flying'],
    notVeryEffectiveAgainst: ['Electric', 'Grass', 'Dragon'],
    noDamageAgainst: ['Ground'],
  },
  Ice: {
    name: 'Ice',
    nameId: 'Es',
    color: '#96D9D6',
    bgColor: 'bg-cyan-500',
    borderColor: 'border-cyan-400',
    textColor: 'text-cyan-100',
    iconName: 'Snowflake',
    weaknesses: ['Fire', 'Fighting', 'Rock', 'Steel'],
    resistances: ['Ice'],
    immunities: [],
    superEffectiveAgainst: ['Grass', 'Ground', 'Flying', 'Dragon'],
    notVeryEffectiveAgainst: ['Fire', 'Water', 'Ice', 'Steel'],
    noDamageAgainst: [],
  },
  Fighting: {
    name: 'Fighting',
    nameId: 'Petarung / Fisik',
    color: '#C22E28',
    bgColor: 'bg-red-700',
    borderColor: 'border-red-600',
    textColor: 'text-red-200',
    iconName: 'Swords',
    weaknesses: ['Flying', 'Psychic', 'Fairy'],
    resistances: ['Bug', 'Rock', 'Dark'],
    immunities: [],
    superEffectiveAgainst: ['Normal', 'Ice', 'Rock', 'Dark', 'Steel'],
    notVeryEffectiveAgainst: ['Poison', 'Flying', 'Psychic', 'Bug', 'Fairy'],
    noDamageAgainst: ['Ghost'],
  },
  Poison: {
    name: 'Poison',
    nameId: 'Racun',
    color: '#A33EA1',
    bgColor: 'bg-purple-700',
    borderColor: 'border-purple-600',
    textColor: 'text-purple-200',
    iconName: 'Skull',
    weaknesses: ['Ground', 'Psychic'],
    resistances: ['Grass', 'Fighting', 'Poison', 'Bug', 'Fairy'],
    immunities: [],
    superEffectiveAgainst: ['Grass', 'Fairy'],
    notVeryEffectiveAgainst: ['Poison', 'Ground', 'Rock', 'Ghost'],
    noDamageAgainst: ['Steel'],
  },
  Ground: {
    name: 'Ground',
    nameId: 'Tanah',
    color: '#E2BF65',
    bgColor: 'bg-amber-700',
    borderColor: 'border-amber-600',
    textColor: 'text-amber-200',
    iconName: 'Mountain',
    weaknesses: ['Water', 'Grass', 'Ice'],
    resistances: ['Poison', 'Rock'],
    immunities: ['Electric'],
    superEffectiveAgainst: ['Fire', 'Electric', 'Poison', 'Rock', 'Steel'],
    notVeryEffectiveAgainst: ['Grass', 'Bug'],
    noDamageAgainst: ['Flying'],
  },
  Flying: {
    name: 'Flying',
    nameId: 'Terbang',
    color: '#A98FF3',
    bgColor: 'bg-indigo-500',
    borderColor: 'border-indigo-400',
    textColor: 'text-indigo-100',
    iconName: 'Wind',
    weaknesses: ['Electric', 'Ice', 'Rock'],
    resistances: ['Grass', 'Fighting', 'Bug'],
    immunities: ['Ground'],
    superEffectiveAgainst: ['Grass', 'Fighting', 'Bug'],
    notVeryEffectiveAgainst: ['Electric', 'Rock', 'Steel'],
    noDamageAgainst: [],
  },
  Psychic: {
    name: 'Psychic',
    nameId: 'Psikis',
    color: '#F95587',
    bgColor: 'bg-pink-600',
    borderColor: 'border-pink-500',
    textColor: 'text-pink-100',
    iconName: 'Eye',
    weaknesses: ['Bug', 'Ghost', 'Dark'],
    resistances: ['Fighting', 'Psychic'],
    immunities: [],
    superEffectiveAgainst: ['Fighting', 'Poison'],
    notVeryEffectiveAgainst: ['Psychic', 'Steel'],
    noDamageAgainst: ['Dark'],
  },
  Bug: {
    name: 'Bug',
    nameId: 'Serangga',
    color: '#A6B91A',
    bgColor: 'bg-lime-600',
    borderColor: 'border-lime-500',
    textColor: 'text-lime-200',
    iconName: 'Bug',
    weaknesses: ['Fire', 'Flying', 'Rock'],
    resistances: ['Grass', 'Fighting', 'Ground'],
    immunities: [],
    superEffectiveAgainst: ['Grass', 'Psychic', 'Dark'],
    notVeryEffectiveAgainst: ['Fire', 'Fighting', 'Poison', 'Flying', 'Ghost', 'Steel', 'Fairy'],
    noDamageAgainst: [],
  },
  Rock: {
    name: 'Rock',
    nameId: 'Batu',
    color: '#B6A136',
    bgColor: 'bg-stone-600',
    borderColor: 'border-stone-500',
    textColor: 'text-stone-200',
    iconName: 'Gem',
    weaknesses: ['Water', 'Grass', 'Fighting', 'Ground', 'Steel'],
    resistances: ['Normal', 'Fire', 'Poison', 'Flying'],
    immunities: [],
    superEffectiveAgainst: ['Fire', 'Ice', 'Flying', 'Bug'],
    notVeryEffectiveAgainst: ['Fighting', 'Ground', 'Steel'],
    noDamageAgainst: [],
  },
  Ghost: {
    name: 'Ghost',
    nameId: 'Hantu',
    color: '#735797',
    bgColor: 'bg-violet-800',
    borderColor: 'border-violet-700',
    textColor: 'text-violet-200',
    iconName: 'Ghost',
    weaknesses: ['Ghost', 'Dark'],
    resistances: ['Poison', 'Bug'],
    immunities: ['Normal', 'Fighting'],
    superEffectiveAgainst: ['Psychic', 'Ghost'],
    notVeryEffectiveAgainst: ['Dark'],
    noDamageAgainst: ['Normal'],
  },
  Dragon: {
    name: 'Dragon',
    nameId: 'Naga',
    color: '#6F35FC',
    bgColor: 'bg-purple-800',
    borderColor: 'border-purple-600',
    textColor: 'text-purple-200',
    iconName: 'Sparkles',
    weaknesses: ['Ice', 'Dragon', 'Fairy'],
    resistances: ['Fire', 'Water', 'Grass', 'Electric'],
    immunities: [],
    superEffectiveAgainst: ['Dragon'],
    notVeryEffectiveAgainst: ['Steel'],
    noDamageAgainst: ['Fairy'],
  },
  Dark: {
    name: 'Dark',
    nameId: 'Gelap / Kegelapan',
    color: '#705746',
    bgColor: 'bg-zinc-800',
    borderColor: 'border-zinc-700',
    textColor: 'text-zinc-300',
    iconName: 'Moon',
    weaknesses: ['Fighting', 'Bug', 'Fairy'],
    resistances: ['Ghost', 'Dark'],
    immunities: ['Psychic'],
    superEffectiveAgainst: ['Psychic', 'Ghost'],
    notVeryEffectiveAgainst: ['Fighting', 'Dark', 'Fairy'],
    noDamageAgainst: [],
  },
  Steel: {
    name: 'Steel',
    nameId: 'Baja / Logam',
    color: '#B7B7CE',
    bgColor: 'bg-slate-600',
    borderColor: 'border-slate-500',
    textColor: 'text-slate-200',
    iconName: 'Shield',
    weaknesses: ['Fire', 'Fighting', 'Ground'],
    resistances: [
      'Normal',
      'Grass',
      'Ice',
      'Flying',
      'Psychic',
      'Bug',
      'Rock',
      'Dragon',
      'Steel',
      'Fairy',
    ],
    immunities: ['Poison'],
    superEffectiveAgainst: ['Ice', 'Rock', 'Fairy'],
    notVeryEffectiveAgainst: ['Fire', 'Water', 'Electric', 'Steel'],
    noDamageAgainst: [],
  },
  Fairy: {
    name: 'Fairy',
    nameId: 'Peri / Fairy',
    color: '#D685AD',
    bgColor: 'bg-pink-500',
    borderColor: 'border-pink-400',
    textColor: 'text-pink-100',
    iconName: 'Heart',
    weaknesses: ['Poison', 'Steel'],
    resistances: ['Fighting', 'Bug', 'Dark'],
    immunities: ['Dragon'],
    superEffectiveAgainst: ['Fighting', 'Dragon', 'Dark'],
    notVeryEffectiveAgainst: ['Fire', 'Poison', 'Steel'],
    noDamageAgainst: [],
  },
};

/**
 * Calculates multiplier for an attack type against a single defending type in Pokémon GO:
 * Super Effective: 1.6
 * Normal: 1.0
 * Not Very Effective: 0.625
 * Immunity in PoGO: 0.390625 (~0.39)
 */
export function getSingleTypeMultiplier(attackType: PokemonType, defendType: PokemonType): number {
  const info = POKEMON_TYPE_DETAILS[defendType];
  if (info.immunities.includes(attackType)) {
    return 0.390625;
  }
  if (info.weaknesses.includes(attackType)) {
    return 1.6;
  }
  if (info.resistances.includes(attackType)) {
    return 0.625;
  }
  return 1.0;
}

/**
 * Calculates multiplier for an attack type against dual defender types:
 */
export function getDualTypeMultiplier(
  attackType: PokemonType,
  defendType1: PokemonType,
  defendType2?: PokemonType | null
): number {
  const m1 = getSingleTypeMultiplier(attackType, defendType1);
  if (!defendType2 || defendType2 === defendType1) {
    return m1;
  }
  const m2 = getSingleTypeMultiplier(attackType, defendType2);
  return m1 * m2;
}

export interface TypeEffectivenessResult {
  attackType: PokemonType;
  multiplier: number;
  label: string;
  badgeClass: string;
  bgTierClass: string;
  description: string;
}

export function calculateDefenderEffectiveness(
  type1: PokemonType,
  type2?: PokemonType | null
): Record<string, TypeEffectivenessResult[]> {
  const results: TypeEffectivenessResult[] = [];

  POKEMON_TYPES.forEach((atk) => {
    const rawMult = getDualTypeMultiplier(atk, type1, type2);
    // Round to 3 decimal places for comparison
    const mult = Math.round(rawMult * 1000) / 1000;

    let label = 'Normal (1.0x)';
    let badgeClass = 'bg-slate-800 text-slate-300 border-slate-700';
    let bgTierClass = 'border-slate-800/60 bg-slate-900/40';
    let description = 'Damage standar';

    if (mult >= 2.5) {
      label = 'Double Super Effective (2.56x)';
      badgeClass = 'bg-rose-600/30 text-rose-300 border-rose-500 font-bold animate-pulse';
      bgTierClass = 'border-rose-600/50 bg-rose-950/30';
      description = 'Kelemahan fatal! Sangat direkomendasikan untuk Raid & Battle';
    } else if (mult >= 1.5) {
      label = 'Super Effective (1.6x)';
      badgeClass = 'bg-orange-500/20 text-orange-300 border-orange-500 font-semibold';
      bgTierClass = 'border-orange-500/40 bg-orange-950/20';
      description = 'Kelemahan elemen (160% Damage)';
    } else if (mult <= 0.25) {
      label = 'Triple Resist (0.244x)';
      badgeClass = 'bg-emerald-950/80 text-emerald-300 border-emerald-500 font-bold';
      bgTierClass = 'border-emerald-600/50 bg-emerald-950/30';
      description = 'Hampir tidak ada efek damage (Hanya 24.4%)';
    } else if (mult <= 0.4) {
      label = 'Immunity / Double Resist (0.39x)';
      badgeClass = 'bg-teal-900/60 text-teal-300 border-teal-500 font-semibold';
      bgTierClass = 'border-teal-600/40 bg-teal-950/20';
      description = 'Kekebalan PoGO (Hanya 39% Damage)';
    } else if (mult <= 0.65) {
      label = 'Not Very Effective (0.625x)';
      badgeClass = 'bg-cyan-900/40 text-cyan-300 border-cyan-700';
      bgTierClass = 'border-cyan-800/40 bg-cyan-950/10';
      description = 'Ditahan / Resisten (62.5% Damage)';
    }

    results.push({
      attackType: atk,
      multiplier: mult,
      label,
      badgeClass,
      bgTierClass,
      description,
    });
  });

  // Group by multiplier categories
  const grouped = {
    doubleWeakness: results.filter((r) => r.multiplier >= 2.5),
    weakness: results.filter((r) => r.multiplier >= 1.5 && r.multiplier < 2.5),
    neutral: results.filter((r) => r.multiplier > 0.65 && r.multiplier < 1.5),
    resistance: results.filter((r) => r.multiplier <= 0.65 && r.multiplier > 0.4),
    immunity: results.filter((r) => r.multiplier <= 0.4 && r.multiplier > 0.25),
    tripleResistance: results.filter((r) => r.multiplier <= 0.25),
  };

  return grouped;
}

export function calculateAttackerEffectiveness(attackType: PokemonType) {
  const superEffective: PokemonType[] = [];
  const notVeryEffective: PokemonType[] = [];
  const noDamage: PokemonType[] = [];
  const neutral: PokemonType[] = [];

  POKEMON_TYPES.forEach((defType) => {
    const mult = getSingleTypeMultiplier(attackType, defType);
    if (mult >= 1.5) {
      superEffective.push(defType);
    } else if (mult <= 0.4) {
      noDamage.push(defType);
    } else if (mult <= 0.65) {
      notVeryEffective.push(defType);
    } else {
      neutral.push(defType);
    }
  });

  return {
    superEffective,
    notVeryEffective,
    noDamage,
    neutral,
  };
}
