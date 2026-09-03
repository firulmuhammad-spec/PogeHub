import { PokemonType, TypeTopPokemonFamily, EvolutionStageItem } from '../types/pokemon';
import { POPULAR_POKEMON_LIST, findPokemonByNameOrDex } from './pokemonList';
import { getPokemonBaseStats } from './pokemonStats';
import evolDataRaw from './pokemonEvolutionsData.json';

interface EvolBranchItem {
  dex: number;
  name: string;
}

interface EvolBranchInfo {
  branch: EvolBranchItem[];
  stageIndex: number;
  isFinal: boolean;
}

interface EvolDataStructure {
  branches: EvolBranchItem[][];
  dexToBranch: Record<string, EvolBranchInfo>;
}

const evolData = evolDataRaw as unknown as EvolDataStructure;

// Curated best PoGO Fast and Charged moves per type
const TYPE_OPTIMAL_MOVES: Record<PokemonType, { fast: string; charged: string }> = {
  Normal: { fast: 'Lock-On / Quick Attack', charged: 'Hyper Beam / Body Slam' },
  Fire: { fast: 'Fire Spin / Incinerate', charged: 'Blast Burn / Overheat' },
  Water: { fast: 'Water Gun / Waterfall', charged: 'Hydro Cannon / Hydro Pump' },
  Grass: { fast: 'Vine Whip / Razor Leaf', charged: 'Frenzy Plant / Solar Beam' },
  Electric: { fast: 'Thunder Shock / Spark', charged: 'Wild Charge / Thunderbolt' },
  Ice: { fast: 'Powder Snow / Ice Fang', charged: 'Avalanche / Blizzard' },
  Fighting: { fast: 'Counter / Force Palm', charged: 'Aura Sphere / Dynamic Punch' },
  Poison: { fast: 'Poison Jab / Acid', charged: 'Sludge Bomb / Gunk Shot' },
  Ground: { fast: 'Mud-Slap / Mud Shot', charged: 'Precipice Blades / Earthquake' },
  Flying: { fast: 'Gust / Wing Attack', charged: 'Dragon Ascent / Brave Bird / Sky Attack' },
  Psychic: { fast: 'Confusion / Psycho Cut', charged: 'Psystrike / Psychic' },
  Bug: { fast: 'Bug Bite / Fury Cutter', charged: 'Megahorn / Bug Buzz' },
  Rock: { fast: 'Smack Down / Rock Throw', charged: 'Rock Wrecker / Meteor Beam' },
  Ghost: { fast: 'Shadow Claw / Lick', charged: 'Shadow Ball / Poltergeist' },
  Dragon: { fast: 'Dragon Tail / Dragon Breath', charged: 'Outrage / Draco Meteor / Breaking Swipe' },
  Dark: { fast: 'Snarl / Bite', charged: 'Brutal Swing / Foul Play / Dark Pulse' },
  Steel: { fast: 'Bullet Punch / Metal Claw', charged: 'Meteor Mash / Flash Cannon' },
  Fairy: { fast: 'Fairy Wind / Charm', charged: 'Dazzling Gleam / Moonblast' },
};

/**
 * Retrieves the full evolutionary ancestry chain for any given Pokédex number
 */
