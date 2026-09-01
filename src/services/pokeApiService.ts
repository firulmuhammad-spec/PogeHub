import { PokemonType, RaidBossData, RecommendedCounter } from '../types/pokemon';
import { calculateDefenderEffectiveness } from '../data/pokemonTypes';
import { POPULAR_POKEMON_LIST, findPokemonByNameOrDex } from '../data/pokemonList';
import { getPokemonBaseStats, calculateRaidCounterPowerScore } from '../data/pokemonStats';

// In-memory cache for fast responsive tab switching
const pokemonCache = new Map<string, RaidBossData>();

export const PRESET_RAID_BOSSES: { name: string; tier: RaidBossData['tier']; displayName: string }[] = [
  { name: 'rayquaza', tier: 'Mega', displayName: 'Mega Rayquaza' },
  { name: 'mewtwo', tier: 'Shadow Tier 5', displayName: 'Shadow Mewtwo' },
  { name: 'kyogre', tier: 'Primal', displayName: 'Primal Kyogre' },
  { name: 'groudon', tier: 'Primal', displayName: 'Primal Groudon' },
  { name: 'dialga', tier: 'Tier 5', displayName: 'Dialga (Origin Forme)' },
  { name: 'palkia', tier: 'Tier 5', displayName: 'Palkia (Origin Forme)' },
  { name: 'lucario', tier: 'Mega', displayName: 'Mega Lucario' },
  { name: 'charizard', tier: 'Mega', displayName: 'Mega Charizard Y' },
  { name: 'tyranitar', tier: 'Mega', displayName: 'Mega Tyranitar' },
  { name: 'necrozma', tier: 'Tier 5', displayName: 'Necrozma' },
  { name: 'zacian', tier: 'Tier 5', displayName: 'Zacian (Hero of Many Battles)' },
  { name: 'zamazenta', tier: 'Tier 5', displayName: 'Zamazenta' },
  { name: 'giratina-altered', tier: 'Tier 5', displayName: 'Giratina' },
  { name: 'darkrai', tier: 'Tier 5', displayName: 'Darkrai' },
  { name: 'garchomp', tier: 'Mega', displayName: 'Mega Garchomp' },
  { name: 'gardevoir', tier: 'Mega', displayName: 'Mega Gardevoir' },
];

// Mapping helper for capital types
function mapApiTypeToPoGoType(apiType: string): PokemonType {
  const cap = apiType.charAt(0).toUpperCase() + apiType.slice(1).toLowerCase();
  return cap as PokemonType;
}

// Recommended moveset generator by attacking type
const TYPE_BEST_MOVES: Record<PokemonType, { fast: string; charged: string }> = {
  Normal: { fast: 'Tackle', charged: 'Hyper Beam' },
  Fire: { fast: 'Fire Spin', charged: 'Overheat / Blast Burn' },
  Water: { fast: 'Water Gun / Waterfall', charged: 'Hydro Cannon / Hydro Pump' },
  Grass: { fast: 'Vine Whip / Razor Leaf', charged: 'Frenzy Plant / Solar Beam' },
  Electric: { fast: 'Thunder Shock / Spark', charged: 'Wild Charge / Thunderbolt' },
  Ice: { fast: 'Powder Snow / Ice Fang', charged: 'Avalanche / Blizzard' },
  Fighting: { fast: 'Counter / Force Palm', charged: 'Aura Sphere / Dynamic Punch' },
  Poison: { fast: 'Poison Jab / Acid', charged: 'Sludge Bomb / Gunk Shot' },
  Ground: { fast: 'Mud-Slap / Mud Shot', charged: 'Earthquake / High Horsepower / Precipice Blades' },
  Flying: { fast: 'Gust / Air Slash', charged: 'Brave Bird / Sky Attack / Dragon Ascent' },
  Psychic: { fast: 'Confusion / Psycho Cut', charged: 'Psystrike / Psychic' },
  Bug: { fast: 'Bug Bite / Fury Cutter', charged: 'Megahorn / Bug Buzz' },
  Rock: { fast: 'Smack Down / Rock Throw', charged: 'Rock Wrecker / Stone Edge / Meteor Beam' },
  Ghost: { fast: 'Shadow Claw / Lick', charged: 'Shadow Ball / Poltergeist' },
  Dragon: { fast: 'Dragon Tail / Dragon Breath', charged: 'Outrage / Draco Meteor / Breaking Swipe' },
  Dark: { fast: 'Snarl / Bite', charged: 'Brutal Swing / Foul Play / Dark Pulse' },
  Steel: { fast: 'Bullet Punch / Metal Claw', charged: 'Meteor Mash / Flash Cannon' },
  Fairy: { fast: 'Charm / Fairy Wind', charged: 'Dazzling Gleam / Moonblast' },
};

