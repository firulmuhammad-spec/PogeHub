import { PokemonType } from '../types/pokemon';

export interface PokemonCatalogItem {
  dex: number;
  name: string;
  types: PokemonType[];
  sprite: string;
  isLegendary?: boolean;
  isMythical?: boolean;
  isMega?: boolean;
  isUltraBeast?: boolean;
  defaultCpEstimate?: number;
}

export const POPULAR_POKEMON_LIST: PokemonCatalogItem[] = [
  { dex: 1, name: 'Bulbasaur', types: ['Grass', 'Poison'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png' },
  { dex: 2, name: 'Ivysaur', types: ['Grass', 'Poison'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png' },
  { dex: 3, name: 'Venusaur', types: ['Grass', 'Poison'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png' },
  { dex: 4, name: 'Charmander', types: ['Fire'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png' },
  { dex: 5, name: 'Charmeleon', types: ['Fire'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png' },
  { dex: 6, name: 'Charizard', types: ['Fire', 'Flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png' },
  { dex: 7, name: 'Squirtle', types: ['Water'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png' },
  { dex: 8, name: 'Wartortle', types: ['Water'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/8.png' },
  { dex: 9, name: 'Blastoise', types: ['Water'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png' },
  { dex: 25, name: 'Pikachu', types: ['Electric'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png' },
  { dex: 26, name: 'Raichu', types: ['Electric'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/26.png' },
  { dex: 65, name: 'Alakazam', types: ['Psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/65.png' },
  { dex: 68, name: 'Machamp', types: ['Fighting'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/68.png' },
  { dex: 94, name: 'Gengar', types: ['Ghost', 'Poison'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png' },
  { dex: 130, name: 'Gyarados', types: ['Water', 'Flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png' },
  { dex: 131, name: 'Lapras', types: ['Water', 'Ice'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/131.png' },
  { dex: 133, name: 'Eevee', types: ['Normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png' },
  { dex: 134, name: 'Vaporeon', types: ['Water'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/134.png' },
  { dex: 135, name: 'Jolteon', types: ['Electric'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/135.png' },
  { dex: 136, name: 'Flareon', types: ['Fire'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/136.png' },
  { dex: 143, name: 'Snorlax', types: ['Normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png' },
  { dex: 144, name: 'Articuno', types: ['Ice', 'Flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/144.png', isLegendary: true },
  { dex: 145, name: 'Zapdos', types: ['Electric', 'Flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/145.png', isLegendary: true },
  { dex: 146, name: 'Moltres', types: ['Fire', 'Flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/146.png', isLegendary: true },
  { dex: 149, name: 'Dragonite', types: ['Dragon', 'Flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png' },
  { dex: 150, name: 'Mewtwo', types: ['Psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png', isLegendary: true },
  { dex: 151, name: 'Mew', types: ['Psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png', isMythical: true },
  { dex: 196, name: 'Espeon', types: ['Psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/196.png' },
  { dex: 197, name: 'Umbreon', types: ['Dark'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/197.png' },
  { dex: 212, name: 'Scizor', types: ['Bug', 'Steel'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/212.png' },
  { dex: 214, name: 'Heracross', types: ['Bug', 'Fighting'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/214.png' },
  { dex: 242, name: 'Blissey', types: ['Normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/242.png' },
  { dex: 243, name: 'Raikou', types: ['Electric'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/243.png', isLegendary: true },
  { dex: 244, name: 'Entei', types: ['Fire'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/244.png', isLegendary: true },
  { dex: 245, name: 'Suicune', types: ['Water'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/245.png', isLegendary: true },
  { dex: 248, name: 'Tyranitar', types: ['Rock', 'Dark'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/248.png' },
  { dex: 249, name: 'Lugia', types: ['Psychic', 'Flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/249.png', isLegendary: true },
  { dex: 250, name: 'Ho-Oh', types: ['Fire', 'Flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/250.png', isLegendary: true },
  { dex: 254, name: 'Sceptile', types: ['Grass'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/254.png' },
  { dex: 257, name: 'Blaziken', types: ['Fire', 'Fighting'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/257.png' },
  { dex: 260, name: 'Swampert', types: ['Water', 'Ground'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/260.png' },
  { dex: 282, name: 'Gardevoir', types: ['Psychic', 'Fairy'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/282.png' },
  { dex: 373, name: 'Salamence', types: ['Dragon', 'Flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/373.png' },
  { dex: 376, name: 'Metagross', types: ['Steel', 'Psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/376.png' },
  { dex: 380, name: 'Latias', types: ['Dragon', 'Psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/380.png', isLegendary: true },
  { dex: 381, name: 'Latios', types: ['Dragon', 'Psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/381.png', isLegendary: true },
  { dex: 382, name: 'Kyogre', types: ['Water'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/382.png', isLegendary: true },
  { dex: 383, name: 'Groudon', types: ['Ground'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/383.png', isLegendary: true },
  { dex: 384, name: 'Rayquaza', types: ['Dragon', 'Flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/384.png', isLegendary: true },
  { dex: 445, name: 'Garchomp', types: ['Dragon', 'Ground'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/445.png' },
  { dex: 448, name: 'Lucario', types: ['Fighting', 'Steel'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/448.png' },
  { dex: 461, name: 'Weavile', types: ['Dark', 'Ice'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/461.png' },
  { dex: 464, name: 'Rhyperior', types: ['Ground', 'Rock'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/464.png' },
  { dex: 468, name: 'Togekiss', types: ['Fairy', 'Flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/468.png' },
  { dex: 471, name: 'Glaceon', types: ['Ice'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/471.png' },
  { dex: 473, name: 'Mamoswine', types: ['Ice', 'Ground'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/473.png' },
  { dex: 475, name: 'Gallade', types: ['Psychic', 'Fighting'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/475.png' },
  { dex: 483, name: 'Dialga', types: ['Steel', 'Dragon'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/483.png', isLegendary: true },
  { dex: 484, name: 'Palkia', types: ['Water', 'Dragon'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/484.png', isLegendary: true },
  { dex: 487, name: 'Giratina', types: ['Ghost', 'Dragon'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/487.png', isLegendary: true },
  { dex: 491, name: 'Darkrai', types: ['Dark'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/491.png', isMythical: true },
  { dex: 530, name: 'Excadrill', types: ['Ground', 'Steel'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/530.png' },
  { dex: 534, name: 'Conkeldurr', types: ['Fighting'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/534.png' },
  { dex: 555, name: 'Darmanitan', types: ['Fire'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/555.png' },
  { dex: 609, name: 'Chandelure', types: ['Ghost', 'Fire'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/609.png' },
  { dex: 612, name: 'Haxorus', types: ['Dragon'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/612.png' },
  { dex: 635, name: 'Hydreigon', types: ['Dark', 'Dragon'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/635.png' },
  { dex: 637, name: 'Volcarona', types: ['Bug', 'Fire'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/637.png' },
  { dex: 643, name: 'Reshiram', types: ['Dragon', 'Fire'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/643.png', isLegendary: true },
  { dex: 644, name: 'Zekrom', types: ['Dragon', 'Electric'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/644.png', isLegendary: true },
  { dex: 645, name: 'Landorus', types: ['Ground', 'Flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/645.png', isLegendary: true },
  { dex: 646, name: 'Kyurem', types: ['Dragon', 'Ice'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/646.png', isLegendary: true },
  { dex: 658, name: 'Greninja', types: ['Water', 'Dark'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/658.png' },
  { dex: 681, name: 'Aegislash', types: ['Steel', 'Ghost'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/681.png' },
  { dex: 700, name: 'Sylveon', types: ['Fairy'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/700.png' },
  { dex: 716, name: 'Xerneas', types: ['Fairy'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/716.png', isLegendary: true },
  { dex: 717, name: 'Yveltal', types: ['Dark', 'Flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/717.png', isLegendary: true },
  { dex: 718, name: 'Zygarde', types: ['Dragon', 'Ground'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/718.png', isLegendary: true },
  { dex: 724, name: 'Decidueye', types: ['Grass', 'Ghost'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/724.png' },
  { dex: 778, name: 'Mimikyu', types: ['Ghost', 'Fairy'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/778.png' },
  { dex: 793, name: 'Nihilego', types: ['Rock', 'Poison'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/793.png', isUltraBeast: true },
  { dex: 796, name: 'Xurkitree', types: ['Electric'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/796.png', isUltraBeast: true },
  { dex: 798, name: 'Kartana', types: ['Grass', 'Steel'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/798.png', isUltraBeast: true },
  { dex: 800, name: 'Necrozma', types: ['Psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/800.png', isLegendary: true },
  { dex: 888, name: 'Zacian', types: ['Fairy', 'Steel'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/888.png', isLegendary: true },
  { dex: 889, name: 'Zamazenta', types: ['Fighting', 'Steel'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/889.png', isLegendary: true },
  { dex: 890, name: 'Eternatus', types: ['Poison', 'Dragon'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/890.png', isLegendary: true },
  { dex: 892, name: 'Urshifu', types: ['Fighting', 'Dark'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/892.png', isLegendary: true },
  { dex: 998, name: 'Baxcalibur', types: ['Dragon', 'Ice'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/998.png' },
  { dex: 1000, name: 'Gholdengo', types: ['Steel', 'Ghost'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1000.png' },
];

export function findPokemonByNameOrDex(query: string): PokemonCatalogItem | undefined {
  const clean = query.trim().toLowerCase();
  if (!clean) return undefined;
  
  const num = parseInt(clean, 10);
  if (!isNaN(num)) {
    return POPULAR_POKEMON_LIST.find((p) => p.dex === num);
  }
  
  return POPULAR_POKEMON_LIST.find(
    (p) => p.name.toLowerCase() === clean || p.name.toLowerCase().startsWith(clean)
  );
}

export function searchPokemonCatalog(query: string, limit = 10): PokemonCatalogItem[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return POPULAR_POKEMON_LIST.slice(0, limit);

  return POPULAR_POKEMON_LIST.filter(
    (p) =>
      p.name.toLowerCase().includes(clean) ||
      p.dex.toString().includes(clean) ||
      p.types.some((t) => t.toLowerCase().includes(clean))
  ).slice(0, limit);
}