export function getPokemonEvolutionLine(dex: number): EvolutionStageItem[] {
  const info = evolData.dexToBranch[dex.toString()];
  const branch = info ? info.branch : [{ dex, name: findPokemonByNameOrDex(dex.toString())?.name || `Pokémon #${dex}` }];

  return branch.map((item) => {
    const catalogItem = findPokemonByNameOrDex(item.dex.toString());
    return {
      dex: item.dex,
      name: catalogItem?.name || item.name,
      sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.dex}.png`,
      types: catalogItem?.types,
      isCurrent: item.dex === dex,
    };
  });
}

/**
 * Calculates PoGO combat effectiveness rating score and rank tier
 */
function calculatePokemonCombatRating(
  stats: { attack: number; defense: number; stamina: number; maxCp: number },
  isLegendary?: boolean,
  isUltraBeast?: boolean
): { score: number; rankTier: 'S+' | 'S' | 'A+' | 'A' | 'B' } {
  // In PoGO, Attack is heavily weighted for Raids/DPS, while CP and bulk matter for longevity
  let rawScore = Math.round(
    stats.attack * 1.6 + stats.maxCp / 15 + (stats.defense + stats.stamina) * 0.35
  );

  if (isLegendary || isUltraBeast) {
    rawScore += 35; // Special prestige and raid stat buff
  }

  let rankTier: 'S+' | 'S' | 'A+' | 'A' | 'B' = 'B';
  if (rawScore >= 870) {
    rankTier = 'S+';
  } else if (rawScore >= 770) {
    rankTier = 'S';
  } else if (rawScore >= 690) {
    rankTier = 'A+';
  } else if (rawScore >= 600) {
    rankTier = 'A';
  } else {
    rankTier = 'B';
  }

  return { score: rawScore, rankTier };
}

/**
 * Returns top recommended Pokémon for a specific type,
 * strictly consolidated by evolutionary family so pre-evolutions don't clutter the list.
 * The highest combat stage is shown with its full evolutionary pedigree.
 */
export function getTopPokemonForType(type: PokemonType): TypeTopPokemonFamily[] {
  // 1. Find all Pokémon that possess this type
  const matchingPokemon = POPULAR_POKEMON_LIST.filter((p) => p.types.includes(type));

  // 2. Group by distinct evolutionary family branch
  const familyMap = new Map<string, {
    catalogItem: typeof POPULAR_POKEMON_LIST[0];
    branch: EvolBranchItem[];
    stats: ReturnType<typeof getPokemonBaseStats>;
    score: number;
    rankTier: 'S+' | 'S' | 'A+' | 'A' | 'B';
  }>();

  for (const p of matchingPokemon) {
    const info = evolData.dexToBranch[p.dex.toString()];
    const branch = info ? info.branch : [{ dex: p.dex, name: p.name }];
    const branchKey = branch.map((b) => b.dex).join('-');

    const stats = getPokemonBaseStats(p.dex, p.name, p.types, p.isLegendary, p.isMythical, p.isMega);
    const { score, rankTier } = calculatePokemonCombatRating(stats, p.isLegendary, p.isUltraBeast);

    if (!familyMap.has(branchKey)) {
      familyMap.set(branchKey, {
        catalogItem: p,
        branch,
        stats,
        score,
        rankTier,
      });
    } else {
      const existing = familyMap.get(branchKey)!;
      // If another member of the same family has this type,
      // prefer the final stage / higher score member
      const existingIdx = branch.findIndex((b) => b.dex === existing.catalogItem.dex);
      const currentIdx = branch.findIndex((b) => b.dex === p.dex);

      if (currentIdx > existingIdx || score > existing.score) {
        familyMap.set(branchKey, {
          catalogItem: p,
          branch,
          stats,
          score,
          rankTier,
        });
      }
    }
  }

  // 3. Transform consolidated families into display-ready items
  const results: TypeTopPokemonFamily[] = [];

  for (const { catalogItem: p, branch, stats, score, rankTier } of familyMap.values()) {
    const hasEvolution = branch.length > 1;

    // Full evolutionary trail
    const evolutionLine: EvolutionStageItem[] = branch.map((item) => {
      const cat = findPokemonByNameOrDex(item.dex.toString());
      return {
        dex: item.dex,
        name: cat?.name || item.name,
        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.dex}.png`,
        types: cat?.types,
        isCurrent: item.dex === p.dex,
      };
    });

    const evolutionSummary = hasEvolution
      ? branch.map((b) => `${b.name} (#${b.dex})`).join(' ➔ ')
      : 'Bentuk Tunggal (Tanpa Evolusi)';

    // Generate tailored role note & advice
    let roleNote = 'Sangat solid untuk pertarungan Gym & Raid.';
    if (p.isLegendary) {
      roleNote = 'Pokémon Legendaris Tier 5 dengan stat elit!';
    } else if (p.isUltraBeast) {
      roleNote = 'Ultra Beast berdaya serang Attack sangat mematikan!';
    } else if (p.isMythical) {
      roleNote = 'Pokémon Mythical langka dengan jurus unik.';
    } else if (hasEvolution) {
      const baseForm = branch[0].name;
      roleNote = `Incar & tangkap ${baseForm} di alam liar, lalu evolusikan untuk hasil terbaik!`;
    }

    const moves = TYPE_OPTIMAL_MOVES[type] || {
      fast: 'Quick Move',
      charged: 'Charge Move',
    };

    results.push({
      dex: p.dex,
      name: p.name,
      types: p.types,
      sprite: p.sprite,
      officialArtwork: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.dex}.png`,
      isLegendary: p.isLegendary,
      isMythical: p.isMythical,
      isUltraBeast: p.isUltraBeast,
      isMega: p.isMega,
      attack: stats.attack,
      defense: stats.defense,
      stamina: stats.stamina,
      maxCp: stats.maxCp,
      powerScore: score,
      rankTier,
      evolutionLine,
      evolutionSummary,
      hasEvolution,
      recommendedMoves: moves,
      roleNote,
    });
  }

  // 4. Sort strictly descending by combat rating score
  results.sort((a, b) => b.powerScore - a.powerScore);

  return results;
}