// Generates dynamic top counters based on the boss's type weaknesses, sorted strictly by Power Score / Base Stats
export function generateBestCounters(bossTypes: PokemonType[]): RecommendedCounter[] {
  const def1 = bossTypes[0] || 'Normal';
  const def2 = bossTypes[1] || null;
  const grouped = calculateDefenderEffectiveness(def1, def2);

  const doubleWeak = grouped.doubleWeakness.map((w) => w.attackType);
  const singleWeak = grouped.weakness.map((w) => w.attackType);

  const counterCandidates: RecommendedCounter[] = [];
  const addedDexes = new Set<number>();

  // Process Double Weakness (2.56x) first
  doubleWeak.forEach((atkType) => {
    const matchingMon = POPULAR_POKEMON_LIST.filter((p) => p.types.includes(atkType));
    matchingMon.forEach((p) => {
      if (addedDexes.has(p.dex)) return;
      addedDexes.add(p.dex);

      const moves = TYPE_BEST_MOVES[atkType] || { fast: 'Tackle', charged: 'Power Move' };
      const stats = getPokemonBaseStats(p.dex, p.name, p.types, p.isLegendary, p.isMythical, p.isMega);
      const isMega = !!(p.isMega || ['Charizard', 'Gengar', 'Rayquaza', 'Lucario', 'Garchomp', 'Tyranitar', 'Gardevoir', 'Swampert', 'Blaziken', 'Sceptile', 'Metagross', 'Salamence', 'Alakazam', 'Diancie'].includes(p.name));
      const hasStab = p.types.includes(atkType);
      
      const { score, rankTier } = calculateRaidCounterPowerScore(stats, 2.56, hasStab, false, isMega);

      counterCandidates.push({
        name: p.name,
        dexNumber: p.dex,
        types: p.types,
        fastMove: moves.fast,
        fastMoveType: atkType,
        chargedMove: moves.charged,
        chargedMoveType: atkType,
        effectiveness: 'Double Super Effective (2.56x)',
        multiplier: 2.56,
        attack: stats.attack,
        defense: stats.defense,
        stamina: stats.stamina,
        maxCp: stats.maxCp,
        powerScore: score,
        rankTier,
        isShadowAvailable: true,
        isMegaAvailable: isMega,
      });
    });
  });

  // Process Single Weakness (1.6x)
  singleWeak.forEach((atkType) => {
    const matchingMon = POPULAR_POKEMON_LIST.filter((p) => p.types.includes(atkType));
    matchingMon.forEach((p) => {
      if (addedDexes.has(p.dex)) return;
      addedDexes.add(p.dex);

      const moves = TYPE_BEST_MOVES[atkType] || { fast: 'Tackle', charged: 'Special Move' };
      const stats = getPokemonBaseStats(p.dex, p.name, p.types, p.isLegendary, p.isMythical, p.isMega);
      const isMega = !!(p.isMega || ['Charizard', 'Gengar', 'Rayquaza', 'Lucario', 'Garchomp', 'Tyranitar', 'Gardevoir', 'Swampert', 'Blaziken', 'Sceptile', 'Metagross', 'Salamence', 'Alakazam', 'Diancie'].includes(p.name));
      const hasStab = p.types.includes(atkType);

      const { score, rankTier } = calculateRaidCounterPowerScore(stats, 1.6, hasStab, false, isMega);

      counterCandidates.push({
        name: p.name,
        dexNumber: p.dex,
        types: p.types,
        fastMove: moves.fast,
        fastMoveType: atkType,
        chargedMove: moves.charged,
        chargedMoveType: atkType,
        effectiveness: 'Super Effective (1.6x)',
        multiplier: 1.6,
        attack: stats.attack,
        defense: stats.defense,
        stamina: stats.stamina,
        maxCp: stats.maxCp,
        powerScore: score,
        rankTier,
        isShadowAvailable: true,
        isMegaAvailable: isMega,
      });
    });
  });

  // Fallback if none found
  if (counterCandidates.length === 0) {
    const mStats = getPokemonBaseStats(150, 'Mewtwo', ['Psychic'], true);
    const { score: mScore, rankTier: mTier } = calculateRaidCounterPowerScore(mStats, 1.6, true, false, false);
    counterCandidates.push({
      name: 'Mewtwo',
      dexNumber: 150,
      types: ['Psychic'],
      fastMove: 'Psycho Cut',
      fastMoveType: 'Psychic',
      chargedMove: 'Psystrike',
      chargedMoveType: 'Psychic',
      effectiveness: 'Super Effective (1.6x)',
      multiplier: 1.6,
      attack: mStats.attack,
      defense: mStats.defense,
      stamina: mStats.stamina,
      maxCp: mStats.maxCp,
      powerScore: mScore,
      rankTier: mTier,
      isShadowAvailable: true,
    });
  }

  // Sort strictly by powerScore (highest attack / DPS / damage output first)
  counterCandidates.sort((a, b) => (b.powerScore || 0) - (a.powerScore || 0));

  return counterCandidates.slice(0, 24);
}

