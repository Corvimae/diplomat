export interface Pokemon {
  id: number;
  name: string;
  sprite?: string;
  defaultState?: string;
}

export const POKEMON_SPRITE_BASE_URL = 'https://play.pokemonshowdown.com/sprites/';