export async function fetchRaidBossData(pokemonQuery: string): Promise<RaidBossData> {
  const clean = pokemonQuery.trim().toLowerCase().replace(/\s+/g, '-');
  
  if (pokemonCache.has(clean)) {
    return pokemonCache.get(clean)!;
  }

  // Check offline catalog first for immediate response
  const catalogMatch = findPokemonByNameOrDex(clean);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(clean)}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`PokéAPI responded with status ${response.status}`);
    }

    const data = await response.json();

    const types: PokemonType[] = data.types.map((t: { type: { name: string } }) =>
      mapApiTypeToPoGoType(t.type.name)
    );

    const officialArtwork =
      data.sprites?.other?.['official-artwork']?.front_default ||
      data.sprites?.other?.home?.front_default ||
      data.sprites?.front_default ||
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`;

    const spriteUrl =
      data.sprites?.front_default ||
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`;

    const hp = data.stats.find((s: { stat: { name: string } }) => s.stat.name === 'hp')?.base_stat || 100;
    const attack = data.stats.find((s: { stat: { name: string } }) => s.stat.name === 'attack')?.base_stat || 100;
    const defense = data.stats.find((s: { stat: { name: string } }) => s.stat.name === 'defense')?.base_stat || 100;
    const speed = data.stats.find((s: { stat: { name: string } }) => s.stat.name === 'speed')?.base_stat || 100;

    const preset = PRESET_RAID_BOSSES.find((p) => p.name === clean);
    const tier = preset ? preset.tier : (data.id > 143 ? 'Tier 5' : 'Tier 3');

    const formattedName = data.name
      .split('-')
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const bossData: RaidBossData = {
      id: data.id,
      name: data.name,
      displayName: preset?.displayName || formattedName,
      tier,
      types,
      spriteUrl,
      officialArtwork,
      baseStats: {
        hp,
        attack,
        defense,
        speed,
      },
      height: data.height ? data.height / 10 : undefined,
      weight: data.weight ? data.weight / 10 : undefined,
      bestCounters: generateBestCounters(types),
    };

    pokemonCache.set(clean, bossData);
    return bossData;
  } catch (err) {
    // If network or PokeAPI fails, gracefully use local catalog
    if (catalogMatch) {
      const bossData: RaidBossData = {
        id: catalogMatch.dex,
        name: catalogMatch.name.toLowerCase(),
        displayName: catalogMatch.name,
        tier: catalogMatch.isLegendary ? 'Tier 5' : catalogMatch.isMega ? 'Mega' : 'Tier 3',
        types: catalogMatch.types,
        spriteUrl: catalogMatch.sprite,
        officialArtwork: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${catalogMatch.dex}.png`,
        baseStats: {
          hp: 120,
          attack: 240,
          defense: 180,
          speed: 100,
        },
        bestCounters: generateBestCounters(catalogMatch.types),
      };
      pokemonCache.set(clean, bossData);
      return bossData;
    }

    throw new Error(
      `Tidak dapat memuat Pokémon "${pokemonQuery}". Pastikan nama dalam Bahasa Inggris yang valid (contoh: Rayquaza, Mewtwo, Kyogre, Lucario).`
    );
  }
}